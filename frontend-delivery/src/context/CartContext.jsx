import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import carrinhoService from '../services/carrinhoService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartError, setCartError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (user?.id && user.tipo === 'cliente' && token) {
      setLoadingCart(true);
      setCartError(null);
      try {
        const response = await carrinhoService.obterCarrinho(user.id);
        setCart(response.data);
      } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        setCartError(error.response?.data?.erro || 'Erro ao carregar carrinho.');

        if (error.response?.status === 404) {
            try {
                const newCartResponse = await carrinhoService.obterCarrinho(user.id);
                setCart(newCartResponse.data);
            } catch (retryError) {
                 console.error('Erro ao buscar carrinho após tentativa de criação:', retryError);
                 setCart(null);
            }
        } else {
            setCart(null);
        }
      } finally {
        setLoadingCart(false);
      }
    } else {
      setCart(null);
    }
  }, [user, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItemToCart = async (produtoId, quantidade) => {
    if (!user?.id || user.tipo !== 'cliente') {
      setCartError('Usuário não logado ou não é cliente.');
      return false;
    }
    setLoadingCart(true);
    setCartError(null);
    try {
      await carrinhoService.adicionarItem(user.id, { produtoId, quantidade });
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      setCartError(error.response?.data?.erro || 'Erro ao adicionar item.');
      await fetchCart();
      return false;
    } finally {
      setLoadingCart(false);
    }
  };

  const updateItemQuantity = async (itemId, quantidade) => {
    if (!user?.id || user.tipo !== 'cliente') {
      setCartError('Usuário não logado ou não é cliente.');
      return;
    }
    if (quantidade <= 0) { 
      return removeItemFromCart(itemId);
    }
    setLoadingCart(true);
    setCartError(null);
    try {
      await carrinhoService.atualizarItem(user.id, itemId, { quantidade });
      await fetchCart();
    } catch (error) {
      console.error('Erro ao atualizar quantidade do item:', error);
      setCartError(error.response?.data?.erro || 'Erro ao atualizar item.');
      await fetchCart();
    } finally {
      setLoadingCart(false);
    }
  };

  const removeItemFromCart = async (itemId) => {
    if (!user?.id || user.tipo !== 'cliente') {
      setCartError('Usuário não logado ou não é cliente.');
      return;
    }
    setLoadingCart(true);
    setCartError(null);
    try {
      await carrinhoService.removerItem(user.id, itemId);
      await fetchCart();
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      setCartError(error.response?.data?.erro || 'Erro ao remover item.');
      await fetchCart();
    } finally {
      setLoadingCart(false);
    }
  };

  const clearClientCart = async () => {
    if (!user?.id || user.tipo !== 'cliente') {
      setCartError('Usuário não logado ou não é cliente.');
      return;
    }
    setLoadingCart(true);
    setCartError(null);
    try {
      await carrinhoService.limparCarrinho(user.id);
      await fetchCart();
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      setCartError(error.response?.data?.erro || 'Erro ao limpar carrinho.');
      await fetchCart();
    } finally {
      setLoadingCart(false);
    }
  };

  // Calcula o total de itens e o valor total do carrinho
  const cartDetails = React.useMemo(() => {
    if (!cart || !cart.CarrinhoItems) {
      return { itemCount: 0, totalAmount: 0, restaurantId: null };
    }
    const itemCount = cart.CarrinhoItems.reduce((sum, item) => sum + item.quantidade, 0);
    const totalAmount = cart.CarrinhoItems.reduce((sum, item) => {

        const price = item.Produto?.preco ? parseFloat(item.Produto.preco) : 0;
        return sum + (item.quantidade * price);
    }, 0);

 
    let restaurantId = null;
    if (cart.CarrinhoItems.length > 0 && cart.CarrinhoItems[0].Produto?.RestauranteId) {
        restaurantId = cart.CarrinhoItems[0].Produto.RestauranteId;
    }


    return { itemCount, totalAmount, cartItems: cart.CarrinhoItems, restaurantId };
  }, [cart]);


  return (
    <CartContext.Provider value={{
      cart,
      cartItems: cartDetails.cartItems,
      itemCount: cartDetails.itemCount,
      totalAmount: cartDetails.totalAmount,
      cartRestaurantId: cartDetails.restaurantId,
      loadingCart,
      cartError,
      fetchCart,
      addItemToCart,
      updateItemQuantity,
      removeItemFromCart,
      clearClientCart,
      setCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);