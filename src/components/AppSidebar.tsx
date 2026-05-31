import { BookOpen, Settings, Heart, Clock, FolderOpen } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { SidebarFooterContent } from "@/components/SidebarFooterContent";

export function AppSidebar() {
  const { profile } = useAuth();
  const { favorites, recentProjects } = useProjects();
  const displayName = profile?.display_name || profile?.username || "Writer";

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">LoreLock</span>
            <span className="text-xs text-muted-foreground truncate max-w-[140px]">{displayName}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className="flex items-center gap-2" activeClassName="!bg-sidebar-accent !font-medium">
                    <FolderOpen className="h-4 w-4" />
                    <span>Projects</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className="flex items-center gap-2" activeClassName="!bg-sidebar-accent !font-medium">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Favorites */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5">
            <Heart className="h-3 w-3" />
            Favorites
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {favorites.length === 0 ? (
              <p className="px-3 text-xs text-muted-foreground">No favorites yet</p>
            ) : (
              <SidebarMenu>
                {favorites.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`/project/${project.id}`}
                        className="flex items-center gap-2 text-sm"
                        activeClassName="!bg-sidebar-accent !font-medium"
                      >
                        <Heart className="h-3.5 w-3.5 shrink-0 text-red-500 fill-current" />
                        <span className="truncate">{project.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Recent Projects */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {recentProjects.length === 0 ? (
              <p className="px-3 text-xs text-muted-foreground">No projects yet</p>
            ) : (
              <SidebarMenu>
                {recentProjects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`/project/${project.id}`}
                        className="flex items-center gap-2 text-sm"
                        activeClassName="!bg-sidebar-accent !font-medium"
                      >
                        <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{project.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooterContent />
    </Sidebar>
  );
}
