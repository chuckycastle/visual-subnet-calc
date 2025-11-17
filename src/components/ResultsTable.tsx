import { Copy, Check, Network, Wifi, Shield, Users, Globe, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { SubnetInfo } from '../types/subnet';

interface ResultsTableProps {
  subnet: SubnetInfo;
}

function ResultsTable({ subnet }: ResultsTableProps) {
  const [copiedField, setCopiedField] = useState<string>('');
  const [showBinaryExpanded, setShowBinaryExpanded] = useState<boolean>(false);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(''), 2000);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopiedField(field);
          setTimeout(() => setCopiedField(''), 2000);
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // const resultRows = [
  //   {
  //     label: 'Network Address',
  //     value: subnet.networkAddress,
  //     description: 'The network identifier'
  //   },
  //   {
  //     label: 'Broadcast Address',
  //     value: subnet.broadcastAddress,
  //     description: 'Last address in the subnet'
  //   },
  //   {
  //     label: 'Subnet Mask',
  //     value: subnet.subnetMask,
  //     description: 'Decimal subnet mask'
  //   },
  //   {
  //     label: 'Wildcard Mask',
  //     value: subnet.wildcardMask,
  //     description: 'Inverse of subnet mask'
  //   },
  //   {
  //     label: 'First Usable IP',
  //     value: subnet.firstUsable,
  //     description: 'First host address'
  //   },
  //   {
  //     label: 'Last Usable IP',
  //     value: subnet.lastUsable,
  //     description: 'Last host address'
  //   },
  //   {
  //     label: 'CIDR Notation',
  //     value: `${subnet.networkAddress}/${subnet.cidr}`,
  //     description: 'Compact network notation'
  //   },
  //   {
  //     label: 'Total Addresses',
  //     value: subnet.totalHosts.toLocaleString(),
  //     description: 'Including network & broadcast'
  //   },
  //   {
  //     label: 'Usable Addresses',
  //     value: subnet.usableHosts.toLocaleString(),
  //     description: 'Available for hosts'
  //   }
  // ];

  // const binaryRows = [
  //   {
  //     label: 'Network (Binary)',
  //     value: subnet.binaryNetwork,
  //     description: 'Network address in binary'
  //   },
  //   {
  //     label: 'Subnet Mask (Binary)',
  //     value: subnet.binaryMask,
  //     description: 'Subnet mask in binary'
  //   }
  // ];

  // const getFieldIcon = (label: string) => {
  //   switch (label) {
  //     case 'Network Address': return <Network className="w-4 h-4 text-blue-600" />;
  //     case 'Broadcast Address': return <Wifi className="w-4 h-4 text-orange-600" />;
  //     case 'Subnet Mask': return <Shield className="w-4 h-4 text-green-600" />;
  //     case 'Wildcard Mask': return <Globe className="w-4 h-4 text-purple-600" />;
  //     case 'First Usable IP': return <Users className="w-4 h-4 text-emerald-600" />;
  //     case 'Last Usable IP': return <Users className="w-4 h-4 text-emerald-600" />;
  //     case 'CIDR Notation': return <Zap className="w-4 h-4 text-indigo-600" />;
  //     default: return <Network className="w-4 h-4 text-gray-600" />;
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* Consolidated Network Analysis - 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Core Network Info */}
        <div className="card p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Network className="w-4 h-4 text-primary-600" />
            Core Network Details
          </h3>
          
          {/* Network Address */}
          <div className="group flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Network className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Network</div>
                <div className="font-mono text-sm text-gray-900 dark:text-white">{subnet.networkAddress}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(subnet.networkAddress, 'Network Address')}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Copy Network Address"
            >
              {copiedField === 'Network Address' ? (
                <Check className="w-4 h-4 text-success-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Broadcast Address */}
          <div className="group flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Wifi className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Broadcast</div>
                <div className="font-mono text-sm text-gray-900 dark:text-white">{subnet.broadcastAddress}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(subnet.broadcastAddress, 'Broadcast Address')}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Copy Broadcast Address"
            >
              {copiedField === 'Broadcast Address' ? (
                <Check className="w-4 h-4 text-success-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Subnet Mask */}
          <div className="group flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Subnet Mask</div>
                <div className="font-mono text-sm text-gray-900 dark:text-white">{subnet.subnetMask}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(subnet.subnetMask, 'Subnet Mask')}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Copy Subnet Mask"
            >
              {copiedField === 'Subnet Mask' ? (
                <Check className="w-4 h-4 text-success-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* CIDR Notation */}
          <div className="group flex items-center justify-between py-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Zap className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white">CIDR</div>
                <div className="font-mono text-sm text-gray-900 dark:text-white">{subnet.networkAddress}/{subnet.cidr}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(`${subnet.networkAddress}/${subnet.cidr}`, 'CIDR Notation')}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Copy CIDR Notation"
            >
              {copiedField === 'CIDR Notation' ? (
                <Check className="w-4 h-4 text-success-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Host Information */}
        <div className="card p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Host Information
          </h3>
          
          {/* First Usable IP */}
          <div className="group flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex-shrink-0"></div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white">First IP</div>
                <div className="font-mono text-sm text-gray-900 dark:text-white">{subnet.firstUsable}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(subnet.firstUsable, 'First Usable IP')}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Copy First Usable IP"
            >
              {copiedField === 'First Usable IP' ? (
                <Check className="w-4 h-4 text-success-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Last Usable IP */}
          <div className="group flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-4 h-4 rounded-full bg-emerald-600 flex-shrink-0"></div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Last IP</div>
                <div className="font-mono text-sm text-gray-900 dark:text-white">{subnet.lastUsable}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(subnet.lastUsable, 'Last Usable IP')}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Copy Last Usable IP"
            >
              {copiedField === 'Last Usable IP' ? (
                <Check className="w-4 h-4 text-success-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Host Counts */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{subnet.totalHosts.toLocaleString()}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{subnet.usableHosts.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">Usable</div>
            </div>
          </div>

          {/* Wildcard Mask (smaller, less prominent) */}
          <div className="group flex items-center justify-between py-1 text-sm">
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-purple-600 flex-shrink-0" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Wildcard:</span>
              <span className="font-mono text-xs text-gray-900 dark:text-white">{subnet.wildcardMask}</span>
            </div>
            <button
              onClick={() => copyToClipboard(subnet.wildcardMask, 'Wildcard Mask')}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Copy Wildcard Mask"
            >
              {copiedField === 'Wildcard Mask' ? (
                <Check className="w-3 h-3 text-success-600" />
              ) : (
                <Copy className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Compact Network Analysis Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <Network className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Class</span>
          </div>
          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
            {subnet.cidr <= 8 ? 'A (/8)' : 
             subnet.cidr <= 16 ? 'B (/16)' : 
             subnet.cidr <= 24 ? 'C (/24)' : 
             'Custom'}
          </div>
        </div>
        
        <div className="card p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Type</span>
          </div>
          <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
            {subnet.cidr === 32 ? 'Host Route' :
             subnet.cidr === 31 ? 'Point-to-Point' :
             subnet.cidr >= 24 ? 'Small' :
             subnet.cidr >= 16 ? 'Medium' :
             'Large'}
          </div>
        </div>
        
        <div className="card p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Efficiency</span>
          </div>
          <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
            {Math.round((subnet.usableHosts / subnet.totalHosts) * 100)}%
          </div>
        </div>

        <div className="card p-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Binary</span>
            </div>
            <button
              onClick={() => setShowBinaryExpanded(!showBinaryExpanded)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
              title={showBinaryExpanded ? "Collapse binary view" : "Expand binary view"}
            >
              {showBinaryExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
          {!showBinaryExpanded ? (
            <button
              onClick={() => setShowBinaryExpanded(true)}
              className="text-left w-full group"
              title="Click to expand binary view"
            >
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                {subnet.binaryNetwork.split('.')[0]}...
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                Click to view
              </div>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Network:</span>
                  <button
                    onClick={() => copyToClipboard(subnet.binaryNetwork, 'Binary Network')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                    title="Copy Network Binary"
                  >
                    {copiedField === 'Binary Network' ? (
                      <Check className="w-3 h-3 text-success-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                    )}
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-900 dark:text-slate-100 break-all leading-relaxed">
                  {subnet.binaryNetwork}
                </div>
              </div>
              <div className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Mask:</span>
                  <button
                    onClick={() => copyToClipboard(subnet.binaryMask, 'Binary Mask')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                    title="Copy Mask Binary"
                  >
                    {copiedField === 'Binary Mask' ? (
                      <Check className="w-3 h-3 text-success-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                    )}
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-900 dark:text-slate-100 break-all leading-relaxed">
                  {subnet.binaryMask}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsTable;