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
      const msg = err.message || "Failed to add product";
      throw new Error(msg);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await productService.updateProduct(id, productData);
      await fetchProducts();
      return { success: true, data: res };
    } catch (err) {
      throw new Error(err.message || "Failed to update product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      return { success: true };
    } catch (err) {
      throw new Error(err.message || "Failed to delete product");
    }
  };

  const deleteProductImage = async (productId, imageUrl) => {
    try {
      const res = await productService.deleteProductImage(productId, imageUrl);
      await fetchProducts();
      return { success: true, data: res };
    } catch (err) {
      throw new Error(err.message || "Failed to delete product image");
    }
  };

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
  };
};

export default useProducts;
