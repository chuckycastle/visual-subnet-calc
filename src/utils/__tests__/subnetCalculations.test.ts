import { describe, it, expect } from 'vitest';
import {
  validateIPAddress,
  validateCIDR,
  ipToInt,
  intToIP,
  ipToBinary,
  cidrToMask,
  cidrToWildcard,
  getNetworkAddress,
  getBroadcastAddress,
  getFirstUsable,
  getLastUsable,
  getTotalHosts,
  getUsableHosts,
  calculateSubnet,
  divideSubnet,
  canJoinSubnets,
  joinSubnets
} from '../subnetCalculations';

describe('IP Address Validation', () => {
  it('validates correct IP addresses', () => {
    expect(validateIPAddress('192.168.1.1')).toEqual({ isValid: true });
    expect(validateIPAddress('0.0.0.0')).toEqual({ isValid: true });
    expect(validateIPAddress('255.255.255.255')).toEqual({ isValid: true });
  });

  it('rejects invalid IP addresses', () => {
    expect(validateIPAddress('256.1.1.1').isValid).toBe(false);
    expect(validateIPAddress('192.168.1').isValid).toBe(false);
    expect(validateIPAddress('192.168.1.1.1').isValid).toBe(false);
    expect(validateIPAddress('not.an.ip.address').isValid).toBe(false);
  });
});

describe('CIDR Validation', () => {
  it('validates correct CIDR values', () => {
    expect(validateCIDR(0)).toEqual({ isValid: true });
    expect(validateCIDR(24)).toEqual({ isValid: true });
    expect(validateCIDR(32)).toEqual({ isValid: true });
  });

  it('rejects invalid CIDR values', () => {
    expect(validateCIDR(-1).isValid).toBe(false);
    expect(validateCIDR(33).isValid).toBe(false);
  });
});

describe('IP Conversion Functions', () => {
  it('converts IP to integer and back', () => {
    const ip = '192.168.1.1';
    const int = ipToInt(ip);
    expect(intToIP(int)).toBe(ip);
    expect(ipToInt('0.0.0.0')).toBe(0);
    expect(intToIP(0)).toBe('0.0.0.0');
  });

  it('converts IP to binary', () => {
    expect(ipToBinary('192.168.1.1')).toBe('11000000.10101000.00000001.00000001');
    expect(ipToBinary('255.255.255.255')).toBe('11111111.11111111.11111111.11111111');
    expect(ipToBinary('0.0.0.0')).toBe('00000000.00000000.00000000.00000000');
  });
});

describe('Subnet Mask Functions', () => {
  it('converts CIDR to subnet mask', () => {
    expect(cidrToMask(24)).toBe('255.255.255.0');
    expect(cidrToMask(16)).toBe('255.255.0.0');
    expect(cidrToMask(8)).toBe('255.0.0.0');
    expect(cidrToMask(0)).toBe('0.0.0.0');
    expect(cidrToMask(32)).toBe('255.255.255.255');
  });

  it('converts CIDR to wildcard mask', () => {
    expect(cidrToWildcard(24)).toBe('0.0.0.255');
    expect(cidrToWildcard(16)).toBe('0.0.255.255');
    expect(cidrToWildcard(8)).toBe('0.255.255.255');
  });
});

describe('Network Address Functions', () => {
  it('calculates network address correctly', () => {
    expect(getNetworkAddress('192.168.1.100', 24)).toBe('192.168.1.0');
    expect(getNetworkAddress('10.5.10.50', 16)).toBe('10.5.0.0');
    expect(getNetworkAddress('172.16.255.255', 12)).toBe('172.16.0.0');
  });

  it('calculates broadcast address correctly', () => {
    expect(getBroadcastAddress('192.168.1.0', 24)).toBe('192.168.1.255');
    expect(getBroadcastAddress('10.0.0.0', 16)).toBe('10.0.255.255');
    expect(getBroadcastAddress('172.16.0.0', 12)).toBe('172.31.255.255');
  });

  it('calculates first and last usable addresses', () => {
    expect(getFirstUsable('192.168.1.0')).toBe('192.168.1.1');
    expect(getLastUsable('192.168.1.255')).toBe('192.168.1.254');
  });
});

describe('Host Count Functions', () => {
  it('calculates total hosts correctly', () => {
    expect(getTotalHosts(24)).toBe(256);
    expect(getTotalHosts(16)).toBe(65536);
    expect(getTotalHosts(30)).toBe(4);
    expect(getTotalHosts(32)).toBe(1);
  });

  it('calculates usable hosts correctly', () => {
    expect(getUsableHosts(24)).toBe(254);
    expect(getUsableHosts(30)).toBe(2);
    expect(getUsableHosts(31)).toBe(2); // Point-to-point
    expect(getUsableHosts(32)).toBe(1); // Host route
  });
});

describe('Main Calculation Function', () => {
  it('calculates subnet information correctly', () => {
    const result = calculateSubnet({ ipAddress: '192.168.1.100', cidr: 24 });
    
    expect(result.networkAddress).toBe('192.168.1.0');
    expect(result.broadcastAddress).toBe('192.168.1.255');
    expect(result.subnetMask).toBe('255.255.255.0');
    expect(result.firstUsable).toBe('192.168.1.1');
    expect(result.lastUsable).toBe('192.168.1.254');
    expect(result.totalHosts).toBe(256);
    expect(result.usableHosts).toBe(254);
    expect(result.cidr).toBe(24);
  });

  it('handles edge cases correctly', () => {
    // /32 subnet
    const hostRoute = calculateSubnet({ ipAddress: '192.168.1.1', cidr: 32 });
    expect(hostRoute.networkAddress).toBe('192.168.1.1');
    expect(hostRoute.usableHosts).toBe(1);

    // /31 subnet (point-to-point)
    const p2p = calculateSubnet({ ipAddress: '192.168.1.0', cidr: 31 });
    expect(p2p.usableHosts).toBe(2);
  });
});

describe('Subnet Division', () => {
  it('divides subnet correctly', () => {
    const subnet = calculateSubnet({ ipAddress: '192.168.1.0', cidr: 24 });
    const [subnet1, subnet2] = divideSubnet(subnet);

    expect(subnet1.networkAddress).toBe('192.168.1.0');
    expect(subnet1.cidr).toBe(25);
    expect(subnet1.broadcastAddress).toBe('192.168.1.127');

    expect(subnet2.networkAddress).toBe('192.168.1.128');
    expect(subnet2.cidr).toBe(25);
    expect(subnet2.broadcastAddress).toBe('192.168.1.255');
  });

  it('throws error when trying to divide /32 subnet', () => {
    const hostRoute = calculateSubnet({ ipAddress: '192.168.1.1', cidr: 32 });
    expect(() => divideSubnet(hostRoute)).toThrow('Cannot divide /32 subnet');
  });
});

describe('Subnet Joining', () => {
  it('identifies joinable subnets correctly', () => {
    const subnet1 = calculateSubnet({ ipAddress: '192.168.1.0', cidr: 25 });
    const subnet2 = calculateSubnet({ ipAddress: '192.168.1.128', cidr: 25 });
    const subnet3 = calculateSubnet({ ipAddress: '192.168.2.0', cidr: 25 });

    expect(canJoinSubnets(subnet1, subnet2)).toBe(true);
    expect(canJoinSubnets(subnet1, subnet3)).toBe(false);
  });

  it('joins adjacent subnets correctly', () => {
    const subnet1 = calculateSubnet({ ipAddress: '192.168.1.0', cidr: 25 });
    const subnet2 = calculateSubnet({ ipAddress: '192.168.1.128', cidr: 25 });
    const joined = joinSubnets(subnet1, subnet2);

    expect(joined.networkAddress).toBe('192.168.1.0');
    expect(joined.cidr).toBe(24);
    expect(joined.broadcastAddress).toBe('192.168.1.255');
  });

  it('throws error when trying to join non-adjacent subnets', () => {
    const subnet1 = calculateSubnet({ ipAddress: '192.168.1.0', cidr: 25 });
    const subnet3 = calculateSubnet({ ipAddress: '192.168.2.0', cidr: 25 });
    
    expect(() => joinSubnets(subnet1, subnet3)).toThrow('Subnets cannot be joined');
  });
});