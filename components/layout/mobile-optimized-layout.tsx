"use client";

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MobileOptimizedLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Mobile-first layout container with optimal spacing and responsive design
 * Designed for Ethiopian farmers with varying device sizes
 */
export function MobileOptimizedLayout({ children, className }: MobileOptimizedLayoutProps) {
  return (
    <div className={cn(
      "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
      "min-h-screen",
      className
    )}>
      {children}
    </div>
  );
}

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onClick?: () => void;
}

/**
 * Mobile-optimized card component with proper touch targets
 * Fixed: No longer renders as button to avoid nested button issues
 */
export function MobileCard({ 
  children, 
  className, 
  padding = 'md', 
  clickable = false,
  onClick 
}: MobileCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
        "shadow-sm",
        paddingClasses[padding],
        clickable && [
          "transition-all duration-200 ease-in-out",
          "hover:shadow-md hover:scale-[1.02]",
          "active:scale-[0.98]",
          "cursor-pointer",
          "min-h-[44px]", // Minimum touch target size
        ],
        className
      )}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </div>
  );
}

interface MobileGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Responsive grid system optimized for mobile devices
 * Automatically adjusts columns based on screen size
 */
export function MobileGrid({ 
  children, 
  columns = 2, 
  gap = 'md',
  className 
}: MobileGridProps) {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
  };

  return (
    <div className={cn(
      "grid",
      columnClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

interface MobileListProps {
  children: ReactNode;
  className?: string;
  dividers?: boolean;
}

/**
 * Mobile-optimized list component with proper spacing
 */
export function MobileList({ children, className, dividers = true }: MobileListProps) {
  return (
    <div className={cn(
      "space-y-1",
      dividers && "divide-y divide-gray-200 dark:divide-gray-700",
      className
    )}>
      {children}
    </div>
  );
}

interface MobileListItemProps {
  children: ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

/**
 * Mobile-optimized list item with proper touch targets
 */
export function MobileListItem({ 
  children, 
  className, 
  clickable = false,
  onClick 
}: MobileListItemProps) {
  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={cn(
        "py-3 px-4",
        clickable && [
          "w-full text-left",
          "transition-colors duration-200",
          "hover:bg-gray-50 dark:hover:bg-gray-700",
          "active:bg-gray-100 dark:active:bg-gray-600",
          "focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700",
          "min-h-[44px] flex items-center" // Minimum touch target
        ],
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  backButton?: boolean;
  onBack?: () => void;
  className?: string;
}

/**
 * Mobile-optimized header component
 */
export function MobileHeader({ 
  title, 
  subtitle, 
  action, 
  backButton = false,
  onBack,
  className 
}: MobileHeaderProps) {
  return (
    <header className={cn(
      "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700",
      "sticky top-0 z-50",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center min-w-0 flex-1">
            {backButton && (
              <button
                onClick={onBack}
                className="mr-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && (
            <div className="ml-4 flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Mobile-optimized bottom sheet for forms and actions
 */
export function MobileBottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className 
}: MobileBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0",
        "bg-white dark:bg-gray-800",
        "rounded-t-xl",
        "max-h-[90vh] overflow-y-auto",
        "transform transition-transform duration-300 ease-out",
        isOpen ? "translate-y-0" : "translate-y-full",
        className
      )}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
        
        {/* Header */}
        {title && (
          <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

interface MobileTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    count?: number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

/**
 * Mobile-optimized tabs component
 */
export function MobileTabs({ tabs, activeTab, onTabChange, className }: MobileTabsProps) {
  return (
    <div className={cn(
      "flex border-b border-gray-200 dark:border-gray-700",
      "overflow-x-auto scrollbar-hide",
      className
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap",
            "border-b-2 transition-colors duration-200",
            "min-h-[44px]", // Minimum touch target
            activeTab === tab.id
              ? "border-primary text-primary"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          )}
        >
          {tab.icon && (
            <span className="mr-2">
              {tab.icon}
            </span>
          )}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "ml-2 px-2 py-1 text-xs rounded-full",
              activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

interface MobileStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

/**
 * Mobile-optimized stats card component
 */
export function MobileStatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  className 
}: MobileStatsCardProps) {
  return (
    <MobileCard padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center mt-2 text-sm",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              <svg 
                className={cn(
                  "w-4 h-4 mr-1",
                  trend.isPositive ? "rotate-0" : "rotate-180"
                )} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
      </div>
    </MobileCard>
  );
}
