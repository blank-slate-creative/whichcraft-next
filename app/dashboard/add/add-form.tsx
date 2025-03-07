'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef, useEffect } from 'react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom';
import { saveBeverageAction, redirectToDashboard } from './actions';
import { Search, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ImageUpload } from '@/components/ui/image-upload';

// Custom Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

// Define types for our data
interface Brewery {
  id: string;
  name: string;
  city?: string;
  state?: string;
  brewery_type?: string;
}

interface Beer {
  id: number;
  name: string;
  type_name: string;
  rating: number;
  rating_count: number;
  image_url?: string;
  abv: number;
  brewery_name: string;
  brewery_id: number;
}

interface BeverageData {
  name: string;
  producer: string;
  type: string;
  style?: string;
  notes?: string;
  liked: boolean | null;
  abv?: number | string;
  untappd_beer_id?: number;
  untappd_brewery_id?: number;
  image_url?: string;
}

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}

// Client component for the search functionality
function BeverageSearch({ onSelect }: { onSelect: (data: BeverageData) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('beer');
  const [searchResults, setSearchResults] = useState<Beer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      if (searchType === 'beer') {
        // Use our Flask API that proxies the Untappd Algolia search
        const response = await fetch(`/api/search/beer?q=${encodeURIComponent(searchTerm)}`);

        const data = await response.json();

        if (Array.isArray(data)) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } else if (searchType === 'wine') {
        // For wine, we would integrate with a wine API
        // For now, just show a placeholder message
        setSearchResults([
          {
            id: 0,
            name: 'Wine API integration coming soon',
            type_name: 'Coming soon',
            brewery_name: 'Wine search will be available in a future update',
            brewery_id: 0,
            rating: 0,
            rating_count: 0,
            image_url: '',
            abv: 0,
          },
        ]);
      }
    } catch (error) {
      console.error('Error searching for beverages:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBeerSelect = (beer: Beer) => {
    onSelect({
      name: beer.name,
      producer: beer.brewery_name || 'Unknown Brewery',
      type: 'Beer',
      style: beer.type_name,
      liked: null,
      abv: beer.abv || '',
      untappd_beer_id: beer.id,
      untappd_brewery_id: beer.brewery_id,
      image_url: beer.image_url,
    });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full space-y-2 sm:space-y-3">
      <div className="relative w-full">
        <div className="relative">
          <Input
            ref={searchInputRef}
            placeholder="Search for a beer or wine..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            onFocus={() => {
              if (searchResults.length > 0) setIsOpen(true);
            }}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
            onClick={handleSearch}
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
            {isLoading && <span className="sr-only">Loading...</span>}
          </Button>
        </div>

        {isOpen && searchResults.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-card border rounded-lg shadow-md overflow-hidden max-h-[300px] sm:max-h-[350px] overflow-y-auto"
          >
            <div className="p-2 sm:p-3 bg-muted/50 border-b flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-medium">Search Results</h3>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="hidden sm:inline">{searchResults.length} results</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            <ul className="divide-y">
              {searchResults.map(result => (
                <li key={result.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start text-left p-2 sm:p-3 h-auto rounded-none hover:bg-accent"
                    onClick={() => handleBeerSelect(result)}
                  >
                    <div className="flex items-start gap-2 sm:gap-4 w-full">
                      {result.image_url ? (
                        <div className="flex-shrink-0">
                          <img
                            src={result.image_url}
                            alt={result.name}
                            className="h-10 sm:h-14 w-auto object-contain rounded-sm"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 sm:h-14 sm:w-14 bg-muted rounded-sm flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">No image</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm sm:text-base">
                          {result.name}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span>{result.brewery_name}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {result.abv}% ABV
                          </span>
                          {result.type_name && (
                            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              {result.type_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div className="flex items-center space-x-4">
          <RadioGroup
            value={searchType}
            onValueChange={setSearchType}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="type-beer" value="beer" />
              <Label htmlFor="type-beer" className="font-normal">
                Beer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="type-wine" value="wine" />
              <Label htmlFor="type-wine" className="font-normal">
                Wine
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Button onClick={handleSearch} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </div>
  );
}

// Submit button component
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto min-w-[120px]">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        'Save Beverage'
      )}
    </Button>
  );
}

// Main form component
export default function AddBeverageForm() {
  const [formState, formAction] = React.useActionState(saveBeverageAction, {
    status: 'idle',
  });

  const [beverageData, setBeverageData] = useState<BeverageData>({
    name: '',
    producer: '',
    type: 'Beer',
    style: '',
    notes: '',
    liked: null,
    abv: '',
  });

  const handleSelectBeverage = (data: BeverageData) => {
    setBeverageData(data);
  };

  // Redirect to dashboard when form submission is successful
  React.useEffect(() => {
    if (formState.status === 'success') {
      redirectToDashboard();
    }
  }, [formState.status]);

  return (
    <form action={formAction} className="space-y-6 sm:space-y-8">
      {/* Hidden fields for form state */}
      <input type="hidden" name="type" value={beverageData.type} />
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
      <input type="hidden" name="image_url" value={beverageData.image_url || ''} />

      {/* Search Section */}
      <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-card rounded-lg border">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Search for a Beverage</h2>
        <BeverageSearch onSelect={handleSelectBeverage} />
      </div>

      {/* Basic Information */}
      <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-card rounded-lg border">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="name">Beverage Name*</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Sierra Nevada Pale Ale"
              value={beverageData.name}
              onChange={e => setBeverageData({ ...beverageData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="producer">Producer/Brewery/Winery</Label>
            <Input
              id="producer"
              name="producer"
              placeholder="e.g. Sierra Nevada Brewing Co."
              value={beverageData.producer}
              onChange={e => setBeverageData({ ...beverageData, producer: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label>Type*</Label>
            <RadioGroup
              value={beverageData.type}
              onValueChange={(value: string) => setBeverageData({ ...beverageData, type: value })}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="form-type-beer" value="Beer" />
                <Label htmlFor="form-type-beer" className="font-normal">
                  Beer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="form-type-wine" value="Wine" />
                <Label htmlFor="form-type-wine" className="font-normal">
                  Wine
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="form-type-other" value="Other" />
                <Label htmlFor="form-type-other" className="font-normal">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="style">Style</Label>
            <Input
              id="style"
              name="style"
              placeholder="e.g. Pale Ale, Sauvignon Blanc"
              value={beverageData.style}
              onChange={e => setBeverageData({ ...beverageData, style: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="abv">ABV (%)</Label>
            <Input
              id="abv"
              name="abv"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="e.g. 5.5"
              value={beverageData.abv || ''}
              onChange={e => setBeverageData({ ...beverageData, abv: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label>Image</Label>
            <ImageUpload
              imageUrl={beverageData.image_url}
              onImageChange={imageUrl => setBeverageData({ ...beverageData, image_url: imageUrl })}
            />
          </div>
        </div>
      </div>

      {/* Rating & Notes */}
      <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-card rounded-lg border">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Rating & Notes</h2>

        <div className="space-y-1.5 sm:space-y-2">
          <Label>Did you like it?*</Label>
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="button"
              variant={beverageData.liked === true ? 'default' : 'outline'}
              onClick={() => setBeverageData({ ...beverageData, liked: true })}
              className="flex items-center space-x-2 flex-1 sm:flex-none justify-center"
              size="sm"
            >
              <span>👍</span>
              <span>Like</span>
            </Button>
            <Button
              type="button"
              variant={beverageData.liked === false ? 'default' : 'outline'}
              onClick={() => setBeverageData({ ...beverageData, liked: false })}
              className="flex items-center space-x-2 flex-1 sm:flex-none justify-center"
              size="sm"
            >
              <span>👎</span>
              <span>Dislike</span>
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="notes">Tasting Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Describe the flavor, aroma, appearance, and your overall impression..."
            rows={4}
            defaultValue={beverageData.notes}
          />
        </div>
      </div>

      {/* Form status messages */}
      {formState.status === 'error' && (
        <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-3 sm:px-4 py-2 bg-destructive/10 rounded text-sm">
          {formState.message}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center sm:justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
