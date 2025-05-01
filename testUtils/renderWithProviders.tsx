import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from 'bndy-ui';
import { ArtistProvider } from '@/lib/context/artist-context';
import { CalendarProvider } from '@/lib/context/calendar-context';
import { ThemeProvider } from '@/lib/context/theme-context';

export function renderWithProviders(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(
    <AuthProvider>
      <ThemeProvider>
        <ArtistProvider>
          <CalendarProvider>
            {ui}
          </CalendarProvider>
        </ArtistProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
