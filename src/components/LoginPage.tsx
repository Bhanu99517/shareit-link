import { Link, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const LoginPage = () => {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--mouse-x", `${e.clientX}px`);
    el.style.setProperty("--mouse-y", `${e.clientY}px`);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-following glow */}
      <div className="pointer-events-none fixed inset-0 z-0 hero-glow" />
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/4 blur-[120px]" />
        
        {/* Orbiting particles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-orbit opacity-20">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-orbit opacity-15" style={{ animationDuration: "15s", animationDirection: "reverse" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          </div>
        </div>

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(210 40% 96%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 40% 96%) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-10">
        {/* Logo & Hero */}
        <div className="space-y-5 opacity-0 animate-fade-in">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse-glow border border-primary/20 overflow-hidden">
            <img src={logo} alt="ShareDrop logo" width={56} height={56} className="object-contain" />
          </div>
          <div>
            <h1 className="text-5xl sm:text-6xl font-display font-bold tracking-tight">
              Share<span className="gradient-text">Drop</span>
            </h1>
            <p className="text-muted-foreground text-lg mt-3 text-balance max-w-sm mx-auto">
              Upload any file and get a shareable link in seconds. Fast, secure, beautiful.
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-3 opacity-0 animate-fade-in stagger-2">
          {[
            { icon: Zap, label: "Lightning Fast", desc: "Instant uploads" },
            { icon: Link, label: "Share Anywhere", desc: "HTTPS links" },
            { icon: Shield, label: "Secure", desc: "Encrypted storage" },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="glass-card-hover rounded-xl p-4 flex flex-col items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-display font-medium">{label}</span>
              <span className="text-[11px] text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>

        {/* Supported formats */}
        <div className="opacity-0 animate-fade-in stagger-3">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {["Images", "Videos", "PDFs", "Docs", "PPTs", "ZIP", "Audio"].map((type) => (
              <span
                key={type}
                className="px-3 py-1 text-xs font-medium rounded-full bg-secondary border border-border/50 text-muted-foreground"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Login Button */}
        <div className="opacity-0 animate-fade-in stagger-4 space-y-4">
          <Button
            onClick={handleGoogleLogin}
            size="lg"
            className="w-full h-14 text-base font-display gap-3 rounded-xl bg-foreground text-background hover:bg-foreground/90 glow-border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <p className="text-xs text-muted-foreground/60">
            Free to use · No file size limits · Your files, your links
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 pb-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/50">
          <a href="#" className="hover:text-muted-foreground transition-colors">Privacy</a>
          <span>·</span>
          <a href="#" className="hover:text-muted-foreground transition-colors">Terms</a>
          <span>·</span>
          <a href="#" className="hover:text-muted-foreground transition-colors">Contact</a>
        </div>
        <p className="text-[11px] text-muted-foreground/30">
          © {new Date().getFullYear()} ShareDrop. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
