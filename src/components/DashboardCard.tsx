
import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '', action }) => {
  return (
    <div className={`card-shadow p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DashboardCard;
