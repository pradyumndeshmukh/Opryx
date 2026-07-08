import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Settings, 
  MessageSquare, 
  CheckSquare, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Sparkles,
  Link2,
  Lock,
  ChevronRight,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import opryxLogo from "../assets/images/transparent logo.png";

// Import modular sub-views
import DashboardView from "./dashboard/DashboardView";
import IntegrationsView from "./dashboard/IntegrationsView";
import TasksView from "./dashboard/TasksView";
import ProfileView from "./dashboard/ProfileView";
import SettingsView from "./dashboard/SettingsView";
import ChatView from "./dashboard/ChatView";

import { CreatorProfile, BrandDeal, KanbanTask } from "../types";

const navLogoIcon = opryxLogo;

interface CreatorDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function CreatorDashboard({ user, onLogout }: CreatorDashboardProps) {
  // Mobile drawer open state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Active tab can be: dashboard | integrations | tasks | profile | settings | chat
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Load and cache Creator Profile metadata
  const [profile, setProfile] = useState<CreatorProfile>(() => {
    const email = user?.email || "partner@opryx.com";
    const saved = localStorage.getItem(`opryx_profile_${email}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      fullName: user?.user_metadata?.full_name || "Aria Sterling",
      email: email,
      niche: "Fashion & Travel",
      bio: "High-end content creator partner specializing in modern technology, luxury fashion, and immersive travel experiences.",
      dob: "2005-01-01",
      phone: "+91 70301 01631",
      youtube: "Aria Sterling Vlog",
      instagram: "aria_sterling",
      tiktok: "",
      twitch: "",
      avatarUrl: "",
      payMethod: "Direct Deposit",
      bankName: "Chase Bank",
      accountNo: "•••• •••• •••• 9823",
      routingNo: "•••••••••"
    };
  });

  // Load and cache Kanban tasks
  const [tasks, setTasks] = useState<KanbanTask[]>(() => {
    const email = user?.email || "partner@opryx.com";
    const saved = localStorage.getItem(`opryx_tasks_${email}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: "1", title: "Shoot Peak Design sponsor integration", description: "B-roll and verbal talking points for Peak Design backpack", status: "todo", priority: "high", dueDate: "Deliver by June 28" },
      { id: "2", title: "Review contract edits with Marcus Thorne", description: "Updated pricing tier and multi-vlog amplification terms", status: "in_progress", priority: "medium", dueDate: "Due by June 30" },
      { id: "3", title: "Deliver rough cut vlog to Head of Talent", description: "Upload rough edit of Tokyo Vlog to Google Drive folder", status: "completed", priority: "high", dueDate: "Completed June 20" },
    ];
  });

  // Auto-save state updates to local cache
  useEffect(() => {
    const email = user?.email || "partner@opryx.com";
    localStorage.setItem(`opryx_profile_${email}`, JSON.stringify(profile));
  }, [profile, user?.email]);

  useEffect(() => {
    const email = user?.email || "partner@opryx.com";
    localStorage.setItem(`opryx_tasks_${email}`, JSON.stringify(tasks));
  }, [tasks, user?.email]);

  // Handle setting updates from Supabase sync pull/push
  const handleUpdateAllData = (allData: { profile: CreatorProfile; tasks: KanbanTask[] }) => {
    setProfile(allData.profile);
    setTasks(allData.tasks);
  };

  const updateProfileFields = (updatedFields: Partial<CreatorProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedFields }));
  };

  const handleUpdateNotes = (newNotes: string) => {
    const email = user?.email || "partner@opryx.com";
    localStorage.setItem(`opryx_notes_${email}`, newNotes);
  };

  const getNotes = () => {
    const email = user?.email || "partner@opryx.com";
    return localStorage.getItem(`opryx_notes_${email}`) || "";
  };

  // Brand deals list for AI Context
  const brandDeals: BrandDeal[] = [
    { id: "1", brand: "Peak Design", amount: 4500, platform: "YouTube", deliverables: ["1x 60s Integration", "Short amplification"], dueDate: "June 28", status: "In Review" },
    { id: "2", brand: "NordicTrack", amount: 6200, platform: "Instagram", deliverables: ["2x Reels", "3x Stories"], dueDate: "July 12", status: "Awaiting Deliverables" },
  ];

  // Helper mapping active view render
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView 
            profile={profile} 
            deals={brandDeals} 
            tasks={tasks} 
            onSwitchTab={setActiveTab}
            notes={getNotes()}
            onUpdateNotes={handleUpdateNotes}
          />
        );
      case "integrations":
        return (
          <IntegrationsView 
            profile={profile} 
            onUpdateProfile={updateProfileFields} 
          />
        );
      case "tasks":
        return (
          <TasksView 
            tasks={tasks} 
            onUpdateTasks={setTasks} 
          />
        );
      case "profile":
        return (
          <ProfileView 
            profile={profile} 
            onUpdateProfile={updateProfileFields} 
          />
        );
      case "settings":
        return (
          <SettingsView 
            profile={profile} 
            onUpdateProfile={updateProfileFields}
            onUpdateAllData={handleUpdateAllData}
            tasks={tasks}
          />
        );
      case "chat":
        return (
          <ChatView email={profile.email} />
        );
      default:
        return (
          <DashboardView 
            profile={profile} 
            deals={brandDeals} 
            tasks={tasks} 
            onSwitchTab={setActiveTab}
            notes={getNotes()}
            onUpdateNotes={handleUpdateNotes}
          />
        );
    }
  };

  const initials = (profile.fullName || "PR").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  // Bottom Navigation tabs list matching screenshots
  const mainNavigationTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "integrations", label: "Integrations", icon: Link2 },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white font-sans flex flex-col md:flex-row relative overflow-x-hidden antialiased">
      {/* Background aurora effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet/10 rounded-full blur-[120px] animate-pulse duration-8000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue/10 rounded-full blur-[120px] animate-pulse duration-8000" />
      </div>

      {/* ------------------ DESKTOP SIDEBAR ------------------ */}
      <aside className="hidden md:flex flex-col w-64 bg-black/40 border-r border-white/5 p-6 z-10 select-none flex-shrink-0 h-screen sticky top-0">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-10 pb-5 border-b border-white/5">
          <img src={navLogoIcon} alt="OPRYX icon" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
          <span className="text-white font-extrabold text-lg tracking-wider">OPRYX</span>
        </div>

        {/* Sidebar Menu Links */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          {mainNavigationTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-violet to-blue text-white shadow-lg shadow-violet/10"
                    : "text-slate hover:text-white hover:bg-white/2"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-white/5 mt-4 flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "chat"
                  ? "bg-gradient-to-r from-violet to-blue text-white shadow-lg shadow-violet/10"
                  : "text-slate hover:text-white hover:bg-white/2"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Feed</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-violet to-blue text-white shadow-lg shadow-violet/10"
                  : "text-slate hover:text-white hover:bg-white/2"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* User Card & Logout bottom */}
        <div className="pt-5 border-t border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet to-blue flex items-center justify-center font-display font-bold text-white text-xs">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">{profile.fullName}</span>
              <span className="text-[10px] text-slate truncate">{profile.email}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full btn bg-white/5 hover:bg-white/10 hover:text-red-400 border border-white/10 text-white rounded-xl py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ------------------ MOBILE FLOATING HEADER ------------------ */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/50 backdrop-blur-xl z-20 sticky top-0 select-none">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-1.5 text-slate hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Central Logo */}
        <div className="flex items-center gap-1.5">
          <img src={navLogoIcon} alt="OPRYX icon" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
          <span className="text-white font-extrabold text-sm tracking-wider">OPRYX</span>
        </div>

        {/* Quick notification bubble */}
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Bell className="w-4 h-4 text-slate hover:text-white" />
        </div>
      </header>

      {/* ------------------ MOBILE DRAWER SLIDE-DRAWER ------------------ */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Slide menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0c0c10] border-r border-white/10 z-50 p-6 flex flex-col md:hidden select-none"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-8">
                <div className="flex items-center gap-2">
                  <img src={navLogoIcon} alt="OPRYX logo" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                  <span className="text-white font-extrabold text-base tracking-wider">OPRYX</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Secondary Navigation items */}
              <div className="flex flex-col gap-1.5 flex-grow">
                <span className="text-[9px] text-slate font-mono uppercase tracking-widest font-bold pb-1.5 mb-1.5 block">Secondary Services</span>
                
                <button
                  onClick={() => {
                    setActiveTab("chat");
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 py-3.5 px-4.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === "chat"
                      ? "bg-gradient-to-r from-violet to-blue text-white shadow-lg shadow-violet/10"
                      : "text-slate hover:text-white hover:bg-white/2"
                  }`}
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>Secure Chat Feed</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 py-3.5 px-4.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === "settings"
                      ? "bg-gradient-to-r from-violet to-blue text-white shadow-lg shadow-violet/10"
                      : "text-slate hover:text-white hover:bg-white/2"
                  }`}
                >
                  <Settings className="w-4.5 h-4.5" />
                  <span>Control Settings</span>
                </button>
              </div>

              {/* Drawer Footer User & Logout */}
              <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet to-blue flex items-center justify-center font-display font-bold text-white text-xs">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">{profile.fullName}</span>
                    <span className="text-[10px] text-slate truncate">{profile.email}</span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full btn bg-white/5 hover:bg-white/10 hover:text-red-400 border border-white/10 text-white rounded-xl py-3 px-4.5 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ------------------ MAIN CONTENT WRAPPER ------------------ */}
      <main className="flex-1 flex flex-col min-w-0 z-10 pb-20 md:pb-6 p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-6xl mx-auto h-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ------------------ MOBILE BOTTOM TAB BAR ------------------ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-black/75 backdrop-blur-xl border-t border-white/5 flex items-center justify-around py-3 px-2 select-none">
        {mainNavigationTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                isActive ? "text-violet" : "text-slate"
              }`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
              <span className={`text-[9px] font-medium tracking-wide transition-colors ${
                isActive ? "text-white" : "text-slate/80"
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
