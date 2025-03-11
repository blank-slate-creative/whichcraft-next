'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateBeverageAction, redirectToCollection } from './actions';
import { Beverage } from '../../beverage-context';
import { BeverageData } from '@/components/BeverageForm';
import { Button } from '@/components/ui/button';
import { BeverageRatingForm } from '@/components/BeverageRatingForm';

// Extend the Beverage type with optional Untappd IDs
interface EditableBeverage extends Beverage {
  untappd_beer_id?: number;
  untappd_brewery_id?: number;
}

// Submit button component that uses useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
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

  const [beverageData, setBeverageData] = React.useState<BeverageData>({
    name: initialBeverage.name || '',
    producer: initialBeverage.producer || '',
    type: initialBeverage.type || 'Beer',
    style: initialBeverage.style || '',
    notes: initialBeverage.notes || '',
    liked: initialBeverage.liked,
    abv:
      typeof initialBeverage.abv === 'string'
        ? parseFloat(initialBeverage.abv)
        : initialBeverage.abv,
    image_url: initialBeverage.image_url || '',
    untappd_beer_id: (initialBeverage as EditableBeverage).untappd_beer_id,
    untappd_brewery_id: (initialBeverage as EditableBeverage).untappd_brewery_id,
  });

  // Handle beverage data changes
  const handleBeverageDataChange = (data: Partial<BeverageData>) => {
    setBeverageData(prev => ({ ...prev, ...data }));
  };

  // Redirect to collection when form submission is successful
  useEffect(() => {
    if (formState.status === 'success') {
      redirectToCollection();
    }
  }, [formState.status]);

  return (
    <form action={formAction}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Edit Beverage</h2>
          <p className="text-muted-foreground">Update the details of your beverage.</p>
        </div>

        <BeverageRatingForm
          beverageData={beverageData}
          onBeverageDataChange={handleBeverageDataChange}
        >
          {/* Form state error messages */}
          {formState.status === 'error' && (
            <div className="text-red-500 border-l-2 border-red-500 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
              {formState.message}
            </div>
          )}

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </BeverageRatingForm>
      </div>
    </form>
  );
}
