import React from 'react';

export interface Command {
  description: string;
  execute: (args: string[], addToOutput: (content: React.ReactNode) => void) => void;
}

interface CommandMap {
  [key: string]: Command;
}

const commands: CommandMap = {
  help: {
    description: 'Get a list of all available commands',
    execute: (_, addToOutput) => {
      addToOutput(Object.entries(commands).map(([cmd, { description }]) => `${cmd}: ${description}`).join('\n'));
    },
  },
  about: {
    description: 'About me',
    execute: (_, addToOutput) => {
      addToOutput("I'm a passionate developer who loves creating unique web experiences!");
    },
  },
  skills: {
    description: 'Check out the skills I have',
    execute: (_, addToOutput) => {
      addToOutput('JavaScript, TypeScript, React, Node.js, Python, and more!');
    },
  },
  projects: {
    description: 'Some of my programming projects',
    execute: (_, addToOutput) => {
      addToOutput('1. add a cool feature\n2. that uses an api\n3. to show my repos');
    },
  },
  socials: {
    description: 'My social networks',
    execute: (_, addToOutput) => {
      // This should be handled in the main component where we have access to the social links
    },
  },
  clear: {
    description: 'Clear the terminal',
    execute: (_, addToOutput) => {
      // This command should be handled in the main component
    },
  },
  theme: {
    description: 'Change terminal theme (light/dark)',
    execute: (args, addToOutput) => {
      const newTheme = args[0] === 'light' ? 'light' : 'dark';
      addToOutput(`Theme set to ${newTheme}`);
      // The actual theme change should be handled in the main component
    },
  },
  music: {
    description: 'Display currently playing music',
    execute: (_, addToOutput) => {
      // This should be handled in the main component where we have access to the music state
    },
  },
  ascii: {
    description: 'Toggle ASCII art',
    execute: (_, addToOutput) => {
      // This should be handled in the main component
    },
  },
  echo: {
    description: 'Echo a message',
    execute: (args, addToOutput) => {
      addToOutput(args.join(' '));
    },
  },
  date: {
    description: 'Display current date and time',
    execute: (_, addToOutput) => {
      // This should be handled in the main component where we have access to necessary functions
    },
  },
  welcome: {
    description: 'Display welcome message',
    execute: (_, addToOutput) => {
      // This should be handled in the main component where we have access to necessary states
    },
  },
};

export default commands;