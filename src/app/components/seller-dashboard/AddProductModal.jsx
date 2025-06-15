import { useState, useEffect } from 'react';

export default function AddProductModal({
    isOpen,
    onClose,
    onSubmit,
    loading,
    product = null
}) {
    const initialFormState = {
        id: null,
        name: '',
        description: '',
        brandName: '',
        model: '',
        category: '',
        placeOfOrigin: '',
        price: '',
        minOrderQuantity: '',
        images: []
    };

    const [formData, setFormData] = useState(initialFormState);
    const [imagePreviews, setImagePreviews] = useState([]);

useEffect(() => {
    if (isOpen && product) {
        setFormData({
            ...initialFormState,
            ...product,
            images: product.images || [],
        });

        const previews = (product.images || []).map(img => {
            if (typeof img === 'string') return img;
            if (img instanceof File) return URL.createObjectURL(img);
            return null;
        }).filter(Boolean);

        setImagePreviews(previews);
    }

    if (isOpen && !product) {
        resetForm(); 
    }
}, [product, isOpen]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (index) => {
        const newPreviews = [...imagePreviews];
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);

        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            images: newImages
        }));
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setImagePreviews([]);
    };

const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("brandName", formData.brandName);
    form.append("model", formData.model);
    form.append("category", formData.category);
    form.append("placeOfOrigin", formData.placeOfOrigin);
    form.append("price", formData.price);
    form.append("minOrderQuantity", formData.minOrderQuantity);

    // Append images (files only)
    formData.images.forEach((img) => {
        if (typeof img !== "string") {
            form.append("images", img);
        }
    });

    // Call parent handler with FormData and isEdit flag
    onSubmit(form, !!product);

    resetForm();
    onClose();
};


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-100 shadow border border-gray-200 p-6 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">
                    {product ? 'Edit Product' : 'Add New Product'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {[
                            ['name', 'Name'],
                            ['brandName', 'Brand Name'],
                            ['model', 'Model'],
                            ['category', 'Category'],
                            ['placeOfOrigin', 'Place of Origin'],
                            ['price', 'Price', 'number'],
                            ['minOrderQuantity', 'Minimum Order Quantity', 'number']
                        ].map(([field, label, type = 'text']) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                <input
                                    type={type}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    className="h-20 w-20 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                        >
                            Cancel
                        </button>
<button
  type="submit"
  disabled={loading}
  className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
    loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  }`}
>
  {loading
    ? (product ? 'Updating...' : 'Adding...')
    : (product ? 'Update Product' : 'Add Product')}
</button>

                    </div>
                </form>
            </div>
        </div>
    );
}
