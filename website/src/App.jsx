import { useEffect, useMemo, useState } from 'react'

function parseLogFile(name) {
  // Expected filename format:
  // "Pulse - 👑PULSE ADMIN👑 - ⚖️conclave [1427228092794933249].html"
  const withoutExt = name.replace(/\.html?$/i, '')
  const idMatch = withoutExt.match(/\[(\d+)\]$/)
  const id = idMatch ? idMatch[1] : null
  const title = id
    ? withoutExt.slice(0, withoutExt.lastIndexOf('[')).trim()
    : withoutExt.trim()

  return { name, title, id }
}

function App() {
  const [logs, setLogs] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('./pages/manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const parsed = (data.files || []).map(parseLogFile)
        setLogs(parsed)
        setLoading(false)
        if (parsed.length > 0 && !selected) {
          setSelected(parsed[0])
        }
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filteredLogs = useMemo(() => {
    const q = filter.toLowerCase()
    if (!q) return logs
    return logs.filter(
      (log) =>
        log.title.toLowerCase().includes(q) ||
        (log.id && log.id.includes(q))
    )
  }, [logs, filter])

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Discord Logs</h1>
          <p>{logs.length} log file{logs.length !== 1 ? 's' : ''}</p>
        </div>
        <input
          type="search"
          className="search"
          placeholder="Search logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <nav className="log-list">
          {loading && <p className="status">Loading logs...</p>}
          {error && <p className="status error">{error}</p>}
          {!loading && filteredLogs.length === 0 && (
            <p className="status">No logs found.</p>
          )}
          {filteredLogs.map((log) => (
            <button
              key={log.name}
              className={`log-item ${selected?.name === log.name ? 'active' : ''}`}
              onClick={() => setSelected(log)}
              title={log.title}
            >
              <span className="log-title">{log.title}</span>
              {log.id && <span className="log-id">{log.id}</span>}
            </button>
          ))}
        </nav>
      </aside>
      <main className="viewer">
        {selected ? (
          <>
            <header className="viewer-header">
              <h2>{selected.title}</h2>
              <a
                href={`./pages/${encodeURIComponent(selected.name)}`}
                target="_blank"
                rel="noreferrer"
                className="open-link"
              >
                Open in new tab
              </a>
            </header>
            <iframe
              key={selected.name}
              src={`./pages/${encodeURIComponent(selected.name)}`}
              title={selected.title}
              className="log-frame"
              sandbox="allow-same-origin allow-scripts"
            />
          </>
        ) : (
          <div className="empty-state">
            <p>Select a log from the sidebar to view it.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
