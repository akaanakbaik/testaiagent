import React, { useState } from 'react'
import { 
  Plus, Trash2, Edit2, Pin, PinOff, X, Check, AlertCircle
} from 'lucide-react'

const Sidebar = ({ 
  isOpen, onClose, sessions, activeSessionId, onSelectSession, 
  onCreateNew, onUpdateName, onTogglePin, onDelete, maxSessions 
}) => {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [showLimitAlert, setShowLimitAlert] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const handleCreateNew = () => {
    if (sessions.length >= maxSessions) {
      setShowLimitAlert(true)
      setTimeout(() => setShowLimitAlert(false), 3000)
      return
    }
    onCreateNew()
  }

  const handleDeleteClick = (sessionId) => {
    setDeleteConfirmId(sessionId)
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirmId(null)
  }

  const startEditing = (session) => {
    setEditingId(session.id)
    setEditName(session.name)
  }

  const saveEditing = () => {
    if (editingId && editName.trim()) {
      onUpdateName(editingId, editName.trim())
    }
    setEditingId(null)
    setEditName('')
  }

  if (!isOpen) return null

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Riwayat Chat</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-body">
          <button
            onClick={handleCreateNew}
            className={`new-chat-btn ${sessions.length >= maxSessions ? 'disabled' : ''}`}
            disabled={sessions.length >= maxSessions}
          >
            <Plus size={18} />
            <span>Chat Baru</span>
          </button>
          
          {showLimitAlert && (
            <div className="alert">
              <AlertCircle size={16} />
              <span>Batas maksimal {maxSessions} sesi. Hapus salah satu!</span>
            </div>
          )}
        </div>

        <div className="sessions-list">
          {sortedSessions.map((session) => (
            <div
              key={session.id}
              className={`session-item ${activeSessionId === session.id ? 'active' : ''}`}
            >
              {deleteConfirmId === session.id ? (
                <div className="delete-confirm">
                  <p>Hapus sesi ini?</p>
                  <div className="delete-actions">
                    <button onClick={handleConfirmDelete} className="confirm-btn">Ya</button>
                    <button onClick={handleCancelDelete} className="cancel-btn">Batal</button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="session-content"
                    onClick={() => onSelectSession(session.id)}
                  >
                    {editingId === session.id ? (
                      <div className="edit-mode">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEditing()}
                          autoFocus
                        />
                        <button onClick={saveEditing} className="save-btn">
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="session-info">
                          {session.pinned && <Pin size={12} className="pin-icon" />}
                          <span className="session-name">{session.name}</span>
                        </div>
                        <div className="session-date">
                          {new Date(session.createdAt).toLocaleDateString('id-ID', { 
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                          })}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {deleteConfirmId !== session.id && (
                    <div className="session-actions">
                      <button onClick={() => onTogglePin(session.id)} title={session.pinned ? 'Lepas pin' : 'Pin'}>
                        {session.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                      </button>
                      <button onClick={() => startEditing(session)} title="Edit nama">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteClick(session.id)} title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          
          {sessions.length === 0 && (
            <div className="empty-state">
              <p>Belum ada sesi chat</p>
              <button onClick={handleCreateNew}>Buat sesi baru</button>
            </div>
          )}
        </div>
        
        <div className="sidebar-footer">
          {sessions.length}/{maxSessions} sesi chat
        </div>
      </aside>
    </>
  )
}

export default Sidebar