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

export async function parseInstagramJson(file: File): Promise<string[]> {
  const text = await file.text();
  const data = JSON.parse(text);
  
  // Handle different potential JSON structures from the scraper
  // If it's an array of objects with 'username'
  if (Array.isArray(data)) {
    return data.map((u: any) => u.username).filter(Boolean);
  }
  
  // If it's a nested structure (sometimes Instagram's own exports are nested)
  if (data.relationships_followers) {
    return data.relationships_followers.map((u: any) => u.string_list_data?.[0]?.value).filter(Boolean);
  }

  return [];
}

export function compareProfiles(followers: string[], following: string[]): AnalysisResults {
  const followerSet = new Set(followers);
  const followingSet = new Set(following);

  const nonFollowers = following.filter(u => !followerSet.has(u)).sort();
  const fans = followers.filter(u => !followingSet.has(u)).sort();
  const mutuals = following.filter(u => followerSet.has(u)).sort();

  return {
    followers,
    following,
    nonFollowers,
    fans,
    mutuals
  };
}
