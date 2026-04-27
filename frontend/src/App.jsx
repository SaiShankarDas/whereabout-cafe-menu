import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FiShoppingCart, FiSearch } from 'react-icons/fi';
import MenuCard from './components/MenuCard';
import CartDrawer from './components/CartDrawer';
import ShnkrDevBadge from './components/ShnkrDevBadge';

function App() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Fetch menu data from backend
    // For now we assume backend runs on localhost:5000 in dev
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await axios.get(`${apiUrl}/api/menu`);
        setMenu(response.data);
        if (response.data.length > 0) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(menu.map(item => item.category));
    return Array.from(cats);
  }, [menu]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      if (search.trim() !== '') {
        return matchesSearch;
      }
      const matchesCategory = item.category === activeCategory;
      return matchesCategory;
    });
  }, [menu, activeCategory, search]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem => 
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === itemId);
      if (existing.quantity > 1) {
        return prev.map(cartItem => 
          cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary tracking-tight">Whereabout Cafe</h1>
          <div className="relative group">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 relative bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiShoppingCart className="w-6 h-6 text-primary" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6 pb-24">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            placeholder="Search for your favorite dish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories (Horizontal Scroll) */}
        {!loading && categories.length > 0 && (
          <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-8 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm
                  ${activeCategory === category 
                    ? 'bg-primary text-white scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Menu Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-32 flex flex-col justify-between">
                 <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                 <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                 <div className="flex justify-between mt-4">
                   <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                   <div className="h-8 bg-gray-200 rounded w-20"></div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMenu.length > 0 ? (
              filteredMenu.map(item => {
                const cartItem = cart.find(c => c.id === item.id);
                const quantity = cartItem ? cartItem.quantity : 0;
                return (
                  <MenuCard 
                    key={item.id} 
                    item={item} 
                    quantity={quantity}
                    onAdd={() => addToCart(item)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                <p className="text-lg">No items found matching "{search}"</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button for Cart (Mobile) */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-30 px-4 sm:hidden pointer-events-none">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-accent text-white py-4 rounded-xl shadow-xl flex justify-between items-center px-6 font-semibold pointer-events-auto active:scale-95 transition-transform"
          >
            <span>{totalItems} item{totalItems > 1 ? 's' : ''} added</span>
            <span className="flex items-center gap-2">
              View Cart <FiShoppingCart />
            </span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        totalPrice={totalPrice}
      />

      {/* Footer */}
      <footer className="w-full bg-[#0F172A] mt-auto py-4 border-t border-gray-800 relative z-10">
        <div className="flex justify-center">
          <ShnkrDevBadge />
        </div>
      </footer>
    </div>
  );
}

export default App;
