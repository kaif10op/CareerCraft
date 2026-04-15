"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { X, Mail, Lock, Loader2, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

// Google SVG icon component for the button
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, initialMode]);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Google Sign-In success:", user.displayName, user.email);

      // Sign in to Supabase with the Google user's email
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: `firebase_google_${user.uid}`,
      });

      if (signInError) {
        // If they already have an unconfirmed account, signInError might be "Email not confirmed" or "Invalid login credentials"
        if (signInError.message?.toLowerCase().includes("email not confirmed")) {
          setError("Your account requires email confirmation. Please check your inbox for the Supabase verification link before signing in.");
          setGoogleLoading(false);
          return;
        }

        // User doesn't exist in Supabase (or invalid credentials), create them
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: user.email!,
          password: `firebase_google_${user.uid}`,
          options: {
            data: {
              full_name: user.displayName,
              avatar_url: user.photoURL,
              provider: "google",
            },
          },
        });

        if (signUpError) {
          if (signUpError.message?.includes("already registered")) {
            setError("This email is already registered but might require email confirmation. If you just created it, please check your inbox for a verification link.");
          } else {
            setError(signUpError.message);
          }
          setGoogleLoading(false);
          return;
        }

        // CRITICAL CHECK: Did Supabase return a session? 
        // If Email Confirmations are enabled in Supabase, session will be null!
        if (!signUpData?.session) {
          setError("Important: Email Confirmation is enabled in your Supabase project. A verification link has been sent to your email. You MUST click it before you can log in, OR you must disable 'Confirm Email' in your Supabase Dashboard to make Google Login instant.");
          setGoogleLoading(false);
          return;
        }

        console.log("Created Supabase user for Google account:", signUpData);
      }

      toast.success(`Welcome, ${user.displayName || user.email}!`);
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh only if we actually got a session
      }, 1500);
    } catch (err: any) {
      console.error("Google Sign-In error:", err);

      // Handle specific Firebase errors
      if (err.code === "auth/popup-closed-by-user") {
        setError(null); // User cancelled, no error needed
        setGoogleLoading(false);
        return;
      }
      if (err.code === "auth/popup-blocked") {
        setError("Pop-up was blocked. Please allow pop-ups and try again.");
      } else {
        const message = err.message || "Google sign-in failed. Please try again.";
        setError(message);
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });
        if (error) throw error;
        setSuccess("Password reset link sent! Please check your email.");
      } else if (mode === "signup") {
        console.log("Attempting signup for:", email);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          console.error("Signup error details:", error);
          throw error;
        }
        console.log("Signup success:", data);
        
        if (!data?.session) {
           setError("Registration successful! However, Supabase requires you to confirm your email. Please check your inbox for a verification link before signing in. (If you own this app, you can disable 'Confirm Email' in Supabase to skip this step).");
           return;
        }
        
        setSuccess("Success! You have been logged in.");
        toast.success("Account created successfully!");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        console.log("Attempting login for:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.error("Login error details:", error);
          toast.error(error.message);
          throw error;
        }
        console.log("Login success:", data);
        toast.success("Signed in successfully! Reloading...");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      const authError = err as { message?: string };
      console.error("Full Auth Exception:", authError);
      const message = authError.message || "Authentication failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md my-auto"
          >
            <div className="bg-gray-900 border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
              {/* Background Glows */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" 
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2] 
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
                className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-600/20 rounded-full blur-[80px] pointer-events-none" 
              />

              <div className="relative z-10 p-8 sm:p-10">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:rotate-90"
                >
                  <X size={20} />
                </button>

                <div className="text-center mb-10">
                  <motion.h2 
                    key={mode}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black text-white mb-2 tracking-tight"
                  >
                    {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 text-sm"
                  >
                    {mode === "login"
                      ? "Sign in to access your saved resumes"
                      : mode === "signup" 
                      ? "Join CarrierCraft to save your masterpieces"
                      : "Enter your email to receive a password reset link"}
                  </motion.p>
                </div>

                {/* Google Sign-In Button */}
                {mode !== "reset" && (
                  <>
                    <motion.button
                      id="google-sign-in-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGoogleSignIn}
                      disabled={googleLoading || loading}
                      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 py-4 rounded-2xl font-semibold text-sm shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6 relative overflow-hidden group"
                    >
                      {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                      ) : (
                        <>
                          <GoogleIcon />
                          <span>Continue with Google</span>
                        </>
                      )}
                    </motion.button>

                    {/* Divider */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-gray-900 px-4 text-gray-500 uppercase tracking-widest font-medium">
                          or continue with email
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-gray-300 text-sm font-semibold pl-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  {mode !== "reset" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pl-1 pr-1">
                        <label className="block text-gray-300 text-sm font-semibold">Password</label>
                        {mode === "login" && (
                          <button
                            type="button"
                            onClick={() => setMode("reset")}
                            className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                        <input
                          type="password"
                          required={mode !== "reset"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-gray-600"
                        />
                      </div>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium overflow-hidden"
                      >
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium overflow-hidden"
                      >
                        {success}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full relative group flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white py-4 rounded-2xl font-bold shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_10px_40px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {mode === "login" ? <LogIn size={20} /> : mode === "signup" ? <UserPlus size={20} /> : <Mail size={20} />}
                        {mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Reset Link"}
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                  <p className="text-gray-400 text-sm">
                    {mode === "reset" ? (
                      <>
                        Remember your password?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="text-white font-bold hover:text-violet-400 transition-all underline underline-offset-4"
                        >
                          Back to Sign In
                        </button>
                      </>
                    ) : mode === "login" ? (
                      <>
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("signup")}
                          className="text-white font-bold hover:text-violet-400 transition-all underline underline-offset-4"
                        >
                          Sign Up Free
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setMode("login")}
                          className="text-white font-bold hover:text-violet-400 transition-all underline underline-offset-4"
                        >
                          Sign In
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
