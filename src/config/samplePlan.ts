import type { TreePlanConfig } from '../types/subnetTree';

export const defaultPlanConfig: TreePlanConfig = {
  rootCidr: '10.1.240.0/20',
  minPrefix: 27,
  assignedCidrs: [
    '10.1.241.0/24',
    '10.1.242.0/24',
    '10.1.243.0/24',
    '10.1.244.0/22',
    '10.1.249.0/24'
  ],
  inUseCidrs: [
    '10.1.244.0/23',
    '10.1.246.0/23',
    '10.1.249.0/24',
    '10.1.241.128/25',
    '10.1.243.128/25',
    '10.1.242.0/26',
    '10.1.242.64/26',
    '10.1.242.128/26',
    '10.1.242.192/26',
    '10.1.241.0/27',
    '10.1.243.0/27',
    '10.1.243.32/27'
  ],
  reservedCidrs: [],
  unavailableCidrs: []
};
