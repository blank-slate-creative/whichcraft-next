"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { TooltipButton } from "@/components/ui/tooltip-button";
import { DeleteBeverageButton } from "./delete-beverage-button";
import { useBeverages, Beverage } from "./beverage-context";

interface DashboardContentProps {
  error: string | null;
}

export function DashboardContent({ error }: DashboardContentProps) {
  const { beverages, stats } = useBeverages();
  const { beerCount, wineCount, totalCount, likedCount, dislikedCount } = stats;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Your Beverage Collection
        </h1>
        <p className="text-muted-foreground">
          Track, rate, and discover your favorite beverages.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* Stats Overview - Redesigned to be more compact */}
      <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total</p>
              <h3 className="text-xl font-bold">{totalCount}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Beer className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Beer</p>
              <h3 className="text-xl font-bold">{beerCount}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <Wine className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Wine</p>
              <h3 className="text-xl font-bold">{wineCount}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <ThumbsUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Liked</p>
              <h3 className="text-xl font-bold">{likedCount}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <ThumbsDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Disliked
              </p>
              <h3 className="text-xl font-bold">{dislikedCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Input
            type="text"
            placeholder="Search beverages..."
            className="pl-10"
          />
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>

        <Button
          className="w-full md:w-auto bg-primary hover:bg-primary/90"
          asChild
        >
          <Link href="/dashboard/add">
            <Plus className="h-5 w-5 mr-2" />
            Add New Beverage
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              All
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Beer className="h-4 w-4 mr-1" />
              Beer
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Wine className="h-4 w-4 mr-1" />
              Wine
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Liked
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <ThumbsDown className="h-4 w-4 mr-1" />
              Disliked
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm font-medium">Sort by:</span>
            <select className="bg-background border rounded-md px-3 py-1 text-sm">
              <option>Date Added</option>
              <option>Name (A-Z)</option>
              <option>Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Beverage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {beverages.length === 0 && !error ?
          <div className="col-span-full text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Wine className="h-12 w-12 text-primary/50" />
            </div>
            <h3 className="text-xl font-medium mb-2">No beverages yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building your collection by adding your first beverage.
            </p>
            <Button asChild>
              <Link href="/dashboard/add">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Beverage
              </Link>
            </Button>
          </div>
        : beverages.map((beverage: Beverage) => (
            <div
              key={beverage.id}
              className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{beverage.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {beverage.producer}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className={`${
                          beverage.type === "Beer" ?
                            "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                        } flex items-center gap-1`}
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
                        }`}
                      >
                        {beverage.style}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-1 mt-2">
                  {beverage.notes}
                </p>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1">
                    {beverage.liked ?
                      <ThumbsUp className="h-5 w-5 text-green-500" />
                    : <ThumbsDown className="h-5 w-5 text-red-500" />}
                  </div>

                  <div className="flex items-center gap-2">
                    <TooltipButton
                      tooltip="Edit"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Link href={`/dashboard/edit/${beverage.id}`}>
                        <PenSquare className="h-4 w-4" />
                      </Link>
                    </TooltipButton>

                    <TooltipButton
                      tooltip="View Details"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Link href={`/dashboard/view/${beverage.id}`}>
                        <Eye className="h-4 w-4" />
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
