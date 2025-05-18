
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  titleClassName?: string;
  isSelectable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  hoverEffect?: 'scale' | 'lift' | 'glow' | 'none';
}

const DashboardCard = ({ 
  title, 
  children, 
  className = "", 
  action, 
  titleClassName = "",
  isSelectable = false,
  isSelected = false,
  onClick,
  hoverEffect = 'scale'
}: DashboardCardProps) => {
  // Map for different hover effects
  const hoverEffects = {
    scale: 'hover:scale-[1.02]',
    lift: 'hover:-translate-y-1',
    glow: 'hover:shadow-lg hover:shadow-primary/10',
    none: ''
  };

  const hoverClass = hoverEffects[hoverEffect] || '';

  return (
    <Card 
      className={`overflow-hidden shadow-sm border-gray-100 transition-all duration-300 
        ${isSelected ? 'ring-2 ring-primary shadow-lg transform scale-[1.02]' : ''} 
        ${isSelectable ? `cursor-pointer hover:shadow-md hover:border-primary/30 ${hoverClass}` : 'hover:shadow-md'} 
        ${className}`}
      onClick={isSelectable ? onClick : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className={`text-lg font-medium ${titleClassName}`}>{title}</CardTitle>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="p-4 pt-2">{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
