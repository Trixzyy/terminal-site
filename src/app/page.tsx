"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useThemeSwitcher } from '@/hooks/useThemeSwitcher'
import { useDiscordStatus } from '@/hooks/useDiscordStatus'
import { ASCII_CAT_FRAMES, ASCII_LOGO } from '@/utils/asciiArt'
import commands from '@/utils/commands'
import { Music, Sun, Moon, Calendar, Github, Twitter, Linkedin, Terminal, MessageSquare, FolderOpen, Settings, Power, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Draggable from 'react-draggable'

const DESKTOP_ICONS = [
  { name: 'Terminal', icon: Terminal },
  { name: 'Calendar', icon: Calendar },
  { name: 'Music', icon: Music },
  { name: 'Messages', icon: MessageSquare },
  { name: 'Files', icon: FolderOpen },
]

export default function WindowsDesktop() {
  const { discordStatus, music, spotifyLink, albumCover } = useDiscordStatus()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<React.ReactNode[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showAscii, setShowAscii] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeWindows, setActiveWindows] = useState<string[]>([])
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [lastPlayedSong, setLastPlayedSong] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ text: string; sent: boolean }[]>([])
  const [messageInput, setMessageInput] = useState('')

  const { theme, switchTheme } = useThemeSwitcher()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [output])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (music && music !== lastPlayedSong) {
      setLastPlayedSong(music)
    }
  }, [music])

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
      setHistory((prev) => [...prev, trimmedInput])
      setHistoryIndex(-1)
    }
    setInput('')
  }

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.toLowerCase().split(' ')
    if (cmd in commands) {
      if (cmd === 'clear' || cmd === 'cls') {
        setOutput([])
      } else if (cmd === 'theme') {
        const newTheme = args[0] === 'light' ? 'light' : 'dark'
        switchTheme(newTheme)
        commands[cmd].execute(args, addToOutput)
      } else if (cmd === 'music') {
        addToOutput(music ?
          <>
            <a href={spotifyLink || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Now playing: {music}
            </a>
          </>
          : 'No music playing')
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
      } else if (cmd === 'ascii') {
        setShowAscii((prev) => !prev)
        addToOutput(`ASCII art ${showAscii ? 'hidden' : 'shown'}`)
      } else if (cmd === 'date') {
        handleDateCommand()
      } else if (cmd === 'welcome') {
        handleWelcomeCommand()
      } else {
        commands[cmd].execute(args, addToOutput)
      }
    } else {
      addToOutput(`Command not found: ${cmd}. Type 'help' for a list of commands.`)
    }
  }

  const addToOutput = (content: React.ReactNode) => {
    setOutput((prev) => [...prev, content])
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
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
      case 'offline': return 'Offline'
      case 'online': return 'Online'
      case 'idle': return 'Idle'
      case 'dnd': return 'Do Not Disturb'
      default: return 'Loading...'
    }
  }

  const getDiscordStatusColor = () => {
    switch (discordStatus?.discord_status) {
      case 'offline': return 'bg-gray-500'
      case 'online': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'dnd': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const currentLondonTime = () => {
    return currentTime.toLocaleString('en-GB', { timeZone: 'Europe/London', hour12: false })
  }

  const handleDateCommand = () => {
    const userTime = new Date()
    const londonTime = new Date(currentTime.toLocaleString('en-GB', { timeZone: 'Europe/London' }))
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timeDifference = (londonTime.getTime() - userTime.getTime()) / (1000 * 60) // difference in minutes

    let timeDifferenceMessage = ''
    if (Math.abs(timeDifference) < 1) {
      timeDifferenceMessage = "We're on the same clock!"
    } else {
      const absDifference = Math.abs(timeDifference)
      const hours = Math.floor(absDifference / 60)
      const minutes = Math.round(absDifference % 60)
      const hourText = hours === 1 ? 'hour' : 'hours'
      const minuteText = minutes === 1 ? 'minute' : 'minutes'
      const timeText = hours > 0 ? `${hours} ${hourText}` : ''
      const minuteTextFinal = minutes > 0 ? `${minutes} ${minuteText}` : ''
      const separator = hours > 0 && minutes > 0 ? ' and ' : ''

      if (timeDifference > 0) {
        timeDifferenceMessage = `We're ${timeText}${separator}${minuteTextFinal} ahead of you in the UK.`
      } else {
        timeDifferenceMessage = `We're ${timeText}${separator}${minuteTextFinal} behind you in the UK.`
      }
    }

    addToOutput(`It's currently ${londonTime.toLocaleString('en-GB', { hour12: false })} for me in the UK.\nYour time: ${userTime.toLocaleString(undefined, { hour12: false })}\nYour timezone: ${userTimeZone}\n${timeDifferenceMessage}`)
  }

  const handleWelcomeCommand = () => {
    addToOutput(
      <>
        Welcome to my terminal!
        <br />
        My current status is {getDiscordStatusText()} on Discord.
        <br />
        Contact: zac@tigerlake.xyz or @trixzy on Discord.
      </>
    )
  }

  const [currentFrame, setCurrentFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % ASCII_CAT_FRAMES.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleWindow = (windowName: string) => {
    setActiveWindows((prev) => 
      prev.includes(windowName) 
        ? prev.filter(w => w !== windowName)
        : [...prev, windowName]
    )
  }

  const renderCalendar = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center p-1"></div>)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div 
          key={i} 
          className={`text-center p-1 ${i === today.getDate() ? 'bg-blue-500 text-white rounded-full' : ''}`}
        >
          {i}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
        {days}
      </div>
    )
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages(prev => [...prev, { text: messageInput, sent: true }])
      setMessageInput('')
      // Simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Thanks for your message! I'll get back to you soon.", sent: false }])
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-[url('/windows-background.jpg')] bg-cover bg-center text-gray-800 dark:text-gray-200 font-sans overflow-hidden">
      {/* Desktop */}
      <div className="p-4 grid grid-cols-6 gap-4 h-[calc(100vh-40px)]">
        {DESKTOP_ICONS.map((icon) => (
          <Button
            key={icon.name}
            variant="ghost"
            className="h-24 w-24 flex flex-col items-center justify-center text-white hover:bg-white/10"
            onClick={() => toggleWindow(icon.name)}
          >
            <icon.icon size={32} />
            <span className="mt-2 text-xs">{icon.name}</span>
          </Button>
        ))}
      </div>

      {/* Windows */}
      {activeWindows.includes('Terminal') && (
        <Draggable handle=".window-header">
          <Card className="absolute top-10 left-10 w-[600px] h-[400px] shadow-lg">
            <CardHeader className="window-header cursor-move">
              <CardTitle className="flex items-center">
                <Terminal className="mr-2" size={18} />
                Terminal
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toggleWindow('Terminal')}>
                  <X size={18} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[320px] w-full pr-4">
                {showAscii && (
                  <div className="flex space-x-4 mb-4 overflow-x-auto">
                    <pre className="text-xs whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                      {ASCII_CAT_FRAMES[currentFrame]}
                    </pre>
                    <pre className="text-xs whitespace-pre-wrap text-gray-600 dark:text-gray-400">
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
              </ScrollArea>
            </CardContent>
          </Card>
        </Draggable>
      )}

      {activeWindows.includes('Calendar') && (
        <Draggable handle=".window-header">
          <Card className="absolute top-20 left-20 w-[300px] shadow-lg">
            <CardHeader className="window-header cursor-move">
              <CardTitle className="flex items-center">
                <Calendar className="mr-2" size={18} />
                Calendar
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toggleWindow('Calendar')}>
                  <X size={18} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-2">
                {currentTime.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
              {renderCalendar()}
            </CardContent>
          </Card>
        </Draggable>
      )}

      {activeWindows.includes('Music') && (
        <Draggable handle=".window-header">
          <Card className="absolute top-30 left-30 w-[350px] shadow-lg">
            <CardHeader className="window-header cursor-move">
              <CardTitle className="flex items-center">
                <Music className="mr-2" size={18} />
                Music Player
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toggleWindow('Music')}>
                  <X size={18} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {music ? (
                <div className="flex items-center space-x-4">
                  <img src={albumCover || ''} alt="Album cover" className="w-16 h-16 rounded" />
                  <div>
                    <p className="font-semibold">Now Playing:</p>
                    <a href={spotifyLink || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {music}
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <p>No music playing</p>
                  {lastPlayedSong && (
                    <p className="mt-2">Last played: {lastPlayedSong}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </Draggable>
      )}

      {activeWindows.includes('Messages') && (
        <Draggable handle=".window-header">
          <Card className="absolute top-40 left-40 w-[350px] h-[400px] shadow-lg">
            <CardHeader className="window-header cursor-move">
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2" size={18} />
                Messages
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toggleWindow('Messages')}>
                  <X size={18} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[320px] flex flex-col">
              <ScrollArea className="flex-grow mb-4">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-2 ${message.sent ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded-lg ${message.sent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                      {message.text}
                    </span>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-grow mr-2"
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </Draggable>
      )}

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm text-white h-10 flex items-center px-4">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4"
          onClick={() => setStartMenuOpen(!startMenuOpen)}
        >
          <FolderOpen size={20} />
          <span className="ml-2">Start</span>
        </Button>
        <div className="flex-grow flex space-x-2">
          {activeWindows.map(window => (
            <Button key={window} variant="ghost" size="sm" onClick={() => toggleWindow(window)}>
              {window}
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getDiscordStatusColor()}`}></div>
            <span className="text-xs">{getDiscordStatusText()}</span>
          </div>
          <span className="text-xs">{currentLondonTime()}</span>
          <Button variant="ghost" size="sm" onClick={() => switchTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </div>

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="absolute bottom-10 left-0 w-64 bg-gray-800/95 backdrop-blur-sm text-white rounded-tr-lg shadow-lg">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Start Menu</h2>
            <ul className="space-y-2">
              {DESKTOP_ICONS.map((icon) => (
                <li key={icon.name}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      toggleWindow(icon.name)
                      setStartMenuOpen(false)
                    }}
                  >
                    <icon.icon size={18} className="mr-2" />
                    {icon.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-gray-700 p-4">
            <Button variant="ghost" className="w-full justify-start" onClick={() => toggleWindow('Settings')}>
              <Settings size={18} className="mr-2" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-400">
              <Power size={18} className="mr-2" />
              Shut Down
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}