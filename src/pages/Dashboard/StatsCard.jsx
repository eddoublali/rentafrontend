import React from 'react';

const StatsCard = ({ title, value, subValue, icon: Icon, iconBgColor, iconColor }) => {
  return (
    <div className="card bg-white shadow-md">
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="card-title text-lg font-medium text-gray-700">{title}</h2>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subValue && <p className="text-sm text-gray-500">{subValue}</p>}
          </div>
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <Icon size={24} className={iconColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;