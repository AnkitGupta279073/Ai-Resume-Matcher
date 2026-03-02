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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, TrendingUp, Award, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsCardProps {
  result: MatchResult;
  candidateName?: string;
}

const recommendationConfig = {
  "Strong Hire": {
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: "🎯",
  },
  Consider: {
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: "🔍",
  },
  Pass: {
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: "❌",
  },
};

const alignmentConfig = {
  Strong: { color: "text-green-600", bar: "bg-green-500", width: "w-full" },
  Moderate: { color: "text-amber-600", bar: "bg-amber-500", width: "w-2/3" },
  Weak: { color: "text-red-500", bar: "bg-red-400", width: "w-1/3" },
};

export function ResultsCard({ result, candidateName }: ResultsCardProps) {
  const recConfig =
    recommendationConfig[result.recommendation] ??
    recommendationConfig["Consider"];
  const alignConfig =
    alignmentConfig[result.experience_alignment] ??
    alignmentConfig["Moderate"];

  return (
    <Card className="overflow-hidden border-border shadow-md result-item">
      {/* Header band */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-400 to-cyan-400" />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
              Analysis Complete
            </p>
            <CardTitle className="font-display text-2xl">
              {candidateName ? `${candidateName}'s Report` : "Match Analysis"}
            </CardTitle>
          </div>
          <span
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border",
              recConfig.bg,
              recConfig.color
            )}
          >
            {recConfig.icon} {result.recommendation}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score + verdict */}
        <div className="flex flex-col sm:flex-row items-center gap-6 result-item">
          <ScoreRing score={result.match_score} size={168} />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Verdict
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 font-body">
              {result.verdict}
            </p>

            {/* Experience alignment */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Experience Alignment
                </span>
                <span
                  className={cn("text-xs font-semibold", alignConfig.color)}
                >
                  {result.experience_alignment}
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 delay-500",
                    alignConfig.bar,
                    alignConfig.width
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 gap-5 result-item">
          {/* Matching skills */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-foreground">
                Matching Skills
              </span>
              <span className="ml-auto text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {result.matching_skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.matching_skills.length > 0 ? (
                result.matching_skills.map((skill) => (
                  <span key={skill} className="skill-badge-match">
                    <CheckCircle2 className="w-3 h-3" />
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No matching skills detected
                </p>
              )}
            </div>
          </div>

          {/* Missing skills */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-foreground">
                Gap Analysis
              </span>
              <span className="ml-auto text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {result.missing_skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.missing_skills.length > 0 ? (
                result.missing_skills.map((skill) => (
                  <span key={skill} className="skill-badge-missing">
                    <XCircle className="w-3 h-3" />
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-green-600 italic flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  All required skills present!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-border flex items-center gap-2 result-item">
          <Award className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Analysis powered by GPT-4o · Results are AI-generated and should be
            reviewed by a human recruiter.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
