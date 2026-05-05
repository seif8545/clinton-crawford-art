// src/components/CartProvider.tsx
// Cart functionality has been retired in favour of an inquiry-based flow.
// This stub remains so that any leftover imports compile.

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useCartStore<T = unknown>(_selector?: (s: unknown) => T): T {
  return undefined as unknown as T
}
