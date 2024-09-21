import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateItemQuantity, deleteProductFromCart } from '../redux/features/cartSlice';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CartItem = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.quantity);

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    dispatch(updateItemQuantity({ id: product._id, quantity: newQuantity }));
  };

  // Remove item from the cart
  const handleRemoveItem = () => {
    dispatch(deleteProductFromCart(product._id));
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-md mb-4">
      <div className="flex items-center justify-between">
        <img
          src={product.photo}
          alt={product.productName}
          className="w-20 h-20 object-cover rounded-md"
        />
        <div className="ml-4 flex-grow">
          <h3 className="font-medium text-lg">{product.productName}</h3>
          <p className="text-gray-500">
            ${product.price} x {quantity} = ${(product.price * quantity).toFixed(2)}
          </p>
          <div className="flex items-center mt-2">
            {/* Decrease Quantity */}
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              disabled={quantity === 1}
            >
              -
            </button>

            {/* Display Quantity */}
            <span className="mx-2">{quantity}</span>

            {/* Increase Quantity */}
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemoveItem}
          className="text-red-500 hover:text-red-600 ml-4"
          aria-label={`Remove ${product.productName} from cart`}
        >
          Remove
        </button>
      </div>

      {/* View Details Link */}
      <div className="mt-2">
        <Link
          to={`/productDetails/${product._id}`}
          className="text-blue-500 hover:underline"
        >
          View details
        </Link>
      </div>
    </div>
  );
};

// PropTypes for validation
CartItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default CartItem;
