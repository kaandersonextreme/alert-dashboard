import React, { useState } from 'react';
import { Alert } from '../types';
import { AlertCircle, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import '../styles/alerts.css';

interface AlertsListProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  selectedAlertId?: string;
  loading?: boolean;
}

const AlertsList: React.FC<AlertsListProps> = ({
  alerts,
  onSelectAlert,
  selectedAlertId,
  loading,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>(
    'all'
  );

  const filtered =
    filterSeverity === 'all' ? alerts : alerts.filter(a => a.severity === filterSeverity);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="severity-icon critical" />;
      case 'warning':
        return <AlertTriangle className="severity-icon warning" />;
      case 'info':
        return <CheckCircle className="severity-icon info" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      default:
        return '#999';
    }
  };

  return (
    <div className="alerts-list-container">
      <div className="alerts-header">
        <h2>🚨 Alerts</h2>
        <div className="severity-filter">
          {(['all', 'critical', 'warning', 'info'] as const).map(severity => (
            <button
              key={severity}
              className={`filter-btn ${filterSeverity === severity ? 'active' : ''}`}
              onClick={() => setFilterSeverity(severity)}
            >
              {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
              {severity !== 'all' && (
                <span className="count">
                  {alerts.filter(a => a.severity === severity).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading-state">Loading alerts...</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <Zap className="empty-icon" />
          <p>No alerts in this category</p>
        </div>
      )}

      <div className="alerts-grid">
        {filtered.map(alert => (
          <div
            key={alert.id}
            className={`alert-card ${selectedAlertId === alert.id ? 'selected' : ''}`}
            onClick={() => onSelectAlert(alert)}
          >
            <div className="alert-card-header">
              {getSeverityIcon(alert.severity)}
              <div className="alert-title">
                <h3>{alert.title}</h3>
                <p className="source">{alert.source}</p>
              </div>
            </div>

            <p className="alert-description">{alert.description}</p>

            <div className="alert-footer">
              <span className="timestamp">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
              <span
                className="severity-badge"
                style={{ backgroundColor: getSeverityColor(alert.severity) }}
              >
                {alert.severity.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsList;
