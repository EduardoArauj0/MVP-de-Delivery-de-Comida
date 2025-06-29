import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import carrinhoService from '../services/carrinhoService';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(); 
const LOCAL_STORAGE_CART_KEY = 'deliveryAppLocalCart';

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const lastAddedRef = useRef(null);

  const loadLocalCart = useCallback(() => {
    const localCartString = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    if (localCartString) {
      try {
        const localCartData = JSON.parse(localCartString);
        return {
            id: 'local',
            clienteId: null,
            CarrinhoItems: localCartData.items || [],
            restauranteId: localCartData.restauranteId || null,
            restauranteNome: localCartData.restauranteNome || null,
        };
      } catch (e) {
        console.error("Erro ao parsear carrinho local:", e);
        localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
        return { id: 'local', clienteId: null, CarrinhoItems: [], restauranteId: null, restauranteNome: null };
      }
    }
    return { id: 'local', clienteId: null, CarrinhoItems: [], restauranteId: null, restauranteNome: null };
  }, []);

  const saveLocalCart = useCallback((currentCart) => {
    if (currentCart && currentCart.id === 'local') {
      const simplifiedItems = currentCart.CarrinhoItems.map(item => ({
        Produto: {
            id: item.Produto.id,
            nome: item.Produto.nome,
            preco: item.Produto.preco,
            imagem: item.Produto.imagem, 
            RestauranteId: item.Produto.RestauranteId,
        },
        quantidade: item.quantidade,
      }));
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify({
          items: simplifiedItems,
          restauranteId: currentCart.restauranteId,
          restauranteNome: currentCart.restauranteNome
      }));
    }
  }, []);

  const fetchBackendCart = useCallback(async () => {
    if (user?.id && user.permissoes?.includes('PLACE_ORDER') && token) {
      setLoadingCart(true);
      setCartError(null);
      try {
        const response = await carrinhoService.obterCarrinho(user.id);
        const backendCart = response.data;

        const normalizedCart = {
          id: backendCart.id,
          clienteId: backendCart.clienteId,
          restauranteId: backendCart.itensNoCarrinho?.[0]?.produtoCarrinho?.RestauranteId || null,
          restauranteNome: backendCart.itensNoCarrinho?.[0]?.produtoCarrinho?.restauranteProduto?.nome || null,
          CarrinhoItems: backendCart.itensNoCarrinho?.map(item => ({
            id: item.id,
            quantidade: item.quantidade,
            Produto: item.produtoCarrinho
          })) || []
        };
        
        setCart(normalizedCart);
      } catch (error) {
        console.error('Erro ao buscar carrinho do backend:', error);
        setCartError(error.response?.data?.erro || 'Erro ao carregar carrinho do backend.');
        setCart(null);
      } finally {
        setLoadingCart(false);
      }
    }
  }, [user, token]);

  const syncLocalCartWithBackend = useCallback(async () => {
    if (!user?.id || !token || isSyncing) return; 
    const localCartData = loadLocalCart();

    if (localCartData && localCartData.CarrinhoItems && localCartData.CarrinhoItems.length > 0) {
      setIsSyncing(true);
      setCartError(null);
      console.log("Sincronizando carrinho local com backend...");
      try {
        await carrinhoService.limparCarrinho(user.id);
        
        for (const item of localCartData.CarrinhoItems) {
          await carrinhoService.adicionarItem(user.id, {
            produtoId: item.Produto.id,
            quantidade: item.quantidade,
          });
        }
        localStorage.removeItem(LOCAL_STORAGE_CART_KEY); 
        console.log("Sincronização concluída. Buscando carrinho do backend.");
        await fetchBackendCart(); 
      } catch (error) {
        console.error('Erro ao sincronizar carrinho local com backend:', error);
        setCartError(error.response?.data?.erro || 'Erro na sincronização do carrinho.');
        await fetchBackendCart();
      } finally {
        setIsSyncing(false);
      }
    } else {
       await fetchBackendCart();
    }
  }, [user, token, isSyncing, loadLocalCart, fetchBackendCart]);

  useEffect(() => {
    if (user?.id && user.permissoes?.includes('PLACE_ORDER')) {
      syncLocalCartWithBackend();
    } else {
      setCart(loadLocalCart());
      setLoadingCart(false);
      setCartError(null);
    }
  }, [user, syncLocalCartWithBackend, loadLocalCart]);

  const addItemToCart = async (produto, quantidade) => {
    const now = Date.now();
    if (lastAddedRef.current && 
        lastAddedRef.current.productId === produto.id && 
        (now - lastAddedRef.current.timestamp) < 500) {
        console.warn("Ignorando adição duplicada rápida do mesmo produto.");
        return false;
    }
    lastAddedRef.current = { productId: produto.id, timestamp: now };
    
    setLoadingCart(true);
    setCartError(null);
    
    try {
      if (user?.id && user.permissoes?.includes('PLACE_ORDER')) {
        const itemData = { produtoId: produto.id, quantidade };
        await carrinhoService.adicionarItem(user.id, itemData);
        await fetchBackendCart();
        return true;
      } else {
        setCart(prevCart => {
          const cartToUpdate = prevCart ? prevCart : loadLocalCart();
          const newCart = JSON.parse(JSON.stringify(cartToUpdate));

          if (newCart.restauranteId && newCart.restauranteId !== produto.RestauranteId) {
              if (!window.confirm(`Seu carrinho atual contém itens do restaurante "${newCart.restauranteNome}". Deseja limpar o carrinho e adicionar itens deste novo restaurante?`)) {
                  return prevCart;
              }
              newCart.CarrinhoItems = [];
              newCart.restauranteId = null;
              newCart.restauranteNome = null;
          }
          if (!newCart.restauranteId && produto.RestauranteId) {
              newCart.restauranteId = produto.RestauranteId;
              newCart.restauranteNome = produto.Restaurante?.nome || "Restaurante Desconhecido";
          }

          const existingItemIndex = newCart.CarrinhoItems.findIndex(i => i.Produto.id === produto.id);
          if (existingItemIndex > -1) {
            newCart.CarrinhoItems[existingItemIndex].quantidade += quantidade;
          } else {
            newCart.CarrinhoItems.push({ Produto: produto, quantidade, id: `local-${produto.id}` });
          }
          
          saveLocalCart(newCart);
          return newCart;
        });
        return true;
      }
    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        setCartError(error.response?.data?.erro || 'Erro ao adicionar item.');
        if (user?.id) await fetchBackendCart();
        return false;
    } finally {
        setLoadingCart(false);
    }
  };

  const updateItemQuantity = async (produtoId, quantidade) => {
    setLoadingCart(true);
    setCartError(null);
    if (user?.id && user.permissoes?.includes('PLACE_ORDER')) {
      const backendItem = cart?.CarrinhoItems?.find(item => item.Produto.id === produtoId);
      if (!backendItem) {
        setCartError('Item não encontrado no carrinho do backend.');
        setLoadingCart(false);
        return;
      }
      if (quantidade <= 0) return removeItemFromCart(backendItem.id, produtoId);
      try {
        await carrinhoService.atualizarItem(user.id, backendItem.id, { quantidade });
        await fetchBackendCart();
      } catch (error) {
        setCartError(error.response?.data?.erro || 'Erro ao atualizar item.');
        await fetchBackendCart();
      } finally {
        setLoadingCart(false);
      }
    } else {
        setCart(prevCart => {
            if (!prevCart) return null;
            const newCart = JSON.parse(JSON.stringify(prevCart));
            const itemIndex = newCart.CarrinhoItems.findIndex(i => i.Produto.id === produtoId);

            if (itemIndex > -1) {
                if (quantidade <= 0) {
                    newCart.CarrinhoItems = newCart.CarrinhoItems.filter((_, index) => index !== itemIndex);
                } else {
                    newCart.CarrinhoItems[itemIndex].quantidade = quantidade;
                }
                if (newCart.CarrinhoItems.length === 0) {
                    newCart.restauranteId = null;
                    newCart.restauranteNome = null;
                }
                saveLocalCart(newCart);
                return newCart;
            }
            return prevCart;
        });
        setLoadingCart(false);
    }
  };

  const removeItemFromCart = async (itemId, produtoId) => {
    setLoadingCart(true);
    setCartError(null);
    if (user?.id && user.permissoes?.includes('PLACE_ORDER')) {
      if (!itemId && cart && cart.CarrinhoItems) { 
        const found = cart.CarrinhoItems.find(item => item.Produto.id === produtoId);
        itemId = found?.id;
      }
      if (!itemId) {
        console.error("removeItemFromCart (backend): itemId não encontrado para produtoId", produtoId);
        await fetchBackendCart();
        setLoadingCart(false);
        return;
      }
      try {
        await carrinhoService.removerItem(user.id, itemId);
        await fetchBackendCart();
      } catch (error) {
        console.error('Erro ao remover item (backend):', error);
        setCartError(error.response?.data?.erro || 'Erro ao remover item.');
        await fetchBackendCart();
      } finally {
        setLoadingCart(false);
      }
    } else {
      setCart(prevCart => {
        const newCart = { ...prevCart };
        newCart.CarrinhoItems = newCart.CarrinhoItems.filter(i => i.Produto.id !== (produtoId || itemId) ); 
         if(newCart.CarrinhoItems.length === 0){ 
            newCart.restauranteId = null;
            newCart.restauranteNome = null;
        }
        saveLocalCart(newCart);
        return newCart;
      });
      setLoadingCart(false);
    }
  };

  const clearClientCart = async () => {
    setLoadingCart(true);
    setCartError(null);
    if (user?.id && user.permissoes?.includes('PLACE_ORDER')) {
      try {
        await carrinhoService.limparCarrinho(user.id);
        await fetchBackendCart(); 
      } catch (error) {
        console.error('Erro ao limpar carrinho (backend):', error);
        setCartError(error.response?.data?.erro || 'Erro ao limpar carrinho.');
        await fetchBackendCart();
      } finally {
        setLoadingCart(false);
      }
    } else {
      const emptyLocalCart = { id: 'local', clienteId: null, CarrinhoItems: [], restauranteId: null, restauranteNome: null };
      setCart(emptyLocalCart);
      saveLocalCart(emptyLocalCart); 
      setLoadingCart(false);
    }
  };

  const cartDetails = React.useMemo(() => {
    if (!cart || !cart.CarrinhoItems) {
      return { itemCount: 0, totalAmount: 0, cartItems: [], cartRestaurantId: null, cartRestaurantNome: null };
    }
    const itemCount = cart.CarrinhoItems.reduce((sum, item) => sum + item.quantidade, 0);
    const totalAmount = cart.CarrinhoItems.reduce((sum, item) => {
        const price = item.Produto?.preco ? parseFloat(item.Produto.preco) : 0;
        return sum + (item.quantidade * price);
    }, 0);

    const cartRestaurantId = cart.restauranteId || (cart.CarrinhoItems.length > 0 && cart.CarrinhoItems[0].Produto?.RestauranteId) || null;
    const cartRestaurantNome = cart.restauranteNome || (cart.CarrinhoItems.length > 0 && (cart.CarrinhoItems[0].Produto?.Restaurante?.nome || cart.CarrinhoItems[0].Produto?.restauranteProduto?.nome)) || null;

    return { itemCount, totalAmount, cartItems: cart.CarrinhoItems, cartRestaurantId, cartRestaurantNome };
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart, 
      cartItems: cartDetails.cartItems,
      itemCount: cartDetails.itemCount,
      totalAmount: cartDetails.totalAmount,
      cartRestaurantId: cartDetails.cartRestaurantId,
      cartRestaurantNome: cartDetails.cartRestaurantNome,
      loadingCart,
      cartError,
      isSyncing,
      fetchCart: user?.id ? fetchBackendCart : () => setCart(loadLocalCart()),
      addItemToCart,
      updateItemQuantity,
      removeItemFromCart,
      clearClientCart,
      syncLocalCartWithBackend,
      setCart
    }}>
      {children}
    </CartContext.Provider>
  );
};