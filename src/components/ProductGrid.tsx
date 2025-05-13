
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { products } from '@/data/products';

interface ProductGridProps {
  activeCategory: string | null;
  activeFilters: Record<string, any>;
}

const ProductGrid = ({ activeCategory, activeFilters }: ProductGridProps) => {
  const { toast } = useToast();

  // Filter products based on selected category and filters
  const filteredProducts = products.filter(product => {
    // Filter by category if one is selected
    if (activeCategory && product.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }

    // Filter by other active filters
    if (activeFilters.organic && !product.organic) {
      return false;
    }

    if (activeFilters.onSale && !product.discount) {
      return false;
    }

    // Price range filter
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }

    return true;
  });

  const handleAddToCart = (product: any) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-500">No products match your filters</h3>
          <p className="mt-2 text-gray-400">Try adjusting your filters or browse all products</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filteredProducts.length} products</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="product-card card-hover">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-[200px] object-cover"
                  />
                  {product.badge && (
                    <Badge className={`absolute top-2 right-2 ${
                      product.badge === "Sale" 
                        ? "bg-farm-accent-red" 
                        : "bg-farm-accent-blue"
                    }`}>
                      {product.badge}
                    </Badge>
                  )}
                  {product.organic && (
                    <Badge className="absolute top-2 left-2 bg-farm-green">
                      Organic
                    </Badge>
                  )}
                </div>
                <CardContent className="pt-4 pb-2">
                  <p className="text-sm text-farm-green">{product.category}</p>
                  <h3 className="font-semibold text-lg mb-1 text-farm-green-dark">{product.name}</h3>
                  <div className="flex items-center">
                    <span className="text-xl font-bold">${product.price}</span>
                    <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
                    {product.discount && (
                      <span className="ml-2 text-sm line-through text-gray-400">
                        ${product.oldPrice}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full bg-farm-green hover:bg-farm-green-dark"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGrid;
