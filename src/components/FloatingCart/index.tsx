import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  // Função que exibe o valor total do carrinho
  const cartTotal = useMemo(() => {
    const total = products.reduce((accumulator, product) => {
      // vou salvar numa variavel o preço do produto multiplicado pela sua quantidade
      const productsSubtotal = product.price * product.quantity;

      // retorno o accumulator + o subtotal
      return accumulator + productsSubtotal;
    }, 0);

    return formatValue(total);
  }, [products]);

  // Função que vai exibir o total de itens no carinho
  const totalItensInCart = useMemo(() => {
    const total = products.reduce((accumulator, product) => {
      // vou salvar numa variavel a quantidade
      const productsQuantity = product.quantity;

      return accumulator + productsQuantity;
    }, 0);

    return total;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
