"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "hsl(142, 71%, 45%)";
  if (score >= 60) return "hsl(221, 83%, 53%)";
  if (score >= 40) return "hsl(38, 92%, 50%)";
  return "hsl(0, 84%, 60%)";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Low";
}

export function ScoreRing({
  score,
  size = 180,
  strokeWidth = 14,
  className,
}: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.style.setProperty("--dash-total", `${circumference}`);
    circle.style.setProperty("--dash-offset", `${offset}`);
  }, [circumference, offset]);

  return (
    <div className={cn("relative flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="hsl(215, 20%, 88%)"
            strokeWidth={strokeWidth}
          />
          {/* Animated fill */}
          <circle
            ref={circleRef}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className="score-ring-track"
            style={
              {
                "--dash-total": circumference,
                "--dash-offset": offset,
              } as React.CSSProperties
            }
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span
            className="text-4xl font-bold font-display tabular-nums leading-none"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            / 100
          </span>
        </div>
      </div>

      <span
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{
          color,
          background: `${color}18`,
          border: `1px solid ${color}30`,
        }}
      >
        {label} Match
      </span>
    </div>
  );
}
