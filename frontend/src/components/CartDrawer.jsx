import React, { useState } from 'react';
import { FiX, FiPlus, FiMinus, FiMessageCircle } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

const CartDrawer = ({ isOpen, onClose, cart, addToCart, removeFromCart, totalPrice }) => {
  const [customerName, setCustomerName] = useState('');
  const WHATSAPP_NUMBER = '918619011024';

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) {
      alert("Please enter your name before ordering.");
      return;
    }

    let message = `Hi, I am ${customerName.trim()}.\nI want to order:\n\n`;
    
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}\n`;
      if (item.items) {
        message += `   (${item.items})\n`;
      }
    });

    message += `\nTotal: ₹${totalPrice}\n\n`;
    message += 'Please confirm my order!';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-primary">Your Order</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FiMessageCircle className="w-8 h-8 text-gray-300" />
              </div>
              <p>Your cart is empty</p>
              <button 
                onClick={onClose}
                className="mt-4 text-accent font-medium hover:underline"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-start bg-gray-50 p-3 rounded-xl">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500 font-medium">₹{item.price}</p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-gray-500 hover:text-accent transition-colors"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="px-2 font-semibold text-sm min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="p-1.5 text-gray-500 hover:text-accent transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="mt-2 font-bold text-primary">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex justify-between items-center mb-4 border-t border-gray-100 pt-3">
              <span className="text-gray-600 font-medium">Item Total</span>
              <span className="font-bold text-xl text-primary">₹{totalPrice}</span>
            </div>
            
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-lg shadow-green-500/20 active:scale-95"
            >
              <BsWhatsapp className="w-5 h-5" />
              Order on WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
