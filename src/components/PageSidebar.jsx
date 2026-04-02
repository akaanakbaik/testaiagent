import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, LayoutDashboard, Check } from 'lucide-react'

const PageSidebar = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const pages = [
    { id: 'chat', name: 'Chat', icon: Home },
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-80 z-50 glass-sidebar-right shadow-2xl"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Halaman
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-2">
              {pages.map((page) => {
                const Icon = page.icon
                const isActive = currentPage === page.id
                
                return (
                  <button
                    key={page.id}
                    onClick={() => onPageChange(page.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-500/20' : 'bg-white/5'}`}>
                        <Icon size={18} className={isActive ? 'text-primary-400' : 'text-gray-400'} />
                      </div>
                      <span className={isActive ? 'text-primary-400 font-medium' : 'text-gray-300'}>
                        {page.name}
                      </span>
                    </div>
                    {isActive && <Check size={18} className="text-primary-400" />}
                  </button>
                )
              })}
            </div>
            
            <div className="p-4 border-t border-white/10 text-xs text-gray-500 text-center">
              Shadow Swarm AI v5.0
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default PageSidebar