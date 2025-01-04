'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface LanguageSwitcherProps {
  onLanguageChange: (lang: string) => void;
}

export default function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState('en')

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'pt-br' : 'en'
    setCurrentLang(newLang)
    onLanguageChange(newLang)
  }

  return (
    <Button onClick={toggleLanguage} className="neon-border bg-background text-primary hover:bg-primary hover:text-background">
      {currentLang === 'en' ? 'Switch to PT-BR' : 'Mudar para EN'}
    </Button>
  )
}

