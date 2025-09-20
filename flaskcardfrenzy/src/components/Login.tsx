"use client"

import React, { useState, FC, ReactNode } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
// Button component styled for the neon theme
const Button: FC<{
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'ghost' | 'primary' | 'cta';
  size?: 'sm' | 'default' | 'lg';
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ children, onClick, className = '', variant = 'primary', size = 'default', type = 'button', disabled = false }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105";

  const variants = {
    primary: "bg-cyan-500/20 border border-cyan-500 text-cyan-300 hover:bg-cyan-500/40",
    ghost: "text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300",
    cta: "bg-cyan-400 text-slate-900 font-bold hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.5)]",
  };

  const sizes = {
    default: "h-12 py-3 px-6",
    sm: "h-9 px-3 rounded-md",
    lg: "h-14 px-8 text-base rounded-lg",
  };

  const finalClassName = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={finalClassName}>
      {children}
    </button>
  );
};

// Input component styled for the neon theme
const Input: FC<{
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: ReactNode;
  error?: string;
  required?: boolean;
}> = ({ type, placeholder, value, onChange, className = '', icon, error, required = false }) => {
  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full h-12 rounded-md border border-slate-600 bg-slate-900/50 text-slate-100 placeholder-slate-400
            focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none
            transition-all duration-300
            ${icon ? 'pl-10' : 'pl-4'} pr-4
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
        />
      </div>
      {error && (
        <div className="mt-2 flex items-center text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

// Password Input with show/hide toggle
const PasswordInput: FC<{
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}> = ({ placeholder, value, onChange, error, required = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full h-12 rounded-md border border-slate-600 bg-slate-900/50 text-slate-100 placeholder-slate-400
            focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none
            transition-all duration-300 pl-10 pr-12
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          `}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error && (
        <div className="mt-2 flex items-center text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
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

// The Login Form Component
const LoginForm: FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };



// Inside LoginForm
const { login } = useAuth();

const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsLoading(true);
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (!res.ok) {
      setErrors({ general: data.error || "Login failed" });
      return;
    }

    login(data.user); // <-- set user in context
    window.location.href = "/play";
  } catch (err: any) {
    setErrors({ general: err.message || "Something went wrong" });
  } finally {
    setIsLoading(false);
  }
};





  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center py-12 px-4">
      <GridBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-2" 
                style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.6)' }}>
              Welcome Back
            </h1>
            <p className="text-slate-400">Sign in to your FlashCard Frenzy account</p>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {errors.general}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                icon={<Mail className="h-5 w-5 text-slate-400" />}
                error={errors.email}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <PasswordInput
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              variant="cta"
              className="w-full"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900 mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <a href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign Up
              </a>
            </p>
          </div>
        </div>

        {/* Quick Access Card */}
        <div className="mt-6 bg-slate-900/30 backdrop-blur-sm border border-cyan-500/10 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">New to FlashCard Frenzy?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Join thousands of learners competing in fast-paced flashcard battles
          </p>
          <Button variant="primary" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  )
}

// Main App component
export default function LoginApp() {
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
      <LoginForm />
    </>
  )
}