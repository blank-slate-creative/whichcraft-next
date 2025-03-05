"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Beer,
  Eye,
  PenSquare,
  Plus,
  Search,
  Wine,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  SlidersHorizontal,
} from "lucide-react";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { DeleteBeverageButton } from "./delete-beverage-button";
import { useBeverages, Beverage } from "./beverage-context";
import { useState, useEffect, useCallback } from "react";
import { fetchBeveragesAction } from "./actions";
import { useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Define sort options
interface SortOption {
  label: string;
  value: string;
  field: "created_at" | "name" | "type" | "producer";
  order: "asc" | "desc";
}

const sortOptions: SortOption[] = [
  {
    label: "Date Added (Newest)",
    value: "date_desc",
    field: "created_at",
    order: "desc",
  },
  {
    label: "Date Added (Oldest)",
    value: "date_asc",
    field: "created_at",
    order: "asc",
  },
  { label: "Name (A-Z)", value: "name_asc", field: "name", order: "asc" },
  { label: "Name (Z-A)", value: "name_desc", field: "name", order: "desc" },
  { label: "Type", value: "type_asc", field: "type", order: "asc" },
  { label: "Producer", value: "producer_asc", field: "producer", order: "asc" },
];

interface DashboardContentProps {
  error: string | null;
}

// Skeleton component for beverage cards
function BeverageCardSkeleton() {
  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="w-full">
            <Skeleton className="h-5 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2 mb-1" />
            <div className="flex gap-1 mt-1">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        <div className="my-3 flex-1">
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        <div className="flex justify-between items-center mt-1">
          <Skeleton className="h-4 w-4" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardContent({ error }: DashboardContentProps) {
  const { beverages, setBeverages, stats, allBeverages, setAllBeverages } =
    useBeverages();
  const { beerCount, wineCount, totalCount, likedCount, dislikedCount } = stats;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get current filter values from URL
  const currentType = searchParams.get("type");
  const currentLiked = searchParams.get("liked");
  const currentSortBy = searchParams.get("sort_by") || "created_at";
  const currentSortOrder = searchParams.get("sort_order") || "desc";

  // Find the current sort option
  const currentSortOption =
    sortOptions.find(
      (option) =>
        option.field === currentSortBy && option.order === currentSortOrder
    ) || sortOptions[0];

  // State for search input and filter drawer
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBeverages, setFilteredBeverages] =
    useState<Beverage[]>(beverages);
  const [filterError, setFilterError] = useState<string | null>(error);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Apply search filter locally
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBeverages(beverages);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredBeverages(
        beverages.filter(
          (beverage) =>
            beverage.name.toLowerCase().includes(query) ||
            beverage.producer.toLowerCase().includes(query) ||
            beverage.style.toLowerCase().includes(query) ||
            beverage.notes.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, beverages]);

  // Fetch all beverages for stats on initial load
  useEffect(() => {
    const fetchAllBeverages = async () => {
      try {
        const result = await fetchBeveragesAction();
        if (result.success) {
          setAllBeverages(result.data);
        }
      } catch (err) {
        console.error("Error fetching all beverages:", err);
      }
    };

    fetchAllBeverages();
  }, [setAllBeverages]);

  // Handle filter changes
  const applyFilter = useCallback(
    (type?: string, liked?: string, sort_by?: string, sort_order?: string) => {
      // Update URL with filters
      const params = new URLSearchParams();

      if (type) {
        params.append("type", type);
      }

      if (liked) {
        params.append("liked", liked);
      }

      // Add sorting parameters
      if (sort_by) {
        params.append("sort_by", sort_by);
      } else if (currentSortBy) {
        params.append("sort_by", currentSortBy);
      }

      if (sort_order) {
        params.append("sort_order", sort_order);
      } else if (currentSortOrder) {
        params.append("sort_order", currentSortOrder);
      }

      // Update URL without full page refresh
      router.push(`/dashboard?${params.toString()}`, { scroll: false });

      // Close filter drawer after applying
      setIsFilterDrawerOpen(false);

      // Fetch filtered data using server action
      startTransition(async () => {
        try {
          const likedBoolean = liked ? liked === "true" : undefined;
          const result = await fetchBeveragesAction({
            type,
            liked: likedBoolean,
            sort_by: (sort_by || currentSortBy) as any,
            sort_order: (sort_order || currentSortOrder) as any,
          });

          if (result.success) {
            setBeverages(result.data);
            setFilterError(null);
          } else {
            setFilterError(result.message || "Failed to apply filters");
          }
        } catch (err) {
          console.error("Error applying filters:", err);
          setFilterError("Failed to apply filters");
        }
      });
    },
    [router, setBeverages, currentSortBy, currentSortOrder]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (value: string) => {
      const selectedOption = sortOptions.find(
        (option) => option.value === value
      );
      if (selectedOption) {
        applyFilter(
          currentType || undefined,
          currentLiked || undefined,
          selectedOption.field,
          selectedOption.order
        );
      }
    },
    [applyFilter, currentType, currentLiked]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push("/dashboard", { scroll: false });
    setSearchQuery("");
    setIsFilterDrawerOpen(false);

    // Fetch all beverages without filters
    startTransition(async () => {
      try {
        const result = await fetchBeveragesAction({
          sort_by: "created_at",
          sort_order: "desc",
        });

        if (result.success) {
          setBeverages(result.data);
          setFilterError(null);
        } else {
          setFilterError(result.message || "Failed to clear filters");
        }
      } catch (err) {
        console.error("Error clearing filters:", err);
        setFilterError("Failed to clear filters");
      }
    });
  }, [router, setBeverages]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative">
      {/* Main Content Area with padding for bottom nav */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-4">
          {/* Dashboard Header - Simplified for mobile */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold tracking-tight">Collection</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="relative"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {(currentType || currentLiked) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
                )}
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/stats">
                  <BarChart3 className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Bar - Simplified */}
          <div className="relative w-full mb-4">
            <Input
              type="text"
              placeholder="Search beverages..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery("")}
              >
                <span className="sr-only">Clear search</span>×
              </Button>
            )}
          </div>

          {/* Error Message */}
          {(error || filterError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="flex items-center text-sm">
                <span className="mr-2">⚠️</span>
                {error || filterError}
              </p>
            </div>
          )}

          {/* Active Filters Display */}
          {(currentType || currentLiked) && (
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs text-muted-foreground">Filters:</span>
              {currentType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {currentType === "Beer" ?
                    <Beer className="h-3 w-3" />
                  : <Wine className="h-3 w-3" />}
                  {currentType}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() =>
                      applyFilter(undefined, currentLiked || undefined)
                    }
                  >
                    <span className="sr-only">Remove filter</span>×
                  </Button>
                </Badge>
              )}
              {currentLiked && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {currentLiked === "true" ?
                    <ThumbsUp className="h-3 w-3" />
                  : <ThumbsDown className="h-3 w-3" />}
                  {currentLiked === "true" ? "Liked" : "Disliked"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() =>
                      applyFilter(currentType || undefined, undefined)
                    }
                  >
                    <span className="sr-only">Remove filter</span>×
                  </Button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Beverage Cards - Mobile optimized */}
          <div className="space-y-3">
            {isPending ?
              // Show skeleton UI during loading
              Array.from({ length: 3 }).map((_, index) => (
                <BeverageCardSkeleton key={`skeleton-${index}`} />
              ))
            : filteredBeverages.length === 0 && !error ?
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Wine className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">No beverages found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ?
                    "Try adjusting your search or filters."
                  : "Start building your collection by adding your first beverage."
                  }
                </p>
                {!searchQuery && (
                  <Button size="sm" asChild>
                    <Link href="/dashboard/add">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Your First Beverage
                    </Link>
                  </Button>
                )}
                {searchQuery && (
                  <Button size="sm" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            : filteredBeverages.map((beverage: Beverage) => (
                <Link
                  key={beverage.id}
                  href={`/dashboard/edit/${beverage.id}`}
                  className="block"
                >
                  <div className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 active:bg-muted/50">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base line-clamp-1">
                            {beverage.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {beverage.producer}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge
                              variant="outline"
                              className={`${
                                beverage.type === "Beer" ?
                                  "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                              } flex items-center gap-1 text-xs`}
                            >
                              {beverage.type === "Beer" ?
                                <Beer className="h-3 w-3" />
                              : <Wine className="h-3 w-3" />}
                              {beverage.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${
                                beverage.type === "Beer" ?
                                  "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                              } text-xs`}
                            >
                              {beverage.style}
                            </Badge>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {beverage.liked ?
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                          : <ThumbsDown className="h-4 w-4 text-red-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
          <SheetHeader className="text-left">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Beverage Type</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!currentType ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() =>
                    applyFilter(undefined, currentLiked || undefined)
                  }
                >
                  All Types
                </Button>
                <Button
                  variant={currentType === "Beer" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => applyFilter("Beer", currentLiked || undefined)}
                >
                  <Beer className="h-4 w-4 mr-1" />
                  Beer
                </Button>
                <Button
                  variant={currentType === "Wine" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => applyFilter("Wine", currentLiked || undefined)}
                >
                  <Wine className="h-4 w-4 mr-1" />
                  Wine
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Rating</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!currentLiked ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() =>
                    applyFilter(currentType || undefined, undefined)
                  }
                >
                  All Ratings
                </Button>
                <Button
                  variant={currentLiked === "true" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => applyFilter(currentType || undefined, "true")}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Liked
                </Button>
                <Button
                  variant={currentLiked === "false" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => applyFilter(currentType || undefined, "false")}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Disliked
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Sort By</h3>
              <div className="grid grid-cols-1 gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      currentSortOption.value === option.value ?
                        "default"
                      : "outline"
                    }
                    size="sm"
                    className="justify-start"
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsFilterDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={clearFilters}
              >
                Reset All
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating Action Button for Mobile */}
      <div className="md:hidden fixed bottom-20 right-4 z-10">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          asChild
        >
          <Link href="/dashboard/add">
            <Plus className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
