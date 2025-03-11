'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { updateBeverageAction, redirectToCollection } from './actions';
import { Beverage } from '../../beverage-context';
import { BeverageData } from '@/components/BeverageForm';
import { BeverageSearch } from '@/components/BeverageSearch';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, ChevronRight, Edit } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Steps in the form flow
enum FormStep {
  SelectType,
  Search,
  ReviewOrEdit,
  Preferences,
}

// Extend the Beverage type with optional Untappd IDs
interface EditableBeverage extends Beverage {
  untappd_beer_id?: number;
  untappd_brewery_id?: number;
}

// Main form component
export default function EditBeverageForm({ initialBeverage }: { initialBeverage: Beverage }) {
  // Create a wrapper function to include the beverage ID in the action
  const updateWithId = React.useCallback(
    (prevState: any, formData: FormData) => {
      return updateBeverageAction(initialBeverage.id.toString(), prevState, formData);
    },
    [initialBeverage.id]
  );

  const [formState, formAction] = React.useActionState(updateWithId, {
    status: 'idle',
  });

  const [currentStep, setCurrentStep] = React.useState<FormStep>(FormStep.SelectType);
  const [selectedType, setSelectedType] = React.useState<string>(initialBeverage.type || 'Beer');
  const [isSearchMode, setIsSearchMode] = React.useState<boolean>(true);
  const [beverageData, setBeverageData] = React.useState<BeverageData>({
    name: initialBeverage.name || '',
    producer: initialBeverage.producer || '',
    type: initialBeverage.type || 'Beer',
    style: initialBeverage.style || '',
    notes: initialBeverage.notes || '',
    liked: initialBeverage.liked,
    abv: initialBeverage.abv || '',
    image_url: initialBeverage.image_url || '',
    untappd_beer_id: (initialBeverage as EditableBeverage).untappd_beer_id,
    untappd_brewery_id: (initialBeverage as EditableBeverage).untappd_brewery_id,
  });

  // Update the type when it changes in the first step
  useEffect(() => {
    setBeverageData(prev => ({
      ...prev,
      type: selectedType,
    }));
  }, [selectedType]);

  // Handle when a beverage is selected from search
  const handleSelectBeverage = (data: BeverageData) => {
    // Preserve the existing ID since we're editing and any notes/ratings
    setBeverageData({
      ...data,
      // Keep notes from the current beverage if they exist
      notes: beverageData.notes || data.notes,
      // Keep the liked status if it's already set
      liked: beverageData.liked !== null ? beverageData.liked : data.liked,
    });

    // Move to the review step after selection
    setCurrentStep(FormStep.ReviewOrEdit);
  };

  // Proceed to manual entry mode
  const handleManualEntry = () => {
    setIsSearchMode(false);
    setCurrentStep(FormStep.ReviewOrEdit);
  };

  // Handle beverage data changes
  const handleBeverageDataChange = (data: BeverageData) => {
    setBeverageData(data);
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
      case FormStep.SelectType:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Select Beverage Type</CardTitle>
              <CardDescription>
                Choose the type of beverage you'd like to add to your collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedType}
                onValueChange={setSelectedType}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div className="flex flex-col gap-2 items-center justify-center p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="Beer" id="beverage-type-beer" className="sr-only" />
                  <Label htmlFor="beverage-type-beer" className="cursor-pointer text-center">
                    <div className="text-3xl mb-2">🍺</div>
                    <div className="font-medium">Beer</div>
                  </Label>
                </div>

                <div className="flex flex-col gap-2 items-center justify-center p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="Wine" id="beverage-type-wine" className="sr-only" />
                  <Label htmlFor="beverage-type-wine" className="cursor-pointer text-center">
                    <div className="text-3xl mb-2">🍷</div>
                    <div className="font-medium">Wine</div>
                  </Label>
                </div>

                <div className="flex flex-col gap-2 items-center justify-center p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="Other" id="beverage-type-other" className="sr-only" />
                  <Label htmlFor="beverage-type-other" className="cursor-pointer text-center">
                    <div className="text-3xl mb-2">🥃</div>
                    <div className="font-medium">Other</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setCurrentStep(FormStep.Search)}>
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        );

      case FormStep.Search:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Search for {selectedType}</CardTitle>
              <CardDescription>
                Search for a {selectedType.toLowerCase()} or add it manually if you can't find it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BeverageSearch
                onSelect={handleSelectBeverage}
                defaultSearchType={selectedType.toLowerCase()}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(FormStep.SelectType)}>
                Back
              </Button>
              <Button onClick={handleManualEntry}>
                Manual Entry <Edit className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        );

      case FormStep.ReviewOrEdit:
        return (
          <Card>
            <CardHeader>
              <CardTitle>
                {isSearchMode ? 'Review Selected Beverage' : 'Enter Beverage Details'}
              </CardTitle>
              <CardDescription>
                {isSearchMode
                  ? 'Confirm the details of the selected beverage or edit if needed'
                  : 'Enter the details of the beverage you want to add'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={isSearchMode ? 'review' : 'edit'}>
                <TabsList className="mb-4">
                  <TabsTrigger value="review">Review</TabsTrigger>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                </TabsList>

                <TabsContent value="review" className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {beverageData.image_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={beverageData.image_url}
                          alt={beverageData.name}
                          className="h-32 w-auto object-contain rounded-md"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-medium">{beverageData.name}</h3>
                        <p className="text-muted-foreground">{beverageData.producer}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {beverageData.type}
                        </span>
                        {beverageData.style && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {beverageData.style}
                          </span>
                        )}
                        {beverageData.abv && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            {beverageData.abv}% ABV
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="edit">
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
                        value={beverageData.abv || ''}
                        onChange={e =>
                          handleBeverageDataChange({ ...beverageData, abv: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(FormStep.Search)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(FormStep.Preferences)}>
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        );

      case FormStep.Preferences:
        return (
          <form action={formAction} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Your Rating & Notes</CardTitle>
                <CardDescription>
                  Did you enjoy this beverage? Add your rating and any tasting notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Did you like it?*</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={beverageData.liked === true ? 'default' : 'outline'}
                      onClick={() => handleBeverageDataChange({ ...beverageData, liked: true })}
                      className="flex-1 sm:flex-none"
                    >
                      <Check
                        className={`h-4 w-4 ${beverageData.liked === true ? 'mr-2' : 'mr-0'}`}
                      />
                      <span>Like</span>
                    </Button>
                    <Button
                      type="button"
                      variant={beverageData.liked === false ? 'default' : 'outline'}
                      onClick={() => handleBeverageDataChange({ ...beverageData, liked: false })}
                      className="flex-1 sm:flex-none"
                    >
                      <Check
                        className={`h-4 w-4 ${beverageData.liked === false ? 'mr-2' : 'mr-0'}`}
                      />
                      <span>Dislike</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Tasting Notes</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe the flavor, aroma, appearance, and your overall impression..."
                    value={beverageData.notes || ''}
                    onChange={e =>
                      handleBeverageDataChange({ ...beverageData, notes: e.target.value })
                    }
                  />
                </div>

                {/* Hidden form fields for all beverage data */}
                <input type="hidden" name="name" value={beverageData.name} />
                <input type="hidden" name="producer" value={beverageData.producer || ''} />
                <input type="hidden" name="type" value={beverageData.type || 'Beer'} />
                <input type="hidden" name="style" value={beverageData.style || ''} />
                <input type="hidden" name="abv" value={beverageData.abv || ''} />
                <input type="hidden" name="image_url" value={beverageData.image_url || ''} />
                <input
                  type="hidden"
                  name="liked"
                  value={beverageData.liked === null ? '' : String(beverageData.liked)}
                />
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
              </CardContent>

              {/* Form state error messages */}
              {formState.status === 'error' && (
                <div className="text-red-500 border-l-2 border-red-500 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded text-sm mx-6">
                  {formState.message}
                </div>
              )}

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(FormStep.ReviewOrEdit)}
                >
                  Back
                </Button>
                <Button type="submit">
                  {formState.status === 'submitting' ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        );
    }
  };

  return <div className="space-y-6">{renderCurrentStep()}</div>;
}
