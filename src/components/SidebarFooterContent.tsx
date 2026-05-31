import { useState } from "react";
import { LogOut, Palette } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Switch } from "@/components/ui/switch";
import { SidebarFooter } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function SidebarFooterContent() {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <SidebarFooter className="border-t border-sidebar-border">
      <div className="space-y-1 px-2 py-2">
        {/* Appearance */}
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Light Mode</span>
          </div>
          <Switch
            checked={theme === "light"}
            onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
          />
        </div>

        {/* Log Out */}
        <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
          <AlertDialogTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out?</AlertDialogTitle>
              <AlertDialogDescription>
                You'll need to sign back in to access your projects.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={signOut}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="px-2 pt-1 text-xs text-muted-foreground">
          LoreLock v1
        </div>
      </div>
    </SidebarFooter>
  );
}
