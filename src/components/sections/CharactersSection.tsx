import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Project, Character } from "@/lib/types";
import { generateId } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  project: Project;
  onUpdate: (project: Project) => void;
}

const CharactersSection = ({ project, onUpdate }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addCharacter = () => {
    const character: Character = {
      id: generateId(),
      name: "New Character",
      role: "",
      personality: "",
      backstory: "",
      secrets: "",
      relationships: "",
    };
    onUpdate({ ...project, characters: [...project.characters, character] });
    setExpandedId(character.id);
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    onUpdate({
      ...project,
      characters: project.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const deleteCharacter = (id: string) => {
    onUpdate({ ...project, characters: project.characters.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-3">
      {project.characters.map((char) => {
        const isExpanded = expandedId === char.id;
        return (
          <div key={char.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => setExpandedId(isExpanded ? null : char.id)}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
                {char.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{char.name}</p>
                {char.role && <p className="truncate text-xs text-muted-foreground">{char.role}</p>}
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {isExpanded && (
              <div className="space-y-3 border-t border-border p-4 animate-fade-in">
                <Input
                  placeholder="Name"
                  value={char.name}
                  onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                />
                <Input
                  placeholder="Role (e.g., Protagonist, Villain)"
                  value={char.role}
                  onChange={(e) => updateCharacter(char.id, { role: e.target.value })}
                />
                <Textarea
                  placeholder="Personality traits..."
                  value={char.personality}
                  onChange={(e) => updateCharacter(char.id, { personality: e.target.value })}
                  rows={2}
                />
                <Textarea
                  placeholder="Backstory..."
                  value={char.backstory}
                  onChange={(e) => updateCharacter(char.id, { backstory: e.target.value })}
                  rows={3}
                />
                <Textarea
                  placeholder="Secrets..."
                  value={char.secrets}
                  onChange={(e) => updateCharacter(char.id, { secrets: e.target.value })}
                  rows={2}
                />
                <Textarea
                  placeholder="Relationships..."
                  value={char.relationships}
                  onChange={(e) => updateCharacter(char.id, { relationships: e.target.value })}
                  rows={2}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCharacter(char.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Delete Character
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={addCharacter}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
      >
        <Plus className="h-4 w-4" /> Add Character
      </button>
    </div>
  );
};

export default CharactersSection;
