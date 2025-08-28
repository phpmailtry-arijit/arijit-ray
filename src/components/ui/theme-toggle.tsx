import { Moon, Sun, Palette, Waves, Sunrise, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/ui/theme-provider"

const themes = [
  { name: "Light", value: "light" as const, icon: Sun },
  { name: "Dark", value: "dark" as const, icon: Moon },
  { name: "Neon", value: "neon" as const, icon: Zap },
  { name: "Ocean", value: "ocean" as const, icon: Waves },
  { name: "Sunset", value: "sunset" as const, icon: Sunrise },
  { name: "System", value: "system" as const, icon: Palette },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  const currentTheme = themes.find(t => t.value === theme) || themes[0]
  const CurrentIcon = currentTheme.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden group animate-magnetic"
        >
          <CurrentIcon className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="sr-only">Toggle theme</span>
          <div className="absolute inset-0 bg-gradient-electric opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`cursor-pointer ${theme === themeOption.value ? 'bg-accent' : ''}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {themeOption.name}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}