'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { BeverageDisplay } from '@/components/BeverageDisplay';
import { Beverage } from '@whichcraft/api-client';

interface BeverageRatingFormProps {
  beverageData: Beverage;
  onBeverageDataChange: (data: Partial<Beverage>) => void;
  showPreview?: boolean;
  children?: React.ReactNode;
}

export function BeverageRatingForm({
  beverageData,
  onBeverageDataChange,
  showPreview = true,
  children,
}: BeverageRatingFormProps) {
  return (
    <div className="space-y-4">
      {showPreview && (
        <BeverageDisplay
          beverage={{
            id: 'preview',
            name: beverageData.name,
            producer: beverageData.producer || '',
            type: beverageData.type || 'Beer',
            style: beverageData.style || '',
            liked: beverageData.liked === null ? false : beverageData.liked,
            notes: beverageData.notes || '',
            created_at: new Date().toISOString(),
            abv: beverageData.abv ?? null,
            image_url: beverageData.image_url ?? null,
            untappd_beer_id: beverageData.untappd_beer_id ?? null,
            untappd_brewery_id: beverageData.untappd_brewery_id ?? null,
          }}
          variant="card"
          imageSize="md"
          showLiked={true}
          linkToDetail={false}
          showAbv={true}
        />
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Did you like it?*</Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={beverageData.liked === true ? 'default' : 'outline'}
              onClick={() => onBeverageDataChange({ liked: true })}
              className="flex-1 sm:flex-none"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              <span>Like</span>
            </Button>
            <Button
              type="button"
              variant={beverageData.liked === false ? 'default' : 'outline'}
              onClick={() => onBeverageDataChange({ liked: false })}
              className="flex-1 sm:flex-none"
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              <span>Dislike</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Tasting Notes</Label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Describe the flavor, aroma, appearance, and your overall impression..."
            value={beverageData.notes || ''}
            onChange={e => onBeverageDataChange({ notes: e.target.value })}
          />
        </div>

        {/* Hidden form fields for all beverage data */}
        <input type="hidden" name="name" value={beverageData.name} />
        <input type="hidden" name="producer" value={beverageData.producer || ''} />
        <input type="hidden" name="type" value={beverageData.type || 'Beer'} />
        <input type="hidden" name="style" value={beverageData.style || ''} />
        <input
          type="hidden"
          name="abv"
          value={beverageData.abv === null ? '' : (beverageData.abv ?? '')}
        />
        <input type="hidden" name="image_url" value={beverageData.image_url || ''} />
        <input
          type="hidden"
          name="liked"
          value={beverageData.liked === null ? '' : String(beverageData.liked)}
        />
        <input type="hidden" name="untappd_beer_id" value={beverageData.untappd_beer_id || ''} />
        <input
          type="hidden"
          name="untappd_brewery_id"
          value={beverageData.untappd_brewery_id || ''}
        />
      </div>

      {children}
    </div>
  );
}
