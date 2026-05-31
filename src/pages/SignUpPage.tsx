import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, ArrowLeft, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ImageCropperDialog } from "@/components/ImageCropperDialog";

const SignUpPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropperFile, setCropperFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCropperFile(file);
      setCropperOpen(true);
    }
  }

  function handleCropComplete(croppedBlob: Blob) {
    const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
    setAvatarFile(croppedFile);
    setAvatarPreview(URL.createObjectURL(croppedBlob));
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const trimmedUsername = username.trim().toLowerCase();
    if (trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Check username uniqueness
    const { data: isAvailable } = await supabase.rpc("check_username_available", {
      desired_username: trimmedUsername,
    });

    if (!isAvailable) {
      setError("Username is already taken.");
      setLoading(false);
      return;
    }

    // Sign up with the provided email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });

    if (authError || !authData.user) {
      setError(authError?.message || "Something went wrong.");
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    // Upload avatar if provided
    let avatarUrl: string | null = null;
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }
    }

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: userId,
      username: trimmedUsername,
      email: trimmedEmail,
      display_name: displayName.trim() || null,
      avatar_url: avatarUrl,
    });

    if (profileError) {
      setError("Account created but profile setup failed. Please try logging in.");
      setLoading(false);
      return;
    }

    navigate("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <button
          onClick={() => navigate("/entry")}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create your universe.</p>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-card transition-colors hover:border-primary"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-6 w-6 text-muted-foreground" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <ImageCropperDialog
            open={cropperOpen}
            onClose={() => setCropperOpen(false)}
            file={cropperFile}
            onCropComplete={handleCropComplete}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              required
              className="rounded-xl bg-card border-border"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Display Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you'll appear in-app"
              className="rounded-xl bg-card border-border"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="rounded-xl bg-card border-border"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="rounded-xl bg-card border-border"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Confirm Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              className="rounded-xl bg-card border-border"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 glow-violet"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
