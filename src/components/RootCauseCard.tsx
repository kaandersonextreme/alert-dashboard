import React from 'react';
import { Alert, RootCauseAnalysis } from '../types';
import { TrendingUp, AlertCircle, Clock, AlertTriangle } from 'lucide-react';
import '../styles/rootcause.css';

interface RootCauseCardProps {
  analysis: RootCauseAnalysis;
  onShowTimeline?: () => void;
}

const RootCauseCard: React.FC<RootCauseCardProps> = ({ analysis, onShowTimeline }) => {
  const { primaryAlert, relatedAlerts, confidence, timeline, impactMetrics, suggestedActions } =
    analysis;

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m`;
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
    <div className="root-cause-container">
      <div className="analysis-header">
        <div className="header-content">
          <h2>🔍 Root Cause Analysis</h2>
          <p className="subtitle">Timeline-based correlation analysis</p>
        </div>
        <div className="confidence-score">
          <div className="score-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" />
              <circle
                cx="50"
                cy="50"
                r="45"
                style={{ strokeDasharray: `${(confidence / 100) * 283} 283` }}
              />
            </svg>
            <span className="score-value">{Math.round(confidence)}%</span>
          </div>
          <p>Confidence</p>
        </div>
      </div>

      {/* Primary Alert */}
      <div className="section">
        <h3 className="section-title">Root Cause Alert</h3>
        <div
          className="alert-spotlight"
          style={{ borderLeftColor: getSeverityColor(primaryAlert.severity) }}
        >
          <div className="alert-icon">
            {primaryAlert.severity === 'critical' && (
              <AlertCircle style={{ color: '#f44336' }} size={24} />
            )}
            {primaryAlert.severity === 'warning' && (
              <AlertTriangle style={{ color: '#ff9800' }} size={24} />
            )}
            {primaryAlert.severity === 'info' && (
              <TrendingUp style={{ color: '#2196f3' }} size={24} />
            )}
          </div>
          <div className="alert-info">
            <h4>{primaryAlert.title}</h4>
            <p>{primaryAlert.description}</p>
            <div className="alert-meta">
              <span>Source: {primaryAlert.source}</span>
              <span>Time: {new Date(primaryAlert.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="section">
        <h3 className="section-title">Impact Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Affected Devices</span>
            <span className="metric-value">{impactMetrics.affectedDevices}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Critical Alerts</span>
            <span className="metric-value" style={{ color: '#f44336' }}>
              {impactMetrics.criticalAlerts}
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Duration</span>
            <span className="metric-value">{formatTime(impactMetrics.duration)}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Related Alerts</span>
            <span className="metric-value">{impactMetrics.relatedAlerts}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {timeline.length > 1 && (
        <div className="section">
          <div className="timeline-header">
            <h3 className="section-title">Temporal Sequence</h3>
            <button className="timeline-btn" onClick={onShowTimeline}>
              View Full Timeline
            </button>
          </div>
          <div className="timeline-preview">
            {timeline.slice(0, 5).map((event, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-marker">
                  <span className="marker-time">{formatTime(event.timeDelta)}</span>
                </div>
                <div className="timeline-content">
                  <p className="timeline-title">{event.alert.title}</p>
                  <p className="timeline-source">{event.alert.source}</p>
                </div>
              </div>
            ))}
            {timeline.length > 5 && (
              <div className="timeline-more">+{timeline.length - 5} more alerts</div>
            )}
          </div>
        </div>
      )}

      {/* Suggested Actions */}
      <div className="section">
        <h3 className="section-title">Recommended Actions</h3>
        <div className="actions-list">
          {suggestedActions.map((action, idx) => (
            <div key={idx} className="action-item">
              <span className="action-number">{idx + 1}</span>
              <p>{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Alerts */}
      {relatedAlerts.length > 0 && (
        <div className="section">
          <h3 className="section-title">Related Alerts ({relatedAlerts.length})</h3>
          <div className="related-alerts">
            {relatedAlerts.slice(0, 5).map(alert => (
              <div
                key={alert.id}
                className="related-alert-item"
                style={{ borderLeftColor: getSeverityColor(alert.severity) }}
              >
                <div className="related-alert-info">
                  <p className="related-title">{alert.title}</p>
                  <p className="related-source">{alert.source}</p>
                </div>
                <span className="related-time">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {relatedAlerts.length > 5 && (
              <div className="related-more">+{relatedAlerts.length - 5} more related alerts</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RootCauseCard;
