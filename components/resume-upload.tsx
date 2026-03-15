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
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleInputChange}
        name="resume"
      />

      {file ? (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatBytes(file.size)} · PDF
            </p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="w-7 h-7 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors group flex-shrink-0"
            aria-label="Remove file"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current && inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200",
            "flex flex-col items-center justify-center gap-3 py-8 px-6",
            isDragging
              ? "border-purple-500 bg-purple-50/50 scale-[1.02] shadow-lg shadow-purple-500/20"
              : "border-purple-200 hover:border-purple-400 hover:bg-purple-50/30"
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
              isDragging
                ? "bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/40"
                : "bg-gradient-to-br from-purple-100 to-indigo-100"
            )}
          >
            <Upload
              className={cn(
                "w-5 h-5 transition-colors duration-200",
                isDragging ? "text-white" : "text-purple-600"
              )}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop PDF here, or{" "}
              <span className="text-purple-600 font-semibold">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF only · Max 10 MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
