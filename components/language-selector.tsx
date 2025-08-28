"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  language: 'am' | 'or' | 'en';
  onLanguageChange: (language: 'am' | 'or' | 'en') => void;
}

const LANGUAGES = [
  { code: 'am', name: 'አማርኛ', nameEn: 'Amharic' },
  { code: 'or', name: 'Afaan Oromo', nameEn: 'Oromo' },
  { code: 'en', name: 'English', nameEn: 'English' },
];

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const currentLanguage = LANGUAGES.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {currentLanguage?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code as 'am' | 'or' | 'en')}
            className={language === lang.code ? 'bg-green-50' : ''}
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.name}</span>
              <span className="text-xs text-gray-500">{lang.nameEn}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
