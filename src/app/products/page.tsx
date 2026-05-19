import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { Filter, ChevronDown } from "lucide-react";

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts();
  
  // Get unique manufacturers for filter
  const manufacturers = Array.from(new Set(products.map(p => p.manufacturer)));

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="glass-card p-6 rounded-2xl sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
              <Filter className="w-5 h-5 text-primary" />
              Filters
            </div>
            
            <div className="space-y-6">
              {/* Brand Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center justify-between">
                  Brands
                  <ChevronDown className="w-4 h-4" />
                </h3>
                <div className="space-y-2">
                  {manufacturers.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 rounded border border-white/20 group-hover:border-primary flex items-center justify-center transition-colors">
                        <div className="w-2 h-2 rounded-[2px] bg-primary scale-0 transition-transform" />
                      </div>
                      <span className="text-gray-400 group-hover:text-white transition-colors text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="h-px bg-white/10" />
              
              {/* Price Filter Mock */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center justify-between">
                  Price Range
                  <ChevronDown className="w-4 h-4" />
                </h3>
                <PriceRangeFilter />
              </div>
              
            </div>
          </div>
        </aside>
        
        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">All Products</h1>
            <div className="text-sm text-gray-400 glass px-4 py-2 rounded-lg border border-white/10">
              Showing {products.length} results
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                manufacturer={product.manufacturer}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
