import { requireAuth } from "@/utils/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipButton } from "@/components/ui/tooltip-button";

export default async function Dashboard() {
  // Ensure user is authenticated
  const { user } = await requireAuth();

  // This would be replaced with actual data from the API
  const mockBeverages = [
    {
      id: 1,
      name: "Sierra Nevada Pale Ale",
      type: "Beer",
      style: "Pale Ale",
      producer: "Sierra Nevada Brewing Co.",
      liked: true,
      notes: "Classic American pale ale with a good balance of malt and hops.",
      dateAdded: "2023-06-15",
      image: "🍺",
    },
    {
      id: 2,
      name: "Cloudy Bay Sauvignon Blanc",
      type: "Wine",
      style: "Sauvignon Blanc",
      producer: "Cloudy Bay",
      liked: true,
      notes: "Crisp and refreshing with notes of citrus and tropical fruits.",
      dateAdded: "2023-07-22",
      image: "🍷",
    },
    {
      id: 3,
      name: "Guinness Draught",
      type: "Beer",
      style: "Stout",
      producer: "Guinness",
      liked: false,
      notes: "Smooth and creamy with roasted coffee and chocolate notes.",
      dateAdded: "2023-08-05",
      image: "🍺",
    },
  ];

  // Count beverages by type
  const beerCount = mockBeverages.filter((b) => b.type === "Beer").length;
  const wineCount = mockBeverages.filter((b) => b.type === "Wine").length;
  const totalCount = mockBeverages.length;
  const likedCount = mockBeverages.filter((b) => b.liked).length;

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

      {/* Stats Overview - Redesigned to be more compact */}
      <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-lg text-primary">📊</span>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total</p>
              <h3 className="text-xl font-bold">{totalCount}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <span className="text-lg text-amber-600">🍺</span>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Beer</p>
              <h3 className="text-xl font-bold">{beerCount}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <span className="text-lg text-rose-600">🍷</span>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Wine</p>
              <h3 className="text-xl font-bold">{wineCount}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <span className="text-lg text-green-600">👍</span>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Liked</p>
              <h3 className="text-xl font-bold">{likedCount}</h3>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <Button
          className="w-full md:w-auto bg-primary hover:bg-primary/90"
          asChild
        >
          <Link href="/protected/dashboard/add">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
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
              <span className="mr-1">🍺</span> Beer
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <span className="mr-1">🍷</span> Wine
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L6.8 7.933a4 4 0 00-.8 2.4z"
                />
              </svg>
              Liked
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2"
                />
              </svg>
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

      {/* Beverage List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockBeverages.map((beverage) => (
          <div
            key={beverage.id}
            className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
          >
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    {beverage.liked ?
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                    : <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-muted-foreground"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2h-5.416a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                      </svg>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base leading-tight break-words mb-1">
                      {beverage.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {beverage.producer}
                    </p>
                  </div>
                </div>
                <TooltipButton
                  variant="ghost"
                  size="icon"
                  className="text-primary h-8 w-8 -mt-1 -mr-1"
                  tooltip="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </TooltipButton>
              </div>

              <div className="flex gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className={
                    beverage.type === "Beer" ?
                      "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                  }
                >
                  {beverage.type}
                </Badge>
                <Badge variant="outline">{beverage.style}</Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                {beverage.notes}
              </p>

              <div className="flex items-center text-xs text-muted-foreground mt-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Added on {beverage.dateAdded}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (hidden when there are beverages) */}
      {mockBeverages.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="inline-flex h-20 w-20 rounded-full bg-muted/30 items-center justify-center mb-4">
            <span className="text-4xl">🥂</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Your collection is empty
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start by adding your first beer or wine to your collection and keep
            track of your favorites.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/protected/dashboard/add">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Your First Beverage
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
