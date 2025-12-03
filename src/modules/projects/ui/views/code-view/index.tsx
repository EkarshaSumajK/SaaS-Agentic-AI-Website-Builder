import Prism from "prismjs"
import {useEffect, useRef} from "react"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
// import "prismjs/components/prism-css"
// import "prismjs/components/prism-scss"
// import "prismjs/components/prism-html"
// import "prismjs/components/prism-json"
// import "prismjs/components/prism-markdown"
// import "prismjs/components/prism-bash"
// import "prismjs/components/prism-python"
// import "prismjs/components/prism-java"
// import "prismjs/components/prism-c"
// import "prismjs/components/prism-cpp"
// import "prismjs/components/prism-csharp"
// import "prismjs/components/prism-php"
// import "prismjs/components/prism-ruby"
// import "prismjs/components/prism-swift"
// import "prismjs/components/prism-sql"
// import "prismjs/components/prism-xml"
// import "prismjs/components/prism-yaml"
// import "prismjs/components/prism-toml"
// import "prismjs/components/prism-ini"
// import "prismjs/components/prism-docker"
// import "prismjs/components/prism-git"
// import "prismjs/components/prism-powershell"
// import "prismjs/components/prism-yaml"
import "./code-theme.css"

interface Props{
    code:string,
    language:string,
}

export const CodeView = ({code,language}:Props) => {
    const codeRef = useRef<HTMLElement>(null);
    
    useEffect(()=>{
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    },[code, language])
    
    const lines = code.split('\n');
    
    return(
        <div className="code-view bg-[#0a0a0a]">
            <pre className="m-0 bg-transparent border-0 rounded-none text-xs flex">
                {/* Line numbers column */}
                <div className="sticky left-0 z-10 flex flex-col bg-[#0a0a0a] text-gray-600 select-none border-r border-white/10 min-w-[2.5rem] text-right pr-2 py-3">
                    {lines.map((_, index) => (
                        <div 
                            key={index} 
                            className="leading-5 font-mono text-[10px]"
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
                
                {/* Code content */}
                <code 
                    ref={codeRef} 
                    className={`language-${language} block pl-3 pr-4 py-3 leading-5 font-mono text-xs whitespace-pre`}
                    style={{ background: 'transparent' }}
                >
                    {code}
                </code>
            </pre>
        </div>
    )
}
