import type { SubnetInfo } from '../types/subnet';

export interface ExportData {
  timestamp: string;
  subnets: SubnetInfo[];
}

export function exportToJSON(subnets: SubnetInfo[]): void {
  const data: ExportData = {
    timestamp: new Date().toISOString(),
    subnets
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `subnet-calculation-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(subnets: SubnetInfo[]): void {
  const headers = [
    'Network Address',
    'CIDR',
    'Subnet Mask',
    'Wildcard Mask',
    'Broadcast Address',
    'First Usable',
    'Last Usable',
    'Total Hosts',
    'Usable Hosts'
  ];
  
  const rows = subnets.map(subnet => [
    subnet.networkAddress,
    subnet.cidr.toString(),
    subnet.subnetMask,
    subnet.wildcardMask,
    subnet.broadcastAddress,
    subnet.firstUsable,
    subnet.lastUsable,
    subnet.totalHosts.toString(),
    subnet.usableHosts.toString()
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `subnet-calculation-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPNG(): void {
  // This would require html2canvas library for full implementation
  // For now, we'll show an alert with instructions
  alert('PNG export feature requires html2canvas library. Use browser\'s built-in print-to-PDF functionality as an alternative.');
}

export function shareSubnetData(subnets: SubnetInfo[]): void {
  if (navigator.share && subnets.length > 0) {
    const summary = subnets.length === 1 
      ? `Subnet: ${subnets[0].networkAddress}/${subnets[0].cidr} (${subnets[0].usableHosts} usable hosts)`
      : `${subnets.length} subnets with ${subnets.reduce((total, s) => total + s.usableHosts, 0)} total usable hosts`;
    
    const data = {
      title: 'Subnet Calculator Results',
      text: summary,
      url: window.location.href
    };
    
    navigator.share(data).catch(err => {
      console.error('Error sharing:', err);
      copyToClipboard(summary);
    });
  } else {
    // Fallback for browsers without Web Share API
    const summary = subnets.length > 0
      ? `Subnet Calculator Results:\n${subnets.map(s => 
          `${s.networkAddress}/${s.cidr} - ${s.usableHosts} usable hosts`
        ).join('\n')}`
      : 'No subnet data to share';
    
    copyToClipboard(summary);
  }
}

function copyToClipboard(text: string): void {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Subnet data copied to clipboard!');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    alert('Subnet data copied to clipboard!');
  } catch (err) {
    console.error('Fallback copy failed:', err);
    alert('Unable to copy to clipboard. Please copy manually.');
  } finally {
    document.body.removeChild(textArea);
  }
}