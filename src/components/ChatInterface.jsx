import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Search, Brain, Maximize2, Minimize2, X } from 'lucide-react'
import MessageBubble from './MessageBubble'

const ChatInterface = ({ session, onUpdateMessages, onUpdateSessionName }) => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [streamingMsg, setStreamingMsg] = useState(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const messages = session.messages || []

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMsg, scrollToBottom])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const generateTitle = useCallback((firstMsg) => {
    const title = firstMsg.slice(0, 35) + (firstMsg.length > 35 ? '...' : '')
    onUpdateSessionName(title)
  }, [onUpdateSessionName])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }
    const updated = [...messages, userMsg]
    onUpdateMessages(updated)
    setInput('')
    setIsLoading(true)
    setStreamingMsg(null)

    if (messages.length === 0) generateTitle(userMsg.content)

    setTimeout(() => {
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**Demo Response**\n\nAnda bertanya: "${userMsg.content}"\n\nMode: ${isThinking ? 'Berpikir ✓' : 'Fast'} | ${isSearch ? 'Search ✓' : 'No Search'}\n\n_Backend akan segera terhubung._`,
        timestamp: new Date().toISOString(),
        sources: [],
        agents: ['DEMO']
      }
      onUpdateMessages([...updated, assistantMsg])
      setIsLoading(false)
    }, 800)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleExpand = () => setIsExpanded(true)
  const closeExpand = () => setIsExpanded(false)

  return (
    <div className="chat-container">
      {isExpanded && (
        <div className="modal-overlay" onClick={closeExpand}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Tanyakan apapun..." autoFocus />
            <div className="modal-actions">
              <button onClick={closeExpand}>Batal</button>
              <button onClick={() => { sendMessage(); closeExpand() }}>Kirim</button>
            </div>
          </div>
        </div>
      )}
      <div className="messages-area">
        {messages.length === 0 && !isLoading && !streamingMsg && (
          <div className="welcome">
            <div className="welcome-icon">🤖</div>
            <h2>Shadow Swarm AI</h2>
            <p>25 AI models siap membantu</p>
          </div>
        )}
        {messages.map((msg, idx) => <MessageBubble key={msg.id || idx} message={msg} />)}
        {streamingMsg && <MessageBubble message={streamingMsg} isStreaming />}
        {isLoading && !streamingMsg && (
          <div className="message assistant">
            <div className="bubble assistant">
              <div className="typing"><span></span><span></span><span></span></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <div className="mode-row">
          <button className={`mode-btn ${isThinking ? 'active-thinking' : ''}`} onClick={() => setIsThinking(!isThinking)}>
            <Brain size={14} /> Berpikir
          </button>
          <button className={`mode-btn ${isSearch ? 'active-search' : ''}`} onClick={() => setIsSearch(!isSearch)}>
            <Search size={14} /> Cari
          </button>
        </div>
        <div className="input-wrapper">
          <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Tanyakan apapun..." rows={1} />
          <button className="expand-btn" onClick={toggleExpand}><Maximize2 size={16} /></button>
          <button className="send-btn" onClick={sendMessage} disabled={isLoading || !input.trim()}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface