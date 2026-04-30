"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import { useEffect } from "react";
import { setCartItems } from "./slices/cartSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load cart from localStorage on client mount
    const savedCart = localStorage.getItem("sharcly_cart");
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        store.dispatch(setCartItems(items));
      } catch (e) {
        console.error("Failed to rehydrate cart from localStorage", e);
      }
    }
  }, []);

  // Sync state back to localStorage on any state change
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem("sharcly_cart", JSON.stringify(state.cart.items));
    });
    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
