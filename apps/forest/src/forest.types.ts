export type ForestStatus = 'ACTIVE' | 'WAITING' | 'FAILED' | 'DISCONNECTED';

export type PermissionMode = 'AUTOMATIC' | 'APPROVAL_REQUIRED' | 'MANUAL';

export type SystemType = 'PRODUCT' | 'AGENT' | 'INTEGRATION' | 'CHANNEL' | 'CORE';

export type ForestSystem = {
  id: string;
  name: string;
  type: SystemType;
  category: string;
  status: ForestStatus;
  description: string;
  icon: string;
  visualVariant: 'pine' | 'cherry' | 'willow' | 'maple' | 'juniper' | 'cedar' | 'sprout';
  health: number;
  position: { x: number; y: number };
  scale: number;
};

export type ForestConnection = {
  id: string;
  sourceSystemId: string;
  destinationSystemId: string;
  trigger: string;
  action: string;
  status: ForestStatus;
  lastRun: string;
  result: string;
  error: string;
  nextRun: string;
  permissionMode: PermissionMode;
  path: string;
  marker: { x: number; y: number };
};

export type ForestAutomation = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: string[];
  status: ForestStatus;
  permissionMode: PermissionMode;
  lastRun: string;
  nextRun: string;
  successCount: number;
  failureCount: number;
  connectionIds: string[];
};

export type ForestSelection =
  | { kind: 'system'; id: string }
  | { kind: 'connection'; id: string }
  | { kind: 'automation'; id: string };
