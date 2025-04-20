// src/app/lib/personas.ts
export type PersonaType = 'band' | 'venue' | 'studio';

export interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface UpcomingFeature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface PersonaColors {
  icon: {
    bg: string;
    text: string;
  };
  logo: string;
  button: {
    bg: string;
    hover: string;
  };
}

export interface Persona {
  id: PersonaType;
  title: string;
  colors: PersonaColors;
  tagline: string;
  features: Feature[];
  upcomingFeatures: UpcomingFeature[];
}

export const personas: Record<PersonaType, Persona> = {
  band: {
    id: 'band',
    title: 'Band/Artist',
    colors: {
      icon: {
        bg: 'bg-orange-500',
        text: 'text-white'
      },
      logo: 'text-orange-500',
      button: {
        bg: 'bg-orange-500',
        hover: 'hover:bg-orange-600'
      }
    },
    tagline: "Streamline your band's song management, from voting on new songs to creating dynamic setlists.",
    features: [
      {
        title: 'Song Repertoire Management',
        description: 'Organize, categorize, and manage your band\'s entire song library in one place.'
      },
      {
        title: 'Collaborative Setlist Builder',
        description: 'Create setlists together in real-time with your band members, with drag-and-drop functionality.'
      },
      {
        title: 'Band Member Permissions',
        description: 'Control who can view, edit, or manage your band\'s content with customizable permissions.'
      },
      {
        title: 'Performance Analytics',
        description: 'Track song popularity, audience engagement, and set effectiveness over time.'
      }
    ],
    upcomingFeatures: [
      {
        title: 'Events Management',
        description: 'Schedule and manage gigs, rehearsals, and band meetings with an intuitive calendar interface.'
      },
      {
        title: 'Media Library',
        description: 'Store and organize band photos, videos, and recordings securely in one place.'
      },
      {
        title: 'AI Setlist Generation',
        description: 'Smart setlist suggestions based on your band\'s style, audience preferences, and venue requirements.'
      }
    ]
  },
  venue: {
    id: 'venue',
    title: 'Venue',
    colors: {
      icon: {
        bg: 'bg-blue-500',
        text: 'text-white'
      },
      logo: 'text-blue-500',
      button: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600'
      }
    },
    tagline: 'Find and book the perfect bands for your events, manage your live music calendar effectively.',
    features: [
      {
        title: 'AI-powered Talent Matching',
        description: 'Find the right bands based on your venue style and audience preferences.'
      },
      {
        title: 'Event Management',
        description: 'Organize your live music calendar and manage bookings efficiently.'
      },
      {
        title: 'Crowd Analytics',
        description: 'Track audience engagement and optimize your entertainment schedule.'
      },
      {
        title: 'Promotional Tools',
        description: 'Create and share event listings across multiple platforms with a single click.'
      }
    ],
    upcomingFeatures: [
      {
        title: 'Ticketing Integration',
        description: 'Sell tickets directly through your venue profile with integrated payment processing.'
      },
      {
        title: 'Audience Engagement',
        description: 'Collect feedback and engage with your audience before, during, and after events.'
      },
      {
        title: 'Smart Scheduling',
        description: 'AI-powered recommendations for optimal event scheduling based on historical data.'
      }
    ]
  },
  studio: {
    id: 'studio',
    title: 'Studio',
    colors: {
      icon: {
        bg: 'bg-green-500',
        text: 'text-white'
      },
      logo: 'text-green-500',
      button: {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600'
      }
    },
    tagline: 'Manage your practice and recording spaces with smart booking and scheduling.',
    features: [
      {
        title: 'Room Scheduling',
        description: 'Streamline booking process for practice and recording rooms.'
      },
      {
        title: 'Equipment Management',
        description: 'Track available equipment and maintain inventory for each room.'
      },
      {
        title: 'Recurring Bookings',
        description: 'Handle regular band practice slots and long-term bookings.'
      },
      {
        title: 'Client Management',
        description: 'Maintain a database of clients with booking history and preferences.'
      }
    ],
    upcomingFeatures: [
      {
        title: 'Project Tracking',
        description: 'Monitor recording projects with progress tracking and milestone management.'
      },
      {
        title: 'Session Musicians',
        description: 'Connect with and book session musicians directly through the platform.'
      },
      {
        title: 'Digital Asset Management',
        description: 'Store, organize, and share digital recordings and project files securely.'
      }
    ]
  }
};

export function getPersonaColor(persona: PersonaType): string {
  switch (persona) {
    case 'band':
      return 'orange';
    case 'venue':
      return 'blue';
    case 'studio':
      return 'green';
    default:
      return 'orange';
  }
}
