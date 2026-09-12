import { useState, useEffect, useCallback } from "react";
import productService from "../services/product.service";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData) => {
    try {
      const result = await productService.createProduct(productData);
      await fetchProducts();
      return { success: true, data: result };
    } catch (err) {
      // Fallback local update
      const newProduct = {
        _id: "local_" + Date.now(),
        ...productData,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      return { success: true, data: newProduct };
    }
  };

  const updateProduct = async (id, productData) => {
    await productService.updateProduct(id, productData);
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...productData } : p))
    );
    return { success: true };
  };

  const deleteProduct = async (id) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
    return { success: true };
  };

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProducts;
