import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { compressImage } from '@/lib/imageCompressor';
import {
  Plus,
  Search,
  Package,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Tag,
  Layers,
  HeartPulse,
} from 'lucide-react';

const getImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith('http://') || img.startsWith('https://')) {
    if (img.includes('localhost:5000')) {
      return img.replace('http://localhost:5000', 'https://wemakesweets-backend.onrender.com');
    }
    return img;
  }
  return `https://wemakesweets-backend.onrender.com${img.startsWith('/') ? '' : '/'}${img}`;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ProductManagement = () => {
  const { products, isLoading, addProduct, deleteProduct } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submittingStatus, setSubmittingStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Accordion tabs in modal
  const [showNutrition, setShowNutrition] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);

  // Selected image files (up to 5)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Form State matching MongoDB Schema & Postman requirements
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    salePrice: 349,
    mrp: 399,
    rating: 4.7,
    stock: 20,
    isBestSeller: false,
    weight: '250g',
    shelfLife: '6 Months',
    storage: 'Store in a cool and dry place. Keep away from direct sunlight.',
    countryOfOrigin: 'India',
    ingredients: 'Pumpkin Seeds, Sunflower Seeds, Flax Seeds, Sesame Seeds, Chia Seeds, Dates',
    nutrition: {
      calories: '168 kcal',
      protein: '5.2 g',
      iron: '2.1 mg',
      phosphorus: '118 mg',
      sugar: '7 g',
      fat: '8.2 g',
    },
    variants: [
      {
        title: '250g',
        salePrice: 349,
        mrp: 399,
        stock: 20,
        sku: 'MSC251',
      },
    ],
    coupons: [],
  });

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.shortDescription?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  const handleCloseAddModal = () => {
    previewUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (_) {}
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setErrorMessage('');
    setSuccessMessage('');
    setSubmittingStatus('');
    setIsAddModalOpen(false);
  };

  const handleOpenAdd = () => {
    previewUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (_) {}
    });
    const timestamp = Date.now().toString().slice(-4);
    setFormData({
      name: '',
      shortDescription: '',
      description: '',
      salePrice: 349,
      mrp: 399,
      rating: 4.7,
      stock: 20,
      isBestSeller: false,
      weight: '250g',
      shelfLife: '6 Months',
      storage: 'Store in a cool and dry place. Keep away from direct sunlight.',
      countryOfOrigin: 'India',
      ingredients: 'Pumpkin Seeds, Sunflower Seeds, Flax Seeds, Sesame Seeds, Chia Seeds, Dates',
      nutrition: {
        calories: '168 kcal',
        protein: '5.2 g',
        iron: '2.1 mg',
        phosphorus: '118 mg',
        sugar: '7 g',
        fat: '8.2 g',
      },
      variants: [
        {
          title: '250g',
          salePrice: 349,
          mrp: 399,
          stock: 20,
          sku: `SWT-${timestamp}`,
        },
      ],
      coupons: [],
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setErrorMessage('');
    setSuccessMessage('');
    setSubmittingStatus('');
    setIsAddModalOpen(true);
  };

  const handleFileChange = (e) => {
    const incomingFiles = Array.from(e.target.files || []);
    if (incomingFiles.length === 0) return;

    // Reset file input value so user can pick the same file again if removed
    e.target.value = '';

    const currentCount = selectedFiles.length;
    const remainingSlots = 5 - currentCount;

    if (remainingSlots <= 0) {
      setErrorMessage('Maximum 5 images allowed per product. Remove an image to add a different one.');
      return;
    }

    let filesToAdd = incomingFiles;
    if (incomingFiles.length > remainingSlots) {
      filesToAdd = incomingFiles.slice(0, remainingSlots);
      setErrorMessage(`Only up to 5 images can be added in total. Added ${remainingSlots} photo(s).`);
    } else {
      setErrorMessage('');
    }

    const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...filesToAdd]);
    setPreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const handleRemoveImage = (indexToRemove) => {
    if (previewUrls[indexToRemove]) {
      try {
        URL.revokeObjectURL(previewUrls[indexToRemove]);
      } catch (_) {}
    }
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
    setErrorMessage('');
  };

  const handleAddVariant = () => {
    const nextSku = `SKU-${Date.now().toString().slice(-4)}`;
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          title: '500g',
          salePrice: Math.round(prev.salePrice * 1.8),
          mrp: Math.round(prev.mrp * 1.8),
          stock: 10,
          sku: nextSku,
        },
      ],
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter the product name.');
      return;
    }
    if (!formData.shortDescription.trim()) {
      setErrorMessage('Please enter a short description.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Please enter the full description.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build FormData payload
      const fd = new FormData();
      fd.append('name', formData.name.trim());

      // Auto-generated slug (never manual as requested)
      const baseSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      fd.append('slug', `${baseSlug}-${Date.now()}`);

      fd.append('shortDescription', formData.shortDescription.trim());
      fd.append('description', formData.description.trim());
      fd.append('salePrice', String(formData.salePrice));
      fd.append('mrp', String(formData.mrp));
      fd.append('rating', String(formData.rating || 4.7));
      fd.append('stock', String(formData.stock));
      fd.append('isBestSeller', String(Boolean(formData.isBestSeller)));
      fd.append('weight', formData.weight);
      fd.append('shelfLife', formData.shelfLife);
      fd.append('storage', formData.storage);
      fd.append('countryOfOrigin', formData.countryOfOrigin);

      // Random unique Shiprocket ID to satisfy unique index
      const randomShiprocketId = 1000000000 + Math.floor(Math.random() * 900000);
      fd.append('shiprocketId', String(randomShiprocketId));

      // Ingredients array
      const ingredientsArr = formData.ingredients
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      fd.append('ingredients', JSON.stringify(ingredientsArr));

      // Nutrition object
      fd.append('nutrition', JSON.stringify(formData.nutrition));

      // Variants array
      const variantsArr =
        formData.variants && formData.variants.length > 0
          ? formData.variants.map((v, i) => ({
              title: v.title,
              salePrice: Number(v.salePrice),
              mrp: Number(v.mrp),
              stock: Number(v.stock),
              sku: v.sku || `SKU-${Date.now()}-${i}`,
              shiprocketId: randomShiprocketId + i + 1,
            }))
          : [
              {
                title: formData.weight,
                salePrice: Number(formData.salePrice),
                mrp: Number(formData.mrp),
                stock: Number(formData.stock),
                sku: `SKU-${Date.now()}`,
                shiprocketId: randomShiprocketId + 1,
              },
            ];
      fd.append('variants', JSON.stringify(variantsArr));

      // Coupons array
      fd.append('coupons', JSON.stringify(formData.coupons || []));

      // NOTE: highlights is intentionally NOT sent in body per request ("highlights nhi jayega body me vo fix hai")

      // Compress and attach image files if any (bypasses 5MB multer limit for 6MB+ files)
      if (selectedFiles.length > 0) {
        setSubmittingStatus(`Optimizing ${selectedFiles.length} photo(s)...`);
        for (let i = 0; i < selectedFiles.length; i++) {
          const original = selectedFiles[i];
          const compressed = await compressImage(original, 2.5, 1920);
          fd.append('images', compressed);
        }
      }

      setSubmittingStatus('Saving product to live server...');
      await addProduct(fd);
      setSuccessMessage('Product added successfully to live backend!');

      setTimeout(() => {
        handleCloseAddModal();
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add product.');
    } finally {
      setIsSubmitting(false);
      setSubmittingStatus('');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        setDeletingId(id);
        await deleteProduct(id);
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      } finally {
        setDeletingId(null);
      }
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

      {/* Search and Total Count */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, description..."
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
          {filteredProducts.map((product) => {
            const hasImages = Array.isArray(product.images) && product.images.length > 0;
            const primaryImage = hasImages ? getImageUrl(product.images[0]) : null;

            return (
              <div
                key={product._id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  {/* Product Image Header */}
                  <div className="h-44 bg-gradient-to-tr from-pink-950/30 to-slate-800 flex items-center justify-center relative overflow-hidden">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-3xl shadow-inner">
                        🍬
                      </div>
                    )}

                    {product.isBestSeller && (
                      <span className="absolute top-3 right-3 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Best Seller
                      </span>
                    )}

                    {product.images && product.images.length > 1 && (
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-pink-300 border border-pink-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-pink-400" />
                        {product.images.length} Photos
                      </span>
                    )}

                    <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                      {product.weight || '250g'}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-bold text-white text-base truncate">{product.name}</h3>
                      <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                        ★ {product.rating || 4.7}
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
                        {product.mrp && product.mrp > product.salePrice && (
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {Math.round(
                              ((product.mrp - product.salePrice) / product.mrp) * 100
                            )}
                            % OFF
                          </span>
                        )}
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

                    {/* Variants pills */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5 flex-wrap text-[10px]">
                        <span className="text-slate-500">Variants:</span>
                        {product.variants.map((v, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700"
                          >
                            {v.title} (₹{v.salePrice})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">
                    ID: {product._id?.slice(-8)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      disabled={deletingId === product._id}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer disabled:opacity-50"
                      title="Delete Product"
                    >
                      {deletingId === product._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-200 shadow-2xl relative">
            <button
              onClick={handleCloseAddModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Add New Sweet Product</h2>
                <p className="text-xs text-slate-400">
                  Upload sweet images, set prices, variants, and nutrition details
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Product Name (Slug is auto-generated in backend payload) */}
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Product Name <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hello Cube / Multi Seed Cube"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Short & Full Description */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Short Description <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="A crunchy and wholesome snack made with premium seeds."
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, shortDescription: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Full Description <span className="text-pink-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="A delicious and healthy multi-seed snack cube made with natural ingredients..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Sale Price (₹) <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.salePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, salePrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    MRP (₹) <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Stock Quantity <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={5}
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Weight, Shelf Life, Storage, Country */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Net Weight <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="250g"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Shelf Life <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6 Months"
                    value={formData.shelfLife}
                    onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-slate-300 font-medium block mb-1">
                    Storage Instruction <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Store in a cool and dry place."
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Product Images Upload (up to 5 photos) */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                    <span>Product Images (Up to 5 Photos)</span>
                  </label>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedFiles.length === 5
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                    }`}
                  >
                    {selectedFiles.length} / 5 Selected
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-tight">
                  The first image (#1 Cover) will be the primary catalog thumbnail. Files &gt;5MB (e.g. 6MB) are automatically optimized.
                </p>

                {/* Thumbnails grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                  {selectedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="relative rounded-xl overflow-hidden border border-slate-700/70 bg-slate-900 aspect-square group shadow-md"
                    >
                      <img
                        src={previewUrls[i]}
                        alt={`Sweet image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Cover Badge or Photo Number */}
                      <div className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-sm text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow">
                        {i === 0 ? (
                          <span className="text-pink-400 font-extrabold">★ Cover</span>
                        ) : (
                          <span>#{i + 1}</span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        title="Remove image"
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center transition shadow-lg cursor-pointer hover:scale-110"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* File Size and Compression indicator */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-1 px-1.5 text-[9px] text-slate-300 truncate">
                        <span className="font-mono">{formatFileSize(file.size)}</span>
                        {file.size > 2.5 * 1024 * 1024 && (
                          <span className="text-emerald-400 text-[8px] font-medium block">
                            Auto-optimized
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Image Button slot (if < 5 images selected) */}
                  {selectedFiles.length < 5 && (
                    <label className="border-2 border-dashed border-slate-700 hover:border-pink-500 rounded-xl aspect-square flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-pink-400 cursor-pointer bg-slate-950/40 hover:bg-pink-500/5 transition p-2 text-center group">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-pink-500/20 flex items-center justify-center transition">
                        <Upload className="w-3.5 h-3.5 text-slate-300 group-hover:text-pink-400" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-300 group-hover:text-pink-400">
                        + Add Image
                      </span>
                      <span className="text-[9px] text-slate-500">
                        ({5 - selectedFiles.length} slots left)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Ingredients (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="Pumpkin Seeds, Sunflower Seeds, Flax Seeds, Dates"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Collapsible: Nutrition Facts */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowNutrition(!showNutrition)}
                  className="w-full p-3 bg-slate-950/80 hover:bg-slate-950 flex items-center justify-between text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                    Nutrition Facts (Calories, Protein, Fat, Sugar...)
                  </span>
                  {showNutrition ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showNutrition && (
                  <div className="p-3.5 bg-slate-950/40 grid grid-cols-3 gap-2.5 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400 text-[10px] block mb-0.5">Calories</span>
                      <input
                        type="text"
                        value={formData.nutrition.calories}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, calories: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block mb-0.5">Protein</span>
                      <input
                        type="text"
                        value={formData.nutrition.protein}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, protein: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block mb-0.5">Sugar</span>
                      <input
                        type="text"
                        value={formData.nutrition.sugar}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, sugar: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block mb-0.5">Fat</span>
                      <input
                        type="text"
                        value={formData.nutrition.fat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, fat: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block mb-0.5">Iron</span>
                      <input
                        type="text"
                        value={formData.nutrition.iron}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, iron: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block mb-0.5">Phosphorus</span>
                      <input
                        type="text"
                        value={formData.nutrition.phosphorus}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nutrition: { ...formData.nutrition, phosphorus: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible: Variants Builder */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowVariants(!showVariants)}
                  className="w-full p-3 bg-slate-950/80 hover:bg-slate-950 flex items-center justify-between text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    Product Variants ({formData.variants.length})
                  </span>
                  {showVariants ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showVariants && (
                  <div className="p-3.5 bg-slate-950/40 space-y-3 border-t border-slate-800">
                    {formData.variants.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 grid grid-cols-5 gap-2 items-center"
                      >
                        <div>
                          <span className="text-[9px] text-slate-400 block">Title</span>
                          <input
                            type="text"
                            value={v.title}
                            onChange={(e) => handleVariantChange(idx, 'title', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-white text-[11px]"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">Sale (₹)</span>
                          <input
                            type="number"
                            value={v.salePrice}
                            onChange={(e) =>
                              handleVariantChange(idx, 'salePrice', Number(e.target.value))
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-white text-[11px]"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">MRP (₹)</span>
                          <input
                            type="number"
                            value={v.mrp}
                            onChange={(e) =>
                              handleVariantChange(idx, 'mrp', Number(e.target.value))
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-white text-[11px]"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">SKU</span>
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-white text-[11px]"
                          />
                        </div>
                        <div className="text-right pt-3">
                          {formData.variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              className="text-rose-400 hover:text-rose-300 text-[10px] underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      + Add Another Variant
                    </button>
                  </div>
                )}
              </div>

              {/* Best Seller Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={(e) =>
                    setFormData({ ...formData, isBestSeller: e.target.checked })
                  }
                  className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="isBestSeller"
                  className="text-slate-300 font-medium cursor-pointer"
                >
                  Mark as Best Seller Badge
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-pink-600/20 cursor-pointer disabled:opacity-60 transition"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{submittingStatus || 'Publishing Sweet...'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Publish Sweet to Store</span>
                    </>
                  )}
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
