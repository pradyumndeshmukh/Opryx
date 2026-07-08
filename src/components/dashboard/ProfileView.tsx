import React, { useState } from "react";
import { User, Shield, Phone, Calendar, Video, FileText, CheckCircle2, Lock, Save, Edit3, X } from "lucide-react";
import { CreatorProfile } from "../../types";

interface ProfileViewProps {
  profile: CreatorProfile;
  onUpdateProfile: (updated: Partial<CreatorProfile>) => void;
}

export default function ProfileView({
  profile,
  onUpdateProfile,
}: ProfileViewProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Local form states
  const [fullName, setFullName] = useState(profile.fullName);
  const [niche, setNiche] = useState(profile.niche);
  const [bio, setBio] = useState(profile.bio);
  const [dob, setDob] = useState(profile.dob || "2005-01-01");
  const [phone, setPhone] = useState(profile.phone || "+91 70301 01631");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [youtube, setYoutube] = useState(profile.youtube);
  const [instagram, setInstagram] = useState(profile.instagram);
  const [tiktok, setTiktok] = useState(profile.tiktok || "");
  const [twitch, setTwitch] = useState(profile.twitch || "");

  // Financial form states
  const [payMethod, setPayMethod] = useState(profile.payMethod || "Direct Deposit");
  const [bankName, setBankName] = useState(profile.bankName || "Chase Bank");
  const [accountNo, setAccountNo] = useState(profile.accountNo || "•••• •••• •••• 9823");
  const [routingNo, setRoutingNo] = useState(profile.routingNo || "•••••••••");

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName,
      niche,
      bio,
      dob,
      phone,
      avatarUrl,
      youtube,
      instagram,
      tiktok,
      twitch,
      payMethod,
      bankName,
      accountNo,
      routingNo,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsEditMode(false);
  };

  const initials = (fullName || "PR").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  // Onboarding milestones checking
  const hasLinkedChannels = profile.youtube || profile.instagram;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Tab Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-violet font-semibold">OPRYX IDENTITY</span>
          <h2 className="font-display font-bold text-2xl text-white">User Credentials & Profile</h2>
        </div>
        <button
          onClick={() => {
            if (isEditMode) {
              // reset
              setFullName(profile.fullName);
              setNiche(profile.niche);
              setBio(profile.bio);
              setDob(profile.dob);
              setPhone(profile.phone);
              setAvatarUrl(profile.avatarUrl);
              setYoutube(profile.youtube);
              setInstagram(profile.instagram);
            }
            setIsEditMode(!isEditMode);
          }}
          className="btn bg-white/5 hover:bg-white/10 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
        >
          {isEditMode ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel Edit</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Edit Details</span>
            </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Success! Your OPRYX Portal settings and dynamic metadata profiles have been synchronized.</span>
        </div>
      )}

      {isEditMode ? (
        /* EDIT PROFILE MODE */
        <form onSubmit={handleSave} className="glass p-6 rounded-3xl bg-[#0c0c10] border border-white/5 flex flex-col gap-6 max-w-3xl">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Edit Creator Profile</h3>
            <p className="text-xs text-slate mt-0.5">Customize your personal metadata, connected handle routes, and bank payout intelligence details.</p>
          </div>

          {/* Identity & Biography */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-violet uppercase tracking-wider border-b border-white/5 pb-2">1. Identity & Biography</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">Full Creator Name</label>
                <input 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">Category Niche</label>
                <input 
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">Date of Birth</label>
                <input 
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">Contact Phone</label>
                <input 
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white font-semibold">Biography Summary</label>
              <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet resize-none leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Connected Handles */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-violet uppercase tracking-wider border-b border-white/5 pb-2">2. Connected Channels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">YouTube Handle/Name</label>
                <input 
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">Instagram Handle</label>
                <input 
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn self-start bg-gradient-to-r from-violet to-blue text-white rounded-xl py-3 px-6 text-xs font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <Save className="w-4 h-4" />
            Save & Sync Settings
          </button>
        </form>
      ) : (
        /* VIEW PROFILE MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Avatar preview & Handles */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass p-6 rounded-2xl bg-[#0c0c10] border border-white/5 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-violet/10 to-blue/15" />
              
              <div className="relative mt-8 mb-4 z-10">
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.fullName} 
                    className="w-20 h-20 rounded-full object-cover border-2 border-violet"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet to-blue flex items-center justify-center font-display font-bold text-white text-2xl uppercase border-2 border-white/5">
                    {initials}
                  </div>
                )}
                <span className="absolute bottom-0 right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-[#0c0c10]" />
              </div>

              <div className="flex flex-col items-center gap-1 z-10 mb-3">
                <h3 className="font-display font-bold text-base text-white">{profile.fullName}</h3>
                <span className="text-[10px] text-slate font-mono uppercase tracking-wider">{profile.email}</span>
              </div>

              <span className="px-3 py-1 rounded-full border border-violet/30 bg-violet/10 text-[10px] font-bold text-violet uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>SUPER ADMIN</span>
              </span>
            </div>

            {/* CONNECTED SOCIAL HANDLES LIST */}
            <div className="glass p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
              <span className="text-[10px] text-slate font-mono uppercase tracking-widest font-semibold pb-2 border-b border-white/5">Connected Platforms</span>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-slate flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-red-500" /> YouTube</span>
                  <span className="font-mono text-white text-xs">{profile.youtube || "No Page/Channel linked"}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-slate flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-pink-500" /> Instagram</span>
                  <span className="font-mono text-white text-xs">{profile.instagram ? `@${profile.instagram}` : "No Page/Channel linked"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Identity details & Secure system matrix */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* PERSONAL IDENTITY & CONTACTS */}
            <div className="glass p-5 rounded-2xl bg-white/5 border border-white/5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-white/5 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-violet" />
                <span>Personal Identity & Contacts</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col gap-1 py-1">
                  <span className="text-slate font-mono uppercase text-[9px] tracking-wider">Identity Name</span>
                  <span className="text-white font-semibold">{profile.fullName}</span>
                </div>
                <div className="flex flex-col gap-1 py-1">
                  <span className="text-slate font-mono uppercase text-[9px] tracking-wider">Date of Birth</span>
                  <span className="text-white font-semibold">{profile.dob || "2005-01-01"}</span>
                </div>
                <div className="flex flex-col gap-1 py-1">
                  <span className="text-slate font-mono uppercase text-[9px] tracking-wider">Contact Phone</span>
                  <span className="text-white font-semibold">{profile.phone || "+91 70301 01631"}</span>
                </div>
              </div>
            </div>

            {/* CHANNEL & STRATEGY SPECIFICATION */}
            <div className="glass p-5 rounded-2xl bg-white/5 border border-white/5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-white/5 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet" />
                <span>Channel & Strategy Specification</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col gap-1 py-1">
                  <span className="text-slate font-mono uppercase text-[9px] tracking-wider">Page / Channel Name</span>
                  <span className="text-white font-semibold">{profile.youtube || profile.instagram || "Not specified"}</span>
                </div>
                <div className="flex flex-col gap-1 py-1">
                  <span className="text-slate font-mono uppercase text-[9px] tracking-wider">Active Platforms</span>
                  <span className="text-white font-semibold">
                    {profile.youtube && profile.instagram ? "YouTube, Instagram" : profile.youtube ? "YouTube" : profile.instagram ? "Instagram" : "None linked"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2 py-1">
                  <span className="text-slate font-mono uppercase text-[9px] tracking-wider">Creative Bio</span>
                  <p className="text-white leading-relaxed mt-0.5">{profile.bio || "No creative bio. Customize in Edit Details mode!"}</p>
                </div>
              </div>
            </div>

            {/* SECURE SYSTEM ROLE AUDIT */}
            <div className="glass p-5 rounded-2xl bg-[#0c0c10] border border-amber-500/15">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-4.5">
                <Lock className="w-4.5 h-4.5 text-amber-400" />
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Secure System Role Audit</h3>
                  <p className="text-[10px] text-slate mt-0.5">Below is your designated system matrix list. Your role (Super Admin) authorizes or restricts access automatically.</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs font-mono">
                {[
                  { privilege: "Absolute Agency Workspace Control", status: hasLinkedChannels ? "AUTHORIZED" : "RESTRICTED", active: hasLinkedChannels },
                  { privilege: "Manage & View Financial Ledgers", status: hasLinkedChannels ? "AUTHORIZED" : "RESTRICTED", active: hasLinkedChannels },
                  { privilege: "Upload Secure Creator Docs & Data", status: "AUTHORIZED", active: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-white/90 text-[11px]">{item.privilege}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      item.active 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
