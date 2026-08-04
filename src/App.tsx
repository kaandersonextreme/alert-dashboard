import React, { useState, useEffect, useMemo } from 'react';
import { Alert } from './types';
import { alertAPI, demoAPI, analyzeCauseAndEffect } from './services/api';
import AlertsList from './components/AlertsList';
import RootCauseCard from './components/RootCauseCard';
import './App.css';

function App() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedRootCauseDevices, setSelectedRootCauseDevices] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alertAPI.getAlerts();
      setAlerts(data);
      if (data.length > 0 && !selectedAlert) {
        setSelectedAlert(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemoData = async () => {
    try {
      setLoading(true);
      setError(null);
      await demoAPI.loadDemoData();
      await fetchAlerts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load demo data');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    try {
      setLoading(true);
      setError(null);
      await demoAPI.clearData();
      setAlerts([]);
      setSelectedAlert(null);
      setSelectedRootCauseDevices(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate root causes for all visible alerts
  const rootCauses = useMemo(() => {
    if (alerts.length === 0) return [];

    const causes: Array<{ devices: string[]; confidence: number; alertCount: number }> = [];

    // Group alerts into time windows and find root causes
    const windows = new Map<number, Alert[]>();
    alerts.forEach(alert => {
      const windowKey = Math.floor(alert.timestamp / 60000) * 60000; // 1 minute windows
      if (!windows.has(windowKey)) {
        windows.set(windowKey, []);
      }
      windows.get(windowKey)!.push(alert);
    });

    windows.forEach(windowAlerts => {
      const analysis = analyzeCauseAndEffect(windowAlerts);
      if (analysis) {
        const devices = Array.from(
          new Set([
            analysis.primaryAlert.tags?.device_id || analysis.primaryAlert.tags?.hostname,
            ...analysis.relatedAlerts.map(a => a.tags?.device_id || a.tags?.hostname),
          ].filter(Boolean))
        ) as string[];

        causes.push({
          devices,
          confidence: analysis.confidence,
          alertCount: windowAlerts.length,
        });
      }
    });

    return causes;
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    if (!selectedRootCauseDevices || selectedRootCauseDevices.length === 0) {
      return alerts;
    }
    return alerts.filter(alert => {
      const deviceId = alert.tags?.device_id || alert.tags?.hostname;
      return selectedRootCauseDevices.includes(deviceId as string);
    });
  }, [alerts, selectedRootCauseDevices]);

  const selectedAnalysis =
    selectedAlert && filteredAlerts.length > 0
      ? analyzeCauseAndEffect(
          filteredAlerts.filter(a => {
            const timeDiff = Math.abs(a.timestamp - selectedAlert.timestamp);
            return timeDiff < 300000; // 5 minute window
          })
        )
      : null;

  const handleRootCauseClick = (devices: string[]) => {
    if (selectedRootCauseDevices && JSON.stringify(selectedRootCauseDevices) === JSON.stringify(devices)) {
      setSelectedRootCauseDevices(null);
    } else {
      setSelectedRootCauseDevices(devices);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚨 Alert Correlation Dashboard</h1>
        <div className="header-controls">
          <button
            className="control-btn primary"
            onClick={handleLoadDemoData}
            disabled={loading}
          >
            Load Demo Data
          </button>
          <button
            className="control-btn secondary"
            onClick={handleClearData}
            disabled={loading}
          >
            Clear Data
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>Error: {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="widgets-row">
        {/* Root Causes Widget */}
        <div
          className={`widget root-causes-widget ${selectedRootCauseDevices ? 'active' : ''}`}
          onClick={() => handleRootCauseClick(rootCauses.length > 0 ? rootCauses[0]?.devices || [] : [])}
        >
          <div className="widget-title">Root Causes</div>
          <div className="widget-value">{rootCauses.length}</div>
          {rootCauses.length > 0 && (
            <div className="widget-subtitle">
              {rootCauses[0].alertCount} alerts
            </div>
          )}
        </div>

        {/* Total Alerts Widget */}
        <div className="widget total-alerts-widget">
          <div className="widget-title">Total Alerts</div>
          <div className="widget-value">{filteredAlerts.length}</div>
          <div className="widget-subtitle">
            {filteredAlerts.filter(a => a.severity === 'critical').length} critical
          </div>
        </div>

        {/* Severity Widget */}
        <div className="widget severity-widget">
          <div className="widget-title">By Severity</div>
          <div className="severity-stats">
            <div className="stat">
              <span className="label">Critical</span>
              <span className="count critical">{filteredAlerts.filter(a => a.severity === 'critical').length}</span>
            </div>
            <div className="stat">
              <span className="label">Warning</span>
              <span className="count warning">{filteredAlerts.filter(a => a.severity === 'warning').length}</span>
            </div>
            <div className="stat">
              <span className="label">Info</span>
              <span className="count info">{filteredAlerts.filter(a => a.severity === 'info').length}</span>
            </div>
          </div>
        </div>

        {/* Sources Widget */}
        <div className="widget sources-widget">
          <div className="widget-title">Top Sources</div>
          <div className="sources-list">
            {Array.from(new Set(filteredAlerts.map(a => a.source)))
              .slice(0, 3)
              .map(source => (
                <div key={source} className="source-item">
                  <span>{source}</span>
                  <span className="badge">{filteredAlerts.filter(a => a.source === source).length}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="app-content">
        <div className="alerts-panel">
          <AlertsList
            alerts={filteredAlerts}
            onSelectAlert={setSelectedAlert}
            selectedAlertId={selectedAlert?.id}
            loading={loading}
          />
        </div>

        <div className="analysis-panel">
          {selectedAlert && selectedAnalysis ? (
            <RootCauseCard
              analysis={selectedAnalysis}
              onShowTimeline={() => {
                console.log('Show full timeline');
              }}
            />
          ) : (
            <div className="no-selection">
              <p>Select an alert to view root cause analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
