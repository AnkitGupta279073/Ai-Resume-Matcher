import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FileText, Upload, X, CheckCircle2 } from "lucide-react";

interface ResumeUploadProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
}

export function ResumeUpload({ onFileSelect, file }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped && dropped.type === "application/pdf") {
        onFileSelect(dropped);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files && e.target.files[0];
    if (selected) onFileSelect(selected);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleInputChange}
        name="resume"
      />

      {file ? (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50/50 animate-fade-up">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatBytes(file.size)} · PDF
            </p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors"
            aria-label="Remove file"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current && inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200",
            "flex flex-col items-center justify-center gap-3 py-10 px-6",
            "hover:border-primary/50 hover:bg-primary/[0.02]",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border bg-secondary/30"
          )}
        >
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
              isDragging ? "bg-primary/15" : "bg-secondary"
            )}
          >
            <Upload
              className={cn(
                "w-6 h-6 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop your resume here, or{" "}
              <span className="text-primary underline-offset-2 hover:underline">
                browse
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF files only · Max 10 MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
