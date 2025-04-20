//path: src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { AuthProvider, FullFooter, BndyLogo } from 'bndy-ui';
import { AppHeader } from './components/AppHeader';
import { Music, MapPin, Calendar, Users, Star, ExternalLink, Sparkles, MessageCircle, Image, BarChart3, Building } from 'lucide-react';
import Link from 'next/link';
import { personas, PersonaType } from './lib/personas';

export default function Home() {
  const [activePersona, setActivePersona] = useState<PersonaType>('band');
  const currentPersona = personas[activePersona];
  
  return (
    <AuthProvider>
      <main className="min-h-screen flex flex-col">
        <AppHeader />
        
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-end mb-4">
              <div className="flex gap-2">
                <Link href="/login" className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white transition-all">
                  Log In
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-all">
                  Sign Up
                </Link>
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
              <Link 
                href="/login" 
                className={`px-8 py-3 rounded-full bg-white ${activePersona === 'band' ? 'text-orange-600 hover:bg-orange-50 shadow-orange-500/20' : activePersona === 'venue' ? 'text-blue-600 hover:bg-blue-50 shadow-blue-500/20' : 'text-green-600 hover:bg-green-50 shadow-green-500/20'} font-medium text-lg shadow-lg transition-all inline-flex items-center justify-center`}
              >
                Get Started Free
              </Link>
              
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
    </AuthProvider>
  );
}
