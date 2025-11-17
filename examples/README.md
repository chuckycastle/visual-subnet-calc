# Visual Subnet Calculator - Examples

Usage examples and code patterns for Visual Subnet Calculator.

## Table of Contents

- [Basic Subnet Calculation](#basic-subnet-calculation)
- [Subnet Division](#subnet-division)
- [Subnet Joining](#subnet-joining)
- [Export Functions](#export-functions)
- [Validation](#validation)
- [Binary Representation](#binary-representation)
- [Integration Examples](#integration-examples)

## Basic Subnet Calculation

### Calculate /24 Network

```typescript
import { calculateSubnet } from './utils/subnetCalculations';

const result = calculateSubnet({
  ipAddress: '192.168.1.0',
  cidr: 24
});

console.log(result);
// Output:
// {
//   networkAddress: '192.168.1.0',
//   broadcastAddress: '192.168.1.255',
//   subnetMask: '255.255.255.0',
//   wildcardMask: '0.0.0.255',
//   firstUsable: '192.168.1.1',
//   lastUsable: '192.168.1.254',
//   totalHosts: 256,
//   usableHosts: 254,
//   cidr: 24,
//   binaryNetwork: '11000000.10101000.00000001.00000000',
//   binaryMask: '11111111.11111111.11111111.00000000'
// }
```

### Calculate /30 Point-to-Point Link

```typescript
const result = calculateSubnet({
  ipAddress: '10.0.0.4',
  cidr: 30
});

console.log(result);
// Output:
// {
//   networkAddress: '10.0.0.4',
//   broadcastAddress: '10.0.0.7',
//   firstUsable: '10.0.0.5',
//   lastUsable: '10.0.0.6',
//   totalHosts: 4,
//   usableHosts: 2
// }
```

### Calculate /32 Host Route

```typescript
const result = calculateSubnet({
  ipAddress: '192.168.1.100',
  cidr: 32
});

console.log(result);
// Output:
// {
//   networkAddress: '192.168.1.100',
//   broadcastAddress: '192.168.1.100',
//   firstUsable: '192.168.1.101',
//   lastUsable: '192.168.1.99',
//   totalHosts: 1,
//   usableHosts: 1
// }
```

## Subnet Division

### Divide /24 into Two /25 Subnets

```typescript
import { calculateSubnet, divideSubnet } from './utils/subnetCalculations';

const subnet = calculateSubnet({
  ipAddress: '192.168.1.0',
  cidr: 24
});

const [subnet1, subnet2] = divideSubnet(subnet);

console.log('Subnet 1:', subnet1.networkAddress, '/', subnet1.cidr);
// Output: Subnet 1: 192.168.1.0 /25

console.log('Subnet 2:', subnet2.networkAddress, '/', subnet2.cidr);
// Output: Subnet 2: 192.168.1.128 /25
```

### Recursive Subnet Division

```typescript
function divideRecursively(subnet: SubnetInfo, times: number): SubnetInfo[] {
  if (times === 0 || subnet.cidr >= 32) {
    return [subnet];
  }

  const [left, right] = divideSubnet(subnet);
  return [
    ...divideRecursively(left, times - 1),
    ...divideRecursively(right, times - 1)
  ];
}

const baseSubnet = calculateSubnet({ ipAddress: '10.0.0.0', cidr: 24 });
const subnets = divideRecursively(baseSubnet, 2);

// Divides /24 into 4 x /26 subnets
subnets.forEach(s => {
  console.log(`${s.networkAddress}/${s.cidr} - ${s.usableHosts} hosts`);
});
// Output:
// 10.0.0.0/26 - 62 hosts
// 10.0.0.64/26 - 62 hosts
// 10.0.0.128/26 - 62 hosts
// 10.0.0.192/26 - 62 hosts
```

## Subnet Joining

### Join Two Adjacent /25 Subnets

```typescript
import { calculateSubnet, joinSubnets, canJoinSubnets } from './utils/subnetCalculations';

const subnet1 = calculateSubnet({ ipAddress: '192.168.1.0', cidr: 25 });
const subnet2 = calculateSubnet({ ipAddress: '192.168.1.128', cidr: 25 });

if (canJoinSubnets(subnet1, subnet2)) {
  const joined = joinSubnets(subnet1, subnet2);
  console.log('Joined:', joined.networkAddress, '/', joined.cidr);
  // Output: Joined: 192.168.1.0 /24
}
```

### Validate Before Joining

```typescript
const subnet1 = calculateSubnet({ ipAddress: '10.0.0.0', cidr: 24 });
const subnet2 = calculateSubnet({ ipAddress: '10.0.2.0', cidr: 24 });

if (canJoinSubnets(subnet1, subnet2)) {
  const joined = joinSubnets(subnet1, subnet2);
} else {
  console.log('Subnets cannot be joined: not adjacent or different sizes');
}
// Output: Subnets cannot be joined: not adjacent or different sizes
```

## Export Functions

### Export to JSON

```typescript
import { calculateSubnet } from './utils/subnetCalculations';
import { exportToJSON } from './utils/exportUtils';

const subnet = calculateSubnet({ ipAddress: '192.168.1.0', cidr: 24 });

// Export single subnet
exportToJSON([subnet]);
// Downloads: subnet-192.168.1.0-24.json

// Export multiple subnets
const [subnet1, subnet2] = divideSubnet(subnet);
exportToJSON([subnet1, subnet2]);
// Downloads: subnets-2-networks.json
```

### Export to CSV

```typescript
import { exportToCSV } from './utils/exportUtils';

const subnets = [
  calculateSubnet({ ipAddress: '192.168.1.0', cidr: 25 }),
  calculateSubnet({ ipAddress: '192.168.1.128', cidr: 25 })
];

exportToCSV(subnets);
// Downloads: subnets.csv with headers:
// Network Address,CIDR,Subnet Mask,Broadcast Address,First Usable,Last Usable,Total Hosts,Usable Hosts
```

### Share via Web Share API

```typescript
import { shareSubnetData } from './utils/exportUtils';

const subnet = calculateSubnet({ ipAddress: '10.0.0.0', cidr: 16 });

shareSubnetData([subnet]);
// Opens native share dialog with subnet summary
```

## Validation

### Validate IP Address

```typescript
import { validateIPAddress } from './utils/subnetCalculations';

const result1 = validateIPAddress('192.168.1.1');
console.log(result1);
// Output: { isValid: true }

const result2 = validateIPAddress('256.0.0.1');
console.log(result2);
// Output: { isValid: false, error: 'Octets must be between 0-255' }

const result3 = validateIPAddress('192.168.1');
console.log(result3);
// Output: { isValid: false, error: 'Invalid IP address format' }
```

### Validate CIDR

```typescript
import { validateCIDR } from './utils/subnetCalculations';

const result1 = validateCIDR(24);
console.log(result1);
// Output: { isValid: true }

const result2 = validateCIDR(33);
console.log(result2);
// Output: { isValid: false, error: 'CIDR must be between 0-32' }

const result3 = validateCIDR(-1);
console.log(result3);
// Output: { isValid: false, error: 'CIDR must be between 0-32' }
```

### Validate Before Calculation

```typescript
import { validateIPAddress, validateCIDR, calculateSubnet } from './utils/subnetCalculations';

function safeCalculateSubnet(ip: string, cidr: number) {
  const ipValidation = validateIPAddress(ip);
  if (!ipValidation.isValid) {
    throw new Error(ipValidation.error);
  }

  const cidrValidation = validateCIDR(cidr);
  if (!cidrValidation.isValid) {
    throw new Error(cidrValidation.error);
  }

  return calculateSubnet({ ipAddress: ip, cidr });
}

try {
  const result = safeCalculateSubnet('192.168.1.0', 24);
  console.log('Success:', result.networkAddress);
} catch (err) {
  console.error('Validation failed:', err.message);
}
```

## Binary Representation

### Convert IP to Binary

```typescript
import { ipToBinary } from './utils/subnetCalculations';

const binary = ipToBinary('192.168.1.1');
console.log(binary);
// Output: 11000000.10101000.00000001.00000001
```

### Convert Subnet Mask to Binary

```typescript
import { cidrToMask, ipToBinary } from './utils/subnetCalculations';

const mask = cidrToMask(24);
const binary = ipToBinary(mask);
console.log(binary);
// Output: 11111111.11111111.11111111.00000000
```

### Display Binary Network Information

```typescript
const subnet = calculateSubnet({ ipAddress: '172.16.5.130', cidr: 25 });

console.log('Network Address:', subnet.networkAddress);
console.log('Binary Network: ', subnet.binaryNetwork);
console.log('Subnet Mask:    ', subnet.subnetMask);
console.log('Binary Mask:    ', subnet.binaryMask);

// Output:
// Network Address: 172.16.5.128
// Binary Network:  10101100.00010000.00000101.10000000
// Subnet Mask:     255.255.255.128
// Binary Mask:     11111111.11111111.11111111.10000000
```

## Integration Examples

### React Component Integration

```typescript
import { useState } from 'react';
import { calculateSubnet, validateIPAddress, validateCIDR } from './utils/subnetCalculations';

function SubnetCalculatorComponent() {
  const [ip, setIp] = useState('192.168.1.0');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');

    const ipValidation = validateIPAddress(ip);
    if (!ipValidation.isValid) {
      setError(ipValidation.error);
      return;
    }

    const cidrValidation = validateCIDR(cidr);
    if (!cidrValidation.isValid) {
      setError(cidrValidation.error);
      return;
    }

    const subnet = calculateSubnet({ ipAddress: ip, cidr });
    setResult(subnet);
  };

  return (
    <div>
      <input
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="IP Address"
      />
      <input
        type="number"
        value={cidr}
        onChange={(e) => setCidr(Number(e.target.value))}
        min={0}
        max={32}
      />
      <button onClick={handleCalculate}>Calculate</button>

      {error && <div className="error">{error}</div>}
      {result && (
        <div>
          <p>Network: {result.networkAddress}/{result.cidr}</p>
          <p>Broadcast: {result.broadcastAddress}</p>
          <p>Usable Hosts: {result.usableHosts}</p>
        </div>
      )}
    </div>
  );
}
```

### API Endpoint Integration

```typescript
// Express.js API endpoint
import express from 'express';
import { calculateSubnet, validateIPAddress, validateCIDR } from './utils/subnetCalculations';

const app = express();
app.use(express.json());

app.post('/api/subnet/calculate', (req, res) => {
  const { ipAddress, cidr } = req.body;

  // Validate input
  const ipValidation = validateIPAddress(ipAddress);
  if (!ipValidation.isValid) {
    return res.status(400).json({ error: ipValidation.error });
  }

  const cidrValidation = validateCIDR(cidr);
  if (!cidrValidation.isValid) {
    return res.status(400).json({ error: cidrValidation.error });
  }

  // Calculate subnet
  const result = calculateSubnet({ ipAddress, cidr });
  res.json(result);
});

app.listen(3000);
```

### VLSM Network Design

```typescript
import { calculateSubnet, divideSubnet } from './utils/subnetCalculations';

interface NetworkRequirement {
  name: string;
  hostsNeeded: number;
}

function designVLSMNetwork(
  baseNetwork: string,
  baseCidr: number,
  requirements: NetworkRequirement[]
): SubnetInfo[] {
  // Sort by hosts needed (descending)
  const sorted = [...requirements].sort((a, b) => b.hostsNeeded - a.hostsNeeded);

  const allocations: SubnetInfo[] = [];
  let availableSubnets = [calculateSubnet({ ipAddress: baseNetwork, cidr: baseCidr })];

  for (const req of sorted) {
    // Find smallest subnet that fits
    let selectedSubnet = availableSubnets.shift();

    while (selectedSubnet && selectedSubnet.usableHosts > req.hostsNeeded * 2) {
      const [left, right] = divideSubnet(selectedSubnet);
      availableSubnets.unshift(right);
      selectedSubnet = left;
    }

    if (selectedSubnet) {
      allocations.push(selectedSubnet);
    }
  }

  return allocations;
}

// Example usage
const requirements = [
  { name: 'Main Office', hostsNeeded: 100 },
  { name: 'Branch Office 1', hostsNeeded: 50 },
  { name: 'Branch Office 2', hostsNeeded: 25 },
  { name: 'Point-to-Point Link', hostsNeeded: 2 }
];

const allocated = designVLSMNetwork('10.0.0.0', 16, requirements);

allocated.forEach((subnet, index) => {
  console.log(`${requirements[index].name}: ${subnet.networkAddress}/${subnet.cidr} (${subnet.usableHosts} hosts)`);
});

// Output:
// Main Office: 10.0.0.0/25 (126 hosts)
// Branch Office 1: 10.0.0.128/26 (62 hosts)
// Branch Office 2: 10.0.0.192/27 (30 hosts)
// Point-to-Point Link: 10.0.0.224/30 (2 hosts)
```

## Additional Resources

- [Main README](../README.md)
- [API Documentation](../CLAUDE.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Changelog](../CHANGELOG.md)
