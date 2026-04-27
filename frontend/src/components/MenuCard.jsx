import React from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const MenuCard = ({ item, quantity, onAdd, onRemove }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 leading-tight pr-2">{item.name}</h3>
          {/* Optional Veg/Non-Veg indicator could go here */}
        </div>
        
        {item.items && (
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            {item.items}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <span className="font-bold text-lg text-primary">
          ₹{item.price}
        </span>
        
        {quantity === 0 ? (
          <button 
            onClick={onAdd}
            className="bg-accent/10 hover:bg-accent hover:text-white text-accent font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center bg-accent/10 rounded-lg">
            <button 
              onClick={onRemove}
              className="p-2 text-accent hover:text-white hover:bg-accent rounded-l-lg transition-colors"
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-accent min-w-[2rem] text-center text-sm">
              {quantity}
            </span>
            <button 
              onClick={onAdd}
              className="p-2 text-accent hover:text-white hover:bg-accent rounded-r-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
