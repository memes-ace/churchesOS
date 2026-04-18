import { useState, useEffect, useCallback } from 'react'

export function useDB(apiObj, localKey) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await apiObj.getAll()
      if (Array.isArray(result)) {
        setData(result)
        try { localStorage.setItem(localKey, JSON.stringify(result)) } catch(e) {}
      }
    } catch(e) {
      console.warn(`API failed for ${localKey}, using localStorage:`, e.message)
      try {
        const cached = localStorage.getItem(localKey)
        if (cached) setData(JSON.parse(cached))
      } catch(le) {}
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [localKey])

  useEffect(() => { load() }, [load])

  const create = useCallback(async (item) => {
    try {
      const saved = await apiObj.create(item)
      setData(prev => [saved, ...prev])
      return saved
    } catch(e) {
      const localItem = { ...item, id: Date.now().toString(), created_at: new Date().toISOString() }
      setData(prev => [localItem, ...prev])
      return localItem
    }
  }, [apiObj])

  const update = useCallback(async (id, item) => {
    try { await apiObj.update(id, item) } catch(e) { console.warn('Update failed:', e.message) }
    setData(prev => prev.map(d => d.id === id ? { ...d, ...item } : d))
  }, [apiObj])

  const remove = useCallback(async (id) => {
    try { await apiObj.delete(id) } catch(e) { console.warn('Delete failed:', e.message) }
    setData(prev => prev.filter(d => d.id !== id))
  }, [apiObj])

  return { data, loading, error, create, update, remove, reload: load }
}
