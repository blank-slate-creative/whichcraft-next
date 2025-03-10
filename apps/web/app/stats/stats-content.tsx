import { Beer, Wine, BarChart3, ThumbsUp, ThumbsDown, PieChart } from 'lucide-react';

// Define the Beverage interface
interface Beverage {
  id: number | string;
  name: string;
  type: string;
  style: string;
  producer: string;
  liked: boolean;
  notes: string;
  created_at: string;
}

interface StatsContentProps {
  beverages: Beverage[];
  error: string | null;
}

export function StatsContent({ beverages, error }: StatsContentProps) {
  // Calculate stats
  const stats = {
    beerCount: beverages.filter(b => b.type === 'Beer').length,
    wineCount: beverages.filter(b => b.type === 'Wine').length,
    totalCount: beverages.length,
    likedCount: beverages.filter(b => b.liked).length,
    dislikedCount: beverages.filter(b => !b.liked).length,
  };

  // Calculate percentages for visualization
  const beerPercentage = stats.totalCount > 0 ? (stats.beerCount / stats.totalCount) * 100 : 0;
  const winePercentage = stats.totalCount > 0 ? (stats.wineCount / stats.totalCount) * 100 : 0;
  const likedPercentage = stats.totalCount > 0 ? (stats.likedCount / stats.totalCount) * 100 : 0;
  const dislikedPercentage =
    stats.totalCount > 0 ? (stats.dislikedCount / stats.totalCount) * 100 : 0;

  // Calculate most common styles
  const styleCount = beverages.reduce(
    (acc, beverage) => {
      const style = beverage.style;
      acc[style] = (acc[style] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topStyles = Object.entries(styleCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate most common producers
  const producerCount = beverages.reduce(
    (acc, beverage) => {
      const producer = beverage.producer;
      acc[producer] = (acc[producer] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topProducers = Object.entries(producerCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Header - More compact for mobile */}
      <div className="mb-4 sm:mb-6 hidden md:block">
        <div className="flex items-center mb-2 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Collection Statistics</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Insights and analytics about your beverage collection.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4">
          <p className="flex items-center text-sm">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* Main Stats - Horizontal layout on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4 sm:mb-8">
        {/* Total Beverages */}
        <div className="bg-card border rounded-lg p-3 sm:p-6 shadow-sm flex sm:flex-col items-center sm:items-center">
          <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center sm:mb-3 mr-3 sm:mr-0">
            <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="flex flex-col sm:items-center">
            <h3 className="text-xl sm:text-3xl font-bold">{stats.totalCount}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Beers */}
        <div className="bg-card border rounded-lg p-3 sm:p-6 shadow-sm">
          <div className="flex sm:flex-col items-center sm:items-center">
            <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-amber-100 flex items-center justify-center sm:mb-3 mr-3 sm:mr-0">
              <Beer className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />
            </div>
            <div className="flex flex-col sm:items-center flex-1">
              <h3 className="text-xl sm:text-3xl font-bold">{stats.beerCount}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Beers</p>
              <div className="w-full mt-1 sm:mt-2 bg-muted rounded-full h-1 sm:h-2">
                <div
                  className="bg-amber-500 h-1 sm:h-2 rounded-full"
                  style={{ width: `${beerPercentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                {beerPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Wines */}
        <div className="bg-card border rounded-lg p-3 sm:p-6 shadow-sm">
          <div className="flex sm:flex-col items-center sm:items-center">
            <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-rose-100 flex items-center justify-center sm:mb-3 mr-3 sm:mr-0">
              <Wine className="h-4 w-4 sm:h-6 sm:w-6 text-rose-600" />
            </div>
            <div className="flex flex-col sm:items-center flex-1">
              <h3 className="text-xl sm:text-3xl font-bold">{stats.wineCount}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Wines</p>
              <div className="w-full mt-1 sm:mt-2 bg-muted rounded-full h-1 sm:h-2">
                <div
                  className="bg-rose-500 h-1 sm:h-2 rounded-full"
                  style={{ width: `${winePercentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                {winePercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Liked */}
        <div className="bg-card border rounded-lg p-3 sm:p-6 shadow-sm">
          <div className="flex sm:flex-col items-center sm:items-center">
            <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center sm:mb-3 mr-3 sm:mr-0">
              <ThumbsUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="flex flex-col sm:items-center flex-1">
              <h3 className="text-xl sm:text-3xl font-bold">{stats.likedCount}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Liked</p>
              <div className="w-full mt-1 sm:mt-2 bg-muted rounded-full h-1 sm:h-2">
                <div
                  className="bg-green-500 h-1 sm:h-2 rounded-full"
                  style={{ width: `${likedPercentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                {likedPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Disliked */}
        <div className="bg-card border rounded-lg p-3 sm:p-6 shadow-sm">
          <div className="flex sm:flex-col items-center sm:items-center">
            <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center sm:mb-3 mr-3 sm:mr-0">
              <ThumbsDown className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="flex flex-col sm:items-center flex-1">
              <h3 className="text-xl sm:text-3xl font-bold">{stats.dislikedCount}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Disliked</p>
              <div className="w-full mt-1 sm:mt-2 bg-muted rounded-full h-1 sm:h-2">
                <div
                  className="bg-red-500 h-1 sm:h-2 rounded-full"
                  style={{ width: `${dislikedPercentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                {dislikedPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats - More compact for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
        {/* Top Styles */}
        <div className="bg-card border rounded-lg p-3 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 sm:mb-4">
            <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">Top Styles</h3>
          </div>

          {topStyles.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {topStyles.map(([style, count]) => (
                <div key={style} className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                    {style}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-32 bg-muted rounded-full h-1 sm:h-2">
                      <div
                        className="bg-primary h-1 sm:h-2 rounded-full"
                        style={{
                          width: `${(count / stats.totalCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">No styles found</p>
          )}
        </div>

        {/* Top Producers */}
        <div className="bg-card border rounded-lg p-3 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 sm:mb-4">
            <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">Top Producers</h3>
          </div>

          {topProducers.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {topProducers.map(([producer, count]) => (
                <div key={producer} className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                    {producer}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-32 bg-muted rounded-full h-1 sm:h-2">
                      <div
                        className="bg-primary h-1 sm:h-2 rounded-full"
                        style={{
                          width: `${(count / stats.totalCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">No producers found</p>
          )}
        </div>
      </div>
    </div>
  );
}
