'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { updateBeverageAction, redirectToDashboard } from './actions';
import { Beverage } from '../beverage-context';
import BeverageForm, { BeverageData } from '@/components/BeverageForm';
import { BeverageSearch } from '@/components/BeverageSearch';

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

  const [beverageData, setBeverageData] = React.useState<BeverageData>({
    name: initialBeverage.name || '',
    producer: initialBeverage.producer || '',
    type: initialBeverage.type || 'Beer',
    style: initialBeverage.style || '',
    notes: initialBeverage.notes || '',
    liked: initialBeverage.liked,
    abv: initialBeverage.abv || '',
    image_url: initialBeverage.image_url || '',
  });

  // Handle when a beverage is selected from search
  const handleSelectBeverage = (data: BeverageData) => {
    // Preserve the existing ID since we're editing
    setBeverageData({
      ...data,
      // Keep notes from the current beverage if they exist
      notes: beverageData.notes || data.notes,
      // Keep the liked status if it's already set
      liked: beverageData.liked !== null ? beverageData.liked : data.liked,
    });
  };

  // Redirect to dashboard when form submission is successful
  useEffect(() => {
    if (formState.status === 'success') {
      redirectToDashboard();
    }
  }, [formState.status]);

  return (
    <BeverageForm
      beverageData={beverageData}
      onBeverageDataChange={setBeverageData}
      formState={formState}
      formAction={formAction}
      submitButtonText="Save Changes"
      showSearch={true}
    >
      <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-card rounded-lg border">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Search for a Beverage</h2>
        <BeverageSearch onSelect={handleSelectBeverage} />
      </div>
    </BeverageForm>
  );
}
