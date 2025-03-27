import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductList from '@/components/products/ProductList';

const Products: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Catalog</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your products and services</p>
        </div>
        
        {/* Product List Component */}
        <ProductList />
      </div>
    </Layout>
  );
};

export default Products;
