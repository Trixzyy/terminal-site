import { useState, useEffect } from 'react';

interface DiscordStatus {
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  username: string;
  avatar: string;
  activities: Activity[];
  spotify?: {
    song: string;
    artist: string;
    track_id: string;
    album_art_url: string;
    start_timestamp: number;
    end_timestamp: number;
  };
}

interface Activity {
  id: string;
  name: string;
  type: number;
  state?: string;
  emoji?: {
    id: string;
    name: string;
    animated: boolean;
  };
  created_at: number;
}

const DISCORD_ID = '992171799536218142';

export const useDiscordStatus = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [discordStatus, setDiscordStatus] = useState<DiscordStatus | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [spotifyLink, setSpotifyLink] = useState<string | null>(null);
  const [albumArt, setAlbumArt] = useState<string | null>(null);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [endTimestamp, setEndTimestamp] = useState<number | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const socket = new WebSocket('wss://api.lazerjay.dev/api/lanyard/socket/');

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: DISCORD_ID
        }
      }));
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
        setDiscordStatus(data.d);
        const discordUser = data.d.discord_user;
        setUsername(discordUser.username);
        setAvatar(`https://cdn.discordapp.com/avatars/${DISCORD_ID}/${discordUser.avatar}?size=256`);

        if (data.d.spotify) {
          setMusic(`${data.d.spotify.song} - ${data.d.spotify.artist}`);
          setSpotifyLink(`https://open.spotify.com/track/${data.d.spotify.track_id}`);
          setStartTimestamp(data.d.spotify.timestamps.start);
          setEndTimestamp(data.d.spotify.timestamps.end);
          setAlbumArt(data.d.spotify.album_art_url);
        } else {
          setMusic(null);
          setSpotifyLink(null);
          setStartTimestamp(null);
          setEndTimestamp(null);
          setAlbumArt(null);
        }

        if (data.d.activities) {
          setActivities(data.d.activities);
        } else {
          setActivities([]);
        }
      }
    });

    return () => socket.close();
  }, []);

  return { username, avatar, discordStatus, music, spotifyLink, albumArt, startTimestamp, endTimestamp, activities };
};