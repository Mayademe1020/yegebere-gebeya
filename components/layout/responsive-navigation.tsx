"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  ShoppingCart, 
  Stethoscope, 
  Users, 
  User,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  MessageCircle,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: {
    amharic: string;
    english: string;
    oromo: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  color: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'home',
    label: { amharic: 'ቤት', english: 'Home', oromo: 'Mana' },
    icon: Home,
    href: '/',
    color: 'text-blue-600'
  },
  {
    id: 'marketplace',
    label: { amharic: 'ገበያ', english: 'Marketplace', oromo: 'Gabaa' },
    icon: ShoppingCart,
    href: '/marketplace',
    color: 'text-green-600'
  },
  {
    id: 'vet',
    label: { amharic: 'ሐኪም', english: 'Vet', oromo: 'Hakiima' },
    icon: Stethoscope,
    href: '/vet-consultation',
    color: 'text-red-600'
  },
  {
    id: 'community',
    label: { amharic: 'ማህበረሰብ', english: 'Community', oromo: 'Hawaasa' },
    icon: Users,
    href: '/community',
    badge: 3,
    color: 'text-purple-600'
  },
  {
    id: 'profile',
    label: { amharic: 'መገለጫ', english: 'Profile', oromo: 'Ibsa' },
    icon: User,
    href: '/profile',
    color: 'text-gray-600'
  }
];

const QUICK_ACTIONS = [
  {
    id: 'post-animal',
    label: { amharic: 'እንስሳ ለጥፍ', english: 'Post Animal', oromo: 'Bineensa Maxxansii' },
    href: '/marketplace/post',
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    id: 'book-vet',
    label: { amharic: 'ሐኪም ይመዝግቡ', english: 'Book Vet', oromo: 'Hakiima Galmeessii' },
    href: '/vet-consultation/book',
    color: 'bg-red-600 hover:bg-red-700'
  },
  {
    id: 'buy-feed',
    label: { amharic: 'መኖ ይግዙ', english: 'Buy Feed', oromo: 'Nyaata Bitaa' },
    href: '/marketplace/feed',
    color: 'bg-green-600 hover:bg-green-700'
  }
];

interface ResponsiveNavigationProps {
  children: React.ReactNode;
}

export function ResponsiveNavigation({ children }: ResponsiveNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, language } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getLocalizedText = (item: { amharic: string; english: string; oromo: string }) => {
    switch (language) {
      case 'oromo': return item.oromo;
      case 'english': return item.english;
      default: return item.amharic;
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YG</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  የገበሬ ገበያ
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.name || 'Guest'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">3</Badge>
              </Button>
              <Button size="sm" variant="ghost">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-16 pb-20">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative",
                  isActive(item.href)
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                <item.icon 
                  className={cn(
                    "h-5 w-5",
                    isActive(item.href) ? item.color : "text-gray-500 dark:text-gray-400"
                  )} 
                />
                <span className={cn(
                  "text-xs font-medium",
                  isActive(item.href) 
                    ? "text-gray-900 dark:text-gray-100" 
                    : "text-gray-500 dark:text-gray-400"
                )}>
                  {getLocalizedText(item.label)}
                </span>
                {item.badge && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Floating Action Button */}
        <div className="fixed bottom-24 right-4 z-40">
          <div className="flex flex-col gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Button
                key={action.id}
                size="sm"
                className={cn("shadow-lg", action.color)}
                onClick={() => router.push(action.href)}
              >
                <Plus className="h-4 w-4 mr-1" />
                {getLocalizedText(action.label)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop/Tablet Sidebar Navigation
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YG</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  የገበሬ ገበያ
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Livestock Platform
                </p>
              </div>
            </div>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative",
                  isActive(item.href)
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="font-medium">{getLocalizedText(item.label)}</span>
                    {item.badge && (
                      <Badge className="ml-auto h-5 w-5 p-0 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            <button className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}>
              <Settings className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">Settings</span>}
            </button>
            
            <button className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}>
              <HelpCircle className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">Help</span>}
            </button>
          </div>

          {!sidebarCollapsed && user && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.phone}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.id}
                  size="sm"
                  className={action.color}
                  onClick={() => router.push(action.href)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {getLocalizedText(action.label)}
                </Button>
              ))}
              
              <Button size="sm" variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">3</Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
