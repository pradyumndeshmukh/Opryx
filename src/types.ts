export interface CreatorProfile {
  fullName: string;
  email: string;
  niche: string;
  bio: string;
  dob: string;
  phone: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  twitch: string;
  avatarUrl: string;
  payMethod: string;
  bankName: string;
  accountNo: string;
  routingNo: string;
  youtubeSubscribers?: number;
  youtubeViews?: number;
  youtubeVideos?: number;
  youtubeThumbnail?: string;
  youtubeTitle?: string;
}

export interface BrandDeal {
  id: string;
  brand: string;
  amount: number;
  platform: "YouTube" | "Instagram" | "TikTok" | "Twitch" | "Newsletter";
  deliverables: string[];
  dueDate: string;
  status: "Completed" | "In Review" | "Awaiting Deliverables" | "Draft";
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  priority: "high" | "medium" | "low";
  dueDate: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  productivity: string;
  attendance: string;
  status: "active" | "offline";
}

export interface FileVaultItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
}

export interface ChatMessage {
  id: string;
  sender: "manager" | "creator";
  text: string;
  timestamp: string;
}
