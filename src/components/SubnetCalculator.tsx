import { useState, useCallback, useEffect, useRef } from 'react';
import { Calculator, Network, Divide, Moon, Sun, Download, Share2, Zap, Globe, Target, Star } from 'lucide-react';
import type { SubnetInfo, SubnetInput } from '../types/subnet';
import { 
  validateIPAddress, 
  validateCIDR, 
  calculateSubnet,
  divideSubnet,
  joinSubnets
} from '../utils/subnetCalculations';
import InputForm from './InputForm';
import ResultsTable from './ResultsTable';
import SubnetVisualization from './SubnetVisualization';
import { useDarkMode } from '../hooks/useDarkMode';
import { exportToJSON, exportToCSV, shareSubnetData } from '../utils/exportUtils';

function SubnetCalculator() {
  const [input, setInput] = useState<SubnetInput>({ ipAddress: '192.168.1.0', cidr: 24 });
  const [subnet, setSubnet] = useState<SubnetInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [subnets, setSubnets] = useState<SubnetInfo[]>([]);
  const [selectedSubnet, setSelectedSubnet] = useState<string>('');
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const { isDark, toggleDarkMode } = useDarkMode();
  const exportMenuRef = useRef<HTMLDivElement>(null);
  
  // Close export menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExportMenu]);

  const handleCalculate = useCallback(() => {
    setError('');
    
    // Debug logging for tests
    if (import.meta.env.MODE === 'test') {
      console.log('handleCalculate called with input:', input);
    }
    
    // Validate IP address
    const ipValidation = validateIPAddress(input.ipAddress);
    if (!ipValidation.isValid) {
      setError(ipValidation.error || 'Invalid IP address');
      return;
    }

    // Validate CIDR - check both the input value and any potential out-of-range issues
    const cidrValidation = validateCIDR(input.cidr);
    if (!cidrValidation.isValid) {
      setError(cidrValidation.error || 'Invalid CIDR notation');
      return;
    }

    try {
      const result = calculateSubnet(input);
      setSubnet(result);
      setSubnets([result]);
      setSelectedSubnet(`${result.networkAddress}/${result.cidr}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
    }
  }, [input]);

  const handleDivideSubnet = useCallback((subnetToDiv: SubnetInfo) => {
    try {
      const [subnet1, subnet2] = divideSubnet(subnetToDiv);
      
      // Replace the original subnet with its two halves
      setSubnets(prev => {
        const index = prev.findIndex(s => 
          s.networkAddress === subnetToDiv.networkAddress && s.cidr === subnetToDiv.cidr
        );
        if (index !== -1) {
          const newSubnets = [...prev];
          newSubnets.splice(index, 1, subnet1, subnet2);
          return newSubnets;
        }
        return [...prev, subnet1, subnet2];
      });
      
      setSelectedSubnet(`${subnet1.networkAddress}/${subnet1.cidr}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Division error');
    }
  }, []);

  const handleJoinSubnets = useCallback((subnet1: SubnetInfo, subnet2: SubnetInfo) => {
    try {
      const joined = joinSubnets(subnet1, subnet2);
      
      // Replace both subnets with the joined one
      setSubnets(prev => {
        const filtered = prev.filter(s => 
          !(
            (s.networkAddress === subnet1.networkAddress && s.cidr === subnet1.cidr) ||
            (s.networkAddress === subnet2.networkAddress && s.cidr === subnet2.cidr)
          )
        );
        return [...filtered, joined];
      });
      
      setSelectedSubnet(`${joined.networkAddress}/${joined.cidr}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Join error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setSubnet(null);
    setSubnets([]);
    setSelectedSubnet('');
    setError('');
  }, []);

  const selectedSubnetInfo = subnets.find(s => 
    `${s.networkAddress}/${s.cidr}` === selectedSubnet
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Left - Title and Tools indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl">
                <Network className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visual Subnet Calculator</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Professional Tool</span>
                  <div className="flex gap-1 ml-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" title="IPv4"></div>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" title="VLSM"></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" title="Real-time"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right - Controls */}
          <div className="flex items-center gap-2">
            {subnets.length > 0 && (
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Export options"
                  aria-label="Export subnet data"
                >
                  <Download className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 card-elevated p-2 z-50 animate-scale-in">
                    <button
                      onClick={() => { exportToJSON(subnets); setShowExportMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Export as JSON
                    </button>
                    <button
                      onClick={() => { exportToCSV(subnets); setShowExportMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Export as CSV
                    </button>
                    <button
                      onClick={() => { shareSubnetData(subnets); setShowExportMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4 text-purple-500" />
                      Share Results
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="subnet-card relative">
              <div className="absolute -top-3 left-6">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-colored">
                  Step 1
                </div>
              </div>
              <div className="subnet-header">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <Calculator className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                Network Input
              </div>
              <InputForm
                input={input}
                onChange={setInput}
                onCalculate={handleCalculate}
                error={error}
              />
              
              {subnets.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-gradient-to-r from-success-50 to-emerald-50 dark:from-success-900/20 dark:to-emerald-900/20 rounded-2xl border border-success-200 dark:border-success-800">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-success-800 dark:text-success-300">Calculation Complete</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Subnets</div>
                        <div className="font-bold text-gray-900 dark:text-white">{subnets.length}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Total Hosts</div>
                        <div className="font-bold text-gray-900 dark:text-white">{subnets.reduce((acc, s) => acc + s.usableHosts, 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleReset}
                    className="btn-secondary w-full"
                  >
                    <Calculator className="w-4 h-4" />
                    Reset Calculator
                  </button>
                  
                  {selectedSubnetInfo && selectedSubnetInfo.cidr < 32 && (
                    <button
                      onClick={() => handleDivideSubnet(selectedSubnetInfo)}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Divide className="w-4 h-4" />
                      Divide Selected Subnet
                    </button>
                  )}
                  
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {subnet && (
              <div className="space-y-8">
                {/* Subnet Details */}
                <div className="subnet-card relative">
                  <div className="absolute -top-3 left-6">
                    <div className="bg-gradient-to-r from-success-500 to-success-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-success">
                      Step 2
                    </div>
                  </div>
                  <div className="subnet-header">
                    <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-xl">
                      <Network className="w-5 h-5 text-success-600 dark:text-success-400" />
                    </div>
                    Network Analysis
                  </div>
                  <ResultsTable subnet={selectedSubnetInfo || subnet} />
                </div>

                {/* Visual Representation */}
                <div className="subnet-card relative">
                  <div className="absolute -top-3 left-6">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      Step 3
                    </div>
                  </div>
                  <div className="subnet-header">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Interactive Visualization
                  </div>
                  <SubnetVisualization
                    subnets={subnets}
                    selectedSubnet={selectedSubnet}
                    onSelectSubnet={setSelectedSubnet}
                    onDivideSubnet={handleDivideSubnet}
                    onJoinSubnets={handleJoinSubnets}
                  />
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {!subnet && (
              <div className="card-elevated p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mb-6">
                  <Network className="w-12 h-12 text-primary-500 animate-pulse-subtle" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Ready to Calculate
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Enter an IP address and CIDR notation to see detailed subnet analysis and interactive visualization.
                </p>
                <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Zap className="w-3 h-3" />
                    Instant calculation
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Globe className="w-3 h-3" />
                    IPv4 networks
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Target className="w-3 h-3" />
                    VLSM support
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 dark:text-gray-300">
          <p className="text-sm">
            Built with React, TypeScript & Tailwind CSS
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Keyboard shortcuts: </span>
            <kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">Tab</kbd> to navigate, 
            <kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">Enter</kbd> to select, 
            <kbd className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">D</kbd> to divide
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubnetCalculator;