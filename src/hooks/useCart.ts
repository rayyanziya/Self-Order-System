"use client";

import { useState, useEffect, useCallback } from "react";
import type { CartItem, MenuItemDTO } from "@/lib/types";

const CART_KEY = "sos-cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCartItems(readCart());
    setHydrated(true);
  }, []);

  const persist = useCallback((items: CartItem[]) => {
    setCartItems(items);
    writeCart(items);
  }, []);

  const addItem = useCallback((menuItem: MenuItemDTO) => {
    setCartItems((prev) => {
      const existing = prev.find((c) => c.menuItem.id === menuItem.id);
      const next = existing
        ? prev.map((c) =>
            c.menuItem.id === menuItem.id
              ? { ...c, quantity: c.quantity + 1 }
              : c
          )
        : [...prev, { menuItem, quantity: 1 }];
      writeCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((menuItemId: number) => {
    setCartItems((prev) => {
      const next = prev.filter((c) => c.menuItem.id !== menuItemId);
      writeCart(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback(
    (menuItemId: number, qty: number) => {
      if (qty <= 0) {
        removeItem(menuItemId);
        return;
      }
      setCartItems((prev) => {
        const next = prev.map((c) =>
          c.menuItem.id === menuItemId ? { ...c, quantity: qty } : c
        );
        writeCart(next);
        return next;
      });
    },
    [removeItem]
  );

  const updateNote = useCallback((menuItemId: number, note: string) => {
    setCartItems((prev) => {
      const next = prev.map((c) =>
        c.menuItem.id === menuItemId ? { ...c, note: note || undefined } : c
      );
      writeCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const total = cartItems.reduce(
    (sum, c) => sum + c.menuItem.price * c.quantity,
    0
  );

  const itemCount = cartItems.reduce((sum, c) => sum + c.quantity, 0);

  return {
    cartItems,
    hydrated,
    addItem,
    removeItem,
    updateQuantity,
    updateNote,
    clearCart,
    total,
    itemCount,
  };
}
