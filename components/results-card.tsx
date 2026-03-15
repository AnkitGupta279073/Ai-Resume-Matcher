// MatchResult type definition
type MatchResult = {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  verdict: string;
  experience_alignment: "Strong" | "Moderate" | "Weak";
  recommendation: "Strong Hire" | "Consider" | "Pass";
};
import { ScoreRing } from "@/components/score-ring";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsCardProps {
  result: MatchResult;
  candidateName?: string;
}

const recommendationConfig = {
  "Strong Hire": {
    color: "text-emerald-700",
    bg: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200",
    dot: "bg-emerald-500",
    label: "Strong Hire",
  },
  Consider: {
    color: "text-amber-700",
    bg: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
    dot: "bg-amber-500",
    label: "Consider",
  },
  Pass: {
    color: "text-red-700",
    bg: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200",
    dot: "bg-red-500",
    label: "Pass",
  },
};

const alignmentConfig = {
  Strong: {
    color: "text-emerald-600",
    bar: "bg-emerald-500",
    width: "100%",
    label: "Strong",
  },
  Moderate: {
    color: "text-amber-600",
    bar: "bg-amber-500",
    width: "66%",
    label: "Moderate",
  },
  Weak: {
    color: "text-red-500",
    bar: "bg-red-400",
    width: "33%",
    label: "Weak",
  },
};

export function ResultsCard({ result, candidateName }: ResultsCardProps) {
  const recConfig =
    recommendationConfig[result.recommendation] ??
    recommendationConfig["Consider"];
  const alignConfig =
    alignmentConfig[result.experience_alignment] ??
    alignmentConfig["Moderate"];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-purple-100/70 bg-white/80 px-4 py-3 shadow-md backdrop-blur-sm">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Analysis Complete
          </p>
          <h2 className="text-xl font-bold text-foreground font-display sm:text-2xl">
            {candidateName ? `${candidateName}'s Report` : "Match Report"}
          </h2>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm",
            recConfig.bg,
            recConfig.color
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", recConfig.dot)} />
          {recConfig.label}
        </span>
      </div>

      {/* Score + Verdict row */}
      <Card className="overflow-hidden border-purple-100/70 bg-white/90 shadow-xl shadow-purple-100/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600" />
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Score ring */}
            <div className="flex-shrink-0">
              <ScoreRing score={result.match_score} size={160} strokeWidth={14} />
            </div>

            {/* Verdict + alignment */}
            <div className="flex-1 space-y-5 w-full">
              {/* Verdict */}
              <div className="rounded-xl border border-purple-100/70 bg-purple-50/40 p-3.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  AI Verdict
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {result.verdict}
                </p>
              </div>

              {/* Experience alignment */}
              <div className="rounded-xl border border-purple-100/70 bg-white p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Experience Alignment
                  </p>
                  <span className={cn("text-xs font-bold", alignConfig.color)}>
                    {alignConfig.label}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-1000", alignConfig.bar)}
                    style={{ width: alignConfig.width }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Matching skills */}
        <Card className="border-emerald-200/70 bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Matching Skills
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full tabular-nums shadow-sm">
                {result.matching_skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {result.matching_skills.length > 0 ? (
                result.matching_skills.map((skill, index) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors duration-200"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No matching skills detected
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gap analysis */}
        <Card className="border-red-200/70 bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-500/30">
                  <XCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Skill Gaps
                </span>
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full tabular-nums shadow-sm">
                {result.missing_skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {result.missing_skills.length > 0 ? (
                result.missing_skills.map((skill, index) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors duration-200"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <XCircle className="w-3 h-3 flex-shrink-0" />
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-emerald-600 italic flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  All required skills present!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer note */}
      <p className="pb-1 text-center text-xs text-muted-foreground">
        AI-generated results · Always verify with a human recruiter before making hiring decisions.
      </p>
    </div>
  );
}
