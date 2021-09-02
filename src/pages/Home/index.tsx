import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart, setProductsContext } = useCart();

  //const cartItemsAmount = cart.reduce((sumAmount, product) => {
  //TODO;
  // }, {} as CartItemsAmount);
  console.log(products);
  useEffect(() => {
    async function loadProducts() {
      api.get("products").then((response) => {
        setProducts(response.data);
      });
    }

    loadProducts();

    const shoe = {
      amount: 1,
      id: 12,
      image:
        "https://static.dafiti.com.br/p/Nike-T%C3%AAnis-Nike-Wmns-Revolution-5-Preto-0154-6507015-1-zoom.jpg",
      title: "Tenis muito bonito",
      price: 300,
    };
  }, []);

  useEffect(() => {
    setProductsContext(products);
  }, [products]);

  function handleAddProduct(productId: number) {
    addProduct(productId);
  }

  return (
    <ProductList>
      {products &&
        products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{`${formatPrice(product.price)}`}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(product.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {/* {cartItemsAmount[product.id] || 0} */} 2
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
    </ProductList>
  );
};

export default Home;
