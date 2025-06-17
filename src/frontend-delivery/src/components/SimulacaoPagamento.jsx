import React from 'react';

const CartaoFormSimulado = () => (
  <div className="mt-3 p-3 bg-light rounded">
    <h6 className="mb-3">Dados do Cartão</h6>
    <div className="mb-2">
      <label className="form-label small">Número do Cartão</label>
      <input type="text" className="form-control" placeholder="0000 0000 0000 0000" readOnly disabled />
    </div>
    <div className="mb-2">
      <label className="form-label small">Nome no Cartão</label>
      <input type="text" className="form-control" placeholder="Seu Nome Completo" readOnly disabled />
    </div>
    <div className="row">
      <div className="col-6">
        <label className="form-label small">Validade</label>
        <input type="text" className="form-control" placeholder="MM/AA" readOnly disabled />
      </div>
      <div className="col-6">
        <label className="form-label small">CVV</label>
        <input type="text" className="form-control" placeholder="123" readOnly disabled />
      </div>
    </div>
  </div>
);

const PixDisplaySimulado = () => (
  <div className="mt-3 p-3 bg-light rounded text-center">
    <h6 className="mb-3">Pague com PIX</h6>
    <img 
      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PedidoSimuladoDeliveryApp" 
      alt="QR Code PIX Simulado"
      className="img-fluid mb-2"
    />
    <p className="small text-muted">Aponte a câmera do seu celular para o QR Code ou use o código abaixo.</p>
    <div className="input-group">
      <input type="text" className="form-control form-control-sm" value="chave-pix-simulada-copia-e-cola-1234" readOnly disabled />
      <button className="btn btn-sm btn-secondary" disabled>Copiar</button>
    </div>
  </div>
);

const TrocoParaForm = () => (
    <div className="mt-3 p-3 bg-light rounded">
        <h6 className="mb-2">Pagamento em Dinheiro</h6>
        <label className="form-label small">Precisa de troco para quanto? (Opcional)</label>
        <input type="text" className="form-control" placeholder="Ex: 50,00" />
    </div>
);

export default function SimulacaoPagamento({ metodo }) {
  if (!metodo) {
    return null;
  }

  const metodoLowerCase = metodo.toLowerCase();

  if (metodoLowerCase.includes('cartão')) {
    return <CartaoFormSimulado />;
  }
  if (metodoLowerCase.includes('pix')) {
    return <PixDisplaySimulado />;
  }
  if (metodoLowerCase.includes('dinheiro')) {
    return <TrocoParaForm />;
  }

  return null;
}