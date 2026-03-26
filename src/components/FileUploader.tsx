import { useState, useCallback } from "react";
import { Upload, Loader2, CloudUpload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface FileUploaderProps {
  onUploadComplete: () => void;
}

const FileUploader = ({ onUploadComplete }: FileUploaderProps) => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, name: "" });

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length, name: file.name });

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("shared-files")
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("shared-files")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("files").insert({
        user_id: user.id,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type || "application/octet-stream",
        storage_path: filePath,
        public_url: publicUrl,
      });

      if (dbError) {
        toast.error(`Failed to save ${file.name}`);
        continue;
      }
      successCount++;
    }

    if (successCount > 0) {
      toast.success(`${successCount} file${successCount > 1 ? "s" : ""} uploaded successfully!`);
      onUploadComplete();
    }

    setUploading(false);
    setProgress({ current: 0, total: 0, name: "" });
  }, [user, onUploadComplete]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  }, [handleUpload]);

  const openFilePicker = () => {
    if (uploading) return;
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e) => handleUpload((e.target as HTMLInputElement).files);
    input.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={openFilePicker}
      className={`
        upload-zone rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-500 
        border-2 border-dashed glow-border
        ${isDragging
          ? "border-primary bg-primary/5 scale-[1.01] shadow-lg shadow-primary/10"
          : "border-border/60 hover:border-primary/40"
        }
        ${uploading ? "pointer-events-none" : ""}
      `}
    >
      {uploading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
          <div>
            <p className="font-display font-semibold">
              Uploading {progress.current}/{progress.total}
            </p>
            <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs mx-auto">
              {progress.name}
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full max-w-xs h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging 
              ? "bg-primary/20 scale-110" 
              : "bg-gradient-to-br from-primary/10 to-accent/10"
          }`}>
            <CloudUpload className={`w-8 h-8 transition-all duration-300 ${
              isDragging ? "text-primary scale-110" : "text-primary/80"
            }`} />
          </div>
          <div>
            <p className="font-display font-semibold text-lg">
              {isDragging ? "Drop to upload" : "Drop files here or click to browse"}
            </p>
            <p className="text-sm text-muted-foreground mt-1.5">
              Supports all file types — images, videos, PDFs, docs & more
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center mt-1">
            {["JPG", "PNG", "MP4", "PDF", "DOCX", "PPTX", "ZIP"].map((ext) => (
              <span key={ext} className="px-2 py-0.5 text-[10px] font-mono rounded bg-secondary/80 text-muted-foreground border border-border/30">
                .{ext.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
