import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useVoiceRating } from './useVoiceRating'

interface FakeSpeechRecognition {
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

function installFakeSpeechRecognition(): FakeSpeechRecognition {
  const instance: FakeSpeechRecognition = {
    onresult: null,
    onerror: null,
    onend: null,
    start: vi.fn(),
    stop: vi.fn(),
  }
  ;(window as unknown as { SpeechRecognition: new () => FakeSpeechRecognition }).SpeechRecognition =
    vi.fn(function () {
      return instance
    }) as unknown as new () => FakeSpeechRecognition
  return instance
}

function emit(instance: FakeSpeechRecognition, transcript: string) {
  instance.onresult?.({ results: [{ 0: { transcript } }] })
}

describe('useVoiceRating', () => {
  afterEach(() => {
    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition
  })

  it('isSupported es false si el navegador no tiene Web Speech API', () => {
    const { result } = renderHook(() => useVoiceRating(vi.fn()))
    expect(result.current.isSupported).toBe(false)
  })

  it('mapea "bien" a GOOD ignorando mayúsculas y tildes', () => {
    const instance = installFakeSpeechRecognition()
    const onRate = vi.fn()
    const { result } = renderHook(() => useVoiceRating(onRate))

    expect(result.current.isSupported).toBe(true)

    act(() => result.current.start())
    act(() => emit(instance, 'Bien'))

    expect(onRate).toHaveBeenCalledWith('GOOD')
  })

  it('mapea "otra vez", "dificil" y "facil" a sus ratings', () => {
    const instance = installFakeSpeechRecognition()
    const onRate = vi.fn()
    const { result } = renderHook(() => useVoiceRating(onRate))

    act(() => result.current.start())
    act(() => emit(instance, 'otra vez'))
    expect(onRate).toHaveBeenLastCalledWith('AGAIN')

    act(() => result.current.start())
    act(() => emit(instance, 'difícil'))
    expect(onRate).toHaveBeenLastCalledWith('HARD')

    act(() => result.current.start())
    act(() => emit(instance, 'fácil'))
    expect(onRate).toHaveBeenLastCalledWith('EASY')
  })

  it('no llama a onRate si no reconoce ninguna palabra clave', () => {
    const instance = installFakeSpeechRecognition()
    const onRate = vi.fn()
    const { result } = renderHook(() => useVoiceRating(onRate))

    act(() => result.current.start())
    act(() => emit(instance, 'no entendí nada de esto'))

    expect(onRate).not.toHaveBeenCalled()
  })
})
