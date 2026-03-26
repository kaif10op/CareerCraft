"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Loader2, Save } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [nameMessage, setNameMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
        setFullName(session.user.user_metadata?.full_name || "");
      }
      setLoading(false);
    });
  }, [router]);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    setNameMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      if (error) throw error;
      setNameMessage({ type: 'success', text: 'Name updated successfully!' });
      // Clear success message after 3 seconds
      setTimeout(() => setNameMessage(null), 3000);
    } catch (error: any) {
      setNameMessage({ type: 'error', text: error.message || 'Failed to update name' });
    } finally {
      setSavingName(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setSavingPassword(true);
    setPasswordMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      if (error) throw error;
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setPassword("");
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordMessage(null), 3000);
    } catch (error: any) {
      setPasswordMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-950 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Your Profile</h1>
            <p className="text-gray-400">Manage your account settings and preferences.</p>
          </div>

          <div className="space-y-6">
            {/* Read-only Email Section */}
            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center border border-white/5">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Email Address</h2>
                  <p className="text-sm text-gray-400">The email associated with your account.</p>
                </div>
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-400 cursor-not-allowed focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">To change your email, please contact support.</p>
            </div>

            {/* Update Name Section */}
            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
              {/* Subtle accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 relative">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                  <User className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Personal Information</h2>
                  <p className="text-sm text-gray-400">Update your full name.</p>
                </div>
              </div>

              <form onSubmit={handleUpdateName} className="relative">
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <AnimatePresence>
                    {nameMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`text-sm ${nameMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
                      >
                        {nameMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingName || (!fullName && fullName === user.user_metadata?.full_name)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {savingName ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Update Password Section */}
            <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
              {/* Subtle accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 relative">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <Lock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Security</h2>
                  <p className="text-sm text-gray-400">Update your password to keep your account secure.</p>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className="relative">
                <div className="space-y-4">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <AnimatePresence>
                    {passwordMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`text-sm ${passwordMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
                      >
                        {passwordMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingPassword || !password}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {savingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
