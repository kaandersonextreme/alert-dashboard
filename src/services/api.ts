import axios from 'axios';
import { Alert, RootCauseAnalysis, TimelineEvent } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const alertAPI = {
  // Get all alerts with optional filtering
  getAlerts: async (filters?: { source?: string; severity?: string }) => {
    const response = await apiClient.get('/api/alerts', { params: filters });
    return response.data.alerts as Alert[];
  },

  // Get alerts by severity
  getAlertsBySeverity: async (severity: 'critical' | 'warning' | 'info') => {
    return alertAPI.getAlerts({ severity });
  },

  // Add a new alert
  createAlert: async (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const response = await apiClient.post('/api/alerts', alert);
    return response.data;
  },

  // Get health status
  getHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export const correlationAPI = {
  // Get all correlations
  getAllCorrelations: async () => {
    const response = await apiClient.get('/api/correlations');
    return response.data;
  },

  // Get rule-based correlations
  getRuleBasedCorrelations: async () => {
    const response = await apiClient.get('/api/correlations/rule-based');
    return response.data.correlations;
  },

  // Get time-window correlations
  getTimeWindowCorrelations: async () => {
    const response = await apiClient.get('/api/correlations/time-window');
    return response.data.correlations;
  },

  // Get ML anomalies
  getAnomalies: async () => {
    const response = await apiClient.get('/api/correlations/anomalies');
    return response.data.anomalies;
  },

  // Get alert bursts
  getBursts: async () => {
    const response = await apiClient.get('/api/correlations/bursts');
    return response.data.bursts;
  },
};

export const ruleAPI = {
  // Get all rules
  getRules: async () => {
    const response = await apiClient.get('/api/rules');
    return response.data.rules;
  },

  // Create a new rule
  createRule: async (rule: {
    name: string;
    description?: string;
    pattern: string;
    action: string;
    windowMs?: number;
    enabled?: boolean;
  }) => {
    const response = await apiClient.post('/api/rules', rule);
    return response.data.rule;
  },
};

export const demoAPI = {
  // Load demo data
  loadDemoData: async () => {
    const response = await apiClient.post('/api/demo-data/load');
    return response.data;
  },

  // Clear all data
  clearData: async () => {
    const response = await apiClient.post('/api/demo-data/clear');
    return response.data;
  },
};

// Root cause analysis helpers
export const analyzeCauseAndEffect = (alerts: Alert[]): RootCauseAnalysis | null => {
  if (!alerts || alerts.length === 0) return null;

  // Sort by timestamp to find the primary alert
  const sortedAlerts = [...alerts].sort((a, b) => a.timestamp - b.timestamp);
  const primaryAlert = sortedAlerts[0];
  const relatedAlerts = sortedAlerts.slice(1);

  // Calculate timeline events
  const timeline: TimelineEvent[] = sortedAlerts.map((alert, idx) => ({
    alert,
    timeDelta: idx === 0 ? 0 : alert.timestamp - sortedAlerts[0].timestamp,
  }));

  // Calculate confidence based on severity and count
  const severityScore =
    primaryAlert.severity === 'critical'
      ? 30
      : primaryAlert.severity === 'warning'
        ? 20
        : 10;
  const countScore = Math.min(relatedAlerts.length * 5, 50);
  const confidence = Math.min(50 + severityScore + countScore, 100);

  // Extract affected devices from tags
  const affectedDevices = new Set(
    alerts.map(a => a.tags?.device_id || a.tags?.hostname).filter(Boolean)
  ).size;

  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const duration = timeline.length > 1 ? timeline[timeline.length - 1].timeDelta : 0;

  // Generate suggested actions based on source and severity
  const suggestedActions = [
    primaryAlert.severity === 'critical'
      ? 'Escalate to on-call engineer'
      : 'Monitor for escalation',
    `Investigate ${primaryAlert.source} system logs`,
    `Check network connectivity for affected devices`,
    `Review recent configuration changes`,
    `Correlate with related alert clusters`,
  ];

  return {
    primaryAlert,
    relatedAlerts,
    confidence,
    timeline,
    impactMetrics: {
      affectedDevices,
      criticalAlerts,
      duration,
      relatedAlerts: relatedAlerts.length,
    },
    suggestedActions,
  };
};

export default apiClient;
