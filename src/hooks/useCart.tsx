import { useEffect } from "react";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface ProductFormatted {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [ProductList, setProductList] = useState<ProductFormatted[]>();

  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart];
      const productExists = updatedCart.find(
        (product) => product.id === productId
      );
      const stock = await api.get(`/stock/${productId}`);
      const stockAmount = stock.data.amount;
      const currentAmount = productExists ? productExists.amount : 0;
      const amount = currentAmount + 1;

      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }
      if (productExists) {
        productExists.amount = amount;
      } else {
        const product = await api.get(`/products/${productId}`);

        const newProduct = {
          ...product.data,
          amount: 1,
        };

        updatedCart.push(newProduct);
      }
      setCart(updatedCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  //usando filter para remover
  /*   const removeProduct = (productId: number) => {
    let listaCart = [...cart];
    try {
      listaCart = cart.filter((p) => p.id != productId);
      setCart(listaCart);
    } catch {
      toast.error("Erro na remoção do produto");
    }
  }; */

  //usando findIndex com splice para remover
  const removeProduct = (productId: number) => {
    let listaCart = [...cart];
    try {
      const productIndex = listaCart.findIndex(
        (product) => productId === product.id
      );

      if (productIndex >= 0) {
        listaCart.splice(productIndex, 1);
        setCart(listaCart);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(listaCart));
      } else {
        throw Error;
      }
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        return;
      }
      /* let listaCart = [...cart];
      listaCart.map((p) => (p.id !== productId ? p : (p.amount = amount)));
      console.log("recebi o id:", productId);
      console.log("a quantidade: ", amount);
      console.log("a lista atualizada dos produtos no carrinho é: ", cart);
      setCart(listaCart); */

      const stock = await api.get(`/stock/${productId}`);
      const stockAmount = stock.data.amount;

      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      const listaCart = [...cart];
      const productExists = listaCart.find((p) => p.id === productId);

      if (productExists) {
        productExists.amount = amount;
        setCart(listaCart);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(listaCart));
      } else {
        throw Error();
      }
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addProduct,
        removeProduct,
        updateProductAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
