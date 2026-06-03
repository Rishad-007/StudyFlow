import { useState, useEffect, useRef, useCallback } from 'react'

export interface SoundOption {
  id: string
  label: string
  emoji: string
  url: string
}

export const SOUND_OPTIONS: SoundOption[] = [
  { id: 'rain', label: 'Rain', emoji: '🌧️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'ocean', label: 'Ocean Waves', emoji: '🌊', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'fireplace', label: 'Fireplace', emoji: '🔥', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'forest', label: 'Forest Birds', emoji: '🌳', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'whitenoise', label: 'White Noise', emoji: '🤍', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 'deepfocus', label: 'Deep Focus', emoji: '🧘', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 'cafe', label: 'Cafe', emoji: '☕', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
]

const VOLUME_KEY = 'studyflow-ambient-volume'
const SOUND_KEY = 'studyflow-ambient-sound'

export function useAmbientSound() {
  const [currentSound, setCurrentSound] = useState<string | null>(() => localStorage.getItem(SOUND_KEY))
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem(VOLUME_KEY)
    return saved ? Number(saved) : 0.3
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
  }, [])

  const play = useCallback((soundId: string | null) => {
    stop()
    if (!soundId) {
      setCurrentSound(null)
      localStorage.removeItem(SOUND_KEY)
      return
    }

    const option = SOUND_OPTIONS.find((o) => o.id === soundId)
    if (!option) return

    const audio = new Audio(option.url)
    audio.loop = true
    audio.volume = localStorage.getItem(VOLUME_KEY) ? Number(localStorage.getItem(VOLUME_KEY)) : 0.3
    audio.play().catch(() => {})
    audioRef.current = audio
    setCurrentSound(soundId)
    setIsPlaying(true)
    localStorage.setItem(SOUND_KEY, soundId)
  }, [stop])

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol)
    localStorage.setItem(VOLUME_KEY, String(vol))
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
  }, [])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return { currentSound, volume, isPlaying, play, stop, setVolume }
}
