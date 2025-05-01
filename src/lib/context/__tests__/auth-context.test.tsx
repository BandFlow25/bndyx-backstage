import React from 'react';
import { renderWithProviders } from '../../../../testUtils/renderWithProviders';
import { useAuth } from 'bndy-ui';
import { screen } from '@testing-library/react';

jest.mock('bndy-ui/components/auth', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

const MockLoginStatus: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'logged-out'}</span>
      <span data-testid="user-id">{currentUser ? currentUser.uid : 'none'}</span>
    </div>
  );
};

describe('Auth Context (bndy-ui integration)', () => {
  it('shows logged-in when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      currentUser: { uid: 'test-user-1', displayName: 'Test User' },
    });
    renderWithProviders(<MockLoginStatus />);
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
    expect(screen.getByTestId('user-id')).toHaveTextContent('test-user-1');
  });

  it('shows logged-out when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      currentUser: null,
    });
    renderWithProviders(<MockLoginStatus />);
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
    expect(screen.getByTestId('user-id')).toHaveTextContent('none');
  });
});
