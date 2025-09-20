import React from 'react'
    import { Menu, X, LogIn, LogOut, UserPlus, Play, History, Home, HelpCircle, Zap, Users, BrainCircuit, Twitter, Instagram, Github } from 'lucide-react';
export default function Footer() {
  return (

        <footer className="relative z-10 border-t border-cyan-500/30 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center">
                  <p className="text-slate-400">&copy; 2024 FlashCard Frenzy. All Rights Reserved.</p>
                  <div className="flex space-x-4 mt-4 sm:mt-0">
                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
        </footer>
  )
}
