import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (product: Product) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    // const storagedCart = Buscar dados do localStorage

    // if (storagedCart) {
    //   return JSON.parse(storagedCart);
    // }

    return [];
  });

  const addProduct = async (product: Product) => {
    try {
      setCart([...cart, product]);
    } catch {
      console.log("houve erro na adição");
    }
  };

  const removeProduct = (productId: number) => {
    let listaCart = [...cart];
    try {
      listaCart = cart.filter((p) => p.id != productId);
      setCart(listaCart);
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      let listaCart = [...cart];
      listaCart.map((p) => (p.id !== productId ? p : (p.amount = amount)));
      console.log("recebi o id:", productId);
      console.log("a quantidade: ", amount);
      console.log("a lista atualizada dos produtos no carrinho é: ", cart);
      setCart(listaCart);
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
