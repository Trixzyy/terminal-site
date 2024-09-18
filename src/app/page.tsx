"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useThemeSwitcher } from '@/hooks/useThemeSwitcher';
import { useDiscordStatus } from '@/hooks/useDiscordStatus';
import { ASCII_CAT_FRAMES, ASCII_LOGO } from '@/utils/asciiArt';
import commands from '@/utils/commands';
import { Music, Sun, Moon } from 'lucide-react';

export default function TerminalWebsite() {
  const { discordStatus, music, spotifyLink } = useDiscordStatus();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<React.ReactNode[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showAscii, setShowAscii] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prevDiscordStatus, setPrevDiscordStatus] = useState(discordStatus?.discord_status);
  const [prevMusic, setPrevMusic] = useState(music);

  const { theme, switchTheme } = useThemeSwitcher();
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasWelcomed = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prevDiscordStatus !== discordStatus?.discord_status) {
      setPrevDiscordStatus(discordStatus?.discord_status);
    }
  }, [discordStatus]);

  useEffect(() => {
    if (prevMusic !== music) {
      setPrevMusic(music);
    }
  }, [music]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput) {
      addToOutput(
        <span>
          <span className='text-blue-600 dark:text-blue-400'>visitor@tigerlake.xyz:~$ </span>
          <span>{trimmedInput}</span>
        </span>
      );
      handleCommand(trimmedInput);
      setHistory((prev) => [...prev, trimmedInput]);
      setHistoryIndex(-1);
    }
    setInput('');
  };

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.toLowerCase().split(' ');
    if (cmd in commands) {
      if (cmd === 'clear' || cmd === 'cls') {
        setOutput([]);
      } else if (cmd === 'theme') {
        const newTheme = args[0] === 'light' ? 'light' : 'dark';
        switchTheme(newTheme);
        commands[cmd].execute(args, addToOutput);
      } else if (cmd === 'music') {
        addToOutput(music ?
          <>
            <a href={spotifyLink || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Now playing: {music}
            </a>
          </>
          : 'No music playing');
      } else if (cmd === 'socials') {
        addToOutput(
          <>
            GitHub: <a href="https://github.com/trixzyy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/trixzyy</a>
            <br />
            Twitter: <a href="https://twitter.com/trixzydev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@trixzydev</a>
            <br />
            Discord: <a href="https://discord.com/users/992171799536218142" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@trixzy</a>
          </>
        );
      } else if (cmd === 'ascii') {
        setShowAscii((prev) => !prev);
        addToOutput(`ASCII art ${showAscii ? 'hidden' : 'shown'}`);
      } else if (cmd === 'date') {
        handleDateCommand();
      } else if (cmd === 'welcome') {
        handleWelcomeCommand();
      } else {
        commands[cmd].execute(args, addToOutput);
      }
    } else {
      addToOutput(`Command not found: ${cmd}. Type 'help' for a list of commands.`);
    }
  };

  const addToOutput = (content: React.ReactNode) => {
    setOutput((prev) => [...prev, content]);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistoryIndex((prev) => {
        const newIndex = Math.min(prev + 1, history.length - 1);
        setInput(history[history.length - 1 - newIndex] || '');
        return newIndex;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIndex((prev) => {
        const newIndex = Math.max(prev - 1, -1);
        setInput(newIndex === -1 ? '' : history[history.length - 1 - newIndex]);
        return newIndex;
      });
    }
  };

  const getDiscordStatusText = () => {
    switch (discordStatus?.discord_status) {
      case 'offline': return 'Offline';
      case 'online': return 'Online';
      case 'idle': return 'Idle';
      case 'dnd': return 'Do Not Disturb';
      default: return 'Loading...';
    }
  };

  const getDiscordStatusColor = () => {
    switch (discordStatus?.discord_status) {
      case 'offline': return 'bg-gray-500';
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const currentLondonTime = () => {
    return currentTime.toLocaleString('en-GB', { timeZone: 'Europe/London', hour12: false });
  };

  const handleDateCommand = () => {
    const userTime = new Date();
    const londonTime = new Date(currentTime.toLocaleString('en-GB', { timeZone: 'Europe/London' }));
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timeDifference = (londonTime.getTime() - userTime.getTime()) / (1000 * 60); // difference in minutes

    let timeDifferenceMessage = '';
    if (Math.abs(timeDifference) < 1) {
      timeDifferenceMessage = "We're on the same clock!";
    } else {
      const absDifference = Math.abs(timeDifference);
      const hours = Math.floor(absDifference / 60);
      const minutes = Math.round(absDifference % 60);
      const hourText = hours === 1 ? 'hour' : 'hours';
      const minuteText = minutes === 1 ? 'minute' : 'minutes';
      const timeText = hours > 0 ? `${hours} ${hourText}` : '';
      const minuteTextFinal = minutes > 0 ? `${minutes} ${minuteText}` : '';
      const separator = hours > 0 && minutes > 0 ? ' and ' : '';

      if (timeDifference > 0) {
        timeDifferenceMessage = `We're ${timeText}${separator}${minuteTextFinal} ahead of you in the UK.`;
      } else {
        timeDifferenceMessage = `We're ${timeText}${separator}${minuteTextFinal} behind you in the UK.`;
      }
    }

    addToOutput(`It's currently ${londonTime.toLocaleString('en-GB', { hour12: false })} for me in the UK.\nYour time: ${userTime.toLocaleString(undefined, { hour12: false })}\nYour timezone: ${userTimeZone}\n${timeDifferenceMessage}`);
  };

  const handleWelcomeCommand = () => {
    addToOutput(
      <>
        Welcome to my terminal!
        <br />
        My current status is {getDiscordStatusText()} on Discord.
        <br />
        Contact: zac@tigerlake.xyz or @trixzy on Discord.
      </>
    );
  };

  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % ASCII_CAT_FRAMES.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono overflow-hidden transition-colors duration-300">
      <nav className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <span className="text-xl font-bold">TigerLake</span>
            </div>
            <div className="flex items-center justify-end md:flex-1 lg:w-0">
              <span className="mr-4">{currentLondonTime()}</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getDiscordStatusColor()} transition-colors duration-300`}></div>
                <span className={`transition-all duration-300 ${prevDiscordStatus !== discordStatus?.discord_status ? 'animate-pulse' : ''}`}>
                  {getDiscordStatusText()}
                </span>
              </div>
              <button
                onClick={() => switchTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {music && (
        <div className="bg-blue-100 dark:bg-blue-900 p-2 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2">
            <Music size={16} className={`${prevMusic !== music ? 'animate-bounce' : ''}`} />
            <span className="mr-2">Now playing:</span>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div className={`inline-block ${music.length > 40 ? 'animate-marquee' : ''}`}>
                <a href={spotifyLink || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {music}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300">
          <div className="p-6">
            {showAscii && (
              <div className="flex space-x-4 mb-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                  {ASCII_CAT_FRAMES[currentFrame]}
                </pre>
                <pre className="text-xs sm:text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                  {ASCII_LOGO}
                </pre>
              </div>
            )}
            <div className="space-y-2">
              {output.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">{line}</div>
              ))}
              <form onSubmit={handleSubmit} className="flex items-center">
                <span className="mr-2 text-blue-600 dark:text-blue-400">visitor@tigerlake.xyz:~$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
                  autoFocus
                />
              </form>
            </div>
          </div>
        </div>
      </main>
      <div ref={bottomRef} />
    </div>
  );
}