"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

const DISCORD_ID = '992171799536218142'; 

const ASCII_CAT = `
 /\\_/\\
( o.o )
 > ^ <
`

const ASCII_LOGO = `
 _   _                 _       _        
| |_(_) __ _  ___ _ __| | __ _| | _____ 
| __| |/ _\` |/ _ \\ '__| |/ _\` | |/ / _ \\
| |_| | (_| |  __/ |  | | (_| |   <  __/
 \\__|_|\\__, |\\___|_|  |_|\\__,_|_|\\_\\___|
  |___/                            
   v1.0
`

const COMMANDS = {
  help: 'Get a list of all available commands',
  about: 'About me',
  skills: 'Check out the skills I have',
  projects: 'Some of my programming projects',
  socials: 'My social networks',
  clear: 'Clear the terminal',
  theme: 'Change terminal theme (light/dark)',
  music: 'Display currently playing music',
  ascii: 'Toggle ASCII art',
  echo: 'Echo a message',
  date: 'Display current date and time',
  welcome: 'Display welcome message',
}

export default function TerminalWebsite() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<React.ReactNode[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showAscii, setShowAscii] = useState(true)
  const [music, setMusic] = useState<string | null>(null)
  const [spotifyLink, setSpotifylink] = useState<string | null>(null)
  interface DiscordStatus {
    discord_status: 'online' | 'idle' | 'dnd' | 'offline';
    spotify?: {
      song: string;
      artist: string;
      track_id: string;
    };
  }

  const [discordStatus, setDiscordStatus] = useState<DiscordStatus | null>(null);
  const { theme, setTheme } = useTheme()
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasWelcomed = useRef(false)

  // Discord status integration using Lanyard
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
      }
    });

    return () => socket.close();
  }, []);

  // Music update logic
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
  
        // Check for Spotify activity and update music state
        if (data.d.spotify) {
          setMusic(`${data.d.spotify.song} - ${data.d.spotify.artist}`);
          setSpotifylink(`https://open.spotify.com/track/${data.d.spotify.track_id}`);
        } else {
          setMusic(null); // No music playing
        }
      }
    });
  
    return () => socket.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [output])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (trimmedInput) {
      addToOutput(
        <span>
          <a className='text-blue-600'>visitor@tigerlake.xyz:~$ </a>
          <a>{trimmedInput}</a>
        </span>
      )
      handleCommand(trimmedInput)
      setHistory((prev) => [...prev, trimmedInput])
      setHistoryIndex(-1)
    }
    setInput('')
  }

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.toLowerCase().split(' ')
    switch (cmd) {
      case 'help':
        addToOutput(Object.entries(COMMANDS).map(([cmd, desc]) => `${cmd}: ${desc}`).join('\n'))
        break
      case 'about':
        addToOutput("I'm a passionate developer who loves creating unique web experiences!")
        break
      case 'skills':
        addToOutput('JavaScript, TypeScript, React, Node.js, Python, and more!')
        break
      case 'projects':
        addToOutput('1. add a cool feature\n2. that uses an api\n3. to show my repos')
        break
      case 'socials':
        addToOutput(
          <>
            GitHub: <a href="https://github.com/trixzyy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/trixzyy</a>
            <br />
            Twitter: <a href="https://twitter.com/trixzydev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@trixzydev</a>
            <br />
            Discord: <a href="https://discord.com/users/992171799536218142" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@trixzy</a>
          </>
        )
        break
      case 'clear':
      case 'cls':
        setOutput([])
        break
      case 'theme':
        const newTheme = args[0] === 'light' ? 'light' : 'dark'
        setTheme(newTheme)
        addToOutput(`Theme set to ${newTheme}`)
        break
      case 'music':
        addToOutput(music ? 
          <>
            <a href={spotifyLink || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Now playing: {music}
            </a>
          </>
           
           : 'No music playing')
        break
      case 'ascii':
        setShowAscii((prev) => !prev)
        addToOutput(`ASCII art ${showAscii ? 'hidden' : 'shown'}`)
        break
      case 'echo':
        addToOutput(args.join(' '))
        break
      case 'time':
      case 'date':
        const userTime = new Date();
        const londonTime = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const londonDate = new Date(londonTime);
        const timeDifference = (londonDate.getTime() - userTime.getTime()) / (1000 * 60 * 60); // difference in hours

        let timeDifferenceMessage = '';
        if (timeDifference === 0) {
          timeDifferenceMessage = "We're on the same clock!";
        } else {
          const absDifference = Math.abs(timeDifference);
          const diffText = absDifference === 1 ? 'hour' : 'hours';
          if (timeDifference > 0) {
        timeDifferenceMessage = `We're ${absDifference} ${diffText} ahead of you in the UK.`;
          } else {
        timeDifferenceMessage = `We're ${absDifference} ${diffText} apart, and you're ahead of us in the UK.`;
          }
        }

        addToOutput(`It's currently ${londonTime} for me in the UK.\nYour time: ${userTime.toLocaleString()}\n${timeDifferenceMessage}`);
        break
      case 'welcome':
        addToOutput(
          <>
            Welcome to my terminal!
            <br />
            My current status is {getDiscordStatusText()} on Discord.
            <br />
            Contact: zac@tigerlake.xyz or @trixzy on Discord.
          </>
        )
        break
      default:
        addToOutput(`Command not found: ${cmd}. Type 'help' for a list of commands.`)
    }
  }

  const addToOutput = (content: React.ReactNode) => {
    setOutput((prev) => [...prev, content])
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistoryIndex((prev) => {
        const newIndex = Math.min(prev + 1, history.length - 1)
        setInput(history[history.length - 1 - newIndex] || '')
        return newIndex
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistoryIndex((prev) => {
        const newIndex = Math.max(prev - 1, -1)
        setInput(newIndex === -1 ? '' : history[history.length - 1 - newIndex])
        return newIndex
      })
    }
  }

  const getDiscordStatusText = () => {
    switch (discordStatus?.discord_status) {
      case 'offline': return 'Offline';
      case 'online': return 'Online';
      case 'idle': return 'Idle';
      case 'dnd': return 'Do Not Disturb';
      default: return 'Loading...';
    }
  };

  const currentLondonTime = () => {
    return new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-green-400 font-mono p-4 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {showAscii && (
          <pre className="text-xs sm:text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: `${ASCII_CAT}${ASCII_LOGO}` }} />
        )}
        <div className="mt-4 space-y-2">
          {output.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">{line}</div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex items-center">
          <span className="mr-2 text-blue-600">visitor@tigerlake.xyz:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent focus:outline-none"
            autoFocus
          />
        </form>
        <div ref={bottomRef} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 text-center">
        Now playing: {music || 'Nothing'}
      </div>
      <div className="fixed top-0 right-0 p-2 text-xs">
        London Time: {currentLondonTime()} | Discord Status: {getDiscordStatusText()}
      </div>
    </div>
  )
}
