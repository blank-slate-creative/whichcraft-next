"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";

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

interface BeverageData {
  name: string;
  producer: string;
  type: string;
  style?: string;
  notes?: string;
  liked: boolean | null;
  location?: string;
}

// Client component for the search functionality
function BeverageSearch({
  onSelect,
}: {
  onSelect: (data: BeverageData) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("beer");
  const [searchResults, setSearchResults] = useState<Brewery[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setIsLoading(true);

    try {
      if (searchType === "beer") {
        // Search for breweries using Open Brewery DB
        const response = await fetch(
          `https://api.openbrewerydb.org/v1/breweries/search?query=${encodeURIComponent(searchTerm)}`
        );
        const data = await response.json();
        setSearchResults(data);
      } else if (searchType === "wine") {
        // For wine, we would integrate with a wine API
        // For now, just show a placeholder message
        setSearchResults([
          { id: "wine-placeholder", name: "Wine API integration coming soon" },
        ]);
      }
    } catch (error) {
      console.error("Error searching for beverages:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrewerySelect = (brewery: Brewery) => {
    onSelect({
      name: `Beer from ${brewery.name}`,
      producer: brewery.name,
      type: "Beer",
      location:
        brewery.city && brewery.state ?
          `${brewery.city}, ${brewery.state}`
        : "",
      style: brewery.brewery_type || "",
      liked: null,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search for a brewery or wine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="flex items-center space-x-2">
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

      {searchResults.length > 0 && (
        <div className="bg-card border rounded-lg p-4 max-h-60 overflow-y-auto">
          <h3 className="text-sm font-medium mb-2">Search Results</h3>
          <ul className="space-y-2">
            {searchResults.map((result) => (
              <li key={result.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => handleBrewerySelect(result)}
                >
                  <div>
                    <div className="font-medium">{result.name}</div>
                    {result.city && result.state && (
                      <div className="text-sm text-muted-foreground">
                        {result.city}, {result.state}
                      </div>
                    )}
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Main form component
export default function AddBeverageForm({ user }: { user: { id: string } }) {
  const [formData, setFormData] = useState<BeverageData>({
    name: "",
    producer: "",
    type: "Beer",
    style: "",
    notes: "",
    liked: null,
    location: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectBeverage = (beverageData: BeverageData) => {
    setFormData({ ...formData, ...beverageData });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.type || formData.liked === null) {
      alert("Please fill in all required fields and rate the beverage");
      return;
    }

    try {
      // Submit to API
      const response = await fetch("/api/beverages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user_id: user.id,
          rating: formData.liked ? 1 : 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save beverage");
      }

      // Redirect to dashboard on success
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error saving beverage:", error);
      alert("Failed to save beverage. Please try again.");
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
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
              placeholder="e.g. Sierra Nevada Pale Ale"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="producer">Producer/Brewery/Winery</Label>
            <Input
              id="producer"
              placeholder="e.g. Sierra Nevada Brewing Co."
              value={formData.producer}
              onChange={handleInputChange}
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
                  checked={formData.type === "Beer"}
                  onCheckedChange={() =>
                    setFormData({ ...formData, type: "Beer" })
                  }
                />
                <Label htmlFor="type-beer" className="font-normal">
                  Beer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-wine"
                  checked={formData.type === "Wine"}
                  onCheckedChange={() =>
                    setFormData({ ...formData, type: "Wine" })
                  }
                />
                <Label htmlFor="type-wine" className="font-normal">
                  Wine
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-other"
                  checked={formData.type === "Other"}
                  onCheckedChange={() =>
                    setFormData({ ...formData, type: "Other" })
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
              placeholder="e.g. Pale Ale, Sauvignon Blanc"
              value={formData.style}
              onChange={handleInputChange}
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
              variant={formData.liked === true ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, liked: true })}
              className="flex items-center space-x-2"
            >
              <span>👍</span>
              <span>Like</span>
            </Button>
            <Button
              type="button"
              variant={formData.liked === false ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, liked: false })}
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
            placeholder="Describe the flavor, aroma, appearance, and your overall impression..."
            rows={5}
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4 p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Location</h2>

        <div className="space-y-2">
          <Label htmlFor="location">Where did you try it?</Label>
          <Input
            id="location"
            placeholder="e.g. Craft Beer Bar, Home"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard">Cancel</Link>
        </Button>
        <Button type="submit">Save Beverage</Button>
      </div>
    </form>
  );
}
