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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  FileText,
  Briefcase,
  AlertCircle,
  Loader2,
  ChevronRight,
  BarChart3,
  Users,
  Target,
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
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-foreground">
              ResumeMatch
              <span className="text-primary ml-0.5">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              GPT-4o Connected
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-primary mb-3 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            HR Intelligence Dashboard
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
            Resume Screening,{" "}
            <span className="text-primary italic">Reimagined</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-base">
            Upload a candidate's resume and paste the job description. Our AI
            evaluates skill alignment and surfaces gaps in seconds.
          </p>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Resumes Screened", value: "10,000+", icon: Users },
            { label: "Time Saved / Hire", value: "4.2 hrs", icon: BarChart3 },
            { label: "Match Accuracy", value: "94%", icon: Target },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-xl px-4 py-3.5"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="font-display text-xl font-bold text-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input panel */}
          <div className="lg:col-span-1 space-y-5">
            {/* Resume upload */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Candidate Resume</CardTitle>
                </div>
                <CardDescription>
                  Upload a PDF resume (max 10 MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeUpload onFileSelect={setFile} file={file} />
              </CardContent>
            </Card>

            {/* JD textarea */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Job Description</CardTitle>
                </div>
                <CardDescription>
                  Paste the full JD including required skills and experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="We are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js. The ideal candidate should have experience with cloud platforms (AWS or GCP), CI/CD pipelines..."
                  rows={10}
                  className="text-sm leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2">
                  <p
                    className={cn(
                      "text-xs",
                      jd.trim().length >= 50
                        ? "text-green-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {jd.trim().length} chars{" "}
                    {jd.trim().length < 50 && "(min 50)"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* CTA */}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              size="lg"
              className="w-full font-semibold gap-2 h-12"
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
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </>
              )}
            </Button>
          </div>

          {/* Output panel */}
          <div>
            {isPending && (
              <Card className="h-full border-dashed">
                <CardContent className="h-full flex flex-col items-center justify-center gap-4 py-20">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Sparkles className="w-5 h-5 text-primary absolute inset-0 m-auto" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-medium text-foreground">
                      AI is analyzing...
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Extracting skills, comparing experience levels, and
                      generating your report
                    </p>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce"
                        style={{ animationDelay: `${d}s` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {result && !isPending && (
              <ResultsCard result={result} candidateName={file ? file.name.replace(".pdf", "") : undefined} />
            )}

            {!result && !isPending && (
              <Card className="h-full border-dashed border-border/50">
                <CardContent className="h-full flex flex-col items-center justify-center gap-4 py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      Results will appear here
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Upload a resume and paste a job description, then click{" "}
                      <strong>Analyze Match</strong>.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 mt-4 text-left w-full max-w-xs">
                    {[
                      "Match score (0–100)",
                      "Matching & missing skills",
                      "Experience alignment",
                      "Hiring recommendation",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
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
