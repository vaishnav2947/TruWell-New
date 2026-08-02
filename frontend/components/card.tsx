import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`bg-white shadow-sm border border-gray-200 rounded-lg p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
