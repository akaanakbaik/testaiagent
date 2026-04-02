import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Search, Brain, Maximize2, Minimize2, X } from 'lucide-react'
import MessageBubble from './MessageBubble'
import axios from 'axios'

const ChatInterface = ({ session, onUpdateMessages, onUpdateSessionName }) => {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isThinkingMode, setIsThinkingMode] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const abortControllerRef = useRef(null)

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
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/generate-title`, {
        message: firstMessage.slice(0, 100)
      })
      const newName = response.data.title || firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '')
      onUpdateSessionName(newName)
    } catch (error) {
      const fallbackName = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '')
      onUpdateSessionName(fallbackName)
    }
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

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: session.id,
          history: updatedMessages,
          mode: {
            fast: !isThinkingMode && !isSearchMode,
            thinking: isThinkingMode,
            search: isSearchMode
          }
        }),
        signal: abortControllerRef.current.signal
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''
      let reasoningContent = ''
      let sources = []
      let agents = []

      const assistantMessageId = (Date.now() + 1).toString()
      setStreamingMessage({
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        reasoning: '',
        sources: [],
        agents: [],
        timestamp: new Date().toISOString()
      })

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'content') {
                accumulatedContent += data.content
                setStreamingMessage(prev => ({
                  ...prev,
                  content: accumulatedContent
                }))
              } else if (data.type === 'reasoning') {
                reasoningContent += data.content
                setStreamingMessage(prev => ({
                  ...prev,
                  reasoning: reasoningContent
                }))
              } else if (data.type === 'source') {
                sources.push(data.source)
                setStreamingMessage(prev => ({
                  ...prev,
                  sources: [...sources]
                }))
              } else if (data.type === 'agent') {
                agents.push(data.agent)
                setStreamingMessage(prev => ({
                  ...prev,
                  agents: [...agents]
                }))
              } else if (data.type === 'done') {
                break
              }
            } catch (e) {}
          }
        }
      }

      const finalAssistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: accumulatedContent,
        reasoning: reasoningContent,
        sources: sources,
        agents: agents,
        timestamp: new Date().toISOString()
      }

      onUpdateMessages([...updatedMessages, finalAssistantMessage])
      setStreamingMessage(null)
    } catch (error) {
      if (error.name !== 'AbortError') {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
          timestamp: new Date().toISOString()
        }
        onUpdateMessages([...updatedMessages, errorMessage])
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [inputValue, isLoading, messages, session.id, onUpdateMessages, generateSessionName, isThinkingMode, isSearchMode])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
  }

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark-900/95 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={handleCollapse}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl h-96"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanyakan apapun..."
                  className="w-full h-full bg-dark-800 border border-white/10 rounded-2xl p-5 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary-500 text-lg"
                  autoFocus
                />
                <button
                  onClick={handleCollapse}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition"
                >
                  <Minimize2 size={20} />
                </button>
                <button
                  onClick={sendMessage}
                  className="absolute bottom-3 right-3 p-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition shadow-lg"
                >
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && !isLoading && !streamingMessage && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Shadow Swarm AI</h2>
            <p className="text-gray-400 max-w-md">Tanyakan apapun. 25 AI models siap membantu Anda.</p>
          </div>
        )}
        
        {messages.map((message, idx) => (
          <MessageBubble key={message.id || idx} message={message} />
        ))}
        
        {streamingMessage && (
          <MessageBubble message={streamingMessage} isStreaming={true} />
        )}
        
        {isLoading && !streamingMessage && (
          <div className="flex justify-start">
            <div className="message-bubble-ai px-5 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-loading-dot" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-loading-dot" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-loading-dot" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setIsThinkingMode(!isThinkingMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isThinkingMode
                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Brain size={16} />
            <span className="text-sm">Berpikir</span>
          </button>
          <button
            onClick={() => setIsSearchMode(!isSearchMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isSearchMode
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Search size={16} />
            <span className="text-sm">Cari</span>
          </button>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan apapun..."
            rows={1}
            className="w-full bg-dark-800 border border-white/10 rounded-2xl pl-5 pr-24 py-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary-500 transition-all"
            style={{ maxHeight: '200px', overflowY: 'auto' }}
          />
          <div className="absolute right-2 bottom-2 flex gap-1">
            <button
              onClick={handleExpand}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              title="Perbesar"
            >
              <Maximize2 size={18} />
            </button>
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isLoading || !inputValue.trim()
                  ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface