//path: src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FullFooter, BndyLogo } from 'bndy-ui';
import { AppHeader } from './components/AppHeader';
import { Music, MapPin, Calendar, Users, Star, ExternalLink, Sparkles, MessageCircle, Image, BarChart3, Building } from 'lucide-react';
import Link from 'next/link';
import { personas, PersonaType } from './lib/personas';
import { useRouter } from 'next/navigation';

// Define the JWT payload interface to match our token structure
interface BndyJwtPayload {
  uid: string;
  email?: string;
  displayName?: string | null;
  roles?: string[];
  exp: number;
  iat?: number;
}

// Token info interface for display
interface TokenInfo {
  token: string;
  decoded: BndyJwtPayload;
  uid: string;
  email: string | null;
  displayName: string | null;
  roles: string[];
  exp: string;
  expiresIn: string;
  allProperties: string[];
}

export default function Home() {
  const [activePersona, setActivePersona] = useState<PersonaType>('band');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const currentPersona = personas[activePersona];
  const router = useRouter();
  
  // Performance timing helper
  const logPerf = (step: string, startTime: number) => {
    const elapsed = Date.now() - startTime;
    console.log(`PERF_HOME: ${step} - ${elapsed}ms`);
    return elapsed;
  };

  // Inspect authentication state and measure performance
  useEffect(() => {
    const startTime = Date.now();
    console.log('AUTH_FLOW: Home page checking URL for token parameter');
    
    // First check URL for token parameter (faster)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      console.log(`AUTH_FLOW: Found token in URL (${logPerf('token_in_url', startTime)}ms)`);      
      localStorage.setItem('bndyAuthToken', urlToken);
      
      // Clean up URL
      logPerf('before_url_cleanup', startTime);
      params.delete('token');
      const newUrl = window.location.pathname + 
                    (params.toString() ? `?${params.toString()}` : '') + 
                    window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
      logPerf('after_url_cleanup', startTime);
      
      // Force redirect to dashboard
      console.log(`AUTH_FLOW: Redirecting to dashboard (${logPerf('before_dashboard_redirect', startTime)}ms)`);
      router.push('/dashboard');
      return;
    }
    
    logPerf('url_token_check_complete', startTime);
    const token = localStorage.getItem('bndyAuthToken');
    const debugInfoElement = document.getElementById('auth-debug-info');
    
    // Update debug panel with initial state
    if (debugInfoElement) {
      debugInfoElement.textContent = JSON.stringify({
        tokenExists: !!token,
        timestamp: new Date().toISOString(),
        message: token ? 'Token found in localStorage, decoding...' : 'No token found in localStorage'
      }, null, 2);
    }
    
    if (token) {
      try {
        // Log token details (without exposing sensitive parts)
        const tokenStart = token.substring(0, 10);
        const tokenEnd = token.substring(token.length - 10);
        console.log(`HOME PAGE: Token found: ${tokenStart}...${tokenEnd}`);
        
        // Import jwtDecode dynamically to inspect token contents
        import('jwt-decode').then(({ jwtDecode }) => {
          try {
            const decoded = jwtDecode<BndyJwtPayload>(token);
            
            // Log the complete decoded token for debugging
            console.log('HOME PAGE: Full decoded token:', decoded);
            
            // Log specific token details
            console.log('HOME PAGE: Decoded token details:', {
              uid: decoded.uid,
              email: decoded.email,
              displayName: decoded.displayName || null,
              roles: decoded.roles || [],
              exp: new Date(decoded.exp * 1000).toISOString()
            });
            
            // Update debug panel with token information
            if (debugInfoElement) {
              debugInfoElement.textContent = JSON.stringify({
                tokenExists: true,
                tokenDecoded: true,
                tokenDetails: {
                  uid: decoded.uid,
                  email: decoded.email,
                  displayName: decoded.displayName || null,
                  roles: decoded.roles || [],
                  exp: new Date(decoded.exp * 1000).toISOString(),
                  expiresIn: ((decoded.exp * 1000 - Date.now()) / 1000 / 60).toFixed(2) + ' minutes',
                  allProperties: Object.keys(decoded)
                },
                message: 'Token successfully decoded. Check if user state is set in auth context.',
                timestamp: new Date().toISOString()
              }, null, 2);
            }
            
            // Store token info for display in the debug panel
            setTokenInfo({
              token: token,
              decoded: decoded,
              uid: decoded.uid,
              email: decoded.email || null,
              displayName: decoded.displayName || null,
              roles: decoded.roles || [],
              exp: new Date(decoded.exp * 1000).toISOString(),
              expiresIn: ((decoded.exp * 1000 - Date.now()) / 1000 / 60).toFixed(2) + ' minutes',
              allProperties: Object.keys(decoded)
            });
            
            // Check if token is expired
            if (decoded.exp * 1000 < Date.now()) {
              console.log('HOME PAGE: Token is expired, removing from localStorage');
              localStorage.removeItem('bndyAuthToken');
              
              if (debugInfoElement) {
                debugInfoElement.textContent = JSON.stringify({
                  tokenExists: true,
                  tokenDecoded: true,
                  error: 'Token is expired',
                  timestamp: new Date().toISOString()
                }, null, 2);
              }
            } else {
              console.log('HOME PAGE: Token is valid, user should be authenticated');
              console.log('HOME PAGE: IMPORTANT - Automatic redirect to dashboard has been disabled for debugging');
            }
          } catch (decodeError) {
            console.error('HOME PAGE: Error decoding token:', decodeError);
            localStorage.removeItem('bndyAuthToken');
            
            if (debugInfoElement) {
              debugInfoElement.textContent = JSON.stringify({
                tokenExists: true,
                tokenDecoded: false,
                error: 'Failed to decode token: ' + (decodeError instanceof Error ? decodeError.message : String(decodeError)),
                timestamp: new Date().toISOString()
              }, null, 2);
            }
          }
        });
      } catch (error) {
        console.error('HOME PAGE: Error processing token:', error);
        
        if (debugInfoElement) {
          debugInfoElement.textContent = JSON.stringify({
            tokenExists: true,
            error: 'Error processing token: ' + (error instanceof Error ? error.message : String(error)),
            timestamp: new Date().toISOString()
          }, null, 2);
        }
      }
    } else {
      console.log('HOME PAGE: No authentication token found');
    }
  }, [router]);
  
  return (
    <main className="min-h-screen flex flex-col">
        <AppHeader />
        
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          {/* Debug controls - hidden in the UI but still accessible programmatically */}
          <div id="auth-debug-info" className="hidden"></div>
          
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-end mb-4">
              <div className="flex gap-2">
                <a 
                  href="https://localhost:3001/login?returnTo=http%3A%2F%2Flocalhost%3A3002" 
                  target="_self" 
                  className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white transition-all"
                  onClick={() => console.log('HOME PAGE: Login button clicked, redirecting to auth service')}
                >
                  Log In
                </a>
                <a 
                  href="https://localhost:3001/login?tab=signup&returnTo=http%3A%2F%2Flocalhost%3A3002" 
                  target="_self" 
                  className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-all"
                  onClick={() => console.log('HOME PAGE: Signup button clicked, redirecting to auth service')}
                >
                  Sign Up
                </a>
              </div>
            </div>
            
            <div className={`w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center ${currentPersona.colors.icon.bg}`}>
              <Music className="w-10 h-10 text-white" />
            </div>

            <div className="mx-auto mb-8">
              <BndyLogo 
                className="mx-auto w-48 md:w-64" 
                color={activePersona === 'band' ? '#f97316' : activePersona === 'venue' ? '#3b82f6' : '#22c55e'}
                holeColor="#1a1f2d"
              />
            </div>

                 
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-6">
              A community-driven platform connecting people to grassroots live music events. 
              No ads, no clutter, just the music you love.
            </p>
            
            {/* Persona Toggles */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {Object.values(personas).map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setActivePersona(persona.id)}
                  className={`px-4 py-2 rounded-full transition-all ${activePersona === persona.id 
                    ? `${persona.colors.button.bg} text-white` 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  {persona.title}
                </button>
              ))}
            </div>
            
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-2 italic">
              {currentPersona.tagline}
            </p>
          </div>
        </section>

        {/* Current Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Current <span className={activePersona === 'band' ? 'text-orange-500' : activePersona === 'venue' ? 'text-blue-500' : 'text-green-500'}>Features</span></h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                {activePersona === 'band' ? "Tools we've built to help bands and artists manage their music more efficiently." :
                 activePersona === 'venue' ? "Features designed to help venues manage and promote live music events." :
                 "Solutions for studios to streamline bookings and manage resources effectively."}
              </p>
            </div>
          
            <div className="grid md:grid-cols-2 gap-6">
              {currentPersona.features.map((feature, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full ${activePersona === 'band' ? 'bg-orange-100' : activePersona === 'venue' ? 'bg-blue-100' : 'bg-purple-100'} flex items-center justify-center flex-shrink-0`}>
                      {activePersona === 'band' ? (
                        index % 2 === 0 ? <Music className="w-5 h-5 text-orange-500" /> : <Users className="w-5 h-5 text-orange-500" />
                      ) : activePersona === 'venue' ? (
                        index % 2 === 0 ? <Calendar className="w-5 h-5 text-blue-500" /> : <MapPin className="w-5 h-5 text-blue-500" />
                      ) : (
                        index % 2 === 0 ? <Building className="w-5 h-5 text-purple-500" /> : <Calendar className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Community Focus Section */}
        <section className="py-16 px-4 bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-slate-900">Built For Musicians</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">Supporting Grassroots</h3>
                <p className="text-slate-600">
                  Built specifically for independent artists, bands, and venues to simplify music management.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">Collaborative Tools</h3>
                <p className="text-slate-600">
                  Work together with your band members in real-time with shared access to setlists and songs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">By Musicians, For Musicians</h3>
                <p className="text-slate-600">
                  Created by musicians who understand the challenges of managing bands and gigs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Features */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <Sparkles className={activePersona === 'band' ? 'text-orange-500' : activePersona === 'venue' ? 'text-blue-500' : 'text-green-500'} />
                <span>Coming Soon</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                {activePersona === 'band' 
                  ? "New features we're working on to make BNDY even better for your band." 
                  : activePersona === 'venue' 
                    ? "Upcoming tools to help venues attract and manage live music events more effectively." 
                    : "New features to help studios manage their spaces and clients more efficiently."}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {currentPersona.upcomingFeatures.map((feature, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full ${activePersona === 'band' ? 'bg-orange-100' : activePersona === 'venue' ? 'bg-blue-100' : 'bg-green-100'} flex items-center justify-center mb-4`}>
                      {index === 0 ? (
                        <Calendar className={`w-5 h-5 ${activePersona === 'band' ? 'text-orange-500' : activePersona === 'venue' ? 'text-blue-500' : 'text-green-500'}`} />
                      ) : index === 1 ? (
                        <Image className={`w-5 h-5 ${activePersona === 'band' ? 'text-orange-500' : activePersona === 'venue' ? 'text-blue-500' : 'text-green-500'}`} />
                      ) : (
                        <Sparkles className={`w-5 h-5 ${activePersona === 'band' ? 'text-orange-500' : activePersona === 'venue' ? 'text-blue-500' : 'text-green-500'}`} />
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Feature Requests */}
        <section className="py-16 px-4 bg-orange-50">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <MessageCircle className="text-orange-500" />
                <span className="text-slate-900">Feature Requests</span>
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
                Have an idea for a feature that would make BNDY better for your band or venue? We'd love to hear it!
                Our development roadmap is shaped by the needs of our community.
              </p>
            </div>
          
            <div className="flex justify-center">
              <a
                href="https://github.com/bndy/issues/new?labels=enhancement&template=feature_request.md"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full flex items-center gap-2 shadow-md transition-all duration-200"
              >
                Submit Feature Request
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className={`py-16 px-4 text-center bg-gradient-to-r ${activePersona === 'band' ? 'from-orange-500 to-orange-600' : activePersona === 'venue' ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'} text-white`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">
              {activePersona === 'band' 
                ? "Ready to simplify your band management?" 
                : activePersona === 'venue' 
                  ? "Ready to enhance your venue's live music experience?" 
                  : "Ready to streamline your studio operations?"}
            </h2>
            <p className="text-xl text-white mb-8">
              {activePersona === 'band' 
                ? "Join bands and artists who are already using BNDY to manage their music journey." 
                : activePersona === 'venue' 
                  ? "Join venues that are using BNDY to find and book the perfect bands for their events." 
                  : "Join studios that are using BNDY to manage their practice and recording spaces efficiently."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://localhost:3001/login?returnTo=http%3A%2F%2Flocalhost%3A3002"
                target="_self"
                className={`px-8 py-3 rounded-full bg-white ${activePersona === 'band' ? 'text-orange-600 hover:bg-orange-50 shadow-orange-500/20' : activePersona === 'venue' ? 'text-blue-600 hover:bg-blue-50 shadow-blue-500/20' : 'text-green-600 hover:bg-green-50 shadow-green-500/20'} font-medium text-lg shadow-lg transition-all inline-flex items-center justify-center`}
              >
                Get Started Free
              </a>
              
              <a 
                href="https://my.bndy.co.uk" 
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-3 rounded-full bg-transparent ${activePersona === 'band' ? 'hover:bg-orange-600' : activePersona === 'venue' ? 'hover:bg-blue-600' : 'hover:bg-green-600'} text-white border border-white font-medium text-lg transition-all inline-flex items-center justify-center`}
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
        
        <FullFooter badgePath={"/assets/images/BndyBeatBadge.png"} className="mt-auto" />
      </main>
  );
}
