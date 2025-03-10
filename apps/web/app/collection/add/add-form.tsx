'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { saveBeverageAction, redirectToCollection } from './actions';
import BeverageForm, { BeverageData } from '@/components/BeverageForm';
import { BeverageSearch } from '@/components/BeverageSearch';

// Main form component
export default function AddBeverageForm() {
  const [formState, formAction] = React.useActionState(saveBeverageAction, {
    status: 'idle',
  });

  const [beverageData, setBeverageData] = React.useState<BeverageData>({
    name: '',
    producer: '',
    type: 'Beer',
    style: '',
    notes: '',
    liked: null,
    abv: '',
  });

  const handleSelectBeverage = (data: BeverageData) => {
    setBeverageData(data);
  };

  // Redirect to collection when form submission is successful
  useEffect(() => {
    if (formState.status === 'success') {
      redirectToCollection();
    }
  }, [formState.status]);

  return (
    <BeverageForm
      beverageData={beverageData}
      onBeverageDataChange={setBeverageData}
      formState={formState}
      formAction={formAction}
      submitButtonText="Save Beverage"
      showSearch={true}
    >
      <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-card rounded-lg border">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Search for a Beverage</h2>
        <BeverageSearch onSelect={handleSelectBeverage} />
      </div>
    </BeverageForm>
  );
}
