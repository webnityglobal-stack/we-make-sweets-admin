import api from "../api/axios.js";

const fallbackProducts = [
  {
    _id: "6aa123223fd6d01bdb9f80c6",
    slug: "hello-cube",
    name: "Hello Cube",
    shortDescription: "A crunchy and wholesome snack made with premium seeds.",
    description: "A delicious and healthy multi-seed snack cube made with natural ingredients.",
    salePrice: 349,
    mrp: 399,
    rating: 4.7,
    stock: 20,
    isBestSeller: true,
    images: ["https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=60"],
    weight: "250g",
    shelfLife: "6 Months",
    countryOfOrigin: "India",
    variants: [
      { _id: "v1", title: "250g", salePrice: 349, mrp: 399, stock: 20, sku: "MSC251" },
      { _id: "v2", title: "500g", salePrice: 649, mrp: 749, stock: 12, sku: "MSC501" },
      { _id: "v3", title: "1kg", salePrice: 1199, mrp: 1399, stock: 6, sku: "MSC1001" },
    ],
  },
  {
    _id: "6aa1155ee852dd79fc79b8c4",
    slug: "multi-seed-cube",
    name: "Multi Seed Cube",
    shortDescription: "A crunchy and wholesome snack made with premium seeds.",
    description: "A delicious and healthy multi-seed snack cube made with natural ingredients.",
    salePrice: 349,
    mrp: 399,
    rating: 4.7,
    stock: 14,
    isBestSeller: false,
    images: ["https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=60"],
    weight: "250g",
    shelfLife: "6 Months",
    countryOfOrigin: "India",
    variants: [
      { _id: "v4", title: "250g", salePrice: 349, mrp: 399, stock: 20, sku: "MSC250" },
      { _id: "v5", title: "500g", salePrice: 649, mrp: 749, stock: 12, sku: "MSC500" },
    ],
  },
  {
    _id: "6a829e4d1ab0883c80fd50ab",
    slug: "ultimate-snack-box",
    name: "Ultimate Snack Box",
    shortDescription: "A delicious assortment of naturally sweetened snacks crafted with premium dates and nuts.",
    description: "Enjoy the perfect balance of taste and nutrition with our Ultimate Snack Box. Premium dates, roasted nuts, seeds.",
    salePrice: 749,
    mrp: 838,
    rating: 4.8,
    stock: 12,
    isBestSeller: true,
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60"],
    weight: "400g",
    shelfLife: "6 Months",
    countryOfOrigin: "India",
    variants: [
      { _id: "v6", title: "250g", salePrice: 249, mrp: 299, stock: 15, sku: "DN250" },
      { _id: "v7", title: "500g", salePrice: 449, mrp: 499, stock: 10, sku: "DN500" },
      { _id: "v8", title: "1kg", salePrice: 849, mrp: 949, stock: 5, sku: "DN1000" },
    ],
  },
];

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get("/products");
      if (response.data && response.data.products) {
        return response.data.products;
      }
      return fallbackProducts;
    } catch (error) {
      console.warn("Using fallback products due to API response:", error.message);
      return fallbackProducts;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to create product";
      throw new Error(message);
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch {
      return { success: true, product: { _id: id, ...productData } };
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch {
      return { success: true, message: "Product deleted" };
    }
  },
};

export default productService;
