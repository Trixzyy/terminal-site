'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useThemeSwitcher } from '@/hooks/useThemeSwitcher'
import { useDiscordStatus } from '@/hooks/useDiscordStatus'
import { ASCII_CAT_FRAMES, ASCII_LOGO } from '@/utils/asciiArt'
import commands from '@/utils/commands'
import { Music, Sun, Moon, Github, Twitter, Linkedin, Package2Icon, CircleUser, CircleCheck, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from 'framer-motion'

export default function TerminalWebsite() {
const { username, avatar, discordStatus, music, spotifyLink, albumArt, startTimestamp, endTimestamp } = useDiscordStatus()
const [input, setInput] = useState('')
const [output, setOutput] = useState<React.ReactNode[]>([])
const [currentFrame, setCurrentFrame] = useState(0)
const [githubRepos, setGithubRepos] = useState([])
const [progress, setProgress] = useState(0)
const { theme, switchTheme } = useThemeSwitcher()
const terminalRef = useRef<HTMLDivElement>(null)
const [dateString, setDateString] = useState('');

useEffect(() => {
  setDateString(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }));
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentFrame((prevFrame) => (prevFrame + 1) % ASCII_CAT_FRAMES.length)
  }, 1000)
  return () => clearInterval(interval)
}, [])

useEffect(() => {
  fetchGithubRepos()
}, [])

useEffect(() => {
  if (startTimestamp && endTimestamp) {
    const updateProgress = () => {
      const now = Date.now()
      const total = endTimestamp - startTimestamp
      const current = now - startTimestamp
      setProgress(Math.min((current / total) * 100, 100))
    }

    const intervalId = setInterval(updateProgress, 1000)
    return () => clearInterval(intervalId)
  }
}, [startTimestamp, endTimestamp])

const fetchGithubRepos = async () => {
  try {
    const response = await fetch('https://api.github.com/users/trixzyy/repos?sort=stars&per_page=100')
    const data = await response.json()
    const topRepos = data
      .filter((repo: any) => !repo.fork)
      .sort((a:any, b:any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
    setGithubRepos(topRepos)
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
  }
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const trimmedInput = input.trim()
  if (trimmedInput) {
    addToOutput(
      <span>
        <span className='text-blue-600 dark:text-blue-400'>visitor@tigerlake.xyz:~$ </span>
        <span>{trimmedInput}</span>
      </span>
    )
    handleCommand(trimmedInput)
  }
  setInput('')
}

const handleCommand = (command: string) => {
  const [cmd, ...args] = command.toLowerCase().split(' ')
  if (cmd in commands) {
    commands[cmd].execute(args, addToOutput)
  } else if (cmd === 'socials') {
    addToOutput(
      <>
        GitHub: <a href="https://github.com/trixzyy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/trixzyy</a>
        <br />
        Twitter: <a href="https://twitter.com/trixzydev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@trixzydev</a>
        <br />
        Discord: <a href="https://discord.com/users/992171799536218142" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@trixzy</a>
      </>
    )
  } else {
    addToOutput(`Command not found: ${cmd}. Type 'help' for a list of commands.`)
  }
}

const addToOutput = (content: React.ReactNode) => {
  setOutput((prev) => [...prev, content])
  if (terminalRef.current) {
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

return (
  <motion.div 
    className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono transition-colors duration-300"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <nav className="sticky top-0 bg-white dark:bg-gray-900 shadow-md z-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <span className="text-xl font-bold">TigerLake</span>
          </div>
          <div className="flex items-center justify-end md:flex-1 lg:w-0">
            <span className="hidden md:block mr-4">{dateString}</span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                discordStatus?.discord_status === 'online' ? 'bg-green-500' :
                discordStatus?.discord_status === 'idle' ? 'bg-yellow-500' :
                discordStatus?.discord_status === 'dnd' ? 'bg-red-500' :
                'bg-gray-500'
              }`}></div>
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

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card>
            <CardHeader>
              <CardTitle>Terminal</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={terminalRef} className="h-[400px] overflow-y-auto mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono">
                <div className="flex space-x-4 mb-4">
                  <pre className="text-xs sm:text-sm whitespace-pre-wrap hidden md:block">
                    {ASCII_CAT_FRAMES[currentFrame]}
                  </pre>
                  <pre className="hidden md:block text-xs sm:text-sm whitespace-pre-wrap">
                    {ASCII_LOGO}
                  </pre>
                </div>
                <div className="space-y-2">
                  {output.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">{line}</div>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="flex items-center mt-2">
                  <span className="mr-2 text-blue-600 dark:text-blue-400">visitor@tigerlake.xyz:~$</span>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow bg-transparent focus:outline-none"
                    autoFocus
                  />
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Discord Presence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Discord Avatar"
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                  )}
                  <div>
                    <p className="font-semibold">{discordStatus?.username || 'Trixzy'}</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        discordStatus?.discord_status === 'online' ? 'bg-green-500' :
                        discordStatus?.discord_status === 'idle' ? 'bg-yellow-500' :
                        discordStatus?.discord_status === 'dnd' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span>{discordStatus?.discord_status || 'Loading...'}</span>
                    </div>
                    {discordStatus?.activities && discordStatus.activities[0] && (
                      <p className="text-sm mt-2">
                        {discordStatus.activities[0].type === 0 ? 'Playing' : 'Doing'}: {discordStatus.activities[0].name}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Spotify</CardTitle>
              </CardHeader>
              <CardContent>
                {music ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img src={albumArt || '/placeholder.svg'} alt="Album Art" className="w-16 h-16 rounded-md" />
                      <div>
                        <p className="font-semibold">Now Playing:</p>
                        <a href={spotifyLink || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                          {music}
                        </a>
                      </div>
                    </div>
                    <Progress value={progress} />
                  </div>
                ) : (
                  <p>No music playing</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="lg:col-span-3">
        <Card>
            <CardHeader>
              <CardTitle>GitHub Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {githubRepos.map((repo: any) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border p-4 rounded-lg hover:shadow-md transition-shadow duration-300 dark:hover:shadow-lg"
                  >
                    <h3 className="font-semibold">{repo.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {repo.description ? (repo.description.length > 75 ? repo.description.substring(0, 75) + '...' : repo.description) : 'No description'}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{repo.language}</span>
                      <span className="text-xs">⭐ {repo.stargazers_count}</span>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.a
                  href="https://github.com/trixzyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={32} className="mr-4" />
                  <div>
                    <p className="font-semibold">GitHub</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@trixzyy</p>
                  </div>
                </motion.a>
                <motion.a
                  href="https://twitter.com/trixzydev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Twitter size={32} className="mr-4" />
                  <div>
                    <p className="font-semibold">Twitter</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@trixzydev</p>
                  </div>
                </motion.a>
                <motion.a
                  href="https://discord.com/users/992171799536218142"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CircleUser size={32} className="mr-4" />
                  <div>
                    <p className="font-semibold">Discord</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@trixzy</p>
                  </div>
                </motion.a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>

    <footer className="bg-white dark:bg-gray-900 shadow-md mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left mb-4 md:mb-0">
            © {new Date().getFullYear()} TigerLake. All rights reserved.
          </p>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Built with React, Next.js, and a lot of ☕
        </div>
        </div>
      </div>
    </footer>
  </motion.div>
)
}