type MetricProps = {
  label: string
  value: string
  detail?: string
  tone?: 'default' | 'positive' | 'negative'
}

export function Metric({ label, value, detail, tone = 'default' }: MetricProps) {
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <strong className={`metric-value ${tone === 'default' ? '' : tone}`}>{value}</strong>
      {detail ? <span className="metric-detail">{detail}</span> : null}
    </div>
  )
}
