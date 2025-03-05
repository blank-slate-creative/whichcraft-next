"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { saveBeverageAction, redirectToDashboard } from "./actions";
import { Search } from "lucide-react";

// Custom Textarea component
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

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
}

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
}

// Client component for the search functionality
function BeverageSearch({
  onSelect,
}: {
  onSelect: (data: BeverageData) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("beer");
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
      if (searchType === "beer") {
        // Use our Flask API that proxies the Untappd Algolia search
        const response = await fetch(
          `/api/search/beer?q=${encodeURIComponent(searchTerm)}`
        );

        const data = await response.json();

        if (Array.isArray(data)) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } else if (searchType === "wine") {
        // For wine, we would integrate with a wine API
        // For now, just show a placeholder message
        setSearchResults([
          {
            id: 0,
            name: "Wine API integration coming soon",
            type_name: "Coming soon",
            brewery_name: "Wine search will be available in a future update",
            brewery_id: 0,
            rating: 0,
            rating_count: 0,
            image_url: "",
            abv: 0,
          },
        ]);
      }
    } catch (error) {
      console.error("Error searching for beverages:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBeerSelect = (beer: Beer) => {
    onSelect({
      name: beer.name,
      producer: beer.brewery_name || "Unknown Brewery",
      type: "Beer",
      style: beer.type_name,
      liked: null,
      abv: beer.abv || "",
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full space-y-3">
      <div className="relative w-full">
        <div className="relative">
          <Input
            ref={searchInputRef}
            placeholder="Search for a beer or wine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
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
            className="absolute z-50 w-full mt-1 bg-card border rounded-lg shadow-md overflow-hidden max-h-[350px] overflow-y-auto"
          >
            <div className="p-3 bg-muted/50 border-b flex items-center justify-between">
              <h3 className="text-sm font-medium">Search Results</h3>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{searchResults.length} results</span>
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
              {searchResults.map((result) => (
                <li key={result.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start text-left p-3 h-auto rounded-none hover:bg-accent"
                    onClick={() => handleBeerSelect(result)}
                  >
                    <div className="flex items-start gap-4 w-full">
                      {result.image_url ?
                        <div className="flex-shrink-0">
                          <img
                            src={result.image_url}
                            alt={result.name}
                            className="h-14 w-auto object-contain rounded-sm"
                          />
                        </div>
                      : <div className="flex-shrink-0 h-14 w-14 bg-muted rounded-sm flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">
                            No image
                          </span>
                        </div>
                      }
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {result.name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span>{result.brewery_name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {result.abv}% ABV
                          </span>
                          {result.type_name && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
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

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-beer"
              checked={searchType === "beer"}
              onCheckedChange={() => setSearchType("beer")}
            />
            <Label htmlFor="type-beer" className="font-normal">
              Beer
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-wine"
              checked={searchType === "wine"}
              onCheckedChange={() => setSearchType("wine")}
            />
            <Label htmlFor="type-wine" className="font-normal">
              Wine
            </Label>
          </div>
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </div>
  );
}

// Submit button component
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Beverage"}
    </Button>
  );
}

// Main form component
export default function AddBeverageForm() {
  const [formState, formAction] = React.useActionState(saveBeverageAction, {
    status: "idle",
  });

  const [beverageData, setBeverageData] = useState<BeverageData>({
    name: "",
    producer: "",
    type: "Beer",
    style: "",
    notes: "",
    liked: null,
    abv: "",
  });

  const handleSelectBeverage = (data: BeverageData) => {
    setBeverageData(data);
  };

  // Redirect to dashboard when form submission is successful
  React.useEffect(() => {
    if (formState.status === "success") {
      redirectToDashboard();
    }
  }, [formState.status]);

  return (
    <form action={formAction} className="space-y-8">
      {/* Hidden fields for form state */}
      <input type="hidden" name="type" value={beverageData.type} />
      <input
        type="hidden"
        name="liked"
        value={beverageData.liked === null ? "" : String(beverageData.liked)}
      />

      {/* Search Section */}
      <div className="space-y-4 p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Search for a Beverage</h2>
        <BeverageSearch onSelect={handleSelectBeverage} />
      </div>

      {/* Basic Information */}
      <div className="space-y-4 p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Beverage Name*</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Sierra Nevada Pale Ale"
              defaultValue={beverageData.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="producer">Producer/Brewery/Winery</Label>
            <Input
              id="producer"
              name="producer"
              placeholder="e.g. Sierra Nevada Brewing Co."
              defaultValue={beverageData.producer}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type*</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-beer"
                  checked={beverageData.type === "Beer"}
                  onCheckedChange={() =>
                    setBeverageData({ ...beverageData, type: "Beer" })
                  }
                />
                <Label htmlFor="type-beer" className="font-normal">
                  Beer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-wine"
                  checked={beverageData.type === "Wine"}
                  onCheckedChange={() =>
                    setBeverageData({ ...beverageData, type: "Wine" })
                  }
                />
                <Label htmlFor="type-wine" className="font-normal">
                  Wine
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-other"
                  checked={beverageData.type === "Other"}
                  onCheckedChange={() =>
                    setBeverageData({ ...beverageData, type: "Other" })
                  }
                />
                <Label htmlFor="type-other" className="font-normal">
                  Other
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Input
              id="style"
              name="style"
              placeholder="e.g. Pale Ale, Sauvignon Blanc"
              value={beverageData.style}
              onChange={(e) =>
                setBeverageData({ ...beverageData, style: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abv">ABV (%)</Label>
            <Input
              id="abv"
              name="abv"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="e.g. 5.5"
              value={beverageData.abv}
              onChange={(e) =>
                setBeverageData({ ...beverageData, abv: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Rating & Notes */}
      <div className="space-y-4 p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Rating & Notes</h2>

        <div className="space-y-2">
          <Label>Did you like it?*</Label>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant={beverageData.liked === true ? "default" : "outline"}
              onClick={() => setBeverageData({ ...beverageData, liked: true })}
              className="flex items-center space-x-2"
            >
              <span>👍</span>
              <span>Like</span>
            </Button>
            <Button
              type="button"
              variant={beverageData.liked === false ? "default" : "outline"}
              onClick={() => setBeverageData({ ...beverageData, liked: false })}
              className="flex items-center space-x-2"
            >
              <span>👎</span>
              <span>Dislike</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Tasting Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Describe the flavor, aroma, appearance, and your overall impression..."
            rows={5}
            defaultValue={beverageData.notes}
          />
        </div>
      </div>

      {/* Form status messages */}
      {formState.status === "error" && (
        <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-4 py-2 bg-destructive/10 rounded">
          {formState.message}
        </div>
      )}

      {formState.status === "success" && (
        <div className="text-green-700 border-l-2 border-green-500 px-4 py-2 bg-green-50 rounded">
          {formState.message}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Cancel</Link>
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
