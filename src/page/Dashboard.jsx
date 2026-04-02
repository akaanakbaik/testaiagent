import React from 'react'
import { Activity, Cpu, Database, Zap, Server, Globe } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    { icon: Activity, label: 'AI Models Aktif', value: '25', color: 'from-blue-500 to-cyan-500' },
    { icon: Cpu, label: 'CPU Usage', value: '23%', color: 'from-green-500 to-emerald-500' },
    { icon: Database, label: 'Memory', value: '1.2GB / 4GB', color: 'from-purple-500 to-pink-500' },
    { icon: Zap, label: 'Requests Today', value: '47', color: 'from-yellow-500 to-orange-500' },
    { icon: Server, label: 'Uptime', value: '99.97%', color: 'from-indigo-500 to-blue-500' },
    { icon: Globe, label: 'Active Sessions', value: '3', color: 'from-red-500 to-rose-500' },
  ]

  const agents = [
    { name: 'ARJUNA', role: 'AI Pemimpin', status: 'active' },
    { name: 'GUNTUR', role: 'AI Search Utama', status: 'active' },
    { name: 'BUMI', role: 'AI Ngoding', status: 'idle' },
    { name: 'KERTA', role: 'AI Terminal', status: 'active' },
    { name: 'NAGA', role: 'AI Pemeriksa', status: 'idle' },
    { name: 'WIRA', role: 'AI Fast Respond', status: 'active' },
    { name: 'LANGIT', role: 'AI Analisis', status: 'idle' },
    { name: 'KIMI', role: 'AI Deep Research', status: 'idle' },
  ]

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Pantau status 25 AI Models Shadow Swarm</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-header">
              <div className={`stat-icon`}>
                <stat.icon size={20} className="text-primary-400" />
              </div>
              <span className="stat-value">{stat.value}</span>
            </div>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="agents-section-dash">
        <h3>Status AI Agents</h3>
        <div className="agents-grid">
          {agents.map((agent, idx) => (
            <div key={idx} className="agent-item">
              <div className="agent-info">
                <h4>{agent.name}</h4>
                <p>{agent.role}</p>
              </div>
              <div className={`status-dot ${agent.status === 'active' ? 'active' : 'idle'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard