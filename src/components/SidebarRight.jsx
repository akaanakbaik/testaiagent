import React from 'react'
import { X, Home, LayoutDashboard, Check } from 'lucide-react'

const SidebarRight = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const pages = [
    { id: 'chat', name: 'Chat', icon: Home },
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard }
  ]

  return (
    <div className={`sidebar-right ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Halaman</h2>
        <button className="close-sidebar" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="pages-list">
        {pages.map(page => {
          const Icon = page.icon
          const isActive = currentPage === page.id
          return (
            <div key={page.id} className={`page-item ${isActive ? 'active' : ''}`} onClick={() => onPageChange(page.id)}>
              <div className="page-icon"><Icon size={18} /></div>
              <span className="page-name">{page.name}</span>
              {isActive && <Check size={16} className="active-icon" />}
            </div>
          )
        })}
      </div>
      <div className="sidebar-footer">Shadow Swarm AI v5.0</div>
    </div>
  )
}

export default SidebarRight