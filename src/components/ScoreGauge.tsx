export default function ScoreGauge({
  value,
  label,
  size = 120,
}: {
  value: number
  label: string
  size?: number
}) {
  const radius = size / 2 - 8
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const offset = circumference - (clamped / 100) * circumference

  const color = clamped >= 70 ? '#F0A94E' : clamped >= 40 ? '#C77A1C' : '#8891A5'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#252C3F"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          className="fill-mist-100 font-mono text-2xl font-semibold"
        >
          {Math.round(clamped)}
        </text>
      </svg>
      <p className="text-center text-xs uppercase tracking-widest text-mist-400">
        {label}
      </p>
    </div>
  )
}
