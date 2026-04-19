export type Theme = "pro" | "instagram" | "pixel";

export interface InstagramUser {
  username: string;
  full_name?: string;
  profile_pic_url?: string;
}

export interface AnalysisResults {
  followers: string[];
  following: string[];
  nonFollowers: string[];
  fans: string[]; // People who follow you but you don't follow back
  mutuals: string[];
}
