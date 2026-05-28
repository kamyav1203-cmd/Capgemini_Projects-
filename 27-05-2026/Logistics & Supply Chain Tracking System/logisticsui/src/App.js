import { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5183';

const initialDashboard = {
  metrics: {
    totalShipments: 0,
    delivered: 0,
    inTransit: 0,
    delayed: 0,
    onTimeRate: 0,
  },
  shipments: [],
  alerts: [],
};

function App() {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setDashboard(data);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Unable to load live logistics data right now.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
      }
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'Customer', 'Status', 'Carrier', 'Mode', 'ETA', 'Progress', 'Temperature'],
      ...dashboard.shipments.map((s) => [
        s.id,
        s.customer,
        s.status,
        s.carrier,
        s.mode,
        s.eta,
        `${s.progress}%`,
        `${s.temperatureC}°C`,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shipments-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredShipments = useMemo(() => {
    if (!searchQuery.trim()) return dashboard.shipments;
    const q = searchQuery.toLowerCase();
    return dashboard.shipments.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.customer.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q),
    );
  }, [dashboard.shipments, searchQuery]);

  const featuredShipment = useMemo(
    () => selectedShipment || dashboard.shipments[0] || null,
    [selectedShipment, dashboard.shipments],
  );

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Logistics & Supply Chain Tracking System</p>
          <h1>Real-time shipment visibility in one clean dashboard.</h1>
          <p className="hero-copy">
            Track active deliveries, monitor cold-chain exceptions, and review recent movement
            updates without leaving the operations screen.
          </p>
        </div>
        <div className="hero-card">
          <span className="hero-label">Operations status</span>
          <strong>{loading ? 'Syncing data...' : error || 'All systems connected'}</strong>
          <span>
            {loading
              ? 'Loading the latest shipment snapshot.'
              : featuredShipment
                ? `${featuredShipment.carrier} • ${featuredShipment.currentLocation}`
                : 'Dashboard updated from the API.'}
          </span>
        </div>
      </header>

      <main className="content-grid">
        <section className="metrics-grid" aria-label="Shipment metrics">
          <MetricCard label="Total shipments" value={dashboard.metrics.totalShipments} />
          <MetricCard label="Delivered" value={dashboard.metrics.delivered} tone="success" />
          <MetricCard label="In transit" value={dashboard.metrics.inTransit} tone="info" />
          <MetricCard label="Delayed" value={dashboard.metrics.delayed} tone="warning" />
          <MetricCard label="On-time health" value={`${dashboard.metrics.onTimeRate}%`} tone="success" />\n          <MetricCard label="Exception rate" value={`${dashboard.metrics.exceptionRate}%`} tone="warning" />\n          <MetricCard label="Avg progress" value={`${dashboard.metrics.avgProgress}%`} tone="info" />
        </section>

        <section className="panel panel-span-2">
          <div className="panel-header">
            <div>
              <p className="section-label">Shipment overview</p>
              <h2>Active shipments ({filteredShipments.length})</h2>
            </div>
            <div className="panel-actions">
              <button className="action-btn" onClick={handleExport} title="Export as CSV">
                📥 Export
              </button>
              <button className="action-btn" onClick={handleRefresh} disabled={loading} title="Refresh data">
                🔄 Refresh
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search by shipment ID, customer, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          {loading ? (
            <p className="placeholder">Loading shipments...</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Shipment</th>
                    <th>Customer</th>
                    <th>Carrier</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Temp</th>
                    <th>Progress</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} onClick={() => setSelectedShipment(shipment)} className="clickable-row">
                      <td>
                        <strong>{shipment.id}</strong>
                        <div className="muted">{shipment.note}</div>
                      </td>
                      <td>{shipment.customer}</td>
                      <td>
                        <div>{shipment.carrier}</div>
                        <div className="muted">{shipment.mode}</div>
                      </td>
                      <td>
                        <div>{shipment.origin}</div>
                        <div className="muted">→ {shipment.destination}</div>
                      </td>
                      <td>
                        <span className={`status-badge status-${shipment.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {shipment.status}
                        </span>
                      </td>
                      <td>{shipment.temperatureC}°C</td>
                      <td>{shipment.progress}%</td>
                      <td>{shipment.eta}</td>
                      <td><span className="expand-icon">→</span></td>
                    </tr>
                  ))}
                  {filteredShipments.length === 0 && (
                    <tr><td colSpan="9" className="placeholder">No shipments match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Alerts</p>
              <h2>Operations watchlist</h2>
            </div>
          </div>
          <div className="alerts-list">
            {dashboard.alerts.map((alert) => (
              <article key={alert.title} className="alert-card">
                <div className="alert-topline">
                  <strong>{alert.title}</strong>
                  <span>{alert.priority}</span>
                </div>
                <p>{alert.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Shipment details</p>
              <h2>{featuredShipment ? featuredShipment.id : 'No shipment loaded'}</h2>
            </div>
            {featuredShipment && (
              <button className="close-btn" onClick={() => setSelectedShipment(null)}>
                ✕
              </button>
            )}
          </div>

          {featuredShipment ? (
            <>
              <div className="detail-grid">
                <Detail label="Carrier" value={featuredShipment.carrier} />
                <Detail label="Mode" value={featuredShipment.mode} />
                <Detail label="Current location" value={featuredShipment.currentLocation} />
                <Detail label="Priority" value={featuredShipment.priority} />
                <Detail label="Last scan" value={featuredShipment.lastScan} />
                <Detail label="Temperature" value={`${featuredShipment.temperatureC}°C`} />
              </div>

              <div className="shipment-summary">
                <span className="status-badge status-in-transit">{featuredShipment.status}</span>
                <p>{featuredShipment.note}</p>
              </div>

              <div className="timeline">
                {featuredShipment.timeline.map((item) => (
                  <div key={`${item.timestamp}-${item.message}`} className="timeline-item">
                    <span className="timeline-time">{item.timestamp}</span>
                    <p>{item.message}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="placeholder">No tracking data available yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}

function MetricCard({ label, value, tone = 'default' }) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
