'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useThemeSwitcher } from '@/hooks/useThemeSwitcher'
import { useDiscordStatus } from '@/hooks/useDiscordStatus'
import { ASCII_CAT_FRAMES, ASCII_LOGO } from '@/utils/asciiArt'
import commands from '@/utils/commands'
import { Music, Sun, Moon, Github, X, CircleUser, Linkedin, CircleCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function TerminalWebsite() {
  const { discordStatus, music, spotifyLink, albumArt, startTimestamp, endTimestamp } = useDiscordStatus()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<React.ReactNode[]>([])
  const [currentFrame, setCurrentFrame] = useState(0)
  const [githubRepos, setGithubRepos] = useState([])
  const [progress, setProgress] = useState(0)
  const { theme, switchTheme } = useThemeSwitcher()
  const terminalRef = useRef<HTMLDivElement>(null)

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
      const response = await fetch('https://api.github.com/users/trixzyy/repos?sort=stars&per_page=3')
      const data = await response.json()
      setGithubRepos(data)
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">TigerLake Terminal</h1>
          <div className="flex items-center space-x-4">
            <span>{new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</span>
            <button
              onClick={() => switchTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle>Terminal</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={terminalRef} className="h-[400px] overflow-y-auto mb-4">
                <pre className="text-xs sm:text-sm whitespace-pre-wrap mb-4">
                  {ASCII_CAT_FRAMES[currentFrame]}
                  {ASCII_LOGO}
                </pre>
                <div className="space-y-2">
                  {output.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">{line}</div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleSubmit} className="flex items-center">
                <span className="mr-2 text-blue-600 dark:text-blue-400">visitor@tigerlake.xyz:~$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow bg-transparent focus:outline-none"
                  autoFocus
                />
              </form>
            </CardContent>
          </Card>

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
                  <Progress value={progress} className="w-full" />
                </div>
              ) : (
                <p>No music playing</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discord Presence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <img
                  src={discordStatus?.avatar_url || '/placeholder.svg'}
                  alt="Discord Avatar"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-semibold">{discordStatus?.username || 'Unknown User'}</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      discordStatus?.discord_status === 'online' ? 'bg-green-500' :
                      discordStatus?.discord_status === 'idle' ? 'bg-yellow-500' :
                      discordStatus?.discord_status === 'dnd' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span>{discordStatus?.discord_status || 'Offline'}</span>
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

          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>GitHub Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {githubRepos.map((repo: any) => (
                  <div key={repo.id} className="border p-4 rounded-lg">
                    <h3 className="font-semibold">{repo.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{repo.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{repo.language}</span>
                      <span className="text-xs">⭐ {repo.stargazers_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <a href="https://github.com/trixzyy" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <Github size={24} />
                </a>
                <a href="https://twitter.com/trixzydev" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <X size={24} />
                </a>
                <a href="https://discord.com/users/992171799536218142" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <CircleUser size={24} />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}