"use client"

import React, { useState, FC, ReactNode } from 'react';
import { Eye, EyeOff, Mail, User, Lock, AlertCircle, ArrowRight } from 'lucide-react';

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

// Password strength indicator
const PasswordStrength: FC<{ password: string }> = ({ password }) => {
  const getStrength = (pass: string) => {
    if (pass.length === 0) return { score: 0, text: '', color: '' };
    
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score, text: 'Weak', color: 'bg-red-500' };
    if (score === 3) return { score, text: 'Fair', color: 'bg-yellow-500' };
    if (score === 4) return { score, text: 'Good', color: 'bg-blue-500' };
    return { score, text: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrength(password);
  
  if (password.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">Password Strength</span>
        <span className="text-xs text-slate-300">{strength.text}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-1.5">
        <div 
          className={`${strength.color} h-1.5 rounded-full transition-all duration-300`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

// The Sign Up Form Component
const SignUpForm: FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
    
      const data = await res.json();
    
      if (!res.ok) {
        setErrors({ api: data.error || "Signup failed" });
        setIsLoading(false);
        return;
      }
    
      // Optionally store user in localStorage for session persistence
      localStorage.setItem("user", JSON.stringify(data.user));
    
      // Redirect or show success
      alert("Account created successfully!");
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (error: any) {
      setErrors({ api: error.message || "Something went wrong" });
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
              Join FlashCard Frenzy
            </h1>
            <p className="text-slate-400">Create your account to get started</p>
          </div>

          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <Input
                type="text"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={handleInputChange('username')}
                icon={<User className="h-5 w-5 text-slate-400" />}
                error={errors.username}
                required
              />
            </div>

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
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
              />
              <PasswordStrength password={formData.password} />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <PasswordInput
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={errors.confirmPassword}
                required
              />
            </div>

            {/* Terms Agreement */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                  }}
                  className="w-5 h-5 text-cyan-500 bg-slate-900 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2 focus:ring-offset-0 mt-0.5"
                />
                <span className="text-sm text-slate-300 leading-5">
                  I agree to the{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms && (
                <div className="flex items-center text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.terms}
                </div>
              )}
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
                  Creating Account...
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App component
export default function SignupApp() {
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
      <SignUpForm />
    </>
  )
}