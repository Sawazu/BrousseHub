import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

export function CraftIcon(props: IconProps) { return <IconBase {...props}><path d="M4 19h16" /><path d="M6.5 16.5 17 6l1 1-10.5 10.5z" /><path d="m14.5 5.5 1.5-1.5 4 4-1.5 1.5" /></IconBase> }
export function TrackerIcon(props: IconProps) { return <IconBase {...props}><path d="M5 19V9" /><path d="M12 19V5" /><path d="M19 19v-7" /><path d="M3 19h18" /></IconBase> }
export function MarginIcon(props: IconProps) { return <IconBase {...props}><path d="M4 17 9 12l4 3 7-8" /><path d="M15 7h5v5" /></IconBase> }
export function StuffIcon(props: IconProps) { return <IconBase {...props}><path d="M8 4h8l2 4v12H6V8z" /><path d="M6 8h12" /><path d="M9 4v4" /><path d="M15 4v4" /></IconBase> }
export function ProfessionIcon(props: IconProps) { return <IconBase {...props}><path d="M4 20h16" /><path d="M7 20v-9h10v9" /><path d="M9 11V7h6v4" /><path d="M10 15h4" /></IconBase> }
export function HomeIcon(props: IconProps) { return <IconBase {...props}><path d="m4 11 8-7 8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-6h4v6" /></IconBase> }
export function PlusIcon(props: IconProps) { return <IconBase {...props}><path d="M12 5v14" /><path d="M5 12h14" /></IconBase> }
export function TrashIcon(props: IconProps) { return <IconBase {...props}><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="m7 7 1 13h8l1-13" /></IconBase> }
export function SaveIcon(props: IconProps) { return <IconBase {...props}><path d="M5 4h12l2 2v14H5z" /><path d="M8 4v6h8V4" /><path d="M8 20v-6h8v6" /></IconBase> }
export function LoadIcon(props: IconProps) { return <IconBase {...props}><path d="M12 4v11" /><path d="m8 11 4 4 4-4" /><path d="M5 19h14" /></IconBase> }
export function ArrowIcon(props: IconProps) { return <IconBase {...props}><path d="M5 12h14" /><path d="m15 8 4 4-4 4" /></IconBase> }
export function SyncIcon(props: IconProps) { return <IconBase {...props}><path d="M20 7h-5V2" /><path d="M4 17h5v5" /><path d="M5.5 9a7 7 0 0 1 11.8-3L20 7" /><path d="M18.5 15a7 7 0 0 1-11.8 3L4 17" /></IconBase> }
export function UndoIcon(props: IconProps) { return <IconBase {...props}><path d="M9 7 5 11l4 4" /><path d="M5 11h8a6 6 0 0 1 6 6" /></IconBase> }
export function ResetIcon(props: IconProps) { return <IconBase {...props}><path d="M5 7v5h5" /><path d="M5.5 12a7 7 0 1 0 2-5" /></IconBase> }
