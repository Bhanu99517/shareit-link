import { useState } from "react";
import { Copy, Trash2, ExternalLink, FileText, Image, Video, File, Check, Music, Archive, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileItem {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  public_url: string;
  storage_path: string;
  created_at: string;
}

interface FileListProps {
  files: FileItem[];
  onDelete: () => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("video/")) return Video;
  if (mimeType.startsWith("audio/")) return Music;
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar")) return Archive;
  if (mimeType.includes("presentation") || mimeType.includes("ppt")) return Presentation;
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("text")) return FileText;
  return File;
};

const getFileColor = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return "from-pink-500/20 to-rose-500/20 text-pink-400";
  if (mimeType.startsWith("video/")) return "from-violet-500/20 to-purple-500/20 text-violet-400";
  if (mimeType.startsWith("audio/")) return "from-amber-500/20 to-orange-500/20 text-amber-400";
  if (mimeType.includes("pdf")) return "from-red-500/20 to-rose-500/20 text-red-400";
  if (mimeType.includes("zip") || mimeType.includes("rar")) return "from-yellow-500/20 to-amber-500/20 text-yellow-400";
  if (mimeType.includes("presentation") || mimeType.includes("ppt")) return "from-orange-500/20 to-red-500/20 text-orange-400";
  return "from-primary/20 to-accent/20 text-primary";
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(1)} GB`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const FileList = ({ files, onDelete }: FileListProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteFile = async (file: FileItem) => {
    const { error: storageError } = await supabase.storage
      .from("shared-files")
      .remove([file.storage_path]);

    if (storageError) {
      toast.error("Failed to delete file");
      return;
    }

    await supabase.from("files").delete().eq("id", file.id);
    toast.success("File deleted");
    onDelete();
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
          <File className="w-8 h-8 text-muted-foreground/30" />
        </div>
        <p className="text-muted-foreground font-display">No files uploaded yet</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Drop some files above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file, index) => {
        const Icon = getFileIcon(file.mime_type);
        const colorClass = getFileColor(file.mime_type);
        const isCopied = copiedId === file.id;

        return (
          <div
            key={file.id}
            className="group flex items-center gap-4 p-3.5 rounded-xl glass-card-hover opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{file.file_name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatSize(file.file_size)} · {formatDate(file.created_at)}
              </p>
            </div>

            <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                onClick={(e) => { e.stopPropagation(); copyLink(file.public_url, file.id); }}
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                onClick={(e) => { e.stopPropagation(); window.open(file.public_url, "_blank"); }}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); deleteFile(file); }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileList;
