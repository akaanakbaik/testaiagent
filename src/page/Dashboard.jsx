import React from 'react'
import { motion } from 'framer-motion'
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
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Pantau status 25 AI Models Shadow Swarm</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-effect rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-5"
        >
          <h2 className="text-lg font-semibold mb-4">Status AI Agents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {agents.map((agent, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <p className="font-medium text-sm">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.role}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard