"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  MessageCircle, 
  User, 
  Menu,
  X,
  BarChart3,
  Shield,
  Bot,
  Stethoscope,
  Truck,
  Calculator,
  Bell,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  category: 'main' | 'services' | 'tools' | 'account';
}

const navigationItems: NavigationItem[] = [
  // Main Navigation
  {
    id: 'home',
    label: 'ዋና ገጽ',
    href: '/',
    icon: <Home className="h-5 w-5" />,
    category: 'main'
  },
  {
    id: 'marketplace',
    label: 'ገበያ',
    href: '/marketplace',
    icon: <Search className="h-5 w-5" />,
    category: 'main'
  },
  {
    id: 'messages',
    label: 'መልዕክቶች',
    href: '/messages',
    icon: <MessageCircle className="h-5 w-5" />,
    badge: '3',
    category: 'main'
  },
  {
    id: 'profile',
    label: 'መገለጫ',
    href: '/profile',
    icon: <User className="h-5 w-5" />,
    category: 'main'
  },

  // Services
  {
    id: 'market-intelligence',
    label: 'የገበያ መረጃ',
    href: '/market-intelligence',
    icon: <BarChart3 className="h-5 w-5" />,
    badge: 'አዲስ',
    category: 'services'
  },
  {
    id: 'financial-services',
    label: 'የገንዘብ አገልግሎት',
    href: '/financial-services',
    icon: <Shield className="h-5 w-5" />,
    category: 'services'
  },
  {
    id: 'ai-assistant',
    label: 'AI ረዳት',
    href: '/ai-assistant',
    icon: <Bot className="h-5 w-5" />,
    badge: 'ሙቅ',
    category: 'services'
  },
  {
    id: 'vet-services',
    label: 'የእንስሳት ሐኪም',
    href: '/vet-services',
    icon: <Stethoscope className="h-5 w-5" />,
    category: 'services'
  },
  {
    id: 'transport',
    label: 'ትራንስፖርት',
    href: '/transport',
    icon: <Truck className="h-5 w-5" />,
    category: 'services'
  },

  // Tools
  {
    id: 'calculators',
    label: 'ካልኩሌተሮች',
    href: '/calculators',
    icon: <Calculator className="h-5 w-5" />,
    category: 'tools'
  }
];

export function EnhancedNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'አዲስ':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'ሙቅ':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const mainNavItems = navigationItems.filter(item => item.category === 'main');
  const serviceItems = navigationItems.filter(item => item.category === 'services');
  const toolItems = navigationItems.filter(item => item.category === 'tools');

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="grid grid-cols-4 gap-1 p-2">
          {mainNavItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'flex flex-col gap-1 h-auto py-2 px-1 w-full',
                  isActive(item.href) && 'bg-primary/10 text-primary'
                )}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <Badge className="absolute -top-2 -right-2 text-xs px-1 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white border-red-600">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs leading-tight">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Header with Menu */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">YG</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            የገበሬ ገበያ
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ዳሰሳ
              </h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Services */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  አገልግሎቶች
                </h3>
                <div className="space-y-2">
                  {serviceItems.map((item) => (
                    <Link key={item.id} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge className={cn('ml-auto text-xs', getBadgeColor(item.badge))}>
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  መሳሪያዎች
                </h3>
                <div className="space-y-2">
                  {toolItems.map((item) => (
                    <Link key={item.id} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Account */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <Settings className="h-5 w-5" />
                    <span>ቅንብሮች</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                    <HelpCircle className="h-5 w-5" />
                    <span>እርዳታ</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="h-5 w-5" />
                    <span>ውጣ</span>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
