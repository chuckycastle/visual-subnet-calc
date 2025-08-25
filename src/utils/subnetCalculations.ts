import type { SubnetInfo, SubnetInput, ValidationResult } from '../types/subnet';

/**
 * Validates an IPv4 address
 */
export function validateIPAddress(ip: string): ValidationResult {
  const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipRegex);
  
  if (!match) {
    return { isValid: false, error: 'Invalid IP address format' };
  }
  
  const octets = match.slice(1).map(Number);
  
  for (const octet of octets) {
    if (octet < 0 || octet > 255) {
      return { isValid: false, error: 'Octets must be between 0-255' };
    }
  }
  
  return { isValid: true };
}

/**
 * Validates CIDR notation
 */
export function validateCIDR(cidr: number): ValidationResult {
  if (cidr < 0 || cidr > 32) {
    return { isValid: false, error: 'CIDR must be between 0-32' };
  }
  return { isValid: true };
}

/**
 * Converts IP address to 32-bit integer
 */
export function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

/**
 * Converts 32-bit integer to IP address
 */
export function intToIP(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

/**
 * Converts IP to binary string
 */
export function ipToBinary(ip: string): string {
  return ip.split('.')
    .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
    .join('.');
}

/**
 * Converts CIDR to subnet mask
 */
export function cidrToMask(cidr: number): string {
  if (cidr === 0) return '0.0.0.0';
  const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  return intToIP(mask);
}

/**
 * Converts CIDR to wildcard mask
 */
export function cidrToWildcard(cidr: number): string {
  const wildcard = ~((0xFFFFFFFF << (32 - cidr)) >>> 0) >>> 0;
  return intToIP(wildcard);
}

/**
 * Calculates network address
 */
export function getNetworkAddress(ip: string, cidr: number): string {
  const ipInt = ipToInt(ip);
  const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  const networkInt = (ipInt & mask) >>> 0;
  return intToIP(networkInt);
}

/**
 * Calculates broadcast address
 */
export function getBroadcastAddress(ip: string, cidr: number): string {
  const networkInt = ipToInt(getNetworkAddress(ip, cidr));
  const hostBits = 32 - cidr;
  const broadcastInt = (networkInt | ((1 << hostBits) - 1)) >>> 0;
  return intToIP(broadcastInt);
}

/**
 * Calculates first usable IP address
 */
export function getFirstUsable(networkAddress: string): string {
  const networkInt = ipToInt(networkAddress);
  return intToIP(networkInt + 1);
}

/**
 * Calculates last usable IP address
 */
export function getLastUsable(broadcastAddress: string): string {
  const broadcastInt = ipToInt(broadcastAddress);
  return intToIP(broadcastInt - 1);
}

/**
 * Calculates total number of hosts in subnet
 */
export function getTotalHosts(cidr: number): number {
  return Math.pow(2, 32 - cidr);
}

/**
 * Calculates usable number of hosts in subnet (total - network - broadcast)
 */
export function getUsableHosts(cidr: number): number {
  const total = getTotalHosts(cidr);
  return cidr === 32 ? 1 : (cidr === 31 ? 2 : total - 2);
}

/**
 * Main subnet calculation function
 */
export function calculateSubnet(input: SubnetInput): SubnetInfo {
  const { ipAddress, cidr } = input;
  
  const networkAddress = getNetworkAddress(ipAddress, cidr);
  const broadcastAddress = getBroadcastAddress(ipAddress, cidr);
  const subnetMask = cidrToMask(cidr);
  const wildcardMask = cidrToWildcard(cidr);
  
  const firstUsable = getFirstUsable(networkAddress);
  const lastUsable = getLastUsable(broadcastAddress);
  
  const totalHosts = getTotalHosts(cidr);
  const usableHosts = getUsableHosts(cidr);
  
  const binaryNetwork = ipToBinary(networkAddress);
  const binaryMask = ipToBinary(subnetMask);
  
  return {
    networkAddress,
    broadcastAddress,
    subnetMask,
    wildcardMask,
    firstUsable,
    lastUsable,
    totalHosts,
    usableHosts,
    cidr,
    binaryNetwork,
    binaryMask
  };
}

/**
 * Divides a subnet into two smaller subnets
 */
export function divideSubnet(subnet: SubnetInfo): [SubnetInfo, SubnetInfo] {
  if (subnet.cidr >= 32) {
    throw new Error('Cannot divide /32 subnet');
  }
  
  const newCidr = subnet.cidr + 1;
  const networkInt = ipToInt(subnet.networkAddress);
  const halfSize = getTotalHosts(newCidr);
  
  const firstSubnet = calculateSubnet({
    ipAddress: subnet.networkAddress,
    cidr: newCidr
  });
  
  const secondSubnet = calculateSubnet({
    ipAddress: intToIP(networkInt + halfSize),
    cidr: newCidr
  });
  
  return [firstSubnet, secondSubnet];
}

/**
 * Checks if two subnets can be joined (are adjacent and same size)
 */
export function canJoinSubnets(subnet1: SubnetInfo, subnet2: SubnetInfo): boolean {
  if (subnet1.cidr !== subnet2.cidr || subnet1.cidr <= 0) {
    return false;
  }
  
  const network1 = ipToInt(subnet1.networkAddress);
  const network2 = ipToInt(subnet2.networkAddress);
  const subnetSize = getTotalHosts(subnet1.cidr);
  
  return Math.abs(network1 - network2) === subnetSize;
}

/**
 * Joins two adjacent subnets of the same size
 */
export function joinSubnets(subnet1: SubnetInfo, subnet2: SubnetInfo): SubnetInfo {
  if (!canJoinSubnets(subnet1, subnet2)) {
    throw new Error('Subnets cannot be joined');
  }
  
  const network1 = ipToInt(subnet1.networkAddress);
  const network2 = ipToInt(subnet2.networkAddress);
  const newNetworkAddress = intToIP(Math.min(network1, network2));
  
  return calculateSubnet({
    ipAddress: newNetworkAddress,
    cidr: subnet1.cidr - 1
  });
}