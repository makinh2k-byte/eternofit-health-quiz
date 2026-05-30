import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Wait, does src/firebase.js exist? App.jsx imports from './firebase'
import { products as defaultProducts } from './data/products';

export const useProducts = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      if (!querySnapshot.empty) {
        const dbProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Merge dbProducts with local defaultProducts so any new local products are visible
        const dbIds = new Set(dbProducts.map(p => p.id.toString()));
        const missingLocals = defaultProducts.filter(p => !dbIds.has(p.id.toString()));
        setProducts([...dbProducts, ...missingLocals]);
      } else {
        setProducts(defaultProducts);
      }
    } catch (error) {
      console.warn("Failed to fetch products from Firebase, using default.", error);
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, reloadProducts: fetchProducts };
};
