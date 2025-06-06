const { Carrinho, CarrinhoItem, Produto } = require('../models');

module.exports = {
  // Obter carrinho do cliente com itens e produtos
  async obterCarrinho(req, res) {
    try {
      const { clienteId } = req.params;

      if (req.user.id !== Number(clienteId)) {
        return res.status(403).json({ erro: 'Você só pode acessar seu próprio carrinho' });
      }

      let carrinho = await Carrinho.findOne({
        where: { clienteId: Number(clienteId) },
        include: [{
          model: CarrinhoItem,
          as: 'itensNoCarrinho',
          include: [{
            model: Produto,
            as: 'produtoCarrinho' 
          }]
        }]
      });

      if (!carrinho) {
        carrinho = await Carrinho.create({ clienteId: Number(clienteId) });
        const carrinhoVazio = carrinho.toJSON();
        carrinhoVazio.itensNoCarrinho = [];
        return res.json(carrinhoVazio);
      }

      res.json(carrinho);
    } catch (error) {
      console.error('Erro detalhado ao obter carrinho:', error); 
      res.status(500).json({ erro: 'Erro ao obter carrinho', detalhes: error.message });
    }
  },

  // Adicionar item no carrinho
  async adicionarItem(req, res) {
    try {
      const { clienteId } = req.params;
      
      if (req.user.id !== Number(clienteId)) {
        return res.status(403).json({ erro: 'Você só pode acessar seu próprio carrinho' });
      }

      const { produtoId, quantidade } = req.body;
      const [carrinho] = await Carrinho.findOrCreate({
        where: { clienteId: Number(clienteId) },
      });

      let item = await CarrinhoItem.findOne({ where: { CarrinhoId: carrinho.id, ProdutoId: produtoId } });
      if (item) {
        item.quantidade += quantidade;
        await item.save();
      } else {
        item = await CarrinhoItem.create({
          CarrinhoId: carrinho.id,
          ProdutoId: produtoId,
          quantidade
        });
      }

      res.status(201).json(item);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      res.status(500).json({ erro: 'Erro ao adicionar item no carrinho', detalhes: error.message });
    }
  },

  // Atualizar quantidade de item
  async atualizarItem(req, res) {
    try {
      const { clienteId, itemId } = req.params;
      
      if (req.user.id !== Number(clienteId)) {
        return res.status(403).json({ erro: 'Você só pode acessar seu próprio carrinho' });
      }

      const { quantidade } = req.body;

      const carrinho = await Carrinho.findOne({ where: { clienteId: Number(clienteId) } });
      if (!carrinho) return res.status(404).json({ erro: 'Carrinho não encontrado' });

      const item = await CarrinhoItem.findOne({ where: { id: itemId, CarrinhoId: carrinho.id } });
      if (!item) return res.status(404).json({ erro: 'Item não encontrado no carrinho' });

      item.quantidade = quantidade;
      await item.save();

      res.json(item);
    } catch (error)
        {
      console.error('Erro ao atualizar item:', error);
      res.status(500).json({ erro: 'Erro ao atualizar item', detalhes: error.message });
    }
  },

  // Remover item do carrinho
  async removerItem(req, res) {
    try {
      const { clienteId, itemId } = req.params;

      if (req.user.id !== Number(clienteId)) {
        return res.status(403).json({ erro: 'Você só pode acessar seu próprio carrinho' });
      }

      const carrinho = await Carrinho.findOne({ where: { clienteId: Number(clienteId) } });
      if (!carrinho) return res.status(404).json({ erro: 'Carrinho não encontrado' });

      const item = await CarrinhoItem.findOne({ where: { id: itemId, CarrinhoId: carrinho.id } });
      if (!item) return res.status(404).json({ erro: 'Item não encontrado no carrinho' });

      await item.destroy();
      res.json({ mensagem: 'Item removido do carrinho' });
    } catch (error) {
      console.error('Erro ao remover item:', error);
      res.status(500).json({ erro: 'Erro ao remover item', detalhes: error.message });
    }
  },

  // Limpar carrinho inteiro
  async limparCarrinho(req, res) {
    try {
      const { clienteId } = req.params;

      if (req.user.id !== Number(clienteId)) {
        return res.status(403).json({ erro: 'Você só pode acessar seu próprio carrinho' });
      }

      const carrinho = await Carrinho.findOne({ where: { clienteId: Number(clienteId) } });
      if (!carrinho) return res.status(404).json({ erro: 'Carrinho não encontrado' });

      await CarrinhoItem.destroy({ where: { CarrinhoId: carrinho.id } });

      res.json({ mensagem: 'Carrinho limpo com sucesso' });
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      res.status(500).json({ erro: 'Erro ao limpar carrinho', detalhes: error.message });
    }
  }
};