import React, { useState } from 'react';
import { AlertCircle, Zap, CheckCircle, HelpCircle, ChevronRight } from 'lucide-react';
import type { SubnetInput } from '../types/subnet';

interface InputFormProps {
  input: SubnetInput;
  onChange: (input: SubnetInput) => void;
  onCalculate: () => void;
  error: string;
}

function InputForm({ input, onChange, onCalculate, error }: InputFormProps) {
  const [ipFocused, setIPFocused] = useState(false);
  const [cidrFocused, setCIDRFocused] = useState(false);

  const handleIPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...input, ipAddress: e.target.value });
  };

  const handleCIDRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onChange({ ...input, cidr: 0 });
      return;
    }
    
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      // Allow any numeric value - validation will catch invalid ranges
      onChange({ ...input, cidr: parsedValue });
    }
    // If not a valid number, don't update the state (preserve current value)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCalculate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* IP Address Input */}
      <div className="input-group">
        <label htmlFor="ip-address" className="input-label">
          IP Address
        </label>
        <div className="relative">
          <input
            id="ip-address"
            type="text"
            inputMode="decimal"
            value={input.ipAddress}
            onChange={handleIPChange}
            onFocus={() => setIPFocused(true)}
            onBlur={() => setIPFocused(false)}
            onKeyPress={handleKeyPress}
            placeholder="192.168.1.0"
            className={`input-field ${error && !ipFocused ? 'border-red-500' : ''}`}
            aria-describedby={error ? 'error-message' : undefined}
            autoComplete="off"
          />
          {ipFocused && (
            <div 
              className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2 text-xs text-gray-600"
              role="tooltip"
              aria-hidden="true"
            >
              <p>Enter IPv4 address (e.g., 192.168.1.0)</p>
              <p>Valid range: 0.0.0.0 to 255.255.255.255</p>
            </div>
          )}
        </div>
      </div>

      {/* CIDR Input */}
      <div className="input-group">
        <label htmlFor="cidr" className="input-label">
          CIDR Prefix Length
        </label>
        <div className="relative">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">/</span>
            <input
              id="cidr"
              type="number"
              inputMode="numeric"
              min="0"
              max="32"
              step="1"
              value={input.cidr}
              onChange={handleCIDRChange}
              onFocus={() => setCIDRFocused(true)}
              onBlur={() => setCIDRFocused(false)}
              onKeyPress={handleKeyPress}
              placeholder="24"
              className={`input-field ${error && !cidrFocused ? 'border-red-500' : ''}`}
              aria-describedby={error ? 'error-message' : undefined}
              autoComplete="off"
            />
          </div>
          {cidrFocused && (
            <div 
              className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2 text-xs text-gray-600"
              role="tooltip"
              aria-hidden="true"
            >
              <p>Network prefix length (0-32)</p>
              <div className="mt-1 space-y-1">
                <p>/8 = 255.0.0.0 (Class A)</p>
                <p>/16 = 255.255.0.0 (Class B)</p>
                <p>/24 = 255.255.255.0 (Class C)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div id="error-message" className="status-error animate-scale-in">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Calculate Button */}
      <button
        type="submit"
        className="btn-primary-large w-full flex items-center justify-center gap-3"
        disabled={!input.ipAddress || input.cidr < 0 || input.cidr > 32}
      >
        <Zap className="w-5 h-5" />
        Calculate Network
        <ChevronRight className="w-4 h-4" />
      </button>
      
      {/* Validation Status */}
      {input.ipAddress && input.cidr >= 0 && input.cidr <= 32 && (
        <div className="status-success animate-scale-in">
          <CheckCircle className="w-4 h-4" />
          <span>Ready to calculate</span>
        </div>
      )}

      {/* Quick Presets */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary-500" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Popular Networks:</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange({ ipAddress: '192.168.1.0', cidr: 24 })}
            className="text-left p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
          >
            <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300">
              192.168.1.0/24
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Home Network (254 hosts)
            </div>
          </button>
          <button
            type="button"
            onClick={() => onChange({ ipAddress: '10.0.0.0', cidr: 8 })}
            className="text-left p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
          >
            <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300">
              10.0.0.0/8
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Class A (16M hosts)
            </div>
          </button>
          <button
            type="button"
            onClick={() => onChange({ ipAddress: '172.16.0.0', cidr: 12 })}
            className="text-left p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
          >
            <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300">
              172.16.0.0/12
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Private B (1M hosts)
            </div>
          </button>
          <button
            type="button"
            onClick={() => onChange({ ipAddress: '203.0.113.0', cidr: 26 })}
            className="text-left p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
          >
            <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300">
              203.0.113.0/26
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Test Network (62 hosts)
            </div>
          </button>
        </div>
      </div>
    </form>
  );
}

export default InputForm;