"use client"

import React, { useState, FC, ReactNode } from "react";
import { Menu, X, LogIn, LogOut, UserPlus, Play, History, Home, HelpCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Button component styled for the neon theme
const Button: FC<{
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "ghost" | "primary";
  size?: "sm" | "default";
}> = ({ children, onClick, className = "", variant = "primary", size = "default" }) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-cyan-500/20 border border-cyan-500 text-cyan-300 hover:bg-cyan-500/40",
    ghost: "text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
  };

  const finalClassName = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;
  return (
    <button onClick={onClick} className={finalClassName}>
      {children}
    </button>
  );
};

// The main Navbar component with neon theme
const FuturisticNavbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isSignedIn = !!user;

  // Unified navigation arrays
  const baseNav = [
    { text: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { text: "How to Play", href: "/howtoplay", icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const signedOutNav = [{ text: "Sign Up", href: "/signup", icon: <UserPlus className="h-5 w-5" /> }];
  const signedInNav = [
    { text: "Play Game", href: "/play", icon: <Play className="h-5 w-5" /> },
    { text: "My Scores", href: "/history", icon: <History className="h-5 w-5" /> },
  ];

  const navItems = [...baseNav, ...(isSignedIn ? signedInNav : signedOutNav)];

  const NavLink: FC<{ href: string; children: ReactNode; onClick?: () => void }> = ({
    href,
    children,
    onClick,
  }) => (
    <a href={href} className="flex items-center" onClick={onClick}>
      <Button variant="ghost" className="w-full justify-start text-slate-300 font-medium px-4 py-3">
        {children}
      </Button>
    </a>
  );

  const AuthButton: FC = () => {
    return isSignedIn ? (
      <Button onClick={logout}>
        <LogOut className="h-4 w-4 mr-2" />
        Log Out
      </Button>
    ) : (
      <a href="/login">
        <Button>
          <LogIn className="h-4 w-4 mr-2" />
          Log In
        </Button>
      </a>
    );
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3">
            <span
              className="text-xl font-bold text-cyan-400 tracking-wider uppercase"
              style={{ textShadow: "0 0 8px rgba(0, 255, 255, 0.7)" }}
            >
              FlashCard Frenzy
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink key={item.text} href={item.href}>
                {item.icon}
                <span className="ml-2">{item.text}</span>
              </NavLink>
            ))}
            <div className="ml-6">
              <AuthButton />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-4 space-y-2 border-t border-cyan-500/30">
              {navItems.map((item) => (
                <NavLink key={item.text} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  {item.icon}
                  <span className="ml-3">{item.text}</span>
                </NavLink>
              ))}
              <div className="pt-3 px-2">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default FuturisticNavbar;
