import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default async function AddBeverage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center mb-8">
        <Link
          href="/protected/dashboard"
          className="mr-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold">Add New Beverage</h1>
      </div>

      <form className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Beverage Name</Label>
              <Input id="name" placeholder="e.g. Sierra Nevada Pale Ale" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="producer">Producer/Brewery/Winery</Label>
              <Input
                id="producer"
                placeholder="e.g. Sierra Nevada Brewing Co."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-beer" />
                  <Label htmlFor="type-beer" className="font-normal">
                    Beer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-wine" />
                  <Label htmlFor="type-wine" className="font-normal">
                    Wine
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="type-other" />
                  <Label htmlFor="type-other" className="font-normal">
                    Other
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Input id="style" placeholder="e.g. Pale Ale, Sauvignon Blanc" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="abv">ABV (%)</Label>
              <Input id="abv" type="number" step="0.1" placeholder="e.g. 5.6" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year/Vintage</Label>
              <Input id="year" placeholder="e.g. 2021" />
            </div>
          </div>
        </div>

        {/* Rating & Notes */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Rating & Notes</h2>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="text-muted-foreground hover:text-primary focus:outline-none transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Tasting Notes</Label>
            <Textarea
              id="notes"
              placeholder="Describe the flavor, aroma, appearance, and your overall impression..."
              rows={5}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="favorite" />
            <Label htmlFor="favorite" className="font-normal">
              Mark as favorite
            </Label>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Additional Details</h2>

          <div className="space-y-2">
            <Label htmlFor="location">Where did you try it?</Label>
            <Input id="location" placeholder="e.g. Craft Beer Bar, Home" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" placeholder="e.g. $8.99" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase-location">Purchase Location</Label>
            <Input
              id="purchase-location"
              placeholder="e.g. Local Bottle Shop, Online"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/protected/dashboard">Cancel</Link>
          </Button>
          <Button type="submit">Save Beverage</Button>
        </div>
      </form>
    </div>
  );
}
