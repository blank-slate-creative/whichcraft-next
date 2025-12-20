'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { Beverage, VenueSearchResult } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronRight, Edit, Search, MapPin, X } from 'lucide-react';
import { BeverageRatingForm } from '@/components/BeverageRatingForm';
import { VenueSearch } from '@/components/VenueSearch';
import { VenueMap } from '@/components/VenueMap';
import { BeverageSearch } from '@/components/BeverageSearch';

// Submit button component that uses useFormStatus
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : label}
    </Button>
  );
}

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}

interface BeverageFormProps {
  initialBeverage?: Beverage;
  onSubmit: (prevState: FormState, formData: FormData) => Promise<FormState>;
  onSuccess: () => void;
  submitLabel?: string;
  showSearch?: boolean;
}

// Steps in the form flow
enum FormStep {
  Search,
  Details,
}

export function BeverageForm({
  initialBeverage,
  onSubmit,
  onSuccess,
  submitLabel = 'Save Beer',
  showSearch = false,
}: BeverageFormProps) {
  const [formState, formAction] = React.useActionState(onSubmit, {
    status: 'idle',
  });

  const [currentStep, setCurrentStep] = React.useState<FormStep>(
    showSearch ? FormStep.Search : FormStep.Details
  );
  const [isSearchMode, setIsSearchMode] = React.useState<boolean>(showSearch);
  const [beverageData, setBeverageData] = React.useState<Beverage>(
    initialBeverage || {
      name: '',
      producer: '',
      type: 'Beer',
      style: '',
      notes: '',
      liked: true,
      abv: null,
      id: '',
      image_url: null,
      created_at: '',
      untappd_beer_id: null,
      untappd_brewery_id: null,
      location: null,
    }
  );
  const [selectedVenue, setSelectedVenue] = React.useState<VenueSearchResult | null>(() => {
    if (!beverageData.location) return null;
    try {
      const locationData = JSON.parse(beverageData.location);
      if (locationData.latitude && locationData.longitude) {
        return {
          id: 'existing',
          name: locationData.name,
          address: locationData.address,
          city: locationData.city,
          state: locationData.state,
          coordinates: {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
          },
        } as VenueSearchResult;
      }
    } catch (e) {
      // If location is not JSON, it's probably just a name
      if (beverageData.location) {
        return {
          id: 'existing',
          name: beverageData.location,
          address: '',
          city: '',
          state: '',
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
        } as VenueSearchResult;
      }
    }
    return null;
  });

  const handleSelectBeverage = (data: Beverage) => {
    setBeverageData(data);
    setCurrentStep(FormStep.Details);
  };

  const handleManualEntry = () => {
    setIsSearchMode(false);
  };

  const handleBeverageDataChange = (data: Partial<Beverage>) => {
    setBeverageData(prev => ({ ...prev, ...data }));
  };

  const handleVenueSelect = (venue: VenueSearchResult | null) => {
    setSelectedVenue(venue);
    if (venue) {
      handleBeverageDataChange({
        location: JSON.stringify({
          name: venue.name,
          address: venue.address,
          city: venue.city,
          state: venue.state,
          latitude: venue.coordinates.latitude,
          longitude: venue.coordinates.longitude,
        }),
      });
    } else {
      handleBeverageDataChange({ location: null });
    }
  };

  // Redirect when form submission is successful
  React.useEffect(() => {
    if (formState.status === 'success') {
      onSuccess();
    }
  }, [formState.status, onSuccess]);

  // Render the form based on the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case FormStep.Search:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Add Beer to Collection</h2>
              <p className="text-muted-foreground">Search for a beer or add details manually</p>
            </div>

            {isSearchMode ? (
              <div className="space-y-4">
                <BeverageSearch onSelect={handleSelectBeverage} defaultSearchType="beer" />

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleManualEntry}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Add manually instead
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name*</Label>
                    <input
                      id="name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={beverageData.name}
                      onChange={e => handleBeverageDataChange({ name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="producer">Producer</Label>
                    <input
                      id="producer"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={beverageData.producer || ''}
                      onChange={e => handleBeverageDataChange({ producer: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="style">Style</Label>
                    <input
                      id="style"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={beverageData.style || ''}
                      onChange={e => handleBeverageDataChange({ style: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="abv">ABV (%)</Label>
                    <input
                      id="abv"
                      type="number"
                      step="0.1"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={beverageData.abv === null ? '' : beverageData.abv}
                      onChange={e => {
                        const value = e.target.value;
                        handleBeverageDataChange({
                          abv: value === '' ? null : parseFloat(value),
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchMode(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search instead
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(FormStep.Details)}
                    disabled={!beverageData.name}
                  >
                    Continue <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case FormStep.Details:
        return (
          <form action={formAction} className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">
                {showSearch ? 'Add Your Rating & Notes' : 'Edit Beverage'}
              </h2>
              <p className="text-muted-foreground">
                {showSearch
                  ? 'Did you enjoy this beer? Add your rating and any tasting notes'
                  : 'Update the details of your beverage.'}
              </p>
            </div>

            {/* Hidden inputs for form data */}
            <input type="hidden" name="name" value={beverageData.name} />
            <input type="hidden" name="producer" value={beverageData.producer || ''} />
            <input type="hidden" name="type" value={beverageData.type} />
            <input type="hidden" name="style" value={beverageData.style || ''} />
            <input type="hidden" name="abv" value={beverageData.abv || ''} />
            <input
              type="hidden"
              name="untappd_beer_id"
              value={beverageData.untappd_beer_id || ''}
            />
            <input
              type="hidden"
              name="untappd_brewery_id"
              value={beverageData.untappd_brewery_id || ''}
            />
            <input type="hidden" name="image_url" value={beverageData.image_url || ''} />
            <input type="hidden" name="location" value={beverageData.location || ''} />

            <BeverageRatingForm
              beverageData={beverageData}
              onBeverageDataChange={handleBeverageDataChange}
            >
              {/* Location section */}
              <div className="space-y-4">
                <Label>Location</Label>
                {selectedVenue ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{selectedVenue.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {[selectedVenue.address, selectedVenue.city, selectedVenue.state]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleVenueSelect(null)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove venue</span>
                      </Button>
                    </div>
                    {selectedVenue.coordinates.latitude !== 0 && (
                      <VenueMap
                        latitude={selectedVenue.coordinates.latitude}
                        longitude={selectedVenue.coordinates.longitude}
                        className="mt-4"
                      />
                    )}
                  </div>
                ) : (
                  <VenueSearch onSelect={handleVenueSelect} placeholder="Search for a venue..." />
                )}
              </div>

              {/* Form state error messages */}
              {formState.status === 'error' && (
                <div className="text-red-500 border-l-2 border-red-500 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                  {formState.message}
                </div>
              )}

              <div className="flex justify-between">
                {showSearch && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(FormStep.Search)}
                  >
                    Back
                  </Button>
                )}
                <div className={showSearch ? '' : 'ml-auto'}>
                  <SubmitButton label={submitLabel} />
                </div>
              </div>
            </BeverageRatingForm>
          </form>
        );
    }
  };

  return <div className="space-y-6">{renderCurrentStep()}</div>;
}
