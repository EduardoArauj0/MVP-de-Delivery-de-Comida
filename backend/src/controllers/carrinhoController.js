const { Carrinho, CarrinhoItem, Produto, User } = require('../models');

module.exports = {
  // Obter carrinho do cliente com itens e produtos
  async obterCarrinho(req, res) {
    try {
      const { clienteId } = req.params;

      if (req.user.id !== Number(clienteId)) {
        return res.status(403).json({ erro: 'Você só pode acessar seu próprio carrinho' });
      }

      let carrinho = await Carrinho.findOne({
        where: { clienteId },
        include: {
          model: CarrinhoItem,
          include: Produto
        }
      });

      if (!carrinho) {
        carrinho = await Carrinho.create({ clienteId });
      }

      res.json(carrinho);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao obter carrinho' });
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

      let carrinho = await Carrinho.findOne({ where: { clienteId } });
      if (!carrinho) {
        carrinho = await Carrinho.create({ clienteId });
      }

      let item = await CarrinhoItem.findOne({ where: { CarrinhoId: carrinho.id, ProdutoId: produtoId } });

      if (item) {
        // Atualiza quantidade
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
      res.status(500).json({ erro: 'Erro ao adicionar item no carrinho' });
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

      const carrinho = await Carrinho.findOne({ where: { clienteId } });
      if (!carrinho) return res.status(404).json({ erro: 'Carrinho não encontrado' });

      const item = await CarrinhoItem.findOne({ where: { id: itemId, CarrinhoId: carrinho.id } });
      if (!item) return res.status(404).json({ erro: 'Item não encontrado no carrinho' });

      item.quantidade = quantidade;
      await item.save();

      res.json(item);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar item' });
    }
  },

  // Remover item do carrinho
  async removerItem(req, res) {
    try {
      const { clienteId, itemId } = req.params;

      if (req.user.id !== Number(clienteId)) {
        return res.status(403).json({ erro: 'Você só pode acessar seu próprio carrinho' });
      }

      const carrinho = await Carrinho.findOne({ where: { clienteId } });
      if (!carrinho) return res.status(404).json({ erro: 'Carrinho não encontrado' });

      const item = await CarrinhoItem.findOne({ where: { id: itemId, CarrinhoId: carrinho.id } });
      if (!item) return res.status(404).json({ erro: 'Item não encontrado no carrinho' });

      await item.destroy();
      res.json({ mensagem: 'Item removido do carrinho' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover item' });
    }
  },

  // Limpar carrinho inteiro (opcional)
  async limparCarrinho(req, res) {
    try {
      const { clienteId } = req.params;

      if (req.user.id !== Number(clienteId)) {
        return res.status(403).json({ erro: 'Você só pode acessar seu próprio carrinho' });
      }

      const carrinho = await Carrinho.findOne({ where: { clienteId } });
      if (!carrinho) return res.status(404).json({ erro: 'Carrinho não encontrado' });

      await CarrinhoItem.destroy({ where: { CarrinhoId: carrinho.id } });

      res.json({ mensagem: 'Carrinho limpo com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao limpar carrinho' });
    }
  }
};
