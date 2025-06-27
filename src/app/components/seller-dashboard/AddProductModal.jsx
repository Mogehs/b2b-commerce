"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Package,
  MapPin,
  Tag,
  FileText,
  ShoppingCart,
} from "lucide-react";

export default function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  product = null,
}) {
  const initialFormState = {
    id: null,
    name: "",
    description: "",
    brandName: "",
    model: "",
    category: "",
    placeOfOrigin: "",
    price: "",
    minOrderQuantity: "",
    imageUrls: [""],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        ...initialFormState,
        ...product,
        imageUrls: product.images?.map((img) => img.url || img) || [""],
      });
    }

    if (isOpen && !product) {
      resetForm();
    }
  }, [product, isOpen]);

  const validateUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      const lowerUrl = url.toLowerCase();
      return (
        imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
        lowerUrl.includes("imgur.com") ||
        lowerUrl.includes("cloudinary.com") ||
        lowerUrl.includes("unsplash.com") ||
        lowerUrl.includes("pexels.com")
      );
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData((prev) => ({
      ...prev,
      imageUrls: newImageUrls,
    }));

    // Clear error when user starts typing
    if (errors[`imageUrl_${index}`]) {
      setErrors((prev) => ({ ...prev, [`imageUrl_${index}`]: "" }));
    }
  };

  const addImageUrlField = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ""],
    }));
  };

  const removeImageUrlField = (index) => {
    if (formData.imageUrls.length > 1) {
      const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        imageUrls: newImageUrls,
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.brandName.trim())
      newErrors.brandName = "Brand name is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.placeOfOrigin.trim())
      newErrors.placeOfOrigin = "Place of origin is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.minOrderQuantity || formData.minOrderQuantity <= 0)
      newErrors.minOrderQuantity = "Valid minimum order quantity is required";

    // Image URL validation
    const validUrls = formData.imageUrls.filter((url) => url.trim());
    if (validUrls.length === 0) {
      newErrors.imageUrls = "At least one image URL is required";
    } else {
      validUrls.forEach((url, index) => {
        if (!validateUrl(url)) {
          newErrors[`imageUrl_${index}`] = "Please enter a valid image URL";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const validImageUrls = formData.imageUrls.filter(
      (url) => url.trim() && validateUrl(url)
    );

    const productData = {
      ...formData,
      imageUrls: validImageUrls,
      price: parseFloat(formData.price),
      minOrderQuantity: parseInt(formData.minOrderQuantity),
    };

    onSubmit(productData, !!product);
    resetForm();
  };

  if (!isOpen) return null;

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Automotive",
    "Food & Beverages",
    "Health",
    "Toys",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C9AF2F] to-[#b79e29] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="text-white" size={24} />
            <h2 className="text-2xl font-bold text-white">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="text-[#C9AF2F]" size={20} />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all ${
                      errors.brandName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter brand name"
                  />
                  {errors.brandName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.brandName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all ${
                      errors.model ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter model number"
                  />
                  {errors.model && (
                    <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="text-[#C9AF2F]" />
                    Place of Origin *
                  </label>
                  <input
                    type="text"
                    name="placeOfOrigin"
                    value={formData.placeOfOrigin}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all ${
                      errors.placeOfOrigin
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter place of origin"
                  />
                  {errors.placeOfOrigin && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.placeOfOrigin}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="text-[#C9AF2F]" size={20} />
                Pricing & Quantity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <ShoppingCart size={16} className="text-[#C9AF2F]" />
                    Minimum Order Quantity *
                  </label>
                  <input
                    type="number"
                    name="minOrderQuantity"
                    value={formData.minOrderQuantity}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all ${
                      errors.minOrderQuantity
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="1"
                    min="1"
                  />
                  {errors.minOrderQuantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.minOrderQuantity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="text-[#C9AF2F]" size={20} />
                Description
              </h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                rows="4"
                placeholder="Describe your product features, specifications, and benefits..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Product Images */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="text-[#C9AF2F]" size={20} />
                Product Images
              </h3>

              {errors.imageUrls && (
                <p className="text-red-500 text-sm mb-4">{errors.imageUrls}</p>
              )}

              <div className="space-y-4">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) =>
                          handleImageUrlChange(index, e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9AF2F] focus:border-transparent transition-all ${
                          errors[`imageUrl_${index}`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="https://example.com/image.jpg"
                      />
                      {errors[`imageUrl_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`imageUrl_${index}`]}
                        </p>
                      )}
                    </div>

                    {/* Image Preview */}
                    {url && validateUrl(url) && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {formData.imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageUrlField(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addImageUrlField}
                  className="flex items-center gap-2 px-4 py-2 text-[#C9AF2F] border border-[#C9AF2F] rounded-lg hover:bg-[#C9AF2F] hover:text-white transition-all"
                >
                  <Plus size={18} />
                  Add Another Image URL
                </button>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Use free image hosting services like
                  Imgur, or direct links to images. Supported formats: JPG, PNG,
                  WebP, GIF
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-gradient-to-r from-[#C9AF2F] to-[#b79e29] text-white rounded-lg font-medium transition-all ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg hover:scale-105"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {product ? "Updating..." : "Adding..."}
                  </div>
                ) : product ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
