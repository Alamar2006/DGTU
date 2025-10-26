'use client'

import { Moon, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme()

    return (
        <button 
            className="relative w-6 h-6 flex items-center justify-center cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Переключить тему"
        >
            <SunMedium className="absolute w-5 h-5 transition-all duration-300 rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0" />
            <Moon className="absolute w-5 h-5 transition-all duration-300 rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
        </button>
    )
}