import { describe, expect, it } from 'vitest';
import { defaultPlanConfig } from '../config/samplePlan';
import { buildSubnetTree, calculateStatusTotals, getFreeBlocks } from './subnetTree';

describe('subnet tree planner', () => {
  it('computes roll-up statuses and totals for the sample plan', () => {
    const tree = buildSubnetTree(defaultPlanConfig);
    const totals = calculateStatusTotals(tree);

    expect(totals.total).toBe(4096);
    expect(totals.IN_USE).toBe(1888);
    expect(totals.FREE).toBe(160);
    expect(totals.RESERVED).toBe(0);
    expect(totals.UNAVAILABLE).toBe(2048);
    expect(totals.IN_USE + totals.FREE + totals.RESERVED + totals.UNAVAILABLE).toBe(totals.total);
  });

  it('surfaces free blocks at common planning sizes', () => {
    const tree = buildSubnetTree(defaultPlanConfig);
    const freeBlocks = getFreeBlocks(tree, [24, 25, 26]);

    expect(freeBlocks.every((block) => block.effectiveStatus === 'FREE')).toBe(true);
    expect(freeBlocks.every((block) => [24, 25, 26].includes(block.prefix))).toBe(true);
  });
});
