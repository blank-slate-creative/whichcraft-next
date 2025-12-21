'use client';

import * as React from 'react';
import { updateBeverageAction, redirectToCollection } from './actions';
import { BeverageForm } from '@/components/BeverageForm';
import { Beverage } from '@/lib/api-client';

interface EditBeverageFormProps {
  beverage: Beverage;
}

export default function EditBeverageForm({ beverage }: EditBeverageFormProps) {
  return (
    <BeverageForm
      initialBeverage={beverage}
      onSubmit={updateBeverageAction}
      onSuccess={redirectToCollection}
      submitLabel="Update Beer"
      showSearch={false}
    />
  );
}
