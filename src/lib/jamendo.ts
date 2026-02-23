interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  duration: number;
  tags: string[];
  shareurl: string;
  image: string;
}

interface JamendoResponse {
  headers: {
    status: string;
    code: number;
    error_message?: string;
  };
  results: JamendoTrack[];
}

const JAMENDO_CLIENT_ID = '93fb86ef';
const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';

export const convertFocusToTags = (focus: string): string[] => {
  const focusLower = focus.toLowerCase();
  const tags: string[] = [];

  if (focusLower.includes('rhythm') || focusLower.includes('beat')) {
    tags.push('rhythmic', 'beat', 'groove');
  }
  if (focusLower.includes('chord') || focusLower.includes('harmony')) {
    tags.push('acoustic', 'instrumental', 'piano');
  }
  if (focusLower.includes('melody') || focusLower.includes('tune')) {
    tags.push('melodic', 'instrumental');
  }
  if (focusLower.includes('technique') || focusLower.includes('practice')) {
    tags.push('instrumental', 'acoustic');
  }

  return tags;
};

export const searchTracks = async (genre: string, focus: string): Promise<JamendoTrack[]> => {
  try {
    const focusTags = convertFocusToTags(focus);
    const allTags = [...new Set([...focusTags, genre.toLowerCase()])].join('+');
    
    const url = `${JAMENDO_API_BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=5&tags=${allTags}&include=musicinfo&groupby=artist_id`;
    
    const response = await fetch(url);
    const data: JamendoResponse = await response.json();
    
    if (data.headers.status !== 'success') {
      throw new Error(data.headers.error_message || 'Failed to fetch tracks');
    }
    
    return data.results;
  } catch (error) {
    console.error('Error fetching Jamendo tracks:', error);
    return [];
  }
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export type { JamendoTrack };