import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  hoverable = false
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 overflow-hidden';
  const hoverClasses = hoverable ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CardImage: React.FC<CardImageProps> = ({ src, alt, className = '' }) => (
  <div className="relative h-48 overflow-hidden">
    <img 
      src={src} 
      alt={alt} 
      className={`w-full h-full object-cover ${className}`} 
    />
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 className={`font-bold text-xl mb-2 ${className}`}>{children}</h3>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`px-5 py-3 bg-gray-50 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

Card.Image = CardImage;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Footer = CardFooter;

export default Card;