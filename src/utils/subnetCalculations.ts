import type { SubnetInfo, SubnetInput, ValidationResult } from '../types/subnet';

/**
 * Validate IPv4 address format and octet ranges
 *
 * @param ip - IPv4 address string in dotted decimal notation
 * @returns Validation result with success status and error message if invalid
 *
 * @remarks
 * Checks that:
 * - Format matches xxx.xxx.xxx.xxx pattern
 * - Contains exactly 4 octets
 * - Each octet is between 0-255
 *
 * @example
 * ```typescript
 * validateIPAddress('192.168.1.1')    // { isValid: true }
 * validateIPAddress('256.0.0.1')      // { isValid: false, error: 'Octets must be between 0-255' }
 * validateIPAddress('192.168.1')      // { isValid: false, error: 'Invalid IP address format' }
 * ```
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
 * Validate CIDR prefix length
 *
 * @param cidr - CIDR prefix length (0-32)
 * @returns Validation result with success status and error message if invalid
 *
 * @remarks
 * Valid CIDR range for IPv4 is 0-32:
 * - /0 = 0.0.0.0 (entire Internet)
 * - /32 = host route (single IP)
 *
 * @example
 * ```typescript
 * validateCIDR(24)    // { isValid: true }
 * validateCIDR(33)    // { isValid: false, error: 'CIDR must be between 0-32' }
 * validateCIDR(-1)    // { isValid: false, error: 'CIDR must be between 0-32' }
 * ```
 */
export function validateCIDR(cidr: number): ValidationResult {
  if (cidr < 0 || cidr > 32) {
    return { isValid: false, error: 'CIDR must be between 0-32' };
  }
  return { isValid: true };
}

/**
 * Convert IPv4 address to 32-bit unsigned integer
 *
 * @param ip - IPv4 address in dotted decimal notation
 * @returns 32-bit unsigned integer representation
 *
 * @remarks
 * Uses bitwise left shift to combine octets:
 * - First octet: bits 24-31
 * - Second octet: bits 16-23
 * - Third octet: bits 8-15
 * - Fourth octet: bits 0-7
 *
 * Unsigned right shift (>>>) ensures positive integer result.
 *
 * @example
 * ```typescript
 * ipToInt('192.168.1.1')     // 3232235777
 * ipToInt('10.0.0.1')        // 167772161
 * ipToInt('255.255.255.255') // 4294967295
 * ```
 */
export function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

/**
 * Convert 32-bit unsigned integer to IPv4 address
 *
 * @param int - 32-bit unsigned integer (0 to 4294967295)
 * @returns IPv4 address in dotted decimal notation
 *
 * @remarks
 * Extracts each octet using bitwise right shift and mask:
 * - Octet 1: (int >>> 24) & 255
 * - Octet 2: (int >>> 16) & 255
 * - Octet 3: (int >>> 8) & 255
 * - Octet 4: int & 255
 *
 * @example
 * ```typescript
 * intToIP(3232235777)  // '192.168.1.1'
 * intToIP(167772161)   // '10.0.0.1'
 * intToIP(4294967295)  // '255.255.255.255'
 * ```
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
 * Convert IPv4 address to binary string representation
 *
 * @param ip - IPv4 address in dotted decimal notation
 * @returns Binary string in dotted format (e.g., '11000000.10101000.00000001.00000001')
 *
 * @remarks
 * Each octet is converted to 8-bit binary with leading zeros.
 * Octets are joined with periods for readability.
 *
 * @example
 * ```typescript
 * ipToBinary('192.168.1.1')    // '11000000.10101000.00000001.00000001'
 * ipToBinary('255.255.255.0')  // '11111111.11111111.11111111.00000000'
 * ipToBinary('10.0.0.0')       // '00001010.00000000.00000000.00000000'
 * ```
 */
export function ipToBinary(ip: string): string {
  return ip.split('.')
    .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
    .join('.');
}

/**
 * Convert CIDR prefix length to subnet mask
 *
 * @param cidr - CIDR prefix length (0-32)
 * @returns Subnet mask in dotted decimal notation
 *
 * @remarks
 * Creates mask by setting `cidr` number of bits to 1, starting from left:
 * - /24 = 255.255.255.0 (24 ones, 8 zeros)
 * - /16 = 255.255.0.0 (16 ones, 16 zeros)
 * - /8 = 255.0.0.0 (8 ones, 24 zeros)
 *
 * Special case: /0 returns 0.0.0.0 (no network bits)
 *
 * @example
 * ```typescript
 * cidrToMask(24)  // '255.255.255.0'
 * cidrToMask(16)  // '255.255.0.0'
 * cidrToMask(32)  // '255.255.255.255'
 * cidrToMask(0)   // '0.0.0.0'
 * ```
 */
export function cidrToMask(cidr: number): string {
  if (cidr === 0) return '0.0.0.0';
  const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  return intToIP(mask);
}

/**
 * Convert CIDR prefix length to wildcard mask
 *
 * @param cidr - CIDR prefix length (0-32)
 * @returns Wildcard mask in dotted decimal notation (inverse of subnet mask)
 *
 * @remarks
 * Wildcard mask is the bitwise NOT of subnet mask.
 * Used in Cisco ACLs and OSPF configuration:
 * - /24 wildcard = 0.0.0.255 (inverse of 255.255.255.0)
 * - /16 wildcard = 0.0.255.255 (inverse of 255.255.0.0)
 *
 * @example
 * ```typescript
 * cidrToWildcard(24)  // '0.0.0.255'
 * cidrToWildcard(16)  // '0.0.255.255'
 * cidrToWildcard(32)  // '0.0.0.0'
 * ```
 */
export function cidrToWildcard(cidr: number): string {
  const wildcard = ~((0xFFFFFFFF << (32 - cidr)) >>> 0) >>> 0;
  return intToIP(wildcard);
}

/**
 * Calculate network address from IP and CIDR
 *
 * @param ip - IPv4 address in dotted decimal notation
 * @param cidr - CIDR prefix length (0-32)
 * @returns Network address (first address in subnet)
 *
 * @remarks
 * Network address is calculated by:
 * 1. Converting IP to 32-bit integer
 * 2. Creating subnet mask from CIDR
 * 3. Performing bitwise AND: IP & mask
 *
 * Network address identifies the subnet and cannot be assigned to hosts.
 *
 * @example
 * ```typescript
 * getNetworkAddress('192.168.1.100', 24)  // '192.168.1.0'
 * getNetworkAddress('10.5.17.33', 16)     // '10.5.0.0'
 * getNetworkAddress('172.16.5.130', 25)   // '172.16.5.128'
 * ```
 */
export function getNetworkAddress(ip: string, cidr: number): string {
  const ipInt = ipToInt(ip);
  const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  const networkInt = (ipInt & mask) >>> 0;
  return intToIP(networkInt);
}

/**
 * Calculate broadcast address from IP and CIDR
 *
 * @param ip - IPv4 address in dotted decimal notation
 * @param cidr - CIDR prefix length (0-32)
 * @returns Broadcast address (last address in subnet)
 *
 * @remarks
 * Broadcast address is calculated by:
 * 1. Getting network address
 * 2. Setting all host bits to 1
 *
 * Broadcast address is used to send packets to all hosts in subnet
 * and cannot be assigned to individual hosts.
 *
 * @example
 * ```typescript
 * getBroadcastAddress('192.168.1.0', 24)   // '192.168.1.255'
 * getBroadcastAddress('10.5.0.0', 16)      // '10.5.255.255'
 * getBroadcastAddress('172.16.5.128', 25)  // '172.16.5.255'
 * ```
 */
export function getBroadcastAddress(ip: string, cidr: number): string {
  const networkInt = ipToInt(getNetworkAddress(ip, cidr));
  const hostBits = 32 - cidr;
  const broadcastInt = (networkInt | ((1 << hostBits) - 1)) >>> 0;
  return intToIP(broadcastInt);
}

/**
 * Calculate first usable host address
 *
 * @param networkAddress - Network address (first address in subnet)
 * @returns First usable IP address for host assignment
 *
 * @remarks
 * First usable address is network address + 1.
 * Network address itself is reserved for subnet identification.
 *
 * @example
 * ```typescript
 * getFirstUsable('192.168.1.0')    // '192.168.1.1'
 * getFirstUsable('10.5.0.0')       // '10.5.0.1'
 * getFirstUsable('172.16.5.128')   // '172.16.5.129'
 * ```
 */
export function getFirstUsable(networkAddress: string): string {
  const networkInt = ipToInt(networkAddress);
  return intToIP(networkInt + 1);
}

/**
 * Calculate last usable host address
 *
 * @param broadcastAddress - Broadcast address (last address in subnet)
 * @returns Last usable IP address for host assignment
 *
 * @remarks
 * Last usable address is broadcast address - 1.
 * Broadcast address itself is reserved for subnet-wide broadcasts.
 *
 * @example
 * ```typescript
 * getLastUsable('192.168.1.255')   // '192.168.1.254'
 * getLastUsable('10.5.255.255')    // '10.5.255.254'
 * getLastUsable('172.16.5.255')    // '172.16.5.254'
 * ```
 */
export function getLastUsable(broadcastAddress: string): string {
  const broadcastInt = ipToInt(broadcastAddress);
  return intToIP(broadcastInt - 1);
}

/**
 * Calculate total addresses in subnet (including network and broadcast)
 *
 * @param cidr - CIDR prefix length (0-32)
 * @returns Total number of addresses (2^(32-CIDR))
 *
 * @remarks
 * Total addresses = 2^(host bits)
 * - /24 has 8 host bits = 256 total addresses
 * - /16 has 16 host bits = 65,536 total addresses
 * - /32 has 0 host bits = 1 total address
 *
 * Includes network address and broadcast address.
 *
 * @example
 * ```typescript
 * getTotalHosts(24)  // 256
 * getTotalHosts(16)  // 65536
 * getTotalHosts(32)  // 1
 * getTotalHosts(0)   // 4294967296 (entire IPv4 space)
 * ```
 */
export function getTotalHosts(cidr: number): number {
  return Math.pow(2, 32 - cidr);
}

/**
 * Calculate usable host addresses in subnet
 *
 * @param cidr - CIDR prefix length (0-32)
 * @returns Number of addresses available for host assignment
 *
 * @remarks
 * Usable hosts = Total - 2 (excludes network and broadcast)
 *
 * Special cases:
 * - /32 = 1 usable (host route, no network/broadcast)
 * - /31 = 2 usable (RFC 3021 point-to-point, no network/broadcast)
 * - /30 = 2 usable (4 total - network - broadcast)
 *
 * @example
 * ```typescript
 * getUsableHosts(24)  // 254 (256 - 2)
 * getUsableHosts(30)  // 2 (4 - 2)
 * getUsableHosts(31)  // 2 (RFC 3021 point-to-point)
 * getUsableHosts(32)  // 1 (host route)
 * ```
 */
export function getUsableHosts(cidr: number): number {
  const total = getTotalHosts(cidr);
  return cidr === 32 ? 1 : (cidr === 31 ? 2 : total - 2);
}

/**
 * Calculate complete subnet information from IP and CIDR
 *
 * @param input - IP address and CIDR prefix
 * @returns Complete subnet analysis with all network parameters
 *
 * @remarks
 * Calculates all subnet properties:
 * - Network and broadcast addresses
 * - Subnet and wildcard masks
 * - First and last usable IPs
 * - Total and usable host counts
 * - Binary representations
 *
 * This is the primary function for subnet analysis.
 *
 * @example
 * ```typescript
 * calculateSubnet({ ipAddress: '192.168.1.0', cidr: 24 })
 * // Returns: {
 * //   networkAddress: '192.168.1.0',
 * //   broadcastAddress: '192.168.1.255',
 * //   subnetMask: '255.255.255.0',
 * //   wildcardMask: '0.0.0.255',
 * //   firstUsable: '192.168.1.1',
 * //   lastUsable: '192.168.1.254',
 * //   totalHosts: 256,
 * //   usableHosts: 254,
 * //   cidr: 24,
 * //   binaryNetwork: '11000000.10101000.00000001.00000000',
 * //   binaryMask: '11111111.11111111.11111111.00000000'
 * // }
 * ```
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
 * Divide subnet into two equal-sized smaller subnets
 *
 * @param subnet - Subnet to divide
 * @returns Tuple of two new subnets with CIDR + 1
 *
 * @throws Error if attempting to divide /32 subnet
 *
 * @remarks
 * Dividing increases CIDR by 1 and creates two subnets:
 * - First subnet starts at original network address
 * - Second subnet starts at network address + (total hosts / 2)
 *
 * Example: Dividing /24 creates two /25 subnets
 *
 * @example
 * ```typescript
 * const subnet = calculateSubnet({ ipAddress: '192.168.1.0', cidr: 24 });
 * const [subnet1, subnet2] = divideSubnet(subnet);
 * // subnet1: 192.168.1.0/25 (192.168.1.0 - 192.168.1.127)
 * // subnet2: 192.168.1.128/25 (192.168.1.128 - 192.168.1.255)
 * ```
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
 * Check if two subnets can be joined into larger subnet
 *
 * @param subnet1 - First subnet
 * @param subnet2 - Second subnet
 * @returns True if subnets are adjacent and same size
 *
 * @remarks
 * Subnets can be joined if:
 * - Both have same CIDR prefix
 * - CIDR is greater than /0
 * - Network addresses are exactly one subnet apart
 *
 * @example
 * ```typescript
 * const sub1 = calculateSubnet({ ipAddress: '192.168.1.0', cidr: 25 });
 * const sub2 = calculateSubnet({ ipAddress: '192.168.1.128', cidr: 25 });
 * canJoinSubnets(sub1, sub2)  // true
 *
 * const sub3 = calculateSubnet({ ipAddress: '192.168.2.0', cidr: 25 });
 * canJoinSubnets(sub1, sub3)  // false (not adjacent)
 * ```
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
 * Join two adjacent subnets into larger subnet
 *
 * @param subnet1 - First subnet
 * @param subnet2 - Second subnet
 * @returns New subnet with CIDR - 1 encompassing both subnets
 *
 * @throws Error if subnets cannot be joined (not adjacent or different sizes)
 *
 * @remarks
 * Joining decreases CIDR by 1 and combines address space.
 * Resulting network address is the lower of the two.
 *
 * Example: Joining two /25 subnets creates one /24 subnet
 *
 * @example
 * ```typescript
 * const sub1 = calculateSubnet({ ipAddress: '192.168.1.0', cidr: 25 });
 * const sub2 = calculateSubnet({ ipAddress: '192.168.1.128', cidr: 25 });
 * const joined = joinSubnets(sub1, sub2);
 * // joined: 192.168.1.0/24 (192.168.1.0 - 192.168.1.255)
 * ```
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