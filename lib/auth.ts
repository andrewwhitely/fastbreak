import { cache } from 'react';

// Basic session mock until we implement a new auth solution
export const getSession = cache(async () => {
  return null;
});

export async function verifySession() {
  return null;
}
