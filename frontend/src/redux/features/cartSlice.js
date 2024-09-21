import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Initial state for the cart
const initialState = {
  cartItems: [], // Ensure cartItems is an array
  totalAmount: 0,
  totalItems: 0,
  loading: false,
};

// Async thunk for adding products to the cart
export const addProductsToCart = createAsyncThunk(
  'cart/addProductsToCart',
  async (id, { rejectWithValue }) => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.post(`/api/cart/${id}`);
      toast.success('Added product to your cart');
      return data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching all products in the cart
export const getAllCartProducts = createAsyncThunk(
  'cart/getAllCartProducts',
  async (_, { rejectWithValue }) => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.get('/api/cart');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a product from the cart
export const deleteProductFromCart = createAsyncThunk(
  'cart/deleteProductFromCart',
  async (id, { rejectWithValue }) => {
    axios.defaults.withCredentials = true;
    try {
      const { data } = await axios.delete(`/api/cart/${id}`);
      toast.success('Removed product from your cart');
      return data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const item = action.payload;
      // Ensure cartItems is an array, and use ._id for consistency
      const existingItem = state.cartItems.find(cartItem => cartItem._id === item._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      state.totalItems += 1;
      state.totalAmount += item.price;
      toast.success(`${item.name} added to cart!`);
    },
    removeItemFromCart: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.cartItems.find(cartItem => cartItem._id === itemId);

      if (existingItem) {
        state.totalItems -= 1;
        state.totalAmount -= existingItem.price;

        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter(cartItem => cartItem._id !== itemId);
        } else {
          existingItem.quantity -= 1;
        }
      }
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find(cartItem => cartItem._id === id);

      if (existingItem && quantity > 0) {
        const quantityDifference = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        state.totalAmount += quantityDifference * existingItem.price;
        state.totalItems += quantityDifference;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
  extraReducers: (builder) => {
    // Add product to cart (async)
    builder.addCase(addProductsToCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addProductsToCart.fulfilled, (state, action) => {
      state.loading = false;
      // Push the new product to cartItems
      state.cartItems.push(action.payload);
    });
    builder.addCase(addProductsToCart.rejected, (state) => {
      state.loading = false;
    });

    // Get all cart products (async)
    builder.addCase(getAllCartProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllCartProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = action.payload; // Ensure payload is an array
    });
    builder.addCase(getAllCartProducts.rejected, (state) => {
      state.loading = false;
    });

    // Delete product from cart (async)
    builder.addCase(deleteProductFromCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteProductFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id);
    });
    builder.addCase(deleteProductFromCart.rejected, (state) => {
      state.loading = false;
    });
  },
});

// Exporting actions
export const { addItemToCart, removeItemFromCart, updateItemQuantity, clearCart } = cartSlice.actions;

// Exporting reducer
export default cartSlice.reducer;
