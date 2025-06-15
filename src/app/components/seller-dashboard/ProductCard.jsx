import Image from 'next/image';

export default function ProductCard({ product, onEdit, onDelete }) {
    return (
        <div className="  overflow-hidden  max-w-[300px] rounded-t-xl mx-auto w-full">
            <div className="h-48  bg-gray-100 relative">
{product.images?.length > 0 && product.images[0]?.url ? (
  <Image
    src={typeof product.images[0].url === 'string'
      ? product.images[0].url
      : URL.createObjectURL(product.images[0].url)}
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

            <div className="px-4 py-1.5 bg-[#F1F1F1] rounded-b-xl">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className=" font-semibold text-sm mb-1">{product.brandName} - {product.model}</p>
                <p className="text-sm mb-2 line-clamp-2 h-10">{product.description}</p>

                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
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
                        <span className="font-medium">Min Order:</span> {product.minOrderQuantity}
                    </div>
                </div>
            </div>

            <div className="flex justify-evenly gap-2 mt-4 px-2">
                <button
                    onClick={() => onEdit(product)}
                    className="px-3 py-3 w-full bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm cursor-pointer"
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="px-3 py-3 w-full bg-red-500 text-white rounded hover:bg-red-600 text-sm cursor-pointer"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
