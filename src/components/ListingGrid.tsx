import React from "react";
import ProductCard from "./ProductCard";

interface ListingGridProps {
  products: any[];
  userId?: string;
}

const ListingGrid = ({ products, userId }: ListingGridProps) => {
  return (
    <div className="px-8 max-w-7xl mx-auto">
      {products.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <p>No products found. Try a different search or category!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              condition={product.condition}
              category={product.category?.name || product.category}
              seller={product.seller?.name || product.seller}
              createdAt={product.createdAt}
              isSavedInitial={userId ? product.savedBy?.length > 0 : false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingGrid;
