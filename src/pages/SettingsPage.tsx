import { useState, useRef } from "react";
import { ArrowLeft, Camera, Save, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ImageCropperDialog } from "@/components/ImageCropperDialog";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropperFile, setCropperFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  async function handleSaveProfile() {
    if (!user) return;
    setSaving(true);
    try {
      // Validate and normalize email
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
        setSaving(false);
        return;
      }

      // Check username uniqueness if changed
      if (username !== profile?.username) {
        const { data: available } = await supabase.rpc("check_username_available", { desired_username: username });
        if (!available) {
          toast({ title: "Username taken", description: "Please choose a different username.", variant: "destructive" });
          setSaving(false);
          return;
        }
      }
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName || null, username, email: trimmedEmail, avatar_url: avatarUrl || null })
        .eq("user_id", user.id);
      if (error) throw error;
      toast({ title: "Profile updated" });
    } catch {
      toast({ title: "Error saving profile", variant: "destructive" });
    }
    setSaving(false);
  }

  function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCropperFile(file);
      setCropperOpen(true);
    }
  }

  async function handleCropComplete(croppedBlob: Blob) {
    if (!user) return;
    const path = `${user.id}/avatar.jpg`;
    const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
    const { error } = await supabase.storage.from("avatars").upload(path, croppedFile, { upsert: true });
    if (error) {
      toast({ title: "Upload failed", variant: "destructive" });
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl + "?t=" + Date.now());
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPw(false);
  }

  return (
    <div className="min-h-screen bg-background px-4 pb-12 pt-8 animate-fade-in">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Control your space.</p>
          </div>
        </div>

        {/* Profile Settings */}
        <section className="mb-6 rounded-2xl bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Profile</h2>

          <div className="mb-5 flex items-center gap-4">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-16 w-16 rounded-2xl object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold text-muted-foreground">
                  {(displayName || username || "?")[0]?.toUpperCase()}
                </div>
              )}
              <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                <Camera className="h-3.5 w-3.5" />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
              </label>
            </div>
            <div className="text-sm text-muted-foreground">Tap to change avatar</div>
          </div>

          <ImageCropperDialog
            open={cropperOpen}
            onClose={() => setCropperOpen(false)}
            file={cropperFile}
            onCropComplete={handleCropComplete}
          />

          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Display Name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="mt-1 bg-secondary border-border"
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="username"
                className="mt-1 bg-secondary border-border"
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1 bg-secondary border-border"
              />
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={saving} className="mt-5 w-full rounded-xl">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </section>

        {/* Account Settings */}
        <section className="mb-6 rounded-2xl bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account</h2>

          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">New Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="bg-secondary border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="mt-1 bg-secondary border-border"
              />
            </div>
            <Button onClick={handleChangePassword} disabled={changingPw} variant="outline" className="w-full rounded-xl">
              {changingPw ? "Updating…" : "Change Password"}
            </Button>
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <Button onClick={signOut} variant="ghost" className="w-full rounded-xl text-destructive hover:text-destructive">
              Log Out
            </Button>
          </div>
        </section>

        {/* Appearance Settings */}
        <section className="rounded-2xl bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Appearance</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Light Mode</p>
              <p className="text-xs text-muted-foreground">Switch to a lighter palette</p>
            </div>
            <Switch
              checked={theme === "light"}
              onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
