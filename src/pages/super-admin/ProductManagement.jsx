import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import {
  Plus,
  Search,
  Package,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
  Loader2,
  ExternalLink,
} from 'lucide-react';

const ProductManagement = () => {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    salePrice: 349,
    mrp: 399,
    stock: 25,
    weight: '250g',
    shelfLife: '6 Months',
    countryOfOrigin: 'India',
    isBestSeller: false,
  });

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q) ||
      p.shortDescription?.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      salePrice: 349,
      mrp: 399,
      stock: 25,
      weight: '250g',
      shelfLife: '6 Months',
      countryOfOrigin: 'India',
      isBestSeller: false,
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      slug: prod.slug || '',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      salePrice: prod.salePrice || 349,
      mrp: prod.mrp || 399,
      stock: prod.stock || 20,
      weight: prod.weight || '250g',
      shelfLife: prod.shelfLife || '6 Months',
      countryOfOrigin: prod.countryOfOrigin || 'India',
      isBestSeller: Boolean(prod.isBestSeller),
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
      } else {
        const payload = {
          ...formData,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
          rating: 4.8,
          highlights: ['100% Natural', 'No Preservatives', 'Made in India'],
          ingredients: ['Premium Dates', 'Nuts', 'Seeds'],
          variants: [
            { title: '250g', salePrice: formData.salePrice, mrp: formData.mrp, stock: formData.stock, sku: 'WMS250' }
          ]
        };
        await addProduct(payload);
      }
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your sweet items, prices, stock levels, variants, and descriptions
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-pink-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Sweet</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, description, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Total Products:</span>
          <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 font-bold border border-pink-500/20">
            {filteredProducts.length}
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
          <span className="text-xs">Loading sweet catalog from backend...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden shadow-lg transition flex flex-col justify-between"
            >
              <div>
                {/* Product Header Card */}
                <div className="h-36 bg-gradient-to-tr from-pink-950/40 to-slate-800 flex items-center justify-center relative p-4">
                  <div className="w-16 h-16 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-3xl shadow-inner">
                    🍬
                  </div>
                  {product.isBestSeller && (
                    <span className="absolute top-3 right-3 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Best Seller
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-white text-base truncate">{product.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {product.weight || '250g'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {product.shortDescription || product.description}
                  </p>

                  {/* Price & Stock info */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold text-white">
                          ₹{product.salePrice}
                        </span>
                        {product.mrp && product.mrp > product.salePrice && (
                          <span className="text-xs text-slate-500 line-through">
                            ₹{product.mrp}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">
                        {Math.round(((product.mrp - product.salePrice) / product.mrp) * 100)}% OFF
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          product.stock > 10
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>

                  {/* Variants pill */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap text-[10px]">
                      <span className="text-slate-500">Variants:</span>
                      {product.variants.map((v, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700"
                        >
                          {v.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono truncate max-w-[140px]">
                  /{product.slug}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4">
              {editingProduct ? 'Edit Sweet Product' : 'Add New Sweet Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Pistachio Cube"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    placeholder="royal-pistachio-cube"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Crispy and guilt-free snack made with California pistachios & dates"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Full Description</label>
                <textarea
                  rows={3}
                  placeholder="Handcrafted with 100% natural ingredients, no palm oil, and zero refined sugar..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Net Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="250g / 500g"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Shelf Life</label>
                  <input
                    type="text"
                    value={formData.shelfLife}
                    onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                    placeholder="6 Months"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <label htmlFor="isBestSeller" className="text-slate-300 font-medium cursor-pointer">
                  Mark as Best Seller Badge
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Update Product' : 'Publish Sweet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
