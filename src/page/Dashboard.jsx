import React from 'react'
import { Activity, Cpu, Database, Zap, Server, Globe } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    { icon: Activity, label: 'AI Models Aktif', value: '25', color: '#3b82f6' },
    { icon: Cpu, label: 'CPU Usage', value: '23%', color: '#10b981' },
    { icon: Database, label: 'Memory', value: '1.2GB / 4GB', color: '#8b5cf6' },
    { icon: Zap, label: 'Requests Today', value: '47', color: '#f59e0b' },
    { icon: Server, label: 'Uptime', value: '99.97%', color: '#06b6d4' },
    { icon: Globe, label: 'Active Sessions', value: '3', color: '#ef4444' },
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
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-sub">Pantau 25 AI Models Shadow Swarm</div>
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <stat.icon size={18} color={stat.color} />
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="agents-grid">
        {agents.map((agent, idx) => (
          <div key={idx} className="agent-row">
            <div>
              <div className="agent-name">{agent.name}</div>
              <div className="agent-role">{agent.role}</div>
            </div>
            <div className={`agent-status ${agent.status}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard