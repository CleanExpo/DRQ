import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServiceAreaDropdown from '../ServiceAreaDropdown';
import { SERVICE_TYPES } from '../../../services/types/IServiceArea';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('ServiceAreaDropdown', () => {
  beforeEach(() => {
    // Reset focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });

  it('should render dropdown button', () => {
    render(<ServiceAreaDropdown />);
    const button = screen.getByTestId('dropdown-toggle');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-haspopup', 'true');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should toggle dropdown menu on button click', () => {
    render(<ServiceAreaDropdown />);
    
    // Initially menu should be hidden
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
    
    // Click to open
    fireEvent.click(screen.getByTestId('dropdown-toggle'));
    const menu = screen.getByTestId('dropdown-menu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute('role', 'region');
    expect(menu).toHaveAttribute('aria-label', 'Service areas menu');
    
    // Click to close
    fireEvent.click(screen.getByTestId('dropdown-toggle'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('should close dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ServiceAreaDropdown />
      </div>
    );

    // Open dropdown
    fireEvent.click(screen.getByTestId('dropdown-toggle'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('should render regions list with proper ARIA attributes', () => {
    render(<ServiceAreaDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-toggle'));

    const list = screen.getByTestId('regions-list');
    expect(list).toHaveAttribute('role', 'list');
    expect(list).toHaveAttribute('aria-labelledby', 'service-areas-heading');

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('should handle tab key navigation', async () => {
    render(<ServiceAreaDropdown />);
    const user = userEvent.setup();

    // Open dropdown
    await user.click(screen.getByTestId('dropdown-toggle'));
    
    // Tab through regions
    await user.tab();
    expect(screen.getByTestId('region-button-brisbane')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByTestId('region-button-gold-coast')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByTestId('region-button-sunshine-coast')).toHaveFocus();
    
    // Tab out should close dropdown
    await user.tab();
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('should handle shift+tab navigation', async () => {
    render(<ServiceAreaDropdown />);
    const user = userEvent.setup();

    // Open dropdown and focus last region
    await user.click(screen.getByTestId('dropdown-toggle'));
    await act(async () => {
      fireEvent.keyDown(screen.getByTestId('dropdown-menu'), { key: 'End' });
    });
    expect(screen.getByTestId('region-button-sunshine-coast')).toHaveFocus();

    // Shift+Tab back through regions
    await user.tab({ shift: true });
    expect(screen.getByTestId('region-button-gold-coast')).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByTestId('region-button-brisbane')).toHaveFocus();

    // Shift+Tab out should close dropdown
    await user.tab({ shift: true });
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('should manage focus when opening region details', () => {
    render(<ServiceAreaDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-toggle'));

    const brisbaneButton = screen.getByTestId('region-button-brisbane');
    fireEvent.click(brisbaneButton);

    const details = screen.getByTestId('region-details-brisbane');
    expect(details).toHaveAttribute('role', 'region');
    expect(details).toHaveAttribute('aria-label', 'Brisbane details');

    // Services list should have proper ARIA attributes
    const servicesList = screen.getByTestId('region-services-brisbane');
    expect(servicesList).toHaveAttribute('role', 'list');
    expect(servicesList).toHaveAttribute('aria-labelledby', 'services-heading-brisbane');
  });

  it('should maintain focus after closing region details', () => {
    render(<ServiceAreaDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-toggle'));

    const brisbaneButton = screen.getByTestId('region-button-brisbane');
    fireEvent.click(brisbaneButton);
    expect(screen.getByTestId('region-details-brisbane')).toBeInTheDocument();

    fireEvent.click(brisbaneButton);
    expect(screen.queryByTestId('region-details-brisbane')).not.toBeInTheDocument();
    expect(brisbaneButton).toHaveFocus();
  });

  it('should handle keyboard navigation between regions', () => {
    render(<ServiceAreaDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-toggle'));

    // Navigate to first region
    fireEvent.keyDown(screen.getByTestId('dropdown-menu'), { key: 'ArrowDown' });
    expect(screen.getByTestId('region-button-brisbane')).toHaveFocus();

    // Navigate down
    fireEvent.keyDown(screen.getByTestId('region-button-brisbane'), { key: 'ArrowDown' });
    expect(screen.getByTestId('region-button-gold-coast')).toHaveFocus();

    // Navigate up
    fireEvent.keyDown(screen.getByTestId('region-button-gold-coast'), { key: 'ArrowUp' });
    expect(screen.getByTestId('region-button-brisbane')).toHaveFocus();
  });

  it('should prevent default on navigation key presses', () => {
    render(<ServiceAreaDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-toggle'));
    
    const preventDefault = jest.fn();
    
    ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'].forEach(key => {
      fireEvent.keyDown(screen.getByTestId('dropdown-menu'), {
        key,
        preventDefault
      });
      expect(preventDefault).toHaveBeenCalled();
      preventDefault.mockClear();
    });
  });

  it('should close dropdown on escape key', () => {
    render(<ServiceAreaDropdown />);
    fireEvent.click(screen.getByTestId('dropdown-toggle'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByTestId('dropdown-menu'), { key: 'Escape' });
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('dropdown-toggle')).toHaveFocus();
  });
});
