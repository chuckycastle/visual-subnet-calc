export type ExplicitStatus = 'IN_USE' | 'FREE' | 'RESERVED' | 'UNAVAILABLE';

export type EffectiveStatus = ExplicitStatus | 'PARTIAL';

export interface SubnetNode {
  id: string;
  network: string;
  prefix: number;
  start: number;
  end: number;
  parentId?: string;
  children: string[];
  explicitStatus?: ExplicitStatus;
  effectiveStatus: EffectiveStatus;
  defaultStatus: ExplicitStatus;
  totalIPs: number;
}

export interface SubnetTree {
  rootId: string;
  nodes: Record<string, SubnetNode>;
}

export interface TreePlanConfig {
  rootCidr: string;
  assignedCidrs: string[];
  inUseCidrs?: string[];
  reservedCidrs?: string[];
  unavailableCidrs?: string[];
  minPrefix: number;
}
