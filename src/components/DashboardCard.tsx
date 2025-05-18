
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  titleClassName?: string;
}

const DashboardCard = ({ title, children, className = "", action, titleClassName = "" }: DashboardCardProps) => {
  return (
    <Card className={`overflow-hidden shadow-sm border-gray-100 transition-all duration-300 hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className={`text-lg font-medium ${titleClassName}`}>{title}</CardTitle>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="p-4 pt-2">{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
