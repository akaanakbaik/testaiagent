import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check, ExternalLink, Bot, Brain, Search } from 'lucide-react'

const MessageBubble = ({ message, isStreaming = false }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === 'user'

  const getModeIcon = () => {
    if (message.mode === 'thinking') return <Brain size={12} className="text-purple-400" />
    if (message.mode === 'search') return <Search size={12} className="text-green-400" />
    return null
  }

  const CodeBlock = ({ language, children }) => {
    const codeContent = String(children).replace(/\n$/, '')
    const [copiedCode, setCopiedCode] = useState(false)

    const handleCopyCode = () => {
      navigator.clipboard.writeText(codeContent)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }

    return (
      <div className="my-3 rounded-xl overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
          <span className="text-xs text-gray-400 uppercase">{language || 'code'}</span>
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition"
          >
            {copiedCode ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-words">
            <code>{codeContent}</code>
          </pre>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] ${isUser ? 'message-bubble-user' : 'message-bubble-ai'} px-5 py-3`}>
        {!isUser && message.reasoning && (
          <div className="mb-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-purple-400" />
              <span className="text-xs text-purple-400 font-medium">Proses Berpikir</span>
            </div>
            <p className="text-sm text-gray-400">{message.reasoning}</p>
          </div>
        )}

        <div className={`prose prose-invert max-w-none ${isUser ? 'text-white' : 'text-gray-200'}`}>
          {isStreaming && !message.content ? (
            <div className="flex gap-1.5 py-1">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-loading-dot" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-loading-dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-loading-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <CodeBlock language={match[1]}>{String(children)}</CodeBlock>
                  ) : (
                    <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm text-primary-300" {...props}>
                      {children}
                    </code>
                  )
                },
                pre({ children }) {
                  return <>{children}</>
                },
                a({ href, children }) {
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                      {children}
                    </a>
                  )
                },
                p({ children }) {
                  return <p className="mb-2 leading-relaxed">{children}</p>
                },
                h1({ children }) { return <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1> },
                h2({ children }) { return <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2> },
                h3({ children }) { return <h3 className="text-md font-bold mt-2 mb-1">{children}</h3> },
                ul({ children }) { return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul> },
                ol({ children }) { return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol> },
                li({ children }) { return <li className="text-gray-300">{children}</li> },
                blockquote({ children }) {
                  return <blockquote className="border-l-4 border-primary-500 pl-4 my-2 text-gray-400 italic">{children}</blockquote>
                }
              }}
            >
              {message.content || ''}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && !isStreaming && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {message.sources.slice(0, 3).map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition text-xs text-gray-400"
                >
                  <ExternalLink size={10} />
                  <span className="truncate max-w-[150px]">{source.title || source.url}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {!isUser && !isStreaming && message.agents && message.agents.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <Bot size={10} className="text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {message.agents.map((agent, idx) => (
                <span key={idx} className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                  {agent}
                </span>
              ))}
            </div>
          </div>
        )}

        {!isUser && !isStreaming && message.content && (
          <button
            onClick={() => handleCopy(message.content)}
            className="mt-2 p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
          </button>
        )}

        {message.timestamp && (
          <div className={`text-xs mt-1 ${isUser ? 'text-blue-200/50' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MessageBubble