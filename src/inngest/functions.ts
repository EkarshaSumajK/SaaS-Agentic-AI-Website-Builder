import { inngest } from "./client";
import { createAgent,createNetwork,createState,createTool,gemini, Message, Tool } from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter";
import { getSandboxUrl, lastAssistantMessageContent } from "./utils";
import { z } from "zod";
import { PROMPT, RESPONSE_PROMPT, FRAGMENT_TITLE_PROMPT, parseStatusTags, extractTaskSummary, ProgressStatus } from "@/prompt";
import { prisma } from "@/lib/db";

interface AgentState{
  summary:string
  files: {[path:string]:string}
  progress: ProgressStatus[]
  currentStatus: string
}

export const codeAgent = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id",async()=>{
      const sandbox = await Sandbox.create('ai-saas-website-builderx')
      await sandbox.setTimeout(Number(process.env.SANDBOX_TIMEOUT) || 60000 * 10)
      return sandbox.sandboxId
    })

    const previousMessages = await step.run("get-previous-messages",async()=>{
      const formattedMessages:Message[] = []
      const messages = await prisma.message.findMany({
        where:{
          projectId:event.data.projectId,
        },
        orderBy:{
          createdAt:"desc",
        },
        take:3,
      })
      for(const message of messages){
        formattedMessages.push({
          type:"text",
          role: message.role== "ASSISTANT" ? "assistant" : "user",
          content:message.content,
          
        })
      }
      return formattedMessages
    }) 
    const state = createState<AgentState>(
      {
        summary:"",
        files:{},
        progress: [],
        currentStatus: "initializing",
      },
      {
        messages:previousMessages,
      }
    )
     const summaryAgent = createAgent<AgentState>({
        name: "summary-agent",
        description: "An expert coding agent",
        system: PROMPT,
        model: gemini({ 
          model: "gemini-2.5-flash",
        }),
        tools: [
          createTool({
            name:"terminal",
            description:"Use the terminal to run commands",
            parameters:z.object({
              command:z.string()
            }),
            handler:async({command},{step})=>{
              return await step?.run("terminal",async()=>{
                const buffers = {stdout:"",stderr:""}
                try{
                  const sandbox = await getSandboxUrl(sandboxId)
                  const result = await sandbox.commands.run(command,{
                    onStdout(data:string) {
                      buffers.stdout += data
                    },
                    onStderr(data:string) {
                      buffers.stderr += data
                    },
                    
                  })
                  return result.stdout
                }
                catch(e){
                  console.error(`Command failed: ${e} \n stderr: ${buffers.stderr} \n stdout: ${buffers.stdout}`)
                  return `Command failed: ${e} \n stderr: ${buffers.stderr} \n stdout: ${buffers.stdout}`
                }
              })
            }
          }),
          createTool({
            name:"createOrUpdateFiles",
            description:"Create or update a file in the sandbox",
            parameters:z.object({
              files:z.array(z.object({
                path:z.string(),
                content:z.string(),
              })),
            }),
            handler:async({files},{step, network}:Tool.Options<AgentState>)=>{
              const newFiles = await step?.run("createOrUpdateFiles",async()=>{
                try{
                  const updatedFiles = await network.state.data.files || {}
                  const sandbox = await getSandboxUrl(sandboxId)
                  for(const file of files){
                    await sandbox.files.write(file.path,file.content)
                    updatedFiles[file.path] = file.content
                  }
                  return updatedFiles
                }
                catch(e){
                  console.error(`Failed to create or update files: ${e}`)
                  return `Failed to create or update files: ${e}`
                }
              })
              if(typeof newFiles === "object"){
                network.state.data.files = newFiles
              }
            },
          }),
          createTool({
            name:"readFiles",
            description:"Reads files from the sandbox",
            parameters:z.object({
              files:z.array(z.string()),
            }),
            handler:async({files},{step})=>{
              return await step?.run("readFiles",async()=>{
                try{
                  const sandbox = await getSandboxUrl(sandboxId)
                  const contents = []
                  for(const file of files){
                    const content = await sandbox.files.read(file)
                    contents.push({
                      path:file,content
                    })
                  }
                  return JSON.stringify(contents)
                }
                catch(e){
                  console.error(`Failed to read file: ${e}`)
                  return `Failed to read file: ${e}`
                }
              })
            }
            
          })


        ],
        lifecycle: {
          onResponse: async({result,network})=>{
            try {
              const lastAssistantMessage = await lastAssistantMessageContent(result)
              if(lastAssistantMessage && network){
                // Parse and store progress status updates
                const newStatuses = parseStatusTags(lastAssistantMessage)
                if(newStatuses.length > 0){
                  network.state.data.progress = [
                    ...network.state.data.progress,
                    ...newStatuses
                  ]
                  // Update current status to the latest one
                  const latestStatus = newStatuses[newStatuses.length - 1]
                  network.state.data.currentStatus = `${latestStatus.type}: ${latestStatus.message}`
                  console.log(`[Lumina AI] Status: ${latestStatus.type} - ${latestStatus.message}`)
                }
                
                // Check for task summary (completion)
                const taskSummary = extractTaskSummary(lastAssistantMessage)
                if(taskSummary){
                  network.state.data.summary = lastAssistantMessage
                  network.state.data.currentStatus = "complete"
                  console.log(`[Lumina AI] Task completed with summary`)
                }
              }
              return result
            } catch (error) {
              console.warn("Error processing response:", error)
              return result
            }
          },
        }
      });
      const network = createNetwork<AgentState>({
         name:"website-builder-network",
         agents:[summaryAgent],
         maxIter:15,
         defaultState:state,
         router: async({network})=>{
          const summary = network.state.data.summary
          if(summary){
            return;
          }
          return summaryAgent
         }
      })
      const result = await network.run(event.data.value,{state:state})
      const fragmentTitleGeneration = createAgent({
        name:"fragment-title-generation",
        description:"A agent that generates a title for a code fragment",
        system:FRAGMENT_TITLE_PROMPT,
        model:gemini({
          model:"gemini-2.5-flash",
        })
      })
      const responseAgent = createAgent<AgentState>({
        name:"response-agent",
        description:"A agent that generates a response to the user",
        system:RESPONSE_PROMPT,
        model:gemini({
          model:"gemini-2.5-flash",
        })
      })
      const {output:fragmentTitle} = await fragmentTitleGeneration.run(result.state.data.summary)
      const {output:response} = await responseAgent.run(result.state.data.summary)
      const generateFradmentTitle =()=>{
        if(fragmentTitle[0].type != "text"){
          return "Fragment Title"
        }
        if(Array.isArray(fragmentTitle[0].content)){
          return fragmentTitle[0].content.map((item)=>item.text).join(" ")
        }
        return fragmentTitle[0].content
      }
      const generateResponse =()=>{
        if(response[0].type != "text"){
          return "Response"
        }
        if(Array.isArray(response[0].content)){
          return response[0].content.map((item)=>item.text).join(" ")
        }
        return response[0].content
      }
      const isError = !result.state.data.summary || Object.keys(result.state.data.files).length === 0
      const sandboxUrl = await step.run("get-sandbox-url",async()=>{
        const sandbox = await getSandboxUrl(sandboxId)
        const host =  sandbox.getHost(3000)
        return `https://${host}`
      })
      await step.run("save-result",async()=>{
        if(isError){
          return await prisma.message.create({
            data:{
              projectId:event.data.projectId,
              content:"Something went wrong Try again",
              role:"ASSISTANT",
              type:"ERROR",
            }
          })
        }
        return await prisma.message.create({
          data:{
            projectId:event.data.projectId,
            content:generateResponse(),
            role:"ASSISTANT",
            type:"RESULT",
            fragments:{
              create:{
                title:generateFradmentTitle(),
                files:result.state.data.files,
                sandboxUrl:sandboxUrl,
              }
            }
          }
        })
      })
      return { 
        url: sandboxUrl, 
        files: result.state.data.files,
        summary: network.state.data.summary,
        progress: result.state.data.progress,
        currentStatus: result.state.data.currentStatus,
      };
  },
);
