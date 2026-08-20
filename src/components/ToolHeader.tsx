import type { ReactNode } from 'react'

type ToolHeaderProps = {
  title: string
  description: string
  actions?: ReactNode
}

export function ToolHeader({ title, description, actions }: ToolHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-copy">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  )
}
