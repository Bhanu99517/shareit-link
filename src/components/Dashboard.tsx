import { useState, useEffect } from "react";
import { LogOut, Upload, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import FileUploader from "./FileUploader";
import FileList from "./FileList";
import logo from "@/assets/logo.png";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setFiles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const totalSize = files.reduce((acc, f) => acc + f.file_size, 0);
  const formatTotalSize = (bytes: number) => {
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1073741824).toFixed(2)} GB`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--mouse-x", `${e.clientX}px`);
    el.style.setProperty("--mouse-y", `${e.clientY}px`);
  };

  return (
    <div className="min-h-screen relative" onMouseMove={handleMouseMove}>
      {/* Mouse-following glow */}
      <div className="pointer-events-none fixed inset-0 z-0 hero-glow" />
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-primary/3 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-accent/3 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="border-b border-border/30 backdrop-blur-xl sticky top-0 z-50 bg-background/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/10 overflow-hidden">
              <img src={logo} alt="ShareDrop logo" width={28} height={28} className="object-contain" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Share<span className="gradient-text">Drop</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/30">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-background">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground truncate max-w-[160px]">
                {user?.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats bar */}
        {files.length > 0 && (
          <div className="flex gap-4 opacity-0 animate-fade-in">
            <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
              <Files className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total Files</p>
                <p className="font-display font-semibold text-sm">{files.length}</p>
              </div>
            </div>
            <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
              <Upload className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Storage Used</p>
                <p className="font-display font-semibold text-sm">{formatTotalSize(totalSize)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload zone */}
        <div className="opacity-0 animate-fade-in stagger-1">
          <FileUploader onUploadComplete={fetchFiles} />
        </div>

        {/* File list */}
        <div className="opacity-0 animate-fade-in stagger-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-xl flex items-center gap-2">
              Your Files
              {files.length > 0 && (
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {files.length}
                </span>
              )}
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-3">Loading your files...</p>
            </div>
          ) : (
            <FileList files={files} onDelete={fetchFiles} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/20 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground/40">
            © {new Date().getFullYear()} ShareDrop. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/40">
            <a href="#" className="hover:text-muted-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-muted-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-muted-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
