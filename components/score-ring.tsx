"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

interface ScoreTheme {
  start: string;
  end: string;
  glow: string;
  trackColor: string;
  label: string;
  labelBg: string;
  labelText: string;
}

function getScoreTheme(score: number): ScoreTheme {
  if (score >= 80)
    return {
      start: "#10b981",
      end: "#059669",
      glow: "rgba(16,185,129,0.35)",
      trackColor: "#d1fae5",
      label: "Excellent",
      labelBg: "bg-emerald-50 border-emerald-200",
      labelText: "text-emerald-700",
    };
  if (score >= 60)
    return {
      start: "#a855f7",
      end: "#6366f1",
      glow: "rgba(139,92,246,0.35)",
      trackColor: "#ede9fe",
      label: "Good",
      labelBg: "bg-purple-50 border-purple-200",
      labelText: "text-purple-700",
    };
  if (score >= 40)
    return {
      start: "#f59e0b",
      end: "#ea580c",
      glow: "rgba(245,158,11,0.35)",
      trackColor: "#fef3c7",
      label: "Fair",
      labelBg: "bg-amber-50 border-amber-200",
      labelText: "text-amber-700",
    };
  return {
    start: "#ef4444",
    end: "#e11d48",
    glow: "rgba(239,68,68,0.35)",
    trackColor: "#fee2e2",
    label: "Low",
    labelBg: "bg-red-50 border-red-200",
    labelText: "text-red-700",
  };
}

export function ScoreRing({
  score,
  size = 160,
  strokeWidth = 14,
  className,
}: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const theme = getScoreTheme(score);
  const cx = size / 2;
  const cy = size / 2;
  const gradId = `sg-${score}`;

  // Angle where the arc ends (in degrees, from top going clockwise)
  const angleDeg = (score / 100) * 360 - 90; // -90 because arc starts at top
  const angleRad = (angleDeg * Math.PI) / 180;
  const dotX = cx + radius * Math.cos(angleRad);
  const dotY = cy + radius * Math.sin(angleRad);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.style.setProperty("--dash-total", `${circumference}`);
    circle.style.setProperty("--dash-offset", `${offset}`);
  }, [circumference, offset]);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Ambient glow behind ring */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ background: `radial-gradient(circle at center, ${theme.glow}, transparent 70%)` }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <defs>
            {/* Gradient that follows roughly the arc */}
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.start} />
              <stop offset="100%" stopColor={theme.end} />
            </linearGradient>

            {/* Soft shadow filter for the arc */}
            <filter id={`glow-${score}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={theme.trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <circle
            ref={circleRef}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className="score-ring-track"
            style={
              {
                "--dash-total": circumference,
                "--dash-offset": offset,
                filter: `drop-shadow(0 0 6px ${theme.glow})`,
              } as React.CSSProperties
            }
          />

          {/* Glowing end-cap dot */}
          {score > 2 && (
            <circle
              cx={dotX}
              cy={dotY}
              r={strokeWidth / 2 - 1}
              fill={theme.end}
              style={{ filter: `drop-shadow(0 0 5px ${theme.glow})` }}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold tabular-nums leading-none font-display"
            style={{ color: theme.start }}
          >
            {score}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground mt-0.5 tracking-widest">
            / 100
          </span>
        </div>
      </div>

      {/* Label badge */}
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border",
          theme.labelBg,
          theme.labelText
        )}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: theme.start }}
        />
        {theme.label} Match
      </span>
    </div>
  );
}
