import { ChevronRight, Divide, Merge } from 'lucide-react';
import { useMemo, useCallback, useState } from 'react';
import type { SubnetInfo } from '../types/subnet';
import { canJoinSubnets } from '../utils/subnetCalculations';

interface SubnetVisualizationProps {
  subnets: SubnetInfo[];
  selectedSubnet: string;
  onSelectSubnet: (subnet: string) => void;
  onDivideSubnet: (subnet: SubnetInfo) => void;
  onJoinSubnets?: (subnet1: SubnetInfo, subnet2: SubnetInfo) => void;
}

function SubnetVisualization({
  subnets,
  selectedSubnet,
  onSelectSubnet,
  onDivideSubnet,
  onJoinSubnets
}: SubnetVisualizationProps) {
  const [joiningMode, setJoiningMode] = useState(false);
  const [firstSelectedForJoin, setFirstSelectedForJoin] = useState<SubnetInfo | null>(null);
  // Sort subnets by network address for consistent display - memoized for performance
  const sortedSubnets = useMemo(() => {
    return [...subnets].sort((a, b) => {
      const aInt = a.networkAddress.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
      const bInt = b.networkAddress.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
      return aInt - bInt;
    });
  }, [subnets]);

  // Calculate visual representation - memoized for performance
  const { maxCidr, minCidr } = useMemo(() => {
    const cidrs = subnets.map(s => s.cidr);
    return {
      maxCidr: Math.max(...cidrs),
      minCidr: Math.min(...cidrs)
    };
  }, [subnets]);
  
  const baseWidth = 100; // Base percentage width

  const getSubnetWidth = useCallback((cidr: number) => {
    if (minCidr === maxCidr) return baseWidth;
    return baseWidth * Math.pow(0.5, cidr - minCidr);
  }, [minCidr, maxCidr]);

  const getSubnetColor = (subnet: SubnetInfo, isSelected: boolean) => {
    const cidrLevel = subnet.cidr;
    const isFirstSelectedForJoin = firstSelectedForJoin && 
      subnet.networkAddress === firstSelectedForJoin.networkAddress && 
      subnet.cidr === firstSelectedForJoin.cidr;
    
    if (joiningMode) {
      if (isFirstSelectedForJoin) {
        return 'bg-orange-200 border-orange-400 border-dashed animate-pulse-subtle';
      }
      // Check if this subnet can join with the first selected
      if (firstSelectedForJoin && onJoinSubnets && canJoinSubnets(firstSelectedForJoin, subnet)) {
        return 'bg-green-100 border-green-400 border-dashed hover:bg-green-200';
      }
      if (firstSelectedForJoin) {
        return 'bg-gray-100 border-gray-300 opacity-50';
      }
    }
    
    if (isSelected) {
      return 'bg-subnet-400 border-subnet-600';
    }
    if (cidrLevel <= 16) {
      return 'bg-subnet-100 border-subnet-300 hover:bg-subnet-200';
    } else if (cidrLevel <= 24) {
      return 'bg-subnet-200 border-subnet-400 hover:bg-subnet-300';
    } else {
      return 'bg-subnet-300 border-subnet-500 hover:bg-subnet-400';
    }
  };

  const handleSubnetClick = useCallback((subnet: SubnetInfo) => {
    const subnetKey = `${subnet.networkAddress}/${subnet.cidr}`;
    
    if (joiningMode && onJoinSubnets) {
      if (!firstSelectedForJoin) {
        setFirstSelectedForJoin(subnet);
      } else if (firstSelectedForJoin.networkAddress === subnet.networkAddress && firstSelectedForJoin.cidr === subnet.cidr) {
        // Clicked the same subnet - deselect
        setFirstSelectedForJoin(null);
      } else if (canJoinSubnets(firstSelectedForJoin, subnet)) {
        // Valid pair - join them
        onJoinSubnets(firstSelectedForJoin, subnet);
        setJoiningMode(false);
        setFirstSelectedForJoin(null);
      }
    } else {
      onSelectSubnet(subnetKey);
    }
  }, [joiningMode, firstSelectedForJoin, onJoinSubnets, onSelectSubnet]);

  const toggleJoiningMode = useCallback(() => {
    setJoiningMode(!joiningMode);
    setFirstSelectedForJoin(null);
  }, [joiningMode]);

  const canShowJoinMode = subnets.length > 1 && onJoinSubnets;

  const formatHostCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-6">
      {/* Visual Blocks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Subnet Blocks</h3>
          <div className="flex items-center gap-3">
            {canShowJoinMode && (
              <button
                onClick={toggleJoiningMode}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  joiningMode 
                    ? 'bg-orange-100 text-orange-800 border border-orange-300 dark:bg-orange-900/30 dark:text-orange-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                title={joiningMode ? 'Exit joining mode' : 'Enable joining mode'}
              >
                <Merge className="w-3 h-3 inline mr-1" />
                {joiningMode ? 'Cancel Join' : 'Join Mode'}
              </button>
            )}
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {joiningMode ? 'Select two adjacent subnets to join' : 'Click to select • Double-click or press D to divide'}
            </div>
          </div>
        </div>
        
        {joiningMode && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Merge className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-orange-900 dark:text-orange-300">Joining Mode Active</div>
                <div className="text-orange-700 dark:text-orange-400 text-xs mt-1">
                  {!firstSelectedForJoin ? (
                    'Click on the first subnet you want to join'
                  ) : (
                    <>Selected <span className="font-mono">{firstSelectedForJoin.networkAddress}/{firstSelectedForJoin.cidr}</span> - now click a compatible adjacent subnet</>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2" role="group" aria-label="Subnet blocks">
          {sortedSubnets.map((subnet) => {
            const subnetKey = `${subnet.networkAddress}/${subnet.cidr}`;
            const isSelected = selectedSubnet === subnetKey;
            const width = getSubnetWidth(subnet.cidr);
            
            return (
              <div
                key={subnetKey}
                className={`
                  relative border-2 rounded-lg p-3 cursor-pointer transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  ${getSubnetColor(subnet, isSelected)}
                `}
                style={{ width: `${Math.max(width, 20)}%`, minHeight: '44px' }}
                onClick={() => handleSubnetClick(subnet)}
                onDoubleClick={() => {
                  if (subnet.cidr < 32) {
                    onDivideSubnet(subnet);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSubnetClick(subnet);
                  } else if (e.key === 'd' && subnet.cidr < 32 && !joiningMode) {
                    e.preventDefault();
                    onDivideSubnet(subnet);
                  } else if (e.key === 'j' && canShowJoinMode) {
                    e.preventDefault();
                    toggleJoiningMode();
                  } else if (e.key === 'Escape' && joiningMode) {
                    e.preventDefault();
                    setJoiningMode(false);
                    setFirstSelectedForJoin(null);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Select subnet ${subnetKey} with ${subnet.usableHosts.toLocaleString()} usable hosts. ${subnet.cidr < 32 ? 'Press D to divide or double-click.' : ''}`}
                title={`${subnetKey} - ${subnet.usableHosts.toLocaleString()} usable hosts`}
              >
                {/* Subnet Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-sm font-semibold">
                    {subnetKey}
                  </div>
                  {subnet.cidr < 32 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDivideSubnet(subnet);
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="p-1 rounded hover:bg-white/20 transition-colors focus:outline-none focus:ring-1 focus:ring-white/40"
                        title="Divide subnet (or press D)"
                        aria-label="Divide subnet"
                        tabIndex={-1}
                      >
                        <Divide className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Subnet Details */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-black/70">Range:</span>
                    <span className="font-mono">
                      {subnet.firstUsable} - {subnet.lastUsable}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/70">Hosts:</span>
                    <span className="font-mono">
                      {formatHostCount(subnet.usableHosts)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/70">Mask:</span>
                    <span className="font-mono text-xs">
                      {subnet.subnetMask}
                    </span>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1">
                    <ChevronRight className="w-4 h-4 text-subnet-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Network Hierarchy */}
      {subnets.length > 1 && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Network Hierarchy</h3>
          <div className="space-y-2">
            {sortedSubnets
              .sort((a, b) => a.cidr - b.cidr) // Sort by CIDR for hierarchy
              .map((subnet) => {
                const subnetKey = `${subnet.networkAddress}/${subnet.cidr}`;
                const isSelected = selectedSubnet === subnetKey;
                const level = subnet.cidr - minCidr;
                
                return (
                  <div
                    key={subnetKey}
                    className={`
                      flex items-center gap-3 p-2 rounded cursor-pointer transition-colors
                      ${isSelected ? 'bg-subnet-100 border border-subnet-300' : 'hover:bg-gray-100/50'}
                    `}
                    style={{ marginLeft: `${level * 20}px` }}
                    onClick={() => onSelectSubnet(subnetKey)}
                  >
                    <div className="font-mono text-sm">
                      {subnetKey}
                    </div>
                    <div className="flex-1 text-xs text-gray-600">
                      {subnet.usableHosts.toLocaleString()} hosts
                    </div>
                    {isSelected && (
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* Address Space Usage */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Address Space Usage</h3>
        <div className="space-y-3">
          {/* Overall Statistics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Total Subnets</div>
              <div className="font-semibold text-lg">{subnets.length}</div>
            </div>
            <div>
              <div className="text-gray-600">Total Usable Addresses</div>
              <div className="font-semibold text-lg">
                {subnets.reduce((acc, s) => acc + s.usableHosts, 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* CIDR Distribution */}
          <div>
            <div className="text-gray-600 text-sm mb-2">CIDR Distribution</div>
            <div className="space-y-1">
              {Array.from(new Set(subnets.map(s => s.cidr)))
                .sort((a, b) => a - b)
                .map(cidr => {
                  const count = subnets.filter(s => s.cidr === cidr).length;
                  return (
                    <div key={cidr} className="flex justify-between text-xs">
                      <span>/{cidr}</span>
                      <span>{count} subnet{count > 1 ? 's' : ''}</span>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubnetVisualization;