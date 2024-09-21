import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  deleteProductFromCart,
  getAllCartProducts,
  clearCart,
  updateItemQuantity,
} from "../redux/features/cartSlice";
import CartItem from "./CartItem";

const CartSidebar = ({ isCartOpen, toggleCart }) => {
  const dispatch = useDispatch();

  // Destructure cart data from Redux store, and ensure cartItems is always an array
  const { cartItems = [], totalAmount, loading } = useSelector((state) => ({
    ...state.cart,
    cartItems: Array.isArray(state.cart.cartItems) ? state.cart.cartItems : [],
  }));

  // Local state for tax and total price
  const [totalPrice, setTotalPrice] = useState(0);
  const [tax, setTax] = useState(0);

  // Fetch cart products when the cart is opened
  useEffect(() => {
    if (isCartOpen) {
      dispatch(getAllCartProducts())
        .unwrap()
        .then((result) => {
          console.log("Cart items fetched: ", result); // Debugging: Check the fetched products
        })
        .catch((error) => {
          console.error("Error fetching cart products: ", error);
        });
    }
  }, [dispatch, isCartOpen]);

  // Handle updating total price whenever cart items change
  const handleUpdateTotalPrice = useCallback(() => {
    const total = cartItems.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  // Calculate tax whenever total price changes
  useEffect(() => {
    setTax(totalPrice * 0.1); // Assuming a tax of 10%
  }, [totalPrice]);

  // Update total price when cart items change
  useEffect(() => {
    handleUpdateTotalPrice();
  }, [cartItems, handleUpdateTotalPrice]);

  // Remove item from the cart
  const handleRemoveItem = (id) => {
    dispatch(deleteProductFromCart(id));
  };

  // Update quantity of a cart item
  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateItemQuantity({ id, quantity }));
  };

  // Clear all items in the cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Close cart when ESC key is pressed
  const handleEsc = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        toggleCart();
      }
    },
    [toggleCart]
  );

  // Register the ESC key listener when the component mounts
  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleEsc]);

  return (
    <div
      className={`fixed inset-0 z-50 flex transition-transform duration-300 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="w-80 bg-white p-6 shadow-lg relative">
        <button
          onClick={toggleCart}
          className="absolute top-4 right-4 text-gray-500 text-2xl font-bold hover:text-red-500 transition duration-200"
          aria-label="Close Cart"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

        {/* Show loading spinner */}
        {loading ? (
          <div className="fixed top-0 right-0 h-screen w-screen z-50 flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : cartItems.length === 0 ? (
          // Empty cart message
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <div>
            {/* Render cart items */}
            {cartItems.map((product) => (
              <CartItem
                key={product._id} // Make sure _id exists in the data
                product={product}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">
                Subtotal: ${totalPrice.toFixed(2)}
              </h3>
              <h3 className="text-lg font-semibold">Tax: ${tax.toFixed(2)}</h3>
              <h3 className="text-xl font-semibold">
                Total: ${(totalPrice + tax).toFixed(2)}
              </h3>
              <button
                onClick={handleClearCart}
                className="w-full bg-red-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-red-600 transition duration-200"
                aria-label="Clear Cart"
              >
                Clear Cart
              </button>
              <Link
                to="/checkout"
                className="w-full bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-200 block text-center"
                aria-label="Proceed to Checkout"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
      <div
        onClick={toggleCart}
        className="flex-grow bg-black bg-opacity-50"
        aria-hidden="true"
      />
    </div>
  );
};

CartSidebar.propTypes = {
  isCartOpen: PropTypes.bool.isRequired,
  toggleCart: PropTypes.func.isRequired,
};

export default CartSidebar;
