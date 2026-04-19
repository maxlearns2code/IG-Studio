import { AnalysisResults } from "@/types";

/**
 * Parses an Instagram JSON file (Followers or Following) and returns a list of usernames.
 * Supports both raw scraper exports and official Instagram data downloads.
 * 
 * @param file - The JSON file to parse
 * @returns Promise resolving to an array of usernames
 * @throws Error if JSON is malformed or structure is unknown
 */
export async function parseInstagramJson(file: File): Promise<string[]> {
  try {
    const text = await file.text();
    if (!text || text.trim() === "") return [];

    const data = JSON.parse(text);
    
    // Pattern 1: Array of objects with 'username' (Scraper format)
    if (Array.isArray(data)) {
      return data.map((u: any) => u.username).filter(Boolean);
    }
    
    // Pattern 2: Nested relationships (Official Instagram Export format)
    if (data.relationships_followers) {
      return data.relationships_followers
        .map((u: any) => u.string_list_data?.[0]?.value)
        .filter(Boolean);
    }

    if (data.relationships_following) {
       return data.relationships_following
        .map((u: any) => u.string_list_data?.[0]?.value)
        .filter(Boolean);
    }

    // fallback for other nested structures
    return [];
  } catch (error) {
    console.error("[Analyzer] Parse Error:", error);
    throw new Error(`Failed to parse ${file.name}. Ensure it is a valid Instagram JSON file.`);
  }
}

/**
 * Compares Followers and Following lists to determine reciprocation and imbalance.
 * 
 * @param followers - Array of follower usernames
 * @param following - Array of following usernames
 * @returns Categorized AnalysisResults
 */
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
