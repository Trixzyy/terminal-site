import { useState, useEffect } from 'react';
import { start } from 'repl';

interface DiscordStatus {
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  avatar: string;
  spotify?: {
    song: string;
    artist: string;
    track_id: string;
    album_art_url: string;
   start_timestamp: number;
   end_timestamp: number;
  };
}

const DISCORD_ID = '992171799536218142';

export const useDiscordStatus = () => {
  const [discordStatus, setDiscordStatus] = useState<DiscordStatus | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [spotifyLink, setSpotifyLink] = useState<string | null>(null);
  const [albumArt, setAlbumArt] = useState<string | null>(null);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [endTimestamp, setEndTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const socket = new WebSocket('wss://api.lanyard.rest/socket');

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
        if (data.d.spotify) {
          setMusic(`${data.d.spotify.song} - ${data.d.spotify.artist}`);
          setSpotifyLink(`https://open.spotify.com/track/${data.d.spotify.track_id}`);
          setStartTimestamp(data.d.spotify.timestamps.start);
          setEndTimestamp(data.d.spotify.timestamps.end);
          setAlbumArt(data.d.spotify.album_art_url);
        } else {
          setMusic(null);
        }
      }
    });

    return () => socket.close();
  }, []);

  return { discordStatus, music, spotifyLink, albumArt, startTimestamp, endTimestamp };
};