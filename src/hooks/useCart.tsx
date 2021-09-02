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
  setProductsContext: (products: ProductFormatted[]) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [ProductList, setProductList] = useState<ProductFormatted[]>();

  const [cart, setCart] = useState<Product[]>(() => {
    // const storagedCart = Buscar dados do localStorage

    // if (storagedCart) {
    //   return JSON.parse(storagedCart);
    // }

    return [];
  });

  useEffect(() => {
    async function loadProducts() {
      api.get("products").then((response) => {
        setProductList(response.data);
      });

      loadProducts();

      console.log("lista de produtos hook: " + ProductList);
    }
  }, []);

  const addProduct = async (productId: number) => {
    try {
      ProductList?.map((product) => {
        let listaCart = [...cart];
        if (product.id == productId) {
          console.log(
            "o produto de id: ",
            productId,
            "foi encontrado na lista de produtos"
          );

          for (var index in listaCart) {
            if (listaCart[index].id == productId) {
              console.log("encontrei no carrinho o id: ", productId);
            } else {
              console.log("não encontrei no carrinho o id: ", productId);
            }
          }
        }
      });
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

  const setProductsContext = (products: ProductFormatted[]) => {
    setProductList(products);

    console.log("recebi a lista: ", products);
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
      value={{
        cart,
        addProduct,
        removeProduct,
        updateProductAmount,
        setProductsContext,
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
