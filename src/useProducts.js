import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Wait, does src/firebase.js exist? App.jsx imports from './firebase'
import { products as defaultProducts } from './data/products';

export const useProducts = () => {
  // Always use local products.js as the single source of truth.
  // This keeps local dev and the live site identical.
  const [products] = useState(defaultProducts);
  const loading = false;
  const reloadProducts = () => {};

  return { products, loading, reloadProducts };
};
