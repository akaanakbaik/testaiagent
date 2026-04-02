import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Pin, 
  PinOff, 
  X,
  Check,
  AlertCircle
} from 'lucide-react'

const Sidebar = ({ 
  isOpen, 
  onClose, 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onCreateNew, 
  onUpdateName, 
  onTogglePin, 
  onDelete, 
  maxSessions 
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-80 z-50 glass-sidebar shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  Riwayat Chat
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4">
                <button
                  onClick={handleCreateNew}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-200 ${
                    sessions.length >= maxSessions
                      ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg'
                  }`}
                  disabled={sessions.length >= maxSessions}
                >
                  <Plus size={18} />
                  <span>Chat Baru</span>
                </button>
                
                <AnimatePresence>
                  {showLimitAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center gap-2 text-sm text-yellow-400"
                    >
                      <AlertCircle size={16} />
                      <span>Batas maksimal {maxSessions} sesi chat. Hapus salah satu untuk membuat baru.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 overflow-y-auto px-3 pb-5 space-y-2">
                {sortedSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`group relative rounded-xl transition-all duration-200 ${
                      activeSessionId === session.id
                        ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {deleteConfirmId === session.id ? (
                      <div className="p-3">
                        <p className="text-sm text-gray-300 mb-3">Hapus sesi ini?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleConfirmDelete}
                            className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition"
                          >
                            Ya, Hapus
                          </button>
                          <button
                            onClick={handleCancelDelete}
                            className="flex-1 py-2 rounded-lg bg-white/10 text-gray-300 text-sm hover:bg-white/20 transition"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`p-3 cursor-pointer transition-all duration-200 ${
                          activeSessionId === session.id ? 'pr-20' : 'pr-20 group-hover:pr-20'
                        }`}
                        onClick={() => onSelectSession(session.id)}
                      >
                        {editingId === session.id ? (
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditing()}
                              className="flex-1 bg-dark-700 border border-white/20 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-primary-500"
                              autoFocus
                            />
                            <button
                              onClick={saveEditing}
                              className="p-1 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition"
                            >
                              <Check size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              {session.pinned && <Pin size={12} className="text-primary-400" />}
                              <span className={`text-sm truncate flex-1 ${activeSessionId === session.id ? 'text-primary-400 font-medium' : 'text-gray-300'}`}>
                                {session.name}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(session.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    
                    {deleteConfirmId !== session.id && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => { e.stopPropagation(); onTogglePin(session.id); }}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition"
                          title={session.pinned ? 'Lepas pin' : 'Pin'}
                        >
                          {session.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); startEditing(session); }}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition"
                          title="Edit nama"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(session.id); }}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {sessions.length === 0 && (
                  <div className="text-center text-gray-500 py-10">
                    <p className="text-sm">Belum ada sesi chat</p>
                    <button onClick={handleCreateNew} className="mt-3 text-primary-400 text-sm hover:underline">
                      Buat sesi baru
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-white/10 text-xs text-gray-500 text-center">
                {sessions.length}/{maxSessions} sesi chat
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default Sidebar