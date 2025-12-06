import { getNetworkAddress, intToIP, ipToInt } from './subnetCalculations';
import type { ExplicitStatus, SubnetNode, SubnetTree, TreePlanConfig, EffectiveStatus } from '../types/subnetTree';

interface ParsedRange {
  cidr: string;
  network: string;
  prefix: number;
  start: number;
  end: number;
  size: number;
}

const STATUS_DEFAULTS: Record<string, ExplicitStatus> = {
  IN_USE: 'IN_USE',
  FREE: 'FREE',
  RESERVED: 'RESERVED',
  UNAVAILABLE: 'UNAVAILABLE'
};

export function cidrKey(network: string, prefix: number): string {
  return `${network}/${prefix}`;
}

export function parseCidrRange(cidr: string): ParsedRange {
  const [rawNetwork, rawPrefix] = cidr.split('/');
  const prefix = Number(rawPrefix);
  const network = getNetworkAddress(rawNetwork, prefix);
  const start = ipToInt(network);
  const size = 2 ** (32 - prefix);
  const end = start + size - 1;

  return {
    cidr: cidrKey(network, prefix),
    network,
    prefix,
    start,
    end,
    size
  };
}

function containsRange(container: ParsedRange, target: SubnetNode): boolean {
  return container.start <= target.start && container.end >= target.end;
}

function cloneNodes(nodes: Record<string, SubnetNode>): Record<string, SubnetNode> {
  const clone: Record<string, SubnetNode> = {};
  Object.entries(nodes).forEach(([id, node]) => {
    clone[id] = { ...node, children: [...node.children] };
  });
  return clone;
}

function buildNodeTree(
  range: ParsedRange,
  minPrefix: number,
  nodes: Record<string, SubnetNode>,
  parentId?: string
): void {
  const id = cidrKey(range.network, range.prefix);
  const node: SubnetNode = {
    id,
    network: range.network,
    prefix: range.prefix,
    start: range.start,
    end: range.end,
    parentId,
    children: [],
    explicitStatus: undefined,
    effectiveStatus: 'UNAVAILABLE',
    defaultStatus: 'UNAVAILABLE',
    totalIPs: range.size
  };

  nodes[id] = node;

  if (parentId) {
    nodes[parentId].children.push(id);
  }

  if (range.prefix < minPrefix) {
    const childPrefix = range.prefix + 1;
    const childSize = range.size / 2;
    const firstStart = range.start;
    const secondStart = range.start + childSize;

    const firstRange: ParsedRange = {
      cidr: '',
      network: intToIP(firstStart),
      prefix: childPrefix,
      start: firstStart,
      end: firstStart + childSize - 1,
      size: childSize
    };

    const secondRange: ParsedRange = {
      cidr: '',
      network: intToIP(secondStart),
      prefix: childPrefix,
      start: secondStart,
      end: secondStart + childSize - 1,
      size: childSize
    };

    buildNodeTree(firstRange, minPrefix, nodes, id);
    buildNodeTree(secondRange, minPrefix, nodes, id);
  }
}

function setDefaultStatuses(
  nodes: Record<string, SubnetNode>,
  assignedRanges: ParsedRange[]
): Record<string, SubnetNode> {
  const updated: Record<string, SubnetNode> = {};
  Object.values(nodes).forEach((node) => {
    const inAssigned = assignedRanges.some((range) => containsRange(range, node));
    updated[node.id] = {
      ...node,
      defaultStatus: inAssigned ? STATUS_DEFAULTS.FREE : STATUS_DEFAULTS.UNAVAILABLE
    };
  });
  return updated;
}

function applyExplicitStatusToSubtree(
  nodes: Record<string, SubnetNode>,
  nodeId: string,
  status: ExplicitStatus
): void {
  const node = nodes[nodeId];
  if (!node) return;

  nodes[nodeId] = { ...node, explicitStatus: status };
  node.children.forEach((childId) => applyExplicitStatusToSubtree(nodes, childId, status));
}

function applyExplicitFromRanges(
  nodes: Record<string, SubnetNode>,
  cidrs: string[] | undefined,
  status: ExplicitStatus
): void {
  if (!cidrs || cidrs.length === 0) return;

  cidrs.map(parseCidrRange).forEach((range) => {
    const nodeId = cidrKey(range.network, range.prefix);
    if (nodes[nodeId]) {
      applyExplicitStatusToSubtree(nodes, nodeId, status);
    }
  });
}

function computeEffectiveStatuses(
  rootId: string,
  nodes: Record<string, SubnetNode>
): Record<string, SubnetNode> {
  const updated = cloneNodes(nodes);

  const walk = (nodeId: string): EffectiveStatus => {
    const node = nodes[nodeId];
    if (!node) return 'UNAVAILABLE';

    if (node.children.length === 0) {
      const status = node.explicitStatus ?? node.defaultStatus;
      updated[nodeId] = { ...node, effectiveStatus: status, children: [...node.children] };
      return status;
    }

    const childStatuses = node.children.map((childId) => walk(childId));
    const allSame = childStatuses.every((status) => status === childStatuses[0]);
    const status = allSame ? childStatuses[0] : 'PARTIAL';

    updated[nodeId] = { ...node, effectiveStatus: status, children: [...node.children] };
    return status;
  };

  walk(rootId);
  return updated;
}

export function buildSubnetTree(plan: TreePlanConfig): SubnetTree {
  const rootRange = parseCidrRange(plan.rootCidr);
  const nodes: Record<string, SubnetNode> = {};

  buildNodeTree(rootRange, plan.minPrefix, nodes);

  const assignedRanges = plan.assignedCidrs.map(parseCidrRange);
  const defaultedNodes = setDefaultStatuses(nodes, assignedRanges);

  applyExplicitFromRanges(defaultedNodes, plan.inUseCidrs, STATUS_DEFAULTS.IN_USE);
  applyExplicitFromRanges(defaultedNodes, plan.reservedCidrs, STATUS_DEFAULTS.RESERVED);
  applyExplicitFromRanges(defaultedNodes, plan.unavailableCidrs, STATUS_DEFAULTS.UNAVAILABLE);

  const nodesWithEffective = computeEffectiveStatuses(rootRange.cidr, defaultedNodes);

  return {
    rootId: rootRange.cidr,
    nodes: nodesWithEffective
  };
}

export function updateNodeStatus(
  tree: SubnetTree,
  nodeId: string,
  status: ExplicitStatus,
  cascade = true
): SubnetTree {
  if (!tree.nodes[nodeId]) return tree;

  const nodes = cloneNodes(tree.nodes);

  if (cascade) {
    applyExplicitStatusToSubtree(nodes, nodeId, status);
  } else {
    nodes[nodeId] = { ...nodes[nodeId], explicitStatus: status };
  }

  const recomputed = computeEffectiveStatuses(tree.rootId, nodes);

  return {
    ...tree,
    nodes: recomputed
  };
}

export interface StatusTotals {
  total: number;
  IN_USE: number;
  FREE: number;
  RESERVED: number;
  UNAVAILABLE: number;
}

export function calculateStatusTotals(tree: SubnetTree): StatusTotals {
  const totals: StatusTotals = {
    total: tree.nodes[tree.rootId]?.totalIPs ?? 0,
    IN_USE: 0,
    FREE: 0,
    RESERVED: 0,
    UNAVAILABLE: 0
  };

  const visit = (nodeId: string) => {
    const node = tree.nodes[nodeId];
    if (!node) return;

    if (node.children.length === 0) {
      if (node.effectiveStatus !== 'PARTIAL') {
        totals[node.effectiveStatus] += node.totalIPs;
      }
      return;
    }

    if (node.effectiveStatus === 'PARTIAL') {
      node.children.forEach(visit);
    } else {
      totals[node.effectiveStatus] += node.totalIPs;
    }
  };

  visit(tree.rootId);
  return totals;
}

export function getFreeBlocks(tree: SubnetTree, prefixes: number[]): SubnetNode[] {
  return Object.values(tree.nodes)
    .filter((node) => node.effectiveStatus === 'FREE' && prefixes.includes(node.prefix))
    .sort((a, b) => a.start - b.start);
}
