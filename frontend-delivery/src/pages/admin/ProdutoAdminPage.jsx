import React from 'react';
import HeaderEmpresa from '../../components/HeaderEmpresa';
import ProdutoForm from '../../components/ProdutoForm';

export default function ProdutoAdminPage() {
  return (
    <>
      <HeaderEmpresa />
      <div className="container py-5">
        <ProdutoForm />
      </div>
    </>
  );
}