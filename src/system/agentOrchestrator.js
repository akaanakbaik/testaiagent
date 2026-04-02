class AgentOrchestrator {
  constructor() {
    this.agents = {
      pemimpin: 'ARJUNA',
      penerima: 'SAMUDRA',
      router: 'KALA',
      pemeriksa: 'NAGA',
      searchUtama: 'GUNTUR',
      searchCadangan: 'BAYU',
      ngodingUtama: 'BUMI',
      ngodingCadangan: 'JAYA',
      terminal: 'KERTA',
      fastRespond: 'WIRA',
      animasi: 'RANGDA',
      analisisUtama: 'LANGIT',
      analisisCadangan: 'DEWI',
      thinkingUtama: 'JOKO',
      thinkingCadangan: 'GUNUNG',
      memory: 'SARI',
      screenshot: 'JAKA_SS',
      unlimited: 'UNLIM',
      webpilot: 'PILOT',
      zai: 'ZAI',
      kimi: 'KIMI',
      blackbox: 'BOX',
      perplexity2: 'PLEX2',
      gemini: 'GEM',
      aggregator: 'GATH',
    }

    this.taskQueue = []
    this.activeTasks = new Map()
    this.maxConcurrent = 3
  }

  classifyTask(message) {
    const msg = message.toLowerCase()
    
    if (msg.includes('buat') || msg.includes('buatkan') || msg.includes('kode') || msg.includes('coding') || msg.includes('html') || msg.includes('css') || msg.includes('js')) {
      return 'coding'
    }
    
    if (msg.includes('cari') || msg.includes('berita') || msg.includes('info') || msg.includes('terbaru') || msg.includes('apa') && msg.includes('sekarang')) {
      return 'search'
    }
    
    if (msg.includes('analisa') || msg.includes('analisis') || msg.includes('bandingkan') || msg.includes('perbedaan')) {
      return 'analysis'
    }
    
    if (msg.includes('harga') || msg.includes('emas') || msg.includes('dollar') || msg.includes('rupiah') || msg.includes('kurs')) {
      return 'finance'
    }
    
    if (msg.includes('apa') || msg.includes('siapa') || msg.includes('kapan') || msg.includes('bagaimana') || msg.includes('mengapa')) {
      return 'question'
    }
    
    return 'general'
  }

  async orchestrate(task, mode, onProgress) {
    const taskType = this.classifyTask(task)
    
    onProgress({ type: 'agent', agent: this.agents.penerima, status: 'Mengklasifikasi tugas...' })
    
    let assignedAgents = []
    
    if (taskType === 'coding') {
      assignedAgents = [this.agents.ngodingUtama, this.agents.ngodingCadangan, this.agents.terminal]
      onProgress({ type: 'agent', agent: this.agents.pemimpin, status: 'Memecah tugas coding...' })
    } else if (taskType === 'search') {
      assignedAgents = [this.agents.searchUtama, this.agents.kimi, this.agents.perplexity2]
      onProgress({ type: 'agent', agent: this.agents.pemimpin, status: 'Memecah tugas pencarian...' })
    } else if (taskType === 'analysis') {
      assignedAgents = [this.agents.analisisUtama, this.agents.analisisCadangan, this.agents.thinkingUtama]
      onProgress({ type: 'agent', agent: this.agents.pemimpin, status: 'Memecah tugas analisis...' })
    } else if (taskType === 'finance') {
      assignedAgents = [this.agents.perplexity2, this.agents.kimi, this.agents.screenshot]
      onProgress({ type: 'agent', agent: this.agents.pemimpin, status: 'Mengambil data finansial...' })
    } else if (taskType === 'question') {
      if (mode.fast) {
        assignedAgents = [this.agents.fastRespond]
        onProgress({ type: 'agent', agent: this.agents.pemimpin, status: 'Mode cepat...' })
      } else if (mode.thinking && !mode.search) {
        assignedAgents = [this.agents.thinkingUtama, this.agents.analisisUtama]
        onProgress({ type: 'agent', agent: this.agents.pemimpin, status: 'Mode berpikir...' })
      } else if (!mode.thinking && mode.search) {
        assignedAgents = [this.agents.searchUtama, this.agents.webpilot]
        onProgress({ type: 'agent', agent: this.agents.pemimpin, status: 'Mode pencarian...' })
      } else if (mode.thinking && mode.search) {
        assignedAgents = [this.agents.thinkingUtama, this.agents.searchUtama, this.agents.kimi, this.agents.perplexity2]
        onProgress({ type: 'agent', agent: this.agents.pemimpin, status: 'Mode lengkap...' })
      } else {
        assignedAgents = [this.agents.fastRespond]
        onProgress({ type: 'agent', agent: this.agents.pemimpin, status: 'Memproses...' })
      }
    } else {
      if (mode.thinking && mode.search) {
        assignedAgents = [this.agents.thinkingUtama, this.agents.searchUtama, this.agents.analisisUtama]
      } else if (mode.thinking) {
        assignedAgents = [this.agents.thinkingUtama, this.agents.analisisUtama]
      } else if (mode.search) {
        assignedAgents = [this.agents.searchUtama, this.agents.webpilot]
      } else {
        assignedAgents = [this.agents.fastRespond]
      }
      onProgress({ type: 'agent', agent: this.agents.pemimpin, status: 'Memecah tugas umum...' })
    }

    onProgress({ type: 'agent', agent: this.agents.router, status: 'Merutekan ke agent...' })
    
    for (const agent of assignedAgents) {
      onProgress({ type: 'agent_assigned', agent: agent, status: 'mulai' })
    }

    onProgress({ type: 'agent', agent: this.agents.pemeriksa, status: 'Memeriksa hasil...' })

    return {
      taskType,
      assignedAgents,
      recommendation: this.getRecommendation(taskType)
    }
  }

  getRecommendation(taskType) {
    const recommendations = {
      coding: 'Gunakan BUMI untuk coding, JAYA untuk backup, KERTA untuk test otomatis',
      search: 'GUNTUR untuk info cepat, KIMI untuk riset mendalam, PLEX2 untuk multi-source',
      analysis: 'LANGIT untuk analisis panjang, DEWI untuk ekstraksi insight',
      finance: 'PLEX2 + KIMI untuk akurasi maksimal',
      question: 'WIRA untuk cepat, JOKO untuk deep thinking, kombinasi untuk hasil terbaik',
      general: 'SAMUDRA untuk respons umum'
    }
    return recommendations[taskType] || recommendations.general
  }

  getAgentList() {
    return this.agents
  }
}

export default new AgentOrchestrator()