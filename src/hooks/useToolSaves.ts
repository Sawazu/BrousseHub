import { useCallback, useMemo, useState } from 'react'

const STORAGE_PREFIX = 'broussehub'
const STORAGE_VERSION = 1

export type ToolSave<T> = {
  id: string
  name: string
  updatedAt: string
  state: T
}

type StoredEnvelope<T> = {
  version: number
  saves: ToolSave<T>[]
}

function storageKey(toolId: string) {
  return `${STORAGE_PREFIX}:v${STORAGE_VERSION}:${toolId}`
}

export function readToolSaves<T>(toolId: string): ToolSave<T>[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(storageKey(toolId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredEnvelope<T>
    if (parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.saves)) return []
    return parsed.saves
  } catch {
    return []
  }
}

function writeSaves<T>(toolId: string, saves: ToolSave<T>[]) {
  const envelope: StoredEnvelope<T> = { version: STORAGE_VERSION, saves }
  window.localStorage.setItem(storageKey(toolId), JSON.stringify(envelope))
}

export function useToolSaves<T>(toolId: string) {
  const [saves, setSaves] = useState<ToolSave<T>[]>(() => readToolSaves<T>(toolId))

  const save = useCallback((name: string, state: T) => {
    const cleanName = name.trim()
    if (!cleanName) return
    setSaves((current) => {
      const now = new Date().toISOString()
      const existing = current.find((entry) => entry.name.toLocaleLowerCase('fr') === cleanName.toLocaleLowerCase('fr'))
      const next = existing
        ? current.map((entry) => entry.id === existing.id ? { ...entry, name: cleanName, updatedAt: now, state } : entry)
        : [{ id: crypto.randomUUID(), name: cleanName, updatedAt: now, state }, ...current]
      writeSaves(toolId, next)
      return next
    })
  }, [toolId])

  const remove = useCallback((id: string) => {
    setSaves((current) => {
      const next = current.filter((entry) => entry.id !== id)
      writeSaves(toolId, next)
      return next
    })
  }, [toolId])

  const orderedSaves = useMemo(() => [...saves].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [saves])
  return { saves: orderedSaves, save, remove }
}
