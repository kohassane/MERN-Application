import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Format price to CFA format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card hoverable className="h-full flex flex-col">
      <div className="relative">
        <Card.Image src={product.imageUrl} alt={product.name} />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md">
            Populaire
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      <Card.Content className="flex-grow">
        <div className="mb-2">
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>
        <Card.Title>{product.name}</Card.Title>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="text-xl font-bold text-orange-600 mb-2">
          {formatPrice(product.price)}
        </div>
      </Card.Content>

      <Card.Footer className="flex space-x-2">
        <Button 
          variant="primary" 
          className="flex-grow"
          disabled={!product.inStock}
        >
          <ShoppingCart size={16} className="mr-2" />
          Ajouter au panier
        </Button>
        <Link to={`/shop/${product.id}`} className="block">
          <Button variant="outline">
            Détails
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;