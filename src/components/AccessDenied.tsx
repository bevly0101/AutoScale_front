import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Acesso Negado</h1>
        <p className="mt-4 text-lg text-gray-700">
          Você não tem permissão para acessar este workspace.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;