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

  const handleCopyCode = (code, idx) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(prev => ({ ...prev, [idx]: true }))
    setTimeout(() => setCopiedCode(prev => ({ ...prev, [idx]: false })), 2000)
  }

  const isUser = message.role === 'user'

  const CodeBlock = ({ language, children, idx }) => {
    const code = String(children).replace(/\n$/, '')
    return (
      <div style={{ margin: '8px 0' }}>
        <div className="code-header">
          <span>{language || 'code'}</span>
          <button className="copy-code" onClick={() => handleCopyCode(code, idx)}>
            {copiedCode[idx] ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
        <pre><code>{code}</code></pre>
      </div>
    )
  }

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className={`bubble ${isUser ? 'user' : 'assistant'}`}>
        {!isUser && message.reasoning && (
          <div style={{ marginBottom: '8px', padding: '6px 8px', background: '#1a1a1a', borderRadius: '10px', fontSize: '12px', color: '#a78bfa' }}>
            <Bot size={12} style={{ display: 'inline', marginRight: '4px' }} /> {message.reasoning}
          </div>
        )}
        <div className="markdown">
          {isStreaming && !message.content ? (
            <div className="typing"><span></span><span></span><span></span></div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const idx = Math.random()
                  return !inline && match ? (
                    <CodeBlock language={match[1]} idx={idx}>{String(children)}</CodeBlock>
                  ) : (
                    <code {...props}>{children}</code>
                  )
                },
                a({ href, children }) {
                  return <a href={href} target="_blank" rel="noopener noreferrer">{children} <ExternalLink size={10} style={{ display: 'inline' }} /></a>
                }
              }}
            >
              {message.content || ''}
            </ReactMarkdown>
          )}
        </div>
        {!isUser && !isStreaming && message.sources && message.sources.length > 0 && (
          <div className="sources">
            {message.sources.slice(0, 3).map((src, i) => (
              <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="source-link">
                <ExternalLink size={10} /> {src.title || src.url.slice(0, 30)}
              </a>
            ))}
          </div>
        )}
        {!isUser && !isStreaming && message.agents && message.agents.length > 0 && (
          <div className="agents">
            {message.agents.map((ag, i) => <span key={i} className="agent-tag">{ag}</span>)}
          </div>
        )}
        {!isUser && !isStreaming && message.content && (
          <button onClick={() => handleCopy(message.content)} style={{ background: 'none', border: 'none', marginTop: '6px', cursor: 'pointer', color: '#888' }}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
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