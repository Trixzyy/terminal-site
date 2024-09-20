import React from 'react';
import { GitFork, Star, Sun, Moon, } from 'lucide-react';
import { zoneMessages } from '@/utils/zoneMessages';

export interface Command {
  description: string;
  execute: (args: string[], addToOutput: (content: React.ReactNode) => void, state: any) => void;
}

interface CommandMap {
  [key: string]: Command;
}

const commands: CommandMap = {
  help: {
    description: 'Get a list of all available commands',
    execute: (_, addToOutput) => {
      addToOutput(
        <div className="space-y-1">
          <p className="font-bold">Available commands:</p>
          {Object.entries(commands).map(([cmd, { description }]) => (
            <p key={cmd}>
              <span className="text-blue-600 dark:text-blue-400">{cmd}</span>: {description}
            </p>
          ))}
        </div>
      );
    },
  },
  about: {
    description: 'About me',
    execute: (_, addToOutput) => {
      addToOutput(
        <p>I'm a passionate developer who loves creating unique web experiences! Check out my projects and skills for more info.</p>
      );
    },
  },
  skills: {
    description: 'Check out the skills I have',
    execute: (_, addToOutput) => {
      addToOutput(
        <ul className="list-disc list-inside">
          <li>JavaScript</li>
          <li>TypeScript</li>
          <li>React</li>
          <li>Node.js</li>
          <li>Python</li>
          <li>And more!</li>
        </ul
        >)
    },
  },
  projects: {
    description: 'Some of my programming projects',
    execute: (_, addToOutput, state) => {
      addToOutput(
        <div className="space-y-2">
          <p className="font-bold">My top GitHub repositories:</p>
          {state.githubRepos.map((repo: any) => (
            <div key={repo.id} className="flex items-center space-x-2 space-y-2">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:underline"
                style={{ minWidth: '180px', display: 'inline-block' }}
              >
                {repo.name}
              </a>
              <span className="text-gray-500 dark:text-gray-400">
                {repo.description || 'No description'}
              </span>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-500" />
                <span>{repo.stargazers_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitFork size={16} className="text-gray-500" />
                <span>{repo.forks_count}</span>
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
  socials: {
    description: 'My social networks',
    execute: (_, addToOutput) => {
      addToOutput(
        <div className="space-y-1">
          <p>
            <span className="font-bold">GitHub:</span>{' '}
            <a href="https://github.com/trixzyy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              @trixzyy
            </a>
          </p>
          <p>
            <span className="font-bold">Twitter:</span>{' '}
            <a href="https://twitter.com/trixzydev" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              @trixzydev
            </a>
          </p>
          <p>
            <span className="font-bold">Discord:</span>{' '}
            <a href="https://discord.com/users/992171799536218142" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
              @trixzy
            </a>
          </p>
        </div>
      );
    },
  },
  clear: {
    description: 'Clear the terminal',
    execute: (_, addToOutput, state) => {
      state.setOutput([]);
    },
  },
  theme: {
    description: 'Change terminal theme (light/dark)',
    execute: (args, addToOutput, state) => {
      const newTheme = args[0] === 'light' ? 'light' : 'dark';
      state.switchTheme(newTheme);
      addToOutput(
        <p>
          Theme set to {newTheme} <span>{newTheme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}</span>
        </p>
      );
    },
  },
  music: {
    description: 'Display currently playing music',
    execute: (_, addToOutput, state) => {
      if (state.music) {
        addToOutput(
          <div className="space-y-2">
            <p className="font-bold">Now Playing:</p>
            <div className="flex items-center space-x-4">
              <img src={state.albumArt || '/placeholder.svg'} alt="Album Art" className="w-16 h-16 rounded-md" />
              <a href={state.spotifyLink || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                {state.music}
              </a>
            </div>
          </div>
        );
      } else {
        addToOutput(<p>No music is currently playing.</p>);
      }
    },
  },
  date: {
    description: 'Display current date and time',
    execute: (_, addToOutput) => {
      const now = new Date();

      // Get local time and London time as formatted strings
      const londonTime = now.toLocaleString('en-GB', { timeZone: 'Europe/London' });
      const localTime = now.toLocaleString();

      // Get the UTC timestamp for both London and local time zones
      const londonDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
      const localDate = new Date(now.toLocaleString());

      // Calculate the time difference in hours
      const timeDifference = (localDate.getTime() - londonDate.getTime()) / (1000 * 60 * 60); // Difference in hours

      // Message for time difference
      const timeDifferenceMessage = timeDifference === 0
        ? `${zoneMessages[Math.floor(Math.random() * zoneMessages.length)]}`
        : `The time difference is ${Math.abs(timeDifference)} hour(s).`;

      addToOutput(
        <div>
          <p>Current date and time in London: {londonTime}</p>
          <p>Your local date and time: {localTime}</p>
          <p>{timeDifferenceMessage}</p>
        </div>
      );
    },
  },



  welcome: {
    description: 'Display welcome message',
    execute: (_, addToOutput, state) => {
      addToOutput(
        <div className="space-y-2">
          <p>Welcome to TigerLake's terminal!</p>
          <p>Type 'help' to see available commands.</p>
          <p>Current Discord status: {state.discordStatus?.discord_status || 'Loading...'}</p>
        </div>
      );
    },
  },
};

export default commands;