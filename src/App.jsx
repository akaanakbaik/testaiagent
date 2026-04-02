import React, { useState, useEffect, useCallback, useRef } from 'react'
import ChatInterface from './components/ChatInterface'
import Sidebar from './components/Sidebar'
import PageSidebar from './components/PageSidebar'
import Dashboard from './page/Dashboard'
import { Menu, FileStack } from 'lucide-react'

function App() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('chat')
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chatSessions')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      } catch (e) {}
    }
    return [{
      id: Date.now().toString(),
      name: 'Percakapan Baru',
      pinned: false,
      createdAt: new Date().toISOString(),
      messages: []
    }]
  })
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const saved = localStorage.getItem('activeSessionId')
    if (saved && sessions.find(s => s.id === saved)) {
      return saved
    }
    return sessions[0]?.id || null
  })

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem('activeSessionId', activeSessionId)
    }
  }, [activeSessionId])

  const createNewSession = useCallback(() => {
    if (sessions.length >= 7) {
      return false
    }
    const newSession = {
      id: Date.now().toString(),
      name: 'Percakapan Baru',
      pinned: false,
      createdAt: new Date().toISOString(),
      messages: []
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    setIsLeftSidebarOpen(false)
    return true
  }, [sessions.length])

  const updateSessionName = useCallback((sessionId, newName) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, name: newName.slice(0, 50) } : s
    ))
  }, [])

  const togglePinSession = useCallback((sessionId) => {
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, pinned: !s.pinned } : s
    ))
  }, [])

  const deleteSession = useCallback((sessionId) => {
    const sessionToDelete = sessions.find(s => s.id === sessionId)
    if (!sessionToDelete) return
    
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    
    if (activeSessionId === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId)
      if (remainingSessions.length > 0) {
        setActiveSessionId(remainingSessions[0].id)
      } else {
        const newSession = {
          id: Date.now().toString(),
          name: 'Percakapan Baru',
          pinned: false,
          createdAt: new Date().toISOString(),
          messages: []
        }
        setSessions([newSession])
        setActiveSessionId(newSession.id)
      }
    }
  }, [sessions, activeSessionId])

  const updateSessionMessages = useCallback((sessionId, messages) => {
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, messages } : s
    ))
  }, [])

  const activeSession = sessions.find(s => s.id === activeSessionId)

  const tripleClickHandler = useCallback(() => {
    let clickCount = 0
    let timeoutId = null
    return () => {
      clickCount++
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => { clickCount = 0 }, 300)
      if (clickCount === 3) {
        setIsLeftSidebarOpen(false)
        setIsRightSidebarOpen(false)
        clickCount = 0
      }
    }
  }, [])

  const handleTripleClick = tripleClickHandler()

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-dark-900" onClick={handleTripleClick}>
      {(isLeftSidebarOpen || isRightSidebarOpen) && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => {
            setIsLeftSidebarOpen(false)
            setIsRightSidebarOpen(false)
          }}
        />
      )}
      
      <Sidebar 
        isOpen={isLeftSidebarOpen}
        onClose={() => setIsLeftSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onCreateNew={createNewSession}
        onUpdateName={updateSessionName}
        onTogglePin={togglePinSession}
        onDelete={deleteSession}
        maxSessions={7}
      />
      
      <PageSidebar 
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page)
          setIsRightSidebarOpen(false)
        }}
      />
      
      <div className={`h-full w-full transition-all duration-300 ${(isLeftSidebarOpen || isRightSidebarOpen) ? 'pointer-events-none' : 'pointer-events-auto'}`}>
        <div className="relative h-full w-full">
          <button
            onClick={() => setIsLeftSidebarOpen(true)}
            className="fixed top-5 left-5 z-30 p-2 rounded-xl glass-effect hover:bg-white/10 transition-all duration-200"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
          
          <button
            onClick={() => setIsRightSidebarOpen(true)}
            className="fixed top-5 right-5 z-30 p-2 rounded-xl glass-effect hover:bg-white/10 transition-all duration-200"
          >
            <FileStack size={22} strokeWidth={1.5} />
          </button>
          
          {currentPage === 'chat' && activeSession && (
            <ChatInterface
              session={activeSession}
              onUpdateMessages={(messages) => updateSessionMessages(activeSessionId, messages)}
              onUpdateSessionName={(name) => updateSessionName(activeSessionId, name)}
            />
          )}
          
          {currentPage === 'dashboard' && (
            <Dashboard />
          )}
        </div>
      </div>
    </div>
  )
}

export default App