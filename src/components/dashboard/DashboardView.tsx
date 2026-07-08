import React, { useState, useEffect } from "react";
import { Link2Off, Sparkles, Zap, Edit3, MessageSquare, ArrowUpRight, TrendingUp, Users, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CreatorProfile, BrandDeal, KanbanTask } from "../../types";

interface DashboardViewProps {
  profile: CreatorProfile;
  deals: BrandDeal[];
  tasks: KanbanTask[];
  onSwitchTab: (tab: string) => void;
  notes: string;
  onUpdateNotes: (newNotes: string) => void;
}

export default function DashboardView({
  profile,
  deals,
  tasks,
  onSwitchTab,
  notes,
  onUpdateNotes,
}: DashboardViewProps) {
  const [intelLoading, setIntelLoading] = useState(false);
  const [intelText, setIntelText] = useState<string>("");

  useEffect(() => {
    // Load existing compiled intel from local storage if any
    const savedIntel = localStorage.getItem(`opryx_intel_${profile.email}`);
    if (savedIntel) {
      setIntelText(savedIntel);
    }
  }, [profile.email]);

  const compileIntel = async () => {
    setIntelLoading(true);
    setIntelText("");
    try {
      const response = await fetch("/api/gemini/intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          activeDeals: deals,
          activeTasks: tasks,
        }),
      });
      const data = await response.json();
      setIntelText(data.text);
      localStorage.setItem(`opryx_intel_${profile.email}`, data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIntelLoading(false);
    }
  };

  const hasLinkedChannels = profile.youtube || profile.instagram || profile.tiktok;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Columns (Audience and Intel) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* SYNCED SOCIAL AUDIENCE */}
        <div className="glass p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet/10 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet font-semibold">Audience Intelligence</span>
              <h3 className="font-display font-bold text-lg text-white mt-1">Synced Social Audience</h3>
            </div>
            {!hasLinkedChannels ? (
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-slate">
                <Link2Off className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            )}
          </div>

          {!hasLinkedChannels ? (
            <div className="flex flex-col gap-5 pt-2">
              <p className="text-xs text-slate leading-relaxed max-w-lg">
                No linked channels detected for this user profile. Connect your Instagram or YouTube accounts to track audience sizes, demographics, and metrics.
              </p>
              <button
                onClick={() => onSwitchTab("integrations")}
                className="btn self-start bg-gradient-to-r from-violet to-blue hover:scale-[1.02] active:scale-[0.98] transition-transform text-white text-xs font-semibold py-2.5 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Zap className="w-3.5 h-3.5" />
                Link Social Channels
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                {profile.youtube && (
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col gap-2 min-h-[76px] justify-center">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {profile.youtubeThumbnail ? (
                          <img 
                            src={profile.youtubeThumbnail} 
                            alt="YouTube Channel Thumbnail" 
                            className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="p-2 bg-red-500/10 rounded-xl flex-shrink-0">
                            <Youtube className="w-4 h-4 text-red-500" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white truncate max-w-[110px] sm:max-w-[130px] md:max-w-[150px]">
                            {profile.youtubeTitle || profile.youtube}
                          </span>
                          <span className="text-[9px] text-slate font-mono truncate max-w-[110px] sm:max-w-[130px] md:max-w-[150px]">
                            {profile.youtube.startsWith("@") || profile.youtube.startsWith("UC") ? profile.youtube : `@${profile.youtube}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-xs font-bold font-mono text-emerald-400">
                          {profile.youtubeSubscribers !== undefined ? (
                            profile.youtubeSubscribers >= 1000000
                              ? `${(profile.youtubeSubscribers / 1000000).toFixed(1)}M`
                              : profile.youtubeSubscribers >= 1000
                              ? `${(profile.youtubeSubscribers / 1000).toFixed(1)}K`
                              : profile.youtubeSubscribers.toLocaleString()
                          ) : "142.5K"}
                        </span>
                        <span className="text-[9px] text-slate font-mono uppercase tracking-wider">Subscribers</span>
                      </div>
                    </div>

                    {profile.youtubeViews !== undefined && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[9px] font-mono">
                        <div className="flex justify-between text-slate bg-black/40 p-1 rounded-md border border-white/5 px-1.5">
                          <span>Views:</span>
                          <span className="text-white font-bold">
                            {profile.youtubeViews >= 1000000
                              ? `${(profile.youtubeViews / 1000000).toFixed(1)}M`
                              : profile.youtubeViews >= 1000
                              ? `${(profile.youtubeViews / 1000).toFixed(1)}K`
                              : profile.youtubeViews.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate bg-black/40 p-1 rounded-md border border-white/5 px-1.5">
                          <span>Videos:</span>
                          <span className="text-white font-bold">{profile.youtubeVideos}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {profile.instagram && (
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex justify-between items-center min-h-[76px]">
                    <div>
                      <span className="text-[10px] font-mono text-slate uppercase block">Instagram Handle</span>
                      <span className="text-sm font-bold text-white font-mono mt-1 block">@{profile.instagram}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 font-mono">89.1K</span>
                      <span className="text-[9px] text-slate block font-mono mt-0.5">Followers</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulated audience growth chart */}
              <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                <span className="text-[10px] font-mono text-slate uppercase block mb-3">Audience Growth (Last 30 Days)</span>
                <div className="h-20 flex items-end justify-between gap-1">
                  {[45, 52, 49, 60, 58, 65, 70, 75, 82, 80, 89, 95].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div 
                        style={{ height: `${val}%` }} 
                        className="w-full bg-gradient-to-t from-violet/40 to-violet rounded-sm min-h-[5px] group-hover:to-blue transition-all"
                      />
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-[9px] font-mono px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        +{val}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-slate font-mono mt-2">
                  <span>W1</span>
                  <span>W2</span>
                  <span>W3</span>
                  <span>W4</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OPRYX CREATOR INTEL (AI) */}
        <div className="glass p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet animate-pulse" />
              <h3 className="font-display font-bold text-base text-white">OPRYX Creator Intel (AI)</h3>
            </div>
            <button
              onClick={compileIntel}
              disabled={intelLoading}
              className="btn bg-white/5 hover:bg-white/10 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-white/10 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-violet" />
              {intelText ? "Refresh Briefing" : "Compile Daily Briefing"}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {intelLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-8 h-8 rounded-full border-2 border-violet border-t-transparent animate-spin" />
                <span className="text-xs text-slate font-mono animate-pulse">Consulting OPRYX AI neural models...</span>
              </motion.div>
            ) : intelText ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert prose-sm text-xs text-slate leading-relaxed whitespace-pre-line bg-black/40 border border-white/5 p-4.5 rounded-xl max-h-[350px] overflow-y-auto"
              >
                {intelText}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-black/30 border border-white/5 border-dashed rounded-xl p-5 text-center flex flex-col items-center gap-2"
              >
                <Sparkles className="w-7 h-7 text-slate-500" />
                <span className="text-xs font-semibold text-white">Need campaign insights or outreach roadmaps?</span>
                <p className="text-[11px] text-slate max-w-sm mt-0.5 leading-relaxed">
                  Trigger OPRYX AI to compile a detailed, personalized performance summary based on your profile metadata, active brand sponsorship pipeline, and current tasks.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column (Notes & Quick links) */}
      <div className="flex flex-col gap-6">
        
        {/* QUICK WORKSPACE NOTES */}
        <div className="glass p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col h-full min-h-[320px]">
          <div className="flex items-center gap-2 pb-3.5 border-b border-white/5 mb-4">
            <Edit3 className="w-4.5 h-4.5 text-violet" />
            <h3 className="font-display font-bold text-sm text-white">Quick Workspace Notes</h3>
          </div>
          <div className="flex-1 flex flex-col gap-2 bg-black/40 border border-white/5 rounded-xl p-3">
            <textarea
              className="w-full h-full bg-transparent resize-none border-0 focus:ring-0 text-xs text-white placeholder-slate/50 font-mono focus:outline-none"
              placeholder="Draft quick thoughts, URLs, or deal notes here... Auto-saves locally."
              value={notes}
              onChange={(e) => onUpdateNotes(e.target.value)}
            />
          </div>
          <div className="text-[10px] text-slate/60 font-mono mt-3 flex justify-between items-center">
            <span>Client-side Secure Sandbox</span>
            <span>Saved {notes.length} characters</span>
          </div>
        </div>

        {/* Dynamic Manager Action */}
        <div className="bg-gradient-to-br from-violet/20 to-blue/5 border border-violet/20 p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex gap-2 text-white items-start">
            <MessageSquare className="w-4.5 h-4.5 text-violet mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-bold">Ask Sarah Jenkins</span>
              <span className="text-[10.5px] text-slate mt-0.5">Need customized sponsorship contracts or fast invoice releases? Ping talent head Sarah Jenkins in active chat.</span>
            </div>
          </div>
          <button 
            onClick={() => onSwitchTab("chat")}
            className="btn bg-white/5 hover:bg-white/10 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all border border-white/10 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Open Chat Feed</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
