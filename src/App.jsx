import React, { useState, useEffect, useCallback } from 'react'
import ChatInterface from './components/ChatInterface'
import SidebarLeft from './components/SidebarLeft'
import SidebarRight from './components/SidebarRight'
import Dashboard from './components/Dashboard'
import { Menu, Layers } from 'lucide-react'

function App() {
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('chat')
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chatSessions')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch(e) {}
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
    if (saved && sessions.find(s => s.id === saved)) return saved
    return sessions[0]?.id || null
  })

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions))
  }, [sessions])
  useEffect(() => {
    if (activeSessionId) localStorage.setItem('activeSessionId', activeSessionId)
  }, [activeSessionId])

  const createNewSession = useCallback(() => {
    if (sessions.length >= 7) return false
    const newSession = {
      id: Date.now().toString(),
      name: 'Percakapan Baru',
      pinned: false,
      createdAt: new Date().toISOString(),
      messages: []
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    setLeftOpen(false)
    return true
  }, [sessions.length])

  const updateSessionName = useCallback((id, name) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, name: name.slice(0, 40) } : s))
  }, [])

  const togglePin = useCallback((id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s))
  }, [])

  const deleteSession = useCallback((id) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    if (activeSessionId === id) {
      const remaining = sessions.filter(s => s.id !== id)
      if (remaining.length > 0) setActiveSessionId(remaining[0].id)
      else {
        const newS = { id: Date.now().toString(), name: 'Percakapan Baru', pinned: false, createdAt: new Date().toISOString(), messages: [] }
        setSessions([newS])
        setActiveSessionId(newS.id)
      }
    }
  }, [activeSessionId, sessions])

  const updateSessionMessages = useCallback((id, messages) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, messages } : s))
  }, [])

  const activeSession = sessions.find(s => s.id === activeSessionId)

  return (
    <div className="app">
      <SidebarLeft
        isOpen={leftOpen}
        onClose={() => setLeftOpen(false)}
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={setActiveSessionId}
        onCreate={createNewSession}
        onUpdateName={updateSessionName}
        onTogglePin={togglePin}
        onDelete={deleteSession}
        maxSessions={7}
      />
      <SidebarRight
        isOpen={rightOpen}
        onClose={() => setRightOpen(false)}
        currentPage={currentPage}
        onPageChange={(page) => { setCurrentPage(page); setRightOpen(false) }}
      />
      <div className={`main-content ${(leftOpen || rightOpen) ? 'blurred' : ''}`}>
        <button className="menu-btn" onClick={() => setLeftOpen(true)}>
          <Menu size={20} />
        </button>
        <button className="menu-btn menu-btn-right" onClick={() => setRightOpen(true)}>
          <Layers size={20} />
        </button>
        {currentPage === 'chat' && activeSession && (
          <ChatInterface
            session={activeSession}
            onUpdateMessages={(msgs) => updateSessionMessages(activeSessionId, msgs)}
            onUpdateSessionName={(name) => updateSessionName(activeSessionId, name)}
          />
        )}
        {currentPage === 'dashboard' && <Dashboard />}
      </div>
      {(leftOpen || rightOpen) && (
        <div className="overlay active" onClick={() => { setLeftOpen(false); setRightOpen(false) }} />
      )}
    </div>
  )
}

export default App