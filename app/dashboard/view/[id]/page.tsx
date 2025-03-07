import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, ThumbsUp, ThumbsDown, Beer, Wine } from 'lucide-react';
import { serverBeverageApi } from '@/utils/server-api';
import { Beverage } from '../../beverage-context';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default async function ViewBeveragePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Check for authentication errors or missing user
  if (error || !user) {
    redirect('/sign-in');
  }

  if (!id) {
    redirect('/dashboard');
  }

  // Fetch the beverage data
  try {
    const beverage: Beverage = await serverBeverageApi.getById(id);

    return (
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" className="mr-2" asChild>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to dashboard</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Beverage Details</h1>
        </div>

        <Card className="border rounded-lg overflow-hidden shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              {beverage.image_url ? (
                <div className="mr-3 flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                  <img
                    src={beverage.image_url}
                    alt={`${beverage.name} by ${beverage.producer}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="mr-3 flex-shrink-0 w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                  {beverage.type === 'Beer' ? (
                    <Beer className="h-8 w-8 text-muted-foreground/60" />
                  ) : (
                    <Wine className="h-8 w-8 text-muted-foreground/60" />
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-lg">{beverage.name}</h2>
                <p className="text-sm text-muted-foreground">{beverage.producer}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge
                    variant="outline"
                    className={`${
                      beverage.type === 'Beer'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    } flex items-center gap-1 text-xs`}
                  >
                    {beverage.type === 'Beer' ? (
                      <Beer className="h-3 w-3" />
                    ) : (
                      <Wine className="h-3 w-3" />
                    )}
                    {beverage.type}
                  </Badge>
                  {beverage.style && (
                    <Badge
                      variant="outline"
                      className={`${
                        beverage.type === 'Beer'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      } text-xs`}
                    >
                      {beverage.style}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="ml-2 flex-shrink-0">
                {beverage.liked ? (
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dl className="space-y-3">
                  {beverage.abv !== undefined && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">ABV</dt>
                      <dd>{beverage.abv}%</dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Added on</dt>
                    <dd>{new Date(beverage.created_at).toLocaleDateString()}</dd>
                  </div>
                </dl>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <p className="whitespace-pre-wrap text-sm">
                    {beverage.notes || 'No notes added.'}
                  </p>
                </div>
              </div>

              {beverage.image_url && (
                <div>
                  <div className="rounded-md overflow-hidden">
                    <img
                      src={beverage.image_url}
                      alt={beverage.name}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button asChild>
                <Link href={`/dashboard/edit/${beverage.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Beverage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error fetching beverage:', error);
    redirect('/dashboard');
  }
}
