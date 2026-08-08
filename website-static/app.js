function parseLogFile(name) {
  const withoutExt = name.replace(/\.html?$/i, '')
  const idMatch = withoutExt.match(/\[(\d+)\]$/)
  const id = idMatch ? idMatch[1] : null
  const title = id
    ? withoutExt.slice(0, withoutExt.lastIndexOf('[')).trim()
    : withoutExt.trim()
  return { name, title, id }
}

function encodeFilename(name) {
  return encodeURIComponent(name)
}

const logList = document.getElementById('log-list')
const searchInput = document.getElementById('search')
const logCount = document.getElementById('log-count')
const viewerTitle = document.getElementById('viewer-title')
const openLink = document.getElementById('open-link')
const logFrame = document.getElementById('log-frame')
const emptyState = document.getElementById('empty-state')

let logs = []
let selectedName = null

function renderLogs(filter = '') {
  logList.innerHTML = ''
  const q = filter.toLowerCase()

  const filtered = logs.filter(
    (log) =>
      log.title.toLowerCase().includes(q) ||
      (log.id && log.id.includes(q))
  )

  if (filtered.length === 0) {
    const status = document.createElement('p')
    status.className = 'status'
    status.textContent = filter ? 'No logs match your search.' : 'No logs found.'
    logList.appendChild(status)
    return
  }

  filtered.forEach((log) => {
    const btn = document.createElement('button')
    btn.className = 'log-item' + (log.name === selectedName ? ' active' : '')
    btn.title = log.title

    const titleSpan = document.createElement('span')
    titleSpan.className = 'log-title'
    titleSpan.textContent = log.title
    btn.appendChild(titleSpan)

    if (log.id) {
      const idSpan = document.createElement('span')
      idSpan.className = 'log-id'
      idSpan.textContent = log.id
      btn.appendChild(idSpan)
    }

    btn.addEventListener('click', () => selectLog(log))
    logList.appendChild(btn)
  })
}

function selectLog(log) {
  selectedName = log.name
  viewerTitle.textContent = log.title
  openLink.href = `./pages/${encodeFilename(log.name)}`
  openLink.classList.remove('hidden')
  logFrame.src = `./pages/${encodeFilename(log.name)}`
  logFrame.classList.remove('hidden')
  emptyState.classList.add('hidden')

  // Update active state in sidebar
  Array.from(logList.children).forEach((child) => {
    if (child.classList.contains('log-item')) {
      child.classList.toggle('active', child.title === log.title)
    }
  })
}

function init() {
  if (typeof LOGS === 'undefined' || !Array.isArray(LOGS)) {
    logCount.textContent = 'Error loading logs'
    logList.innerHTML = '<p class="status error">Could not load log data. Make sure logs-data.js is present.</p>'
    return
  }

  logs = LOGS.map(parseLogFile).sort((a, b) => a.title.localeCompare(b.title))
  logCount.textContent = `${logs.length} log file${logs.length !== 1 ? 's' : ''}`

  searchInput.addEventListener('input', (e) => renderLogs(e.target.value))

  renderLogs()

  if (logs.length > 0) {
    selectLog(logs[0])
  }
}

init()
