'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { saveBeverageAction, redirectToCollection } from './actions';
import { Beverage } from '@whichcraft/api-client';
import { BeverageSearch } from '@/components/BeverageSearch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronRight, Edit, Search } from 'lucide-react';
import { BeverageRatingForm } from '@/components/BeverageRatingForm';

// Submit button component that uses useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Beer'}
    </Button>
  );
}

// Steps in the form flow
enum FormStep {
  Search,
  Preferences,
}

// Main form component
export default function AddBeverageForm() {
  const [formState, formAction] = React.useActionState(saveBeverageAction, {
    status: 'idle',
  });

  const [currentStep, setCurrentStep] = React.useState<FormStep>(FormStep.Search);
  const [isSearchMode, setIsSearchMode] = React.useState<boolean>(true);
  const [beverageData, setBeverageData] = React.useState<Beverage>({
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
  });

  const handleSelectBeverage = (data: Beverage) => {
    setBeverageData(data);
    // Move directly to the preferences step after selection
    setCurrentStep(FormStep.Preferences);
  };

  // Proceed to manual entry mode
  const handleManualEntry = () => {
    setIsSearchMode(false);
    // Stay on the same step but switch to manual entry mode
    // The user will fill out the form and then click continue
  };

  // Handle beverage data changes
  const handleBeverageDataChange = (data: Partial<Beverage>) => {
    setBeverageData(prev => ({ ...prev, ...data }));
  };

  // Redirect to collection when form submission is successful
  useEffect(() => {
    if (formState.status === 'success') {
      redirectToCollection();
    }
  }, [formState.status]);

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
                      onChange={e =>
                        handleBeverageDataChange({ ...beverageData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="producer">Producer</Label>
                    <input
                      id="producer"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={beverageData.producer || ''}
                      onChange={e =>
                        handleBeverageDataChange({ ...beverageData, producer: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="style">Style</Label>
                    <input
                      id="style"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={beverageData.style || ''}
                      onChange={e =>
                        handleBeverageDataChange({ ...beverageData, style: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="abv">ABV (%)</Label>
                    <input
                      id="abv"
                      type="number"
                      step="0.1"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={beverageData.abv === null ? '' : (beverageData.abv ?? '')}
                      onChange={e => {
                        const value = e.target.value;
                        handleBeverageDataChange({
                          ...beverageData,
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
                    onClick={() => setCurrentStep(FormStep.Preferences)}
                    disabled={!beverageData.name}
                  >
                    Continue <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case FormStep.Preferences:
        return (
          <form action={formAction} className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Add Your Rating & Notes</h2>
              <p className="text-muted-foreground">
                Did you enjoy this beer? Add your rating and any tasting notes
              </p>
            </div>

            <BeverageRatingForm
              beverageData={beverageData}
              onBeverageDataChange={data => handleBeverageDataChange({ ...beverageData, ...data })}
            >
              {/* Form state error messages */}
              {formState.status === 'error' && (
                <div className="text-red-500 border-l-2 border-red-500 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                  {formState.message}
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(FormStep.Search)}
                >
                  Back
                </Button>
                <SubmitButton />
              </div>
            </BeverageRatingForm>
          </form>
        );
    }
  };

  return <div className="space-y-6">{renderCurrentStep()}</div>;
}
