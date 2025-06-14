import Image from 'next/image';

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-100 relative">
        {product.images.length > 0 ? (
          <Image
            src={typeof product.images[0] === 'string' ? product.images[0] : URL.createObjectURL(product.images[0])}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.brandName} - {product.model}</p>
        <p className="text-sm mb-2 line-clamp-2">{product.description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="font-medium">Category:</span> {product.category}
          </div>
          <div>
            <span className="font-medium">Origin:</span> {product.placeOfOrigin}
          </div>
          <div>
            <span className="font-medium">Price:</span> ${product.price}
          </div>
          <div>
            <span className="font-medium">Min Order:</span> {product.minimumOrderQuantity}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
