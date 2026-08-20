import { useState } from 'react'
import type { ToolSave } from '../hooks/useToolSaves'
import { LoadIcon, SaveIcon, TrashIcon } from './icons'

type SaveBarProps<T> = {
  saves: ToolSave<T>[]
  onSave: (name: string) => void
  onLoad: (state: T) => void
  onDelete: (id: string) => void
  defaultName?: string
}

export function SaveBar<T>({ saves, onSave, onLoad, onDelete, defaultName = '' }: SaveBarProps<T>) {
  const [name, setName] = useState(defaultName)

  function handleSave() {
    const cleanName = name.trim()
    if (!cleanName) return
    onSave(cleanName)
    setName('')
  }

  return (
    <div>
      <div className="save-bar">
        <input className="input save-name" value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') handleSave() }} placeholder="Nom de la sauvegarde" aria-label="Nom de la sauvegarde" />
        <button className="btn btn-primary" type="button" disabled={!name.trim()} onClick={handleSave}><SaveIcon /> Sauvegarder</button>
      </div>

      {saves.length ? (
        <div className="saved-list">
          {saves.slice(0, 8).map((save) => (
            <div className="saved-row" key={save.id}>
              <div className="saved-row-copy">
                <span className="saved-row-name">{save.name}</span>
                <span className="saved-row-date">Mis à jour le {new Date(save.updatedAt).toLocaleString('fr-FR')}</span>
              </div>
              <div className="saved-row-actions">
                <button className="btn btn-ghost btn-icon" type="button" aria-label={`Charger ${save.name}`} onClick={() => onLoad(save.state)}><LoadIcon /></button>
                <button className="btn btn-danger btn-icon" type="button" aria-label={`Supprimer ${save.name}`} onClick={() => onDelete(save.id)}><TrashIcon /></button>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="empty-inline">Aucune sauvegarde pour cet outil.</p>}
    </div>
  )
}
