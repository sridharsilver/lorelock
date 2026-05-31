import { useNavigate } from "react-router-dom";
import { BookOpen, LogIn, UserPlus } from "lucide-react";

const EntryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="mb-12 flex flex-col items-center animate-fade-in">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 glow-violet">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">LoreLock</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your private story workspace</p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] glow-violet"
        >
          <LogIn className="h-5 w-5" />
          Return to your world
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 text-base font-medium text-foreground transition-all hover:bg-secondary hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="h-5 w-5" />
          Begin your story
        </button>
      </div>
    </div>
  );
};

export default EntryPage;
