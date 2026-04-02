import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check, ExternalLink, Bot } from 'lucide-react'

const MessageBubble = ({ message, isStreaming = false }) => {
  const [copied, setCopied] = useState(false)
  const [copiedCode, setCopiedCode] = useState({})

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(prev => ({ ...prev, [index]: true }))
    setTimeout(() => setCopiedCode(prev => ({ ...prev, [index]: false })), 2000)
  }

  const isUser = message.role === 'user'

  const CodeBlock = ({ language, children, index }) => {
    const codeContent = String(children).replace(/\n$/, '')
    return (
      <div className="code-wrapper">
        <div className="code-header">
          <span className="code-lang">{language || 'code'}</span>
          <button onClick={() => handleCopyCode(codeContent, index)} className="copy-code-btn">
            {copiedCode[index] ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <pre className="code-pre">
          <code className="code-content">{codeContent}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className={`message-row ${isUser ? 'user-row' : 'ai-row'}`}>
      <div className={`message-bubble ${isUser ? 'message-bubble-user' : 'message-bubble-ai'}`}>
        {!isUser && message.reasoning && (
          <div className="reasoning-block">
            <div className="reasoning-header">
              <Bot size={14} />
              <span>Proses Berpikir</span>
            </div>
            <p className="reasoning-text">{message.reasoning}</p>
          </div>
        )}

        <div className="message-content">
          {isStreaming && !message.content ? (
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const index = Math.random()
                  return !inline && match ? (
                    <CodeBlock language={match[1]} index={index}>{String(children)}</CodeBlock>
                  ) : (
                    <code className="inline-code" {...props}>{children}</code>
                  )
                },
                a({ href, children }) {
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="external-link">
                      {children} <ExternalLink size={12} />
                    </a>
                  )
                },
                p({ children }) { return <p className="paragraph">{children}</p> },
                h1({ children }) { return <h1 className="heading-1">{children}</h1> },
                h2({ children }) { return <h2 className="heading-2">{children}</h2> },
                h3({ children }) { return <h3 className="heading-3">{children}</h3> },
                ul({ children }) { return <ul className="list-ul">{children}</ul> },
                ol({ children }) { return <ol className="list-ol">{children}</ol> },
                li({ children }) { return <li className="list-li">{children}</li> },
                blockquote({ children }) { return <blockquote className="blockquote">{children}</blockquote> },
                table({ children }) { return <div className="table-wrapper"><table className="markdown-table">{children}</table></div> },
                th({ children }) { return <th className="table-header">{children}</th> },
                td({ children }) { return <td className="table-cell">{children}</td> }
              }}
            >
              {message.content || ''}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && !isStreaming && message.sources && message.sources.length > 0 && (
          <div className="sources-section">
            <div className="sources-title">Sumber:</div>
            <div className="sources-list">
              {message.sources.slice(0, 3).map((source, idx) => (
                <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="source-link">
                  <ExternalLink size={10} />
                  <span>{source.title || source.url}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {!isUser && !isStreaming && message.agents && message.agents.length > 0 && (
          <div className="agents-section">
            <Bot size={10} />
            <div className="agents-list">
              {message.agents.map((agent, idx) => (
                <span key={idx} className="agent-tag">{agent}</span>
              ))}
            </div>
          </div>
        )}

        {!isUser && !isStreaming && message.content && (
          <button onClick={() => handleCopy(message.content)} className="copy-message-btn">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        )}

        {message.timestamp && (
          <div className="message-time">
            {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble