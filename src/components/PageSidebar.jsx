import React from 'react'
import { X, Home, LayoutDashboard, Check } from 'lucide-react'

const PageSidebar = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const pages = [
    { id: 'chat', name: 'Chat', icon: Home },
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard }
  ]

  if (!isOpen) return null

  return (
    <>
      <div className="sidebar-overlay-right" onClick={onClose} />
      <aside className="sidebar-right">
        <div className="sidebar-header">
          <h2>Halaman</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="pages-list">
          {pages.map((page) => {
            const Icon = page.icon
            const isActive = currentPage === page.id
            
            return (
              <button
                key={page.id}
                onClick={() => onPageChange(page.id)}
                className={`page-item ${isActive ? 'active' : ''}`}
              >
                <div className="page-icon">
                  <Icon size={18} />
                </div>
                <span className="page-name">{page.name}</span>
                {isActive && <Check size={18} className="active-icon" />}
              </button>
            )
          })}
        </div>
        
        <div className="sidebar-footer">
          Shadow Swarm AI v5.0
        </div>
      </aside>
    </>
  )
}

export default PageSidebar