'use server';

import { serverBeverageApi } from '@/utils/server-api';
import { redirect } from 'next/navigation';

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}

export async function updateBeverageAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get('id') as string;
  if (!id) {
    return {
      status: 'error',
      message: 'Beverage ID is required',
    };
  }

  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const liked = formData.get('liked') === 'true';

  if (!name || !type || typeof liked !== 'boolean') {
    return {
      status: 'error',
      message: 'Name, type, and liked status are required',
    };
  }

  try {
    await serverBeverageApi.update(id, {
      name,
      type,
      liked,
      producer: formData.get('producer') as string,
      style: formData.get('style') as string,
      notes: formData.get('notes') as string,
      abv: formData.get('abv') ? parseFloat(formData.get('abv') as string) : null,
      untappd_beer_id: formData.get('untappd_beer_id')
        ? parseInt(formData.get('untappd_beer_id') as string, 10)
        : null,
      untappd_brewery_id: formData.get('untappd_brewery_id')
        ? parseInt(formData.get('untappd_brewery_id') as string, 10)
        : null,
      image_url: formData.get('image_url') as string,
      location: formData.get('location') as string,
    });

    return {
      status: 'success',
      message: 'Beverage updated successfully',
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to update beverage',
    };
  }
}

export function redirectToCollection() {
  redirect('/collection');
}
