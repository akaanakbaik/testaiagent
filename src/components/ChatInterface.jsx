import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Search, Brain, Maximize2, Minimize2, X } from 'lucide-react'
import MessageBubble from './MessageBubble'

const ChatInterface = ({ session, onUpdateMessages, onUpdateSessionName }) => {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isThinkingMode, setIsThinkingMode] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const messages = session.messages || []

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage, scrollToBottom])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [inputValue])

  const generateSessionName = useCallback(async (firstMessage) => {
    const newName = firstMessage.slice(0, 40) + (firstMessage.length > 40 ? '...' : '')
    onUpdateSessionName(newName)
  }, [onUpdateSessionName])

  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    }

    const updatedMessages = [...messages, userMessage]
    onUpdateMessages(updatedMessages)
    setInputValue('')
    setIsLoading(true)
    setStreamingMessage(null)

    const isFirstMessage = messages.length === 0
    if (isFirstMessage) {
      await generateSessionName(userMessage.content)
    }

    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**Demo Response:**\n\nKamu bertanya: "${userMessage.content}"\n\nMode: ${isThinkingMode ? 'Berpikir ✓' : 'Fast'} | ${isSearchMode ? 'Search ✓' : 'No Search'}\n\n_Fitur backend akan segera terhubung._`,
        timestamp: new Date().toISOString(),
        sources: [],
        agents: ['DEMO']
      }
      onUpdateMessages([...updatedMessages, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }, [inputValue, isLoading, messages, onUpdateMessages, generateSessionName, isThinkingMode, isSearchMode])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleExpand = () => setIsExpanded(true)
  const handleCollapse = () => setIsExpanded(false)

  return (
    <div className="chat-container">
      {isExpanded && (
        <div className="expanded-overlay" onClick={handleCollapse}>
          <div className="expanded-modal" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan apapun..."
              autoFocus
            />
            <button onClick={handleCollapse} className="collapse-btn">
              <Minimize2 size={20} />
            </button>
            <button onClick={sendMessage} className="send-expanded-btn">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 && !isLoading && !streamingMessage && (
          <div className="welcome-screen">
            <div className="welcome-icon">🤖</div>
            <h2>Shadow Swarm AI</h2>
            <p>25 AI models siap membantu Anda</p>
          </div>
        )}
        
        {messages.map((message, idx) => (
          <MessageBubble key={message.id || idx} message={message} />
        ))}
        
        {streamingMessage && <MessageBubble message={streamingMessage} isStreaming={true} />}
        
        {isLoading && !streamingMessage && (
          <div className="loading-bubble">
            <div className="message-bubble-ai">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <div className="mode-buttons">
          <button
            onClick={() => setIsThinkingMode(!isThinkingMode)}
            className={`mode-btn ${isThinkingMode ? 'active-thinking' : ''}`}
          >
            <Brain size={16} />
            <span>Berpikir</span>
          </button>
          <button
            onClick={() => setIsSearchMode(!isSearchMode)}
            className={`mode-btn ${isSearchMode ? 'active-search' : ''}`}
          >
            <Search size={16} />
            <span>Cari</span>
          </button>
        </div>

        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan apapun..."
            rows={1}
          />
          <button onClick={handleExpand} className="expand-btn" title="Perbesar">
            <Maximize2 size={18} />
          </button>
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            className={`send-btn ${isLoading || !inputValue.trim() ? 'disabled' : ''}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface