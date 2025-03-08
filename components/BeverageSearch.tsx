'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BeverageData } from './BeverageForm';

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

export function BeverageSearch({ onSelect }: { onSelect: (data: BeverageData) => void }) {
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
