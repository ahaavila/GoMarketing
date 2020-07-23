import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Função para carregar os produtos
  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // carrego os produtos
      const storagedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );

      // Se existir alguma coisa, eu jogo ele pra dentro de setProducts
      if (storagedProducts) {
        setProducts([...JSON.parse(storagedProducts)]);
      }
    }

    loadProducts();
  }, []);

  // Função para adicionar um item no carrinho
  const addToCart = useCallback(
    async product => {
      // Verifico se o item seleciona já exista no carrinho
      const productExists = products.find(p => p.id === product.id);

      // Se existir o item no carrinho
      if (productExists) {
        setProducts(
          // dou um map em todos os meus products no carrinho
          products.map(p =>
            // se o id do produto do carrinho for igual ao id do produto em questão eu somo 1 na quantidade, se não, eu só retorno o produto
            p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
          ),
        );
      } else {
        // Caso o item selecionado não estiver no carrinho, eu adiciono ele com a quantidade = 1
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  // Função que adicona uma quantidade a mais no carrinho
  const increment = useCallback(
    async id => {
      // percorro todos os itens do meu carrinho
      const newProducts = products.map(product =>
        // se existir um item no carrinho que tenha o mesmo id do item que eu to aumentando, eu adiciono 1 na quantidade
        // se não existir, eu só retorno o item.
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );

      // jogo a minha variavel para dentro do estado
      setProducts(newProducts);

      // atualizo meu storage com os novos dados
      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  // Função que remove uma quantidade do item no carrinho
  const decrement = useCallback(
    async id => {
      // / percorro todos os itens do meu carrinho
      const newProducts = products.map(product =>
        // se existir um item no carrinho que tenha o mesmo id do item que eu to aumentando, eu removo 1 na quantidade
        // se não existir, eu só retorno o item.
        product.id === id
          ? { ...product, quantity: product.quantity - 1 }
          : product,
      );

      // jogo a minha variavel para dentro do estado
      setProducts(newProducts);

      // atualizo meu storage com os novos dados
      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
