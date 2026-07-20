import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import axios from 'axios';
import { 
  UtensilsCrossed, 
  Search, 
  ShoppingBag, 
  ChevronRight, 
  X, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  ArrowLeft,
  DollarSign
} from 'lucide-react';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

export default function PublicMenu() {
  const { orgId } = useParams();
  const [searchParams] = useSearchParams();
  const tableNum = searchParams.get('table');

  const [menuData, setMenuData] = useState([]);
  const [tableInfo, setTableInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Live Tracking state
  const [activeOrderId, setActiveOrderId] = useState(() => localStorage.getItem(`active_order_${orgId}_${tableNum}`) || '');
  const [activeOrder, setActiveOrder] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadPublicData();
  }, [orgId, tableNum]);

  // Track live order status changes by polling every 5 seconds when an order is active
  useEffect(() => {
    if (!activeOrderId) {
      setActiveOrder(null);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/orders/public/${activeOrderId}`);
        const order = res.data?.data?.order || res.data?.order;
        setActiveOrder(order);
        if (order && (order.status === 'completed' || order.status === 'cancelled')) {
          // If completed, clear local storage active order after a short delay
          localStorage.removeItem(`active_order_${orgId}_${tableNum}`);
        }
      } catch (err) {
        console.error('Failed to poll order status', err);
      }
    };

    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 5000);
    return () => clearInterval(interval);
  }, [activeOrderId]);

  const loadPublicData = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!tableNum) {
        throw new Error('Table number is missing in the URL (e.g. ?table=23)');
      }

      // 1. Fetch public table info by org ID and table number
      const tableRes = await api.get(`/tables/public/${orgId}/number/${tableNum}`);
      const fetchedTable = tableRes.data?.data?.table || tableRes.data?.table;
      setTableInfo(fetchedTable);

      // 2. Fetch public menu grouped by category
      const menuRes = await api.get(`/menu/${orgId}`);
      const categories = menuRes.data?.data?.menuItems || menuRes.data?.menuItems || [];
      setMenuData(categories);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load restaurant details.');
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = (item, diff) => {
    const currentQty = cart[item._id]?.qty || 0;
    const newQty = currentQty + diff;

    if (newQty <= 0) {
      const updated = { ...cart };
      delete updated[item._id];
      setCart(updated);
    } else {
      setCart({
        ...cart,
        [item._id]: { item, qty: newQty }
      });
    }
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((acc, c) => acc + (c.item.price * c.qty), 0);
  const cartItemCount = cartItems.reduce((acc, c) => acc + c.qty, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (cartItemCount === 0) return;

    try {
      setSubmittingOrder(true);
      const itemsPayload = cartItems.map(c => ({
        menuItemId: c.item._id,
        quantity: c.qty
      }));

      const res = await api.post(`/orders/public/${orgId}`, {
        tableId: tableInfo._id,
        items: itemsPayload
      });

      const placedOrder = res.data?.data?.order || res.data?.order;
      
      // Save to state & local storage
      setActiveOrderId(placedOrder._id);
      localStorage.setItem(`active_order_${orgId}_${tableNum}`, placedOrder._id);
      
      // Clear cart
      setCart({});
      setShowCheckout(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handlePayOrder = async (method) => {
    try {
      setPaying(true);
      await api.put(`/orders/public/${activeOrderId}/payment`, {
        paymentStatus: 'paid',
        paymentMethod: method
      });

      // Fetch latest order details to update local UI state
      const res = await api.get(`/orders/public/${activeOrderId}`);
      const updated = res.data?.data?.order || res.data?.order;
      setActiveOrder(updated);
      setShowPaymentModal(false);
      
      // Clear tracking state
      setActiveOrderId('');
      localStorage.removeItem(`active_order_${orgId}_${tableNum}`);
      alert('Payment successful! Thank you for dining with us.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to process payment.');
    } finally {
      setPaying(false);
    }
  };

  // Filtered menu categories based on search input
  const filteredMenuData = menuData.map(cat => {
    const items = cat.items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
    );
    return { ...cat, items };
  }).filter(cat => cat.items.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Connecting to Restaurant Table...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center border border-red-100 shadow-sm mb-5">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Failed to load Menu</h2>
        <p className="text-sm font-bold text-red-600 bg-red-50/50 border border-red-100 rounded-xl px-4 py-2 mb-6">{error}</p>
        <button onClick={loadPublicData} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 cursor-pointer">Try Again</button>
      </div>
    );
  }

  // RENDER LIVE TRACKING SCREEN
  if (activeOrderId && activeOrder) {
    const getStatusStep = () => {
      switch (activeOrder.status) {
        case 'pending': return 1;
        case 'preparing': return 2;
        case 'served': return 3;
        case 'completed': return 4;
        default: return 1;
      }
    };
    const step = getStatusStep();

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 px-6 py-10 text-white rounded-b-[40px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="max-w-md mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white/90">Live Order Tracking</span>
            <h1 className="text-3xl font-black mt-2">Table T-{tableNum}</h1>
            <p className="text-xs font-semibold text-indigo-200 mt-1">Order Ref: {activeOrder.orderNumber}</p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-6 -mt-6">
          {/* Status Tracker */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100/50 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm font-extrabold text-slate-500 uppercase tracking-wider">Status</span>
              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                {activeOrder.status}
              </span>
            </div>

            {/* Tracker Bar */}
            <div className="relative pt-2">
              <div className="flex justify-between relative z-10">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
                  <span className={`text-[10px] font-bold mt-1.5 uppercase ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>Placed</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${step >= 2 ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>2</div>
                  <span className={`text-[10px] font-bold mt-1.5 uppercase ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>Cooking</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
                  <span className={`text-[10px] font-bold mt-1.5 uppercase ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>Served</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${step >= 4 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>4</div>
                  <span className={`text-[10px] font-bold mt-1.5 uppercase ${step >= 4 ? 'text-indigo-600' : 'text-slate-400'}`}>Paid</span>
                </div>
              </div>
              {/* Tracker lines */}
              <div className="absolute top-6 left-4 right-4 h-0.5 bg-slate-100 -z-10">
                <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(step - 1) * 33.3}%` }}></div>
              </div>
            </div>

            {/* Preparation notice */}
            {activeOrder.status === 'preparing' && (
              <div className="p-4 bg-amber-50/50 border border-amber-100 text-amber-800 rounded-2xl flex gap-3 text-xs font-semibold leading-relaxed">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>Our kitchen team is preparing your delicious meal. Grab a glass of water, it will be served fresh shortly!</span>
              </div>
            )}

            {activeOrder.status === 'served' && (
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 text-emerald-800 rounded-2xl flex gap-3 text-xs font-semibold leading-relaxed">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Your food has been served! Enjoy your meal. You can request checkout payment below when ready.</span>
              </div>
            )}
          </div>

          {/* Items Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100/50 space-y-4 mt-6">
            <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">Dishes Ordered</h3>
            <div className="divide-y divide-slate-100">
              {activeOrder.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between py-3 text-sm">
                  <div className="flex gap-2">
                    <span className="font-extrabold text-indigo-600">{it.quantity}x</span>
                    <span className="font-semibold text-slate-800">{it.menuItem?.name || 'Menu Item'}</span>
                  </div>
                  <span className="font-bold text-slate-700">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t border-slate-100 font-extrabold text-slate-800 text-base">
              <span>Grand Total</span>
              <span className="text-lg text-indigo-600">₹{activeOrder.totalAmount}</span>
            </div>
          </div>

          {/* Request Checkout */}
          <div className="mt-8">
            <button 
              onClick={() => setShowPaymentModal(true)} 
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer text-sm tracking-wide uppercase"
            >
              Pay & Checkout (₹{activeOrder.totalAmount})
            </button>
          </div>
        </div>

        {/* PAYMENT MODAL */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/50 backdrop-blur-md transition-all duration-300">
            <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col relative overflow-hidden animate-pop-in">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Choose Payment Method</h2>
                <button onClick={() => setShowPaymentModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-150 text-slate-400 hover:text-slate-700 transition-all border border-transparent hover:border-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-500 font-semibold mb-2">Simulate checkout payment. Once completed, your table will be released.</p>
                
                <button 
                  onClick={() => handlePayOrder('upi')} 
                  disabled={paying}
                  className="w-full flex items-center gap-4 p-4 border border-slate-100 bg-slate-50/30 hover:bg-slate-50 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all group active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-slate-800">Pay via UPI (GPay/PhonePe)</span>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase mt-0.5">Instant online confirmation</span>
                  </div>
                </button>

                <button 
                  onClick={() => handlePayOrder('card')} 
                  disabled={paying}
                  className="w-full flex items-center gap-4 p-4 border border-slate-100 bg-slate-50/30 hover:bg-slate-50 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all group active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-slate-800">Credit / Debit Card</span>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase mt-0.5">Visa, Mastercard, RuPay</span>
                  </div>
                </button>

                <button 
                  onClick={() => handlePayOrder('cash')} 
                  disabled={paying}
                  className="w-full flex items-center gap-4 p-4 border border-slate-100 bg-slate-50/30 hover:bg-slate-50 rounded-2xl cursor-pointer hover:border-indigo-200 transition-all group active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-slate-800">Cash Payment at Counter</span>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase mt-0.5">Notify waitstaff directly</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER PUBLIC MENU DISHES SELECTION SCREEN
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-6 pt-12 pb-14 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed className="w-5 h-5 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Welcome Dining Guest</span>
          </div>
          <h1 className="text-3xl font-black">Digital Menu</h1>
          <p className="text-sm font-semibold text-slate-400 mt-0.5">Table: T-{tableNum} • Scan & Order</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-6 space-y-6">
        {/* Search bar */}
        <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input 
            type="text" 
            placeholder="Search yummy dishes..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="flex-1 bg-transparent text-sm focus:outline-none font-semibold placeholder-slate-400 py-1.5"
          />
          {search && (
            <button onClick={() => setSearch('')} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 scroll-hide">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              activeCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-indigo-600/10'
                : 'bg-white border border-slate-150 text-slate-500 hover:bg-slate-50'
            }`}
          >
            All Items
          </button>
          {menuData.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === cat.name
                  ? 'bg-indigo-600 text-white shadow-indigo-600/10'
                  : 'bg-white border border-slate-150 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu items grouped by Category */}
        <div className="space-y-8">
          {filteredMenuData.map(cat => {
            // Apply category filter tabs
            if (activeCategory !== 'All' && activeCategory !== cat.name) return null;

            return (
              <div key={cat._id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">{cat.name}</h2>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{cat.items.length} dishes</span>
                </div>

                <div className="space-y-4">
                  {cat.items.map(item => {
                    const qty = cart[item._id]?.qty || 0;
                    return (
                      <div key={item._id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100/50 flex justify-between gap-4 hover:border-slate-200 transition-colors">
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className={`w-2.5 h-2.5 rounded-full inline-block ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900 leading-tight mb-1">{item.name}</h3>
                            {item.description && (
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2 font-medium">{item.description}</p>
                            )}
                          </div>
                          <span className="text-base font-black text-indigo-600">₹{item.price}</span>
                        </div>

                        <div className="flex flex-col items-center justify-center shrink-0">
                          {/* Item Card Add/Qty control */}
                          {qty > 0 ? (
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-inner">
                              <button 
                                onClick={() => handleQtyChange(item, -1)} 
                                className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg active:scale-90 transition-all cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-bold text-slate-800 text-sm">{qty}</span>
                              <button 
                                onClick={() => handleQtyChange(item, 1)} 
                                className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg active:scale-90 transition-all cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleQtyChange(item, 1)}
                              className="px-5 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-600 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                            >
                              ADD +
                            </button>
                          )}
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-1.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {item.preparationTime || 15}m prep
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {filteredMenuData.length === 0 && (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
              <p className="text-sm font-semibold text-slate-400">No yummy dishes found matching your query.</p>
            </div>
          )}
        </div>
      </div>

      {/* PERSISTENT FLOATING CART BAR */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-40">
          <div className="max-w-md mx-auto">
            <button 
              onClick={() => setShowCheckout(true)} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm text-white">{cartItemCount}</div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-indigo-150 uppercase tracking-wider">Cart total</span>
                  <span className="block text-base font-black text-white">₹{cartTotal}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 font-bold text-sm tracking-wide uppercase">
                View Order
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL SHEET */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-md p-0 sm:p-6 transition-all duration-300">
          <div className="bg-white rounded-t-[40px] sm:rounded-3xl shadow-2xl w-full max-w-md flex flex-col relative max-h-[85vh] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Your Dining Order</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Table T-{tableNum}</p>
              </div>
              <button onClick={() => setShowCheckout(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-150 text-slate-400 hover:text-slate-700 transition-all border border-transparent hover:border-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto divide-y divide-slate-100 flex-1">
              <div className="pb-4 space-y-3">
                {cartItems.map(c => (
                  <div key={c.item._id} className="flex justify-between items-center text-sm">
                    <div className="flex gap-2">
                      <span className="font-extrabold text-indigo-600">{c.qty}x</span>
                      <span className="font-semibold text-slate-800">{c.item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-700">₹{c.item.price * c.qty}</span>
                      <button onClick={() => handleQtyChange(c.item, -c.qty)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="py-4 space-y-4">
                <div className="flex justify-between font-extrabold text-base text-slate-800">
                  <span>Grand Total</span>
                  <span className="text-lg text-indigo-600">₹{cartTotal}</span>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Your Name (For Order Tracking)</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Enter your name..." 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-250 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submittingOrder}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-sm shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider mt-2"
                >
                  {submittingOrder ? 'Submitting Order...' : 'Confirm & Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
