"use client";

import { ClaudeLogo } from "@/components/icons/BrandLogos";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { ambassador } from "@/data/ambassador";
import { projects, projectsFr } from "@/data/projects";
import {
  Award,
  Briefcase,
  Code2,
  Copy,
  Download,
  FolderGit2,
  Github,
  Home,
  Languages,
  Linkedin,
  Mail,
  Moon,
  Search,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Locale = "en" | "fr";

const EMAIL = "emmanuel.ouangnamou@gmail.com";

export default function CommandPalette({
  locale = "en",
  triggerClassName = "",
}: {
  locale?: Locale;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const fr = locale === "fr";
  const basePath = fr ? "/fr" : "";
  const featured = (fr ? projectsFr : projects).filter((p) => p.featured);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    // Let the dialog close before scrolling or navigating
    window.setTimeout(fn, 60);
  };

  const goToSection = (id: string) =>
    run(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else router.push(`${basePath}/#${id}`);
    });

  const openExternal = (url: string) => run(() => window.open(url, "_blank", "noopener,noreferrer"));

  const sections = [
    { id: "home", label: fr ? "Accueil" : "Home", icon: Home },
    { id: "about", label: fr ? "À propos" : "About", icon: User },
    { id: "skills", label: fr ? "Compétences" : "Skills", icon: Code2 },
    { id: "projects", label: fr ? "Projets" : "Projects", icon: FolderGit2 },
    { id: "journey", label: fr ? "Parcours" : "Journey", icon: Briefcase },
    { id: "ambassador", label: fr ? "Ambassadeur Claude" : "Claude Ambassador", icon: ClaudeLogo },
    { id: "achievements", label: fr ? "Distinctions" : "Awards", icon: Award },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={fr ? "Ouvrir la palette de commandes" : "Open command palette"}
        className={`group inline-flex h-9 items-center gap-2 rounded-full px-2.5 text-xs font-semibold transition-colors sm:h-10 sm:px-3 ${triggerClassName}`}
      >
        <Search className="h-[18px] w-[18px]" />
        <kbd className="hidden rounded-md border border-current/20 px-1.5 py-0.5 font-sans text-[10px] font-bold tracking-wider opacity-70 2xl:inline-block">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">{fr ? "Palette de commandes" : "Command palette"}</DialogTitle>
        <CommandInput placeholder={fr ? "Aller à, chercher un projet, copier l'email…" : "Jump to, find a project, copy my email…"} />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>{fr ? "Aucun résultat." : "No results found."}</CommandEmpty>

          <CommandGroup heading={fr ? "Naviguer" : "Navigate"}>
            {sections.map(({ id, label, icon: Icon }) => (
              <CommandItem key={id} value={`section ${label}`} onSelect={() => goToSection(id)}>
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading={fr ? "Projets phares" : "Featured projects"}>
            {featured.map((p) => (
              <CommandItem
                key={p.slug}
                value={`project ${p.title} ${p.category}`}
                onSelect={() => run(() => router.push(`${basePath}/projects/${p.slug}`))}
              >
                <FolderGit2 className="mr-2 h-4 w-4" />
                <span className="truncate">{p.title}</span>
                <CommandShortcut>{p.category}</CommandShortcut>
              </CommandItem>
            ))}
            <CommandItem value="all projects archive" onSelect={() => run(() => router.push(`${basePath}/projects`))}>
              <FolderGit2 className="mr-2 h-4 w-4" />
              {fr ? "Voir tous les projets" : "View all projects"}
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading={fr ? "Actions" : "Actions"}>
            <CommandItem
              value="copy email"
              onSelect={() => run(() => navigator.clipboard?.writeText(EMAIL))}
            >
              <Copy className="mr-2 h-4 w-4" />
              {fr ? "Copier mon email" : "Copy my email"}
              <CommandShortcut>{EMAIL}</CommandShortcut>
            </CommandItem>
            <CommandItem value="download resume cv" onSelect={() => openExternal(fr ? "/resume_fr.pdf" : "/resume.pdf")}>
              <Download className="mr-2 h-4 w-4" />
              {fr ? "Télécharger le CV" : "Download resume"}
            </CommandItem>
            <CommandItem value="sign up join claude community" onSelect={() => openExternal(ambassador.signup.href)}>
              <ClaudeLogo className="mr-2 h-4 w-4 text-[#d97757]" />
              {fr ? "Rejoindre la communauté Claude" : "Join the Claude community"}
            </CommandItem>
            <CommandItem value="toggle theme dark light" onSelect={() => run(() => setTheme(theme === "dark" ? "light" : "dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              {fr ? "Changer le thème" : "Toggle light / dark"}
            </CommandItem>
            <CommandItem value="language english french" onSelect={() => run(() => router.push(fr ? "/" : "/fr"))}>
              <Languages className="mr-2 h-4 w-4" />
              {fr ? "Switch to English" : "Passer en français"}
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading={fr ? "Réseaux" : "Elsewhere"}>
            <CommandItem value="github" onSelect={() => openExternal("https://github.com/adoumouangnamouemmanuel")}>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </CommandItem>
            <CommandItem value="linkedin" onSelect={() => openExternal("https://www.linkedin.com/in/emmanueladoum/")}>
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
