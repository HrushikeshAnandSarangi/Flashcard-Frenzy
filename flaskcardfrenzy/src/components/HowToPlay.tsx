"use client"

import React, { FC, ReactNode } from 'react';
import { Play, Users, Trophy, Clock, Zap, Target, BookOpen, Star, ArrowRight, CheckCircle } from 'lucide-react';

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
const Section: FC<{ id?: string, className?: string, children: ReactNode }> = ({ id, className, children }) => (
  <section id={id} className={`w-full py-16 sm:py-20 ${className || ''}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

// Card Component for consistent styling
const Card: FC<{ children: ReactNode, className?: string, hover?: boolean }> = ({ children, className, hover = true }) => (
  <div className={`bg-slate-900/50 rounded-lg border border-cyan-500/20 p-6 ${hover ? 'hover:border-cyan-400/40 hover:bg-slate-900/70' : ''} transition-all duration-300 ${className || ''}`}>
    {children}
  </div>
);

// Step Component for game flow
const GameStep: FC<{ 
  number: string, 
  title: string, 
  description: string, 
  icon: ReactNode,
  details: string[]
}> = ({ number, title, description, icon, details }) => (
  <div className="relative">
    <div className="flex items-start gap-6">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-cyan-500/20 border border-cyan-500 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl font-bold text-cyan-500/70">{number}</span>
          <h3 className="text-2xl font-bold text-slate-100">{title}</h3>
        </div>
        <p className="text-slate-400 text-lg mb-4">{description}</p>
        <ul className="space-y-2">
          {details.map((detail, index) => (
            <li key={index} className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// The How to Play Page Component
const HowToPlayPage: FC = () => {
  return (
    <div className="min-h-screen text-slate-100">
      <GridBackground />
      <main className="relative z-10">
        
        {/* Hero Section */}
        <Section className="pt-20 sm:pt-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-slate-100 tracking-tight mb-6" 
                style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.6)' }}>
              Master the Game
            </h1>
            <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-8">
              Everything you need to know to dominate FlashCard Frenzy and become the ultimate learning champion.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button as="a" href="/signup" variant="cta" size="lg">
                <Play className="h-5 w-5 mr-2" />
                Start Playing Now
              </Button>
              <Button as="a" href="#game-basics" variant="ghost" size="lg">
                Learn the Basics
              </Button>
            </div>
          </div>
        </Section>

        {/* Quick Overview Cards */}
        <Section id="overview">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-4">Game Overview</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">FlashCard Frenzy is a fast-paced, competitive learning game where speed and accuracy determine victory.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <Users className="h-10 w-10 mx-auto text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-100 mb-2">1-4 Players</h3>
              <p className="text-slate-400">Battle solo or with friends in real-time matches</p>
            </Card>
            <Card className="text-center">
              <Clock className="h-10 w-10 mx-auto text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-100 mb-2">5-15 Minutes</h3>
              <p className="text-slate-400">Quick matches that fit any schedule</p>
            </Card>
            <Card className="text-center">
              <BookOpen className="h-10 w-10 mx-auto text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-100 mb-2">Any Subject</h3>
              <p className="text-slate-400">Math, Science, Languages, History & more</p>
            </Card>
            <Card className="text-center">
              <Trophy className="h-10 w-10 mx-auto text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-100 mb-2">Ranked Play</h3>
              <p className="text-slate-400">Climb leaderboards and earn achievements</p>
            </Card>
          </div>
        </Section>

        {/* How to Play Steps */}
        <Section id="game-basics">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-4">How to Play</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Follow these simple steps to start your learning adventure</p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-16">
            <GameStep
              number="01"
              title="Join or Create a Game"
              description="Start by either creating your own game room or joining an existing one."
              icon={<Play className="h-8 w-8 text-cyan-400" />}
              details={[
                "Choose a flashcard deck from our library or upload your own",
                "Set game duration (5, 10, or 15 minutes)",
                "Invite friends with a room code or join public matches",
                "Wait for other players to join (1-4 players total)"
              ]}
            />

            <GameStep
              number="02"
              title="Answer Questions Fast"
              description="When the game starts, flashcards appear one by one. Answer as quickly and accurately as possible."
              icon={<Zap className="h-8 w-8 text-cyan-400" />}
              details={[
                "Each correct answer earns you points",
                "Faster answers earn bonus points",
                "Wrong answers give you a brief penalty",
                "Questions get progressively harder as you advance"
              ]}
            />

            <GameStep
              number="03"
              title="Compete for the Lead"
              description="Watch the real-time leaderboard and use power-ups strategically to gain an advantage."
              icon={<Target className="h-8 w-8 text-cyan-400" />}
              details={[
                "See live scores and positions during the match",
                "Earn power-ups for answer streaks",
                "Use freeze, double points, or hint power-ups",
                "Maintain your streak for maximum points"
              ]}
            />

            <GameStep
              number="04"
              title="Win and Level Up"
              description="The player with the most points when time runs out wins the match and earns rewards."
              icon={<Trophy className="h-8 w-8 text-cyan-400" />}
              details={[
                "Gain XP and climb the global leaderboard",
                "Unlock new badges and achievements",
                "Access harder difficulty levels",
                "Track your learning progress over time"
              ]}
            />
          </div>
        </Section>

        {/* Scoring System */}
        <Section id="scoring">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-4">Scoring System</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Understanding how points are calculated will help you maximize your score</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
                <Star className="h-6 w-6 text-cyan-400 mr-2" />
                Base Points
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Correct Answer</span>
                  <span className="text-cyan-400 font-bold">+100 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Speed Bonus (under 3s)</span>
                  <span className="text-cyan-400 font-bold">+50 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Lightning Fast (under 1s)</span>
                  <span className="text-cyan-400 font-bold">+100 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Wrong Answer</span>
                  <span className="text-red-400 font-bold">-25 pts</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
                <Zap className="h-6 w-6 text-cyan-400 mr-2" />
                Streak Multipliers
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">5 Correct in a Row</span>
                  <span className="text-cyan-400 font-bold">1.5x multiplier</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">10 Correct in a Row</span>
                  <span className="text-cyan-400 font-bold">2x multiplier</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">15 Correct in a Row</span>
                  <span className="text-cyan-400 font-bold">2.5x multiplier</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">20+ Correct in a Row</span>
                  <span className="text-cyan-400 font-bold">3x multiplier</span>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* Power-ups Section */}
        <Section id="powerups">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-4">Power-ups & Strategy</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Master these power-ups to gain the competitive edge</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            <Card className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Freeze Time</h3>
              <p className="text-slate-400 mb-3">Pauses the timer for 10 seconds, giving you extra thinking time</p>
              <span className="text-blue-400 text-sm">Earned after 3 correct answers</span>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Double Points</h3>
              <p className="text-slate-400 mb-3">Next correct answer is worth 2x points and bonuses</p>
              <span className="text-yellow-400 text-sm">Earned after 5 correct answers</span>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Hint</h3>
              <p className="text-slate-400 mb-3">Eliminates 2 wrong answers from multiple choice questions</p>
              <span className="text-green-400 text-sm">Earned after 7 correct answers</span>
            </Card>
          </div>
        </Section>

        {/* Tips Section */}
        <Section id="tips">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-4">Pro Tips</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Level up your game with these expert strategies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Speed vs Accuracy</h3>
              <p className="text-slate-400 mb-4">While speed bonuses are tempting, maintaining accuracy is crucial for building streak multipliers.</p>
              <div className="flex items-center text-cyan-400">
                <ArrowRight className="h-4 w-4 mr-2" />
                <span className="text-sm">Aim for 90%+ accuracy to maximize streaks</span>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Power-up Timing</h3>
              <p className="text-slate-400 mb-4">Save your Double Points power-up for difficult questions that you're confident about.</p>
              <div className="flex items-center text-cyan-400">
                <ArrowRight className="h-4 w-4 mr-2" />
                <span className="text-sm">Use strategically for maximum point gain</span>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Study Your Decks</h3>
              <p className="text-slate-400 mb-4">Practice with flashcard decks in study mode before jumping into competitive matches.</p>
              <div className="flex items-center text-cyan-400">
                <ArrowRight className="h-4 w-4 mr-2" />
                <span className="text-sm">Familiarity leads to faster response times</span>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Stay Calm Under Pressure</h3>
              <p className="text-slate-400 mb-4">When behind, focus on building a streak rather than rushing to catch up.</p>
              <div className="flex items-center text-cyan-400">
                <ArrowRight className="h-4 w-4 mr-2" />
                <span className="text-sm">Consistent play beats desperate moves</span>
              </div>
            </Card>
          </div>
        </Section>

        {/* Call to Action */}
        <Section className="text-center bg-slate-900/30 border-t border-cyan-500/30 mt-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">Ready to Dominate?</h2>
            <p className="text-xl text-slate-400 mb-8">You've got the knowledge. Now put it to the test and climb the leaderboards!</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button as="a" href="/signup" variant="cta" size="lg">
                <Play className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
              <Button as="a" href="/" variant="ghost" size="lg">
                Back to Home
              </Button>
            </div>
          </div>
        </Section>
        
      </main>
    </div>
  )
}

// Main App component to render the How to Play Page
export default function HowToPlayApp() {
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
      <HowToPlayPage />
    </>
  )
}