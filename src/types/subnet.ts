export interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstUsable: string;
  lastUsable: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
  binaryNetwork: string;
  binaryMask: string;
}

export interface SubnetInput {
  ipAddress: string;
  cidr: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface SubnetDivision {
  id: string;
  subnet: SubnetInfo;
  level: number;
  parent?: string;
  children: string[];
}