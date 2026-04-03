import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Pin, PinOff, X, Check, AlertCircle } from 'lucide-react'

const SidebarLeft = ({ isOpen, onClose, sessions, activeId, onSelect, onCreate, onUpdateName, onTogglePin, onDelete, maxSessions }) => {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [showLimitAlert, setShowLimitAlert] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const handleCreate = () => {
    if (sessions.length >= maxSessions) {
      setShowLimitAlert(true)
      setTimeout(() => setShowLimitAlert(false), 2000)
      return
    }
    onCreate()
  }

  const startEdit = (session) => {
    setEditingId(session.id)
    setEditName(session.name)
  }
  const saveEdit = () => {
    if (editingId && editName.trim()) onUpdateName(editingId, editName.trim())
    setEditingId(null)
    setEditName('')
  }

  const confirmDelete = (id) => setDeleteConfirmId(id)
  const cancelDelete = () => setDeleteConfirmId(null)
  const handleDelete = () => {
    if (deleteConfirmId) onDelete(deleteConfirmId)
    setDeleteConfirmId(null)
  }

  return (
    <div className={`sidebar-left ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Riwayat Chat</h2>
        <button className="close-sidebar" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <button className={`new-chat-btn ${sessions.length >= maxSessions ? 'disabled' : ''}`} onClick={handleCreate}>
        <Plus size={16} /> Chat Baru
      </button>
      {showLimitAlert && (
        <div style={{ margin: '0 16px 8px', padding: '6px 10px', background: '#1f1f1f', borderRadius: '10px', fontSize: '11px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={14} /> Batas {maxSessions} sesi, hapus salah satu
        </div>
      )}
      <div className="sessions-list">
        {sortedSessions.map(session => (
          <div key={session.id} className={`session-item ${activeId === session.id ? 'active' : ''}`}>
            {deleteConfirmId === session.id ? (
              <div className="delete-confirm">
                <button className="confirm-btn" onClick={handleDelete}>Hapus</button>
                <button className="cancel-btn" onClick={cancelDelete}>Batal</button>
              </div>
            ) : (
              <>
                <div onClick={() => onSelect(session.id)} style={{ cursor: 'pointer' }}>
                  {editingId === session.id ? (
                    <input className="edit-input" value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEdit()} autoFocus />
                  ) : (
                    <div className="session-name">
                      {session.pinned && <Pin size={10} className="pin-icon" />}
                      {session.name}
                    </div>
                  )}
                  <div className="session-date">{new Date(session.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                </div>
                <div className="session-actions">
                  <button onClick={() => onTogglePin(session.id)} title={session.pinned ? 'Lepas pin' : 'Pin'}>
                    {session.pinned ? <PinOff size={12} /> : <Pin size={12} />}
                  </button>
                  <button onClick={() => startEdit(session)} title="Edit nama"><Edit2 size={12} /></button>
                  <button onClick={() => confirmDelete(session.id)} title="Hapus"><Trash2 size={12} /></button>
                </div>
              </>
            )}
          </div>
        ))}
        {sessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontSize: '12px' }}>
            Belum ada sesi
          </div>
        )}
      </div>
      <div className="sidebar-footer">{sessions.length}/{maxSessions} sesi chat</div>
    </div>
  )
}

export default SidebarLeft