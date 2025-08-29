"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  ShoppingCart,
  Star,
  MapPin,
  Calendar,
  Eye,
  Verified,
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImprovedCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function ImprovedCard({ 
  children, 
  className, 
  padding = 'md', 
  hover = true, 
  clickable = false,
  onClick 
}: ImprovedCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm",
        hover && "transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600",
        clickable && "cursor-pointer hover:scale-[1.02]",
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface MarketplaceCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  seller: {
    name: string;
    verified: boolean;
    rating: number;
    location: string;
  };
  badges?: string[];
  stats: {
    views: number;
    likes: number;
    age?: string;
    breed?: string;
  };
  onLike?: () => void;
  onShare?: () => void;
  onMessage?: () => void;
  onBuy?: () => void;
  className?: string;
}

export function MarketplaceCard({
  id,
  title,
  price,
  originalPrice,
  image,
  images = [],
  seller,
  badges = [],
  stats,
  onLike,
  onShare,
  onMessage,
  onBuy,
  className
}: MarketplaceCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  const allImages = [image, ...images];
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.();
  };

  return (
    <ImprovedCard className={cn("overflow-hidden group", className)} padding="none" clickable>
      {/* Image Section - 70% of card height */}
      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
        <img 
          src={allImages[currentImageIndex]} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Image Navigation Dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {badges.map((badge, index) => (
            <Badge key={index} className="text-xs bg-black/70 text-white border-0">
              {badge}
            </Badge>
          ))}
          {hasDiscount && (
            <Badge className="text-xs bg-red-600 text-white border-0">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 text-white border-0"
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 text-white border-0"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.();
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg">
          <div className="flex items-center gap-1">
            <span className="font-bold text-lg">{price.toLocaleString()}</span>
            <span className="text-xs">ETB</span>
          </div>
          {hasDiscount && (
            <div className="text-xs line-through text-gray-300">
              {originalPrice?.toLocaleString()} ETB
            </div>
          )}
        </div>
      </div>

      {/* Content Section - 30% of card height */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 text-sm sm:text-base">
          {title}
        </h3>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            {stats.age && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{stats.age}</span>
              </div>
            )}
            {stats.breed && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>{stats.breed}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{stats.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{stats.likes}</span>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {seller.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-xs text-gray-900 dark:text-gray-100">
                  {seller.name}
                </span>
                {seller.verified && (
                  <Verified className="h-3 w-3 text-blue-600" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{seller.rating}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{seller.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8"
            onClick={(e) => {
              e.stopPropagation();
              onMessage?.();
            }}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            <span className="text-xs">Chat</span>
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8 bg-green-600 hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              onBuy?.();
            }}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            <span className="text-xs">Buy Now</span>
          </Button>
        </div>
      </div>
    </ImprovedCard>
  );
}

interface AnimalCardProps {
  id: string;
  name?: string;
  animalId: string;
  type: string;
  image?: string;
  age: string;
  status: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    color: string;
  };
  stats?: {
    milkToday?: number;
    healthDue?: boolean;
    pregnant?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export function AnimalCard({
  id,
  name,
  animalId,
  type,
  image,
  age,
  status,
  stats,
  onClick,
  className
}: AnimalCardProps) {
  return (
    <ImprovedCard 
      className={cn("overflow-hidden", className)} 
      padding="none" 
      clickable 
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-32 sm:h-40 bg-gray-100 dark:bg-gray-700">
        {image ? (
          <img 
            src={image} 
            alt={name || animalId}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl">
              {type === 'cattle' && '🐄'}
              {type === 'goat' && '🐐'}
              {type === 'sheep' && '🐑'}
              {type === 'poultry' && '🐔'}
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant={status.variant as any}
            className="text-xs"
            style={{ backgroundColor: status.color }}
          >
            {status.text}
          </Badge>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {stats.milkToday && (
              <Badge className="text-xs bg-blue-600 text-white border-0">
                {stats.milkToday}L
              </Badge>
            )}
            {stats.pregnant && (
              <Badge className="text-xs bg-pink-600 text-white border-0">
                🤱
              </Badge>
            )}
            {stats.healthDue && (
              <Badge className="text-xs bg-red-600 text-white border-0">
                ⚠️
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
            {name || animalId}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {animalId}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span className="capitalize">{type}</span>
          <span>{age}</span>
        </div>
      </div>
    </ImprovedCard>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
  className
}: StatsCardProps) {
  return (
    <ImprovedCard className={cn("", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={cn("p-3 rounded-full", color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <TrendingUp className={cn(
            "h-3 w-3",
            trend.isPositive ? "text-green-600" : "text-red-600 rotate-180"
          )} />
          <span className={cn(
            "text-xs font-medium",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            from last month
          </span>
        </div>
      )}
    </ImprovedCard>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const gridClasses = `grid grid-cols-${cols.mobile} sm:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;

  return (
    <div className={cn(gridClasses, gapClasses[gap], className)}>
      {children}
    </div>
  );
}
