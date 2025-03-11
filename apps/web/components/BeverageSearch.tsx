'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { BeverageData } from './BeverageForm';
import { BeverageDisplay, Beverage as ExtendedBeverage } from './BeverageDisplay';

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

export interface BeverageSearchProps {
  onSelect: (data: BeverageData) => void;
  defaultSearchType?: string;
}

export function BeverageSearch({ onSelect }: BeverageSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
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
      // Use our Flask API that proxies the Untappd Algolia search
      const response = await fetch(`/api/search/beer?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching for beers:', error);
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
      style: beer.type_name || '',
      liked: null,
      abv: typeof beer.abv === 'number' ? beer.abv : null,
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
    <div className="relative w-full space-y-2">
      <div className="relative w-full">
        <div className="relative">
          <Input
            ref={searchInputRef}
            placeholder="Search for a beer..."
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
                    <BeverageDisplay
                      beverage={
                        {
                          id: result.id,
                          name: result.name,
                          producer: result.brewery_name || 'Unknown Brewery',
                          type: 'Beer',
                          style: result.type_name || '',
                          liked: false,
                          notes: '',
                          created_at: new Date().toISOString(),
                          abv: typeof result.abv === 'number' ? result.abv : undefined,
                          image_url: result.image_url,
                          untappd_beer_id: result.id,
                          untappd_brewery_id: result.brewery_id,
                        } as ExtendedBeverage
                      }
                      variant="compact"
                      imageSize="sm"
                      showLiked={false}
                      linkToDetail={false}
                      className="w-full"
                    />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSearch} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </div>
  );
}
