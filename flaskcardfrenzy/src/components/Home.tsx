"use client"

import React, { useState, FC, ReactNode } from 'react';
import { Menu, X, LogIn, LogOut, UserPlus, Play, History, Home, HelpCircle, Zap, Users, BrainCircuit, Twitter, Instagram, Github } from 'lucide-react';

// Button component styled for the neon theme
const Button: FC<{
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'ghost' | 'primary' | 'cta';
  size?: 'sm' | 'default' | 'lg';
  as?: 'button' | 'a';
  href?: string;
}> = ({ children, onClick, className = '', variant = 'primary', size = 'default', as = 'button', href }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105";

  const variants = {
    primary: "bg-cyan-500/20 border border-cyan-500 text-cyan-300 hover:bg-cyan-500/40",
    ghost: "text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300",
    cta: "bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.5)]",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-12 px-8 text-base rounded-lg",
  };

  const finalClassName = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (as === 'a') {
    return <a href={href} className={finalClassName}>{children}</a>;
  }

  return (
    <button onClick={onClick} className={finalClassName}>
      {children}
    </button>
  );
};

// Background component
const GridBackground: FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-950">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '2.5rem 2.5rem',
        }}
      />
    </div>
  );
};

// Section Component for consistent styling
const Section: FC<{ id: string, className?: string, children: ReactNode }> = ({ id, className, children }) => (
  <section id={id} className={`w-full py-20 sm:py-28 ${className || ''}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

// The Landing Page Component
const LandingPage: FC = () => {
  return (
    <div className="min-h-screen text-slate-100">
      <GridBackground />
      <main className="relative z-10">
        
        {/* Hero Section */}
        <Section id="home" className="pt-32 sm:pt-48 flex items-center min-h-screen">
          <div className="text-center mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-slate-100 tracking-tight" style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.6)' }}>
              Learn Faster. <br /> Compete Harder.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
              The ultimate multiplayer flashcard game. Challenge your friends, master new subjects, and climb the leaderboard.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button as="a" href="/signup" variant="cta" size="lg">Get Started Now</Button>
              <Button as="a" href="#how-to-play" variant="ghost" size="lg">Learn How to Play</Button>
            </div>
          </div>
        </Section>
        
        {/* Features Section */}
        <Section id="features">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400">Why You'll Love It</h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">Everything you need to make learning an epic adventure.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-slate-900/50 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-colors duration-300">
              <Zap className="h-10 w-10 mx-auto text-cyan-400" />
              <h3 className="mt-4 text-xl font-bold text-slate-100">Real-Time Battles</h3>
              <p className="mt-2 text-slate-400">Challenge friends or rivals to a fast-paced flashcard duel.</p>
            </div>
            <div className="text-center p-8 bg-slate-900/50 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-colors duration-300">
              <Users className="h-10 w-10 mx-auto text-cyan-400" />
              <h3 className="mt-4 text-xl font-bold text-slate-100">Create & Share Decks</h3>
              <p className="mt-2 text-slate-400">Build your own custom decks for any subject and share them.</p>
            </div>
            <div className="text-center p-8 bg-slate-900/50 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-colors duration-300">
              <BrainCircuit className="h-10 w-10 mx-auto text-cyan-400" />
              <h3 className="mt-4 text-xl font-bold text-slate-100">Track Your Progress</h3>
              <p className="mt-2 text-slate-400">Monitor your stats and watch your knowledge grow over time.</p>
            </div>
          </div>
        </Section>

        {/* How to Play Section */}
        <Section id="how-to-play">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400">Get in the Game</h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">Three simple steps to start your learning journey.</p>
          </div>
          <div className="mt-16 max-w-3xl mx-auto space-y-12">
            <div className="flex items-center gap-6">
              <div className="text-5xl font-bold text-cyan-500/50 min-w-[80px]">01</div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Sign Up Free</h3>
                <p className="text-slate-400">Create your account in seconds to save your progress and decks.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-5xl font-bold text-cyan-500/50 min-w-[80px]">02</div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Create or Join a Game</h3>
                <p className="text-slate-400">Start a new game with your own flashcard deck or join a public match.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-5xl font-bold text-cyan-500/50 min-w-[80px]">03</div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Challenge & Win</h3>
                <p className="text-slate-400">Answer questions faster than your opponent to score points and win!</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button as="a" href="/signup" variant="cta" size="lg">
              Ready to Start? Join Now!
            </Button>
          </div>
        </Section>
        
      </main>
      
      {/* Footer */}
    </div>
  )
}

// Main App component to render the Landing Page
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: #020617;
          line-height: 1.6;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      <LandingPage />
    </>
  )
}