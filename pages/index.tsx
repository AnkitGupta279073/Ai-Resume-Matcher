import { useState } from "react";
// MatchResult type definition
type MatchResult = {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  verdict: string;
  experience_alignment: "Strong" | "Moderate" | "Weak";
  recommendation: "Strong Hire" | "Consider" | "Pass";
};
import { ResumeUpload } from "@/components/resume-upload";
import { ResultsCard } from "@/components/results-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Sparkles,
  AlertCircle,
  Loader2,
  BarChart3,
  Users,
  Target,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const canSubmit = file && jd.trim().length >= 50 && !isPending;

  async function handleSubmit() {
    if (!file) return;
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);

    setIsPending(true);
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setResult(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 pattern-grid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-80" />
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-purple-100/60 bg-white/85 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-[1380px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/30">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm">
              ResumeMatch<span className="text-gradient font-bold">AI</span>
            </span>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Engine Ready 
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1380px] px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
        {/* Page hero */}
        <div className="mb-8 rounded-3xl border border-purple-100/70 bg-white/70 p-6 shadow-xl shadow-purple-100/60 backdrop-blur-xl sm:mb-10 sm:p-8 lg:p-10">
          <p className="text-xs font-mono text-purple-600 uppercase tracking-widest font-medium mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            HR Intelligence Dashboard
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-3 leading-tight break-words">
            Resume Screening,{" "}
            <br className="hidden sm:inline" />
            <span className="text-gradient italic">Reimagined</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base leading-relaxed">
            Upload a resume and paste the job description. Our AI evaluates
            skill alignment and surfaces gaps in seconds.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs">
            <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 font-medium text-purple-700">
              AI-first hiring workflow
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
              Human-review friendly results
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:mb-10 sm:grid-cols-3 sm:gap-4">
          {[
            { label: "Resumes Screened", value: "10,000+", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Time Saved / Hire", value: "4.2 hrs", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Match Accuracy", value: "94%", icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="rounded-2xl border border-purple-100/70 bg-white/85 p-4 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", bg)}>
                  <Icon className={cn("w-4 h-4", color)} />
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">{label}</span>
              </div>
              <p className="font-display text-lg sm:text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground sm:hidden mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Main 2-col layout */}
        <div className="grid items-start gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Left: input panel */}
          <div className="space-y-4 lg:col-span-5 lg:sticky lg:top-20">
            {/* Step 1: Resume */}
            <Card className="border-purple-100/60 bg-white/85 backdrop-blur-sm shadow-lg shadow-purple-100/40 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/30">
                    1
                  </span>
                  <div>
                    <CardTitle className="text-base font-semibold">Candidate Resume</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      PDF format · max 10 MB
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <ResumeUpload onFileSelect={setFile} file={file} />
              </CardContent>
            </Card>

            {/* Step 2: JD */}
            <Card className="border-purple-100/50 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/30">
                    2
                  </span>
                  <div>
                    <CardTitle className="text-base font-semibold">Job Description</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Paste the full JD with skills &amp; requirements
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <Textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="We are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js..."
                  rows={14}
                  className="text-sm leading-relaxed resize-none border-purple-200/60 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
                <p
                  className={cn(
                    "text-xs mt-1.5",
                    jd.trim().length >= 50 ? "text-emerald-600" : "text-muted-foreground"
                  )}
                >
                  {jd.trim().length} chars{jd.trim().length < 50 ? " (min 50)" : " ✓"}
                </p>
              </CardContent>
            </Card>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* CTA button */}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              size="lg"
              className="w-full h-12 font-semibold text-sm gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Resume…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Match
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </>
              )}
            </Button>
          </div>

          {/* Right: output panel */}
          <div className="lg:col-span-7">
            {isPending && (
              <Card className="border-dashed border-purple-300/50 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="flex flex-col items-center justify-center gap-5 py-20">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
                    <Sparkles className="w-5 h-5 text-purple-600 absolute inset-0 m-auto" />
                  </div>
                  <div className="text-center space-y-1.5 max-w-xs">
                    <p className="font-semibold text-foreground">Analyzing resume…</p>
                    <p className="text-sm text-muted-foreground">
                      Extracting skills, comparing experience, and generating your report.
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-bounce shadow-lg shadow-purple-500/50"
                        style={{ animationDelay: `${d}s` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {result && !isPending && (
              <ResultsCard
                result={result}
                candidateName={file ? file.name.replace(".pdf", "") : undefined}
              />
            )}

            {!result && !isPending && (
              <Card className="border-dashed border-purple-200/70 bg-white/85 backdrop-blur-sm shadow-lg shadow-purple-100/40">
                <CardContent className="flex flex-col items-center justify-center gap-5 py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-purple-600/60" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <p className="font-semibold text-foreground">Results will appear here</p>
                    <p className="text-sm text-muted-foreground">
                      Upload a resume and paste a job description, then click{" "}
                      <strong className="text-purple-600 font-semibold">Analyze Match</strong>.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 w-full max-w-xs text-left">
                    {[
                      "Match score (0–100)",
                      "Matching skills list",
                      "Skill gap analysis",
                      "Hiring recommendation",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-xs text-muted-foreground bg-purple-50/50 rounded-lg px-3 py-2 border border-purple-100/50"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
