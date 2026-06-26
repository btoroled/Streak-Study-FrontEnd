import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReviewRating } from '@/types/flashcard.types'

interface SpeechRecognitionAlternativeLike {
  transcript: string
}
interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike
}
interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<SpeechRecognitionResultLike>
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
}

const RATING_BY_PHRASE: Record<string, ReviewRating> = {
  'otra vez': 'AGAIN',
  dificil: 'HARD',
  bien: 'GOOD',
  facil: 'EASY',
}

const DIACRITICS_PATTERN = new RegExp('[\\u0300-\\u036f]', 'g')

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_PATTERN, '')
    .trim()
}

function matchRating(transcript: string): ReviewRating | null {
  const normalized = normalize(transcript)
  for (const [phrase, rating] of Object.entries(RATING_BY_PHRASE)) {
    if (normalized.includes(phrase)) return rating
  }
  return null
}

/** Reconocimiento de voz (Web Speech API) para calificar el repaso sin tocar la pantalla. */
export function useVoiceRating(onRate: (rating: ReviewRating) => void) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  const SpeechRecognitionCtor =
    typeof window !== 'undefined' ? window.SpeechRecognition ?? window.webkitSpeechRecognition : undefined
  const isSupported = !!SpeechRecognitionCtor

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const start = useCallback(() => {
    if (!SpeechRecognitionCtor) return

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'es-PE'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
      const rating = matchRating(transcript)
      if (rating) onRate(rating)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [SpeechRecognitionCtor, onRate])

  useEffect(() => () => recognitionRef.current?.stop(), [])

  return { start, stop, isListening, isSupported }
}
