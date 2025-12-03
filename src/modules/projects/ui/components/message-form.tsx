import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import  TextareaAutosize  from "react-textarea-autosize"
import {z} from "zod"
import {useState} from "react"
import {toast} from "sonner"
import { ArrowRightIcon, Loader2Icon, PaperclipIcon, SparklesIcon } from "lucide-react"
import {useMutation,useQueryClient} from "@tanstack/react-query"
import {cn} from "@/lib/utils"
import {useTRPC} from "@/trpc/client"
import {Button} from "@/components/ui/button"
import { Form,FormField } from "@/components/ui/form"



interface MessageFormProps{
    projectId:string
}
const formSchema = z.object({
    value:z.string().min(1,{message:"value is required"}).max(10000,{message:"value must be less than 10000 characters"}),
})

export const MessageForm = ({projectId}:MessageFormProps) => {
    const[isFocused,setIsFocused] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            value:"",
        },
    })
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess:()=>{
            form.reset()
            queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({projectId}))
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    }))
    const isPending = createMessage.isPending
    const isDisabled = isPending || !form.formState.isValid
    const onSubmit = async (values:z.infer<typeof formSchema>)=>{
        await createMessage.mutateAsync({
            value:values.value,
            projectId,
        })
    }
    return (
        <div className="relative w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full">
                    {/* Wrapper with gradient border - matching home page style */}
                    <div className="relative rounded-xl p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-black/20 shadow-[0_1px_2px_0_rgba(0,0,0,0.06)]">
                        <div className={cn(
                            "relative flex flex-col rounded-xl overflow-hidden transition-all duration-300",
                            "bg-[rgba(15,15,20,0.55)] backdrop-blur-md",
                            isFocused && "ring-1 ring-[#1f3dbc]/40"
                        )}>
                            <FormField control={form.control} name="value" render={({field})=>(
                                <TextareaAutosize
                                    className="w-full resize-none bg-transparent border-none outline-none text-xs text-white placeholder:text-white/40 px-3 py-3 pr-12 min-h-[60px] max-h-[150px] transition-all duration-200"
                                    {...field}
                                    disabled={isPending}
                                    onFocus={()=>setIsFocused(true)}
                                    onBlur={()=>setIsFocused(false)}
                                    minRows={2}
                                    maxRows={5}
                                    placeholder="Describe what you want to build..."
                                    onKeyDown={(e)=>{
                                        if(e.key==="Enter"&&(e.ctrlKey || e.metaKey)){
                                            e.preventDefault()
                                            form.handleSubmit(onSubmit)(e)
                                        }
                                    }}
                                />
                            )}
                            />
                        
                            {/* Control Bar */}
                            <div className="flex items-center justify-between px-2 pb-2">
                                {/* Left Group */}
                                <div className="flex items-center gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-6 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200"
                                    >
                                        <PaperclipIcon className="size-3" />
                                    </Button>
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-gray-500">
                                        <SparklesIcon className="size-2.5 text-[#1f3dbc]" />
                                        <span>AI</span>
                                    </div>
                                </div>

                                {/* Submit Button - matching home page style */}
                                <Button 
                                    type="submit" 
                                    size="icon" 
                                    className={cn(
                                        "w-8 h-7 rounded-lg transition-all duration-200",
                                        "bg-[#f0f2ff] text-black hover:bg-white",
                                        "shadow-sm hover:shadow-md",
                                        (!form.getValues("value") || isPending) && "opacity-50 cursor-not-allowed"
                                    )} 
                                    disabled={isDisabled || !form.getValues("value")}
                                >
                                    {isPending ? (
                                        <Loader2Icon className="size-3 animate-spin" />
                                    ) : (
                                        <ArrowRightIcon className="size-3" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}