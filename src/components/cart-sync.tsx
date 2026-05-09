"use client";

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useAuth } from "@/context/auth-context";
import { apiClient } from "@/lib/api-client";
import { setCartItems } from "@/store/slices/cartSlice";

export function CartSync() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isFirstMount = useRef(true);
  const lastSyncedCart = useRef<string>("");

  // 1. Initial Sync: Merge backend cart on login
  useEffect(() => {
    const syncOnLogin = async () => {
      if (user && isFirstMount.current) {
        try {
          const response = await apiClient.get("/auth/profile");
          const backendCart = response.data.user.cart;

          if (backendCart && Array.isArray(backendCart) && backendCart.length > 0) {
            // Simple merge strategy: if local cart is empty, use backend. 
            // If local has items, we could merge or keep local. 
            // Most users expect their current guest cart to be preserved and added to their account.
            if (cartItems.length === 0) {
               dispatch(setCartItems(backendCart));
            } else {
               // Merge: Add backend items to local if they don't exist
               const merged = [...cartItems];
               backendCart.forEach((bItem: any) => {
                 if (!merged.find(lItem => lItem.id === bItem.id)) {
                   merged.push(bItem);
                 }
               });
               dispatch(setCartItems(merged));
            }
          }
        } catch (err) {
          console.error("Failed to sync cart from backend:", err);
        }
        isFirstMount.current = false;
      }
    };

    syncOnLogin();
  }, [user]);

  // 2. Continuous Sync: Upload local changes to backend
  useEffect(() => {
    const uploadCart = async () => {
      if (user && cartItems.length > 0) {
        const currentCartStr = JSON.stringify(cartItems);
        if (currentCartStr !== lastSyncedCart.current) {
          try {
            await apiClient.put("/auth/cart", { cartItems });
            lastSyncedCart.current = currentCartStr;
          } catch (err) {
            console.error("Failed to sync cart to backend:", err);
          }
        }
      }
    };

    const timeout = setTimeout(uploadCart, 2000); // Debounce sync
    return () => clearTimeout(timeout);
  }, [cartItems, user]);

  return null;
}
