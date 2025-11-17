import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubnetCalculator from '../SubnetCalculator';

describe('SubnetCalculator', () => {
  it('renders without crashing', () => {
    render(<SubnetCalculator />);
    expect(screen.getByText('Visual Subnet Calculator')).toBeInTheDocument();
  });

  it('has default IP address and CIDR values', () => {
    render(<SubnetCalculator />);
    const ipInput = screen.getByDisplayValue('192.168.1.0');
    const cidrInput = screen.getByDisplayValue('24');
    
    expect(ipInput).toBeInTheDocument();
    expect(cidrInput).toBeInTheDocument();
  });

  it('calculates subnet when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SubnetCalculator />);

    const calculateButton = screen.getByText('Calculate Subnet');
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Network Details')).toBeInTheDocument();
    });
  });

  it('shows error for invalid IP address', async () => {
    const user = userEvent.setup();
    render(<SubnetCalculator />);

    const ipInput = screen.getByDisplayValue('192.168.1.0');
    await user.clear(ipInput);
    await user.type(ipInput, '256.1.1.1');

    const calculateButton = screen.getByText('Calculate Subnet');
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Octets must be between 0-255')).toBeInTheDocument();
    });
  });

  it('shows error for invalid CIDR', async () => {
    const user = userEvent.setup();
    render(<SubnetCalculator />);

    const cidrInput = screen.getByDisplayValue('24');
    await user.clear(cidrInput);
    await user.type(cidrInput, '33');

    const calculateButton = screen.getByText('Calculate Subnet');
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('CIDR must be between 0-32')).toBeInTheDocument();
    });
  });

  it('updates input when preset is clicked', async () => {
    const user = userEvent.setup();
    render(<SubnetCalculator />);

    const preset = screen.getByText('10.0.0.0/8');
    await user.click(preset);

    expect(screen.getByDisplayValue('10.0.0.0')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8')).toBeInTheDocument();
  });

  it('resets calculator when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<SubnetCalculator />);

    // First calculate a subnet
    const calculateButton = screen.getByText('Calculate Subnet');
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Network Details')).toBeInTheDocument();
    });

    // Then reset
    const resetButton = screen.getByText('Reset Calculator');
    await user.click(resetButton);

    expect(screen.queryByText('Network Details')).not.toBeInTheDocument();
  });

  it('enables divide button for subnets smaller than /32', async () => {
    const user = userEvent.setup();
    render(<SubnetCalculator />);

    const calculateButton = screen.getByText('Calculate Subnet');
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Divide Selected Subnet')).toBeInTheDocument();
    });
  });

  it('disables divide button for /32 subnet', async () => {
    const user = userEvent.setup();
    render(<SubnetCalculator />);

    const cidrInput = screen.getByDisplayValue('24');
    await user.clear(cidrInput);
    await user.type(cidrInput, '32');

    const calculateButton = screen.getByText('Calculate Subnet');
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.queryByText('Divide Selected Subnet')).not.toBeInTheDocument();
    });
  });
});