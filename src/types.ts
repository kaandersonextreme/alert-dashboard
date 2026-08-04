export interface Alert {
  id: string;
  source: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: number;
  tags: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface Correlation {
  alerts: Alert[];
  confidence: number;
  reason?: string;
}

export interface RootCauseAnalysis {
  primaryAlert: Alert;
  relatedAlerts: Alert[];
  confidence: number;
  timeline: TimelineEvent[];
  impactMetrics: {
    affectedDevices: number;
    criticalAlerts: number;
    duration: number;
    relatedAlerts: number;
  };
  suggestedActions: string[];
}

export interface TimelineEvent {
  alert: Alert;
  timeDelta: number;
}

export interface APIRegistry {
  apis: APISpec[];
}

export interface APISpec {
  id: string;
  title: string;
  description: string;
  version: string;
  baseUrl: string;
  tags: string[];
  endpoints: APIEndpoint[];
}

export interface APIEndpoint {
  path: string;
  method: string;
  operationId: string;
  summary: string;
  tags: string[];
}
