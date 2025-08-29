"use client";

import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function PageLayout({
  children,
  title,
  subtitle,
  actions,
  className,
  maxWidth = 'full',
  padding = 'md'
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", className)}>
      <div className={cn("mx-auto", maxWidthClasses[maxWidth], paddingClasses[padding])}>
        {(title || subtitle || actions) && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex-shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export function Section({
  children,
  title,
  subtitle,
  actions,
  className,
  spacing = 'md'
}: SectionProps) {
  const spacingClasses = {
    none: '',
    sm: 'mb-6',
    md: 'mb-8',
    lg: 'mb-12'
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {(title || subtitle || actions) && (
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              {title && (
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

interface CompactHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function CompactHeader({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className
}: CompactHeaderProps) {
  return (
    <header className={cn(
      "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        {breadcrumbs && (
          <nav className="mb-2">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-gray-700 dark:hover:text-gray-300">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarWidth?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SidebarLayout({
  children,
  sidebar,
  sidebarWidth = 'md',
  className
}: SidebarLayoutProps) {
  const sidebarWidthClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96'
  };

  return (
    <div className={cn("flex gap-6", className)}>
      <main className="flex-1 min-w-0">
        {children}
      </main>
      <aside className={cn("flex-shrink-0 hidden lg:block", sidebarWidthClasses[sidebarWidth])}>
        {sidebar}
      </aside>
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      {Icon && (
        <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && action}
    </div>
  );
}

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export function FilterBar({ children, className, sticky = true }: FilterBarProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6",
      sticky && "sticky top-4 z-10",
      className
    )}>
      <div className="flex flex-wrap items-center gap-3">
        {children}
      </div>
    </div>
  );
}

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  showScrollbar?: boolean;
}

export function HorizontalScroll({ 
  children, 
  className, 
  showScrollbar = false 
}: HorizontalScrollProps) {
  return (
    <div className={cn(
      "flex gap-4 overflow-x-auto pb-2",
      !showScrollbar && "scrollbar-hide",
      className
    )}>
      {children}
    </div>
  );
}

interface MasonryGridProps {
  children: React.ReactNode;
  cols?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MasonryGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className
}: MasonryGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={cn(
      `columns-${cols.mobile} sm:columns-${cols.tablet} lg:columns-${cols.desktop}`,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

interface FloatingActionButtonProps {
  children: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
}

export function FloatingActionButton({
  children,
  position = 'bottom-right',
  className
}: FloatingActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={cn(
      "fixed z-50",
      positionClasses[position],
      className
    )}>
      {children}
    </div>
  );
}

// Utility component for better spacing
interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Spacer({ size = 'md' }: SpacerProps) {
  const sizeClasses = {
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12'
  };

  return <div className={sizeClasses[size]} />;
}
