'use client';

import * as React from 'react';
import { saveBeverageAction, redirectToCollection } from './actions';
import { BeverageForm } from '@/components/BeverageForm';

export default function AddBeverageForm() {
  return (
    <BeverageForm
      onSubmit={saveBeverageAction}
      onSuccess={redirectToCollection}
      submitLabel="Save Beer"
      showSearch={true}
    />
  );
}
