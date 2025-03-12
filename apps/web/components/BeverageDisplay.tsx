'use client';

import React from 'react';
import { Beer, Wine, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Beverage } from '@whichcraft/api-client';

export type BeverageDisplayVariant = 'list' | 'card' | 'detail' | 'compact';

export interface BeverageDisplayProps {
  beverage: Beverage;
  variant?: BeverageDisplayVariant;
  showLiked?: boolean;
  linkToDetail?: boolean;
  className?: string;
  imageSize?: 'sm' | 'md' | 'lg';
  showNotes?: boolean;
  showAbv?: boolean;
  showDate?: boolean;
}

// Client Component for image handling
const BeverageImage = ({
  imageUrl,
  name,
  producer,
  isBeer,
  imageSize,
  iconSizes,
}: {
  imageUrl?: string;
  name: string;
  producer: string;
  isBeer: boolean;
  imageSize: 'sm' | 'md' | 'lg';
  iconSizes: { [key: string]: string };
}) => {
  const imageSizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  if (!imageUrl) {
    return (
      <div
        className={`mr-3 flex-shrink-0 ${imageSizeClasses[imageSize]} bg-muted rounded-md flex items-center justify-center`}
      >
        {isBeer ? (
          <Beer className={`${iconSizes[imageSize]} text-muted-foreground/60`} />
        ) : (
          <Wine className={`${iconSizes[imageSize]} text-muted-foreground/60`} />
        )}
      </div>
    );
  }

  return (
    <div className={`mr-3 flex-shrink-0 ${imageSizeClasses[imageSize]} rounded-md overflow-hidden`}>
      <img
        src={imageUrl}
        alt={`${name} by ${producer}`}
        className="w-full h-full object-cover"
        onError={e => {
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.classList.add('flex', 'items-center', 'justify-center', 'bg-muted');
            const icon = document.createElement('div');
            icon.innerHTML = isBeer
              ? `<svg class="${iconSizes[imageSize]} text-muted-foreground/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"></path><path d="M9 12v6"></path><path d="M13 12v6"></path><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5s2-.5 3-.5 2 .5 3 .5 1.44-.5 3-.5a2.5 2.5 0 0 1 0 5c-1.56 0-2-.5-3-.5Z"></path><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"></path></svg>`
              : `<svg class="${iconSizes[imageSize]} text-muted-foreground/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"></path><path d="M7 10h10"></path><path d="M12 15v7"></path><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"></path></svg>`;
            parent.appendChild(icon);
          }
        }}
      />
    </div>
  );
};

export function BeverageDisplay({
  beverage,
  variant = 'list',
  showLiked = true,
  linkToDetail = true,
  className = '',
  imageSize = 'md',
  showNotes = false,
  showAbv = false,
  showDate = false,
}: BeverageDisplayProps) {
  // Define icon sizes
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
  };

  // Define badge icon sizes
  const badgeIconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  // Define text sizes
  const textSizes = {
    list: {
      title: 'text-sm font-medium line-clamp-1',
      producer: 'text-xs text-muted-foreground',
    },
    card: {
      title: 'text-base font-medium line-clamp-1',
      producer: 'text-sm text-muted-foreground',
    },
    detail: {
      title: 'text-lg font-semibold',
      producer: 'text-sm text-muted-foreground',
    },
    compact: {
      title: 'text-xs font-medium line-clamp-1',
      producer: 'text-xs text-muted-foreground',
    },
  };

  // Determine if this is a beer or wine
  const isBeer = beverage.type === 'Beer';

  // Render the badge
  const renderBadge = () => (
    <Badge
      variant="outline"
      className={cn(
        `${
          isBeer
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-rose-50 text-rose-700 border-rose-200'
        } flex items-center gap-1 text-xs`,
        variant === 'list' && 'max-w-full'
      )}
    >
      {isBeer ? (
        <Beer className={badgeIconSizes[imageSize]} />
      ) : (
        <Wine className={badgeIconSizes[imageSize]} />
      )}
      <span className={variant === 'list' ? 'truncate' : ''}>
        {beverage.style && beverage.style}
      </span>
    </Badge>
  );

  // Render the liked/disliked indicator
  const renderLiked = () => {
    if (!showLiked) return null;

    return (
      <div className="ml-2 flex-shrink-0">
        {beverage.liked ? (
          <ThumbsUp className="h-4 w-4 text-green-500" />
        ) : (
          <ThumbsDown className="h-4 w-4 text-red-500" />
        )}
      </div>
    );
  };

  // Render additional details for detail view
  const renderDetails = () => {
    if (variant !== 'detail' && !showAbv && !showDate && !showNotes) return null;

    return (
      <div className="mt-3 space-y-2">
        {(showDate || variant === 'detail') && (
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Added on</dt>
            <dd>{new Date(beverage.created_at).toLocaleDateString()}</dd>
          </div>
        )}

        {(showNotes || variant === 'detail') && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
            <p className="whitespace-pre-wrap text-sm">{beverage.notes || 'No notes added.'}</p>
          </div>
        )}
      </div>
    );
  };

  // Main content
  const content = (
    <div className={cn('flex items-start w-full', className)}>
      <BeverageImage
        imageUrl={beverage.image_url || undefined}
        name={beverage.name}
        producer={beverage.producer}
        isBeer={isBeer}
        imageSize={imageSize}
        iconSizes={iconSizes}
      />

      <div className="flex-1 min-w-0">
        <div className={textSizes[variant].title}>{beverage.name}</div>
        <div className={textSizes[variant].producer}>{beverage.producer}</div>

        <div className={cn('flex flex-wrap gap-1', variant === 'detail' ? 'mt-1' : 'mt-0.5')}>
          {renderBadge()}
          {(showAbv || variant === 'detail') &&
            beverage.abv !== undefined &&
            beverage.abv !== null && (
              <Badge
                variant="outline"
                className="inline-flex items-center bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                <span className="font-medium">{beverage.abv}% ABV</span>
              </Badge>
            )}
        </div>

        {renderDetails()}
      </div>

      {renderLiked()}
    </div>
  );

  // Wrap in link if linkToDetail is true
  if (linkToDetail) {
    return (
      <Link
        href={`/collection/${beverage.id}`}
        className={cn(
          'py-2 flex items-stretch hover:bg-accent/10 transition-colors rounded-md',
          variant === 'list' && 'py-3',
          variant === 'compact' && 'py-1.5',
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return content;
}
