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

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBeverages, setFilteredBeverages] =
    useState<Beverage[]>(beverages);
  const [filterError, setFilterError] = useState<string | null>(error);

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
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOption = sortOptions.find(
        (option) => option.value === e.target.value
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Dashboard Header - More compact for mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Collection
          </h1>
          <p className="text-sm text-muted-foreground">
            Track, rate, and discover your favorite beverages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            asChild
          >
            <Link href="/dashboard/stats">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">View Stats</span>
            </Link>
          </Button>

          <Button className="bg-primary hover:bg-primary/90" size="sm" asChild>
            <Link href="/dashboard/add">
              <Plus className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Add Beverage</span>
            </Link>
          </Button>
        </div>
      </div>

      {(error || filterError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="flex items-center text-sm">
            <span className="mr-2">⚠️</span>
            {error || filterError}
          </p>
        </div>
      )}

      {/* Search and Filter Bar - Simplified for mobile */}
      <div className="bg-card border rounded-xl p-3 mb-4 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search beverages..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <Button
              variant={!currentType && !currentLiked ? "default" : "outline"}
              size="sm"
              className="rounded-full shrink-0"
              onClick={clearFilters}
              disabled={isPending}
            >
              All
            </Button>
            <Button
              variant={currentType === "Beer" ? "default" : "outline"}
              size="sm"
              className="rounded-full shrink-0"
              onClick={() => applyFilter("Beer", currentLiked || undefined)}
              disabled={isPending}
            >
              <Beer className="h-4 w-4 mr-1" />
              Beer
            </Button>
            <Button
              variant={currentType === "Wine" ? "default" : "outline"}
              size="sm"
              className="rounded-full shrink-0"
              onClick={() => applyFilter("Wine", currentLiked || undefined)}
              disabled={isPending}
            >
              <Wine className="h-4 w-4 mr-1" />
              Wine
            </Button>
            <Button
              variant={currentLiked === "true" ? "default" : "outline"}
              size="sm"
              className="rounded-full shrink-0"
              onClick={() => applyFilter(currentType || undefined, "true")}
              disabled={isPending}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Liked
            </Button>
            <Button
              variant={currentLiked === "false" ? "default" : "outline"}
              size="sm"
              className="rounded-full shrink-0"
              onClick={() => applyFilter(currentType || undefined, "false")}
              disabled={isPending}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Disliked
            </Button>

            <select
              className="bg-background border rounded-md px-2 py-1 text-sm ml-auto shrink-0"
              value={currentSortOption.value}
              onChange={handleSortChange}
              disabled={isPending}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Beverage Cards - Adjusted for better mobile display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isPending ?
          // Show skeleton UI during loading
          Array.from({ length: 3 }).map((_, index) => (
            <BeverageCardSkeleton key={`skeleton-${index}`} />
          ))
        : filteredBeverages.length === 0 && !error ?
          <div className="col-span-full text-center py-8">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Wine className="h-8 w-8 sm:h-10 sm:w-10 text-primary/50" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              No beverages found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ?
                "Try adjusting your search or filters."
              : "Start building your collection by adding your first beverage."}
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
              <Button size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        : filteredBeverages.map((beverage: Beverage) => (
            <div
              key={beverage.id}
              className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                      {beverage.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
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
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mb-3 flex-1 mt-1 line-clamp-2">
                  {beverage.notes}
                </p>

                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-1">
                    {beverage.liked ?
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                    : <ThumbsDown className="h-4 w-4 text-red-500" />}
                  </div>

                  <div className="flex items-center gap-1">
                    <TooltipButton
                      tooltip="Edit"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                    >
                      <Link href={`/dashboard/edit/${beverage.id}`}>
                        <PenSquare className="h-3.5 w-3.5" />
                      </Link>
                    </TooltipButton>

                    <TooltipButton
                      tooltip="View Details"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                    >
                      <Link href={`/dashboard/view/${beverage.id}`}>
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </TooltipButton>

                    <DeleteBeverageButton
                      id={beverage.id}
                      name={beverage.name}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
