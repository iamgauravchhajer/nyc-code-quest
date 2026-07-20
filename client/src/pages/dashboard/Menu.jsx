import { useState, useEffect } from 'react';
import { Plus, Search, HelpCircle, UtensilsCrossed, AlertTriangle, RefreshCw, FolderPlus, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/dashboard/PageHeader';
import { DataTable } from '../../components/dashboard/DataTable';
import { Modal } from '../../components/dashboard/Modal';
import { Badge } from '../../components/dashboard/Badge';
import { 
  getMenuItems, 
  getMenuCategories, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  createMenuCategory,
  deleteMenuCategory
} from '../../api/menu';
import { SearchableSelect } from '../../components/dashboard/SearchableSelect';

export const Menu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsRes, catsRes] = await Promise.all([
        getMenuItems(),
        getMenuCategories()
      ]);
      
      setItems(itemsRes.data?.menuItems || itemsRes.menuItems || []);
      setCategories(catsRes.data?.menuCategories || catsRes.menuCategories || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch menu items or categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailable = async (row) => {
    try {
      const updatedStatus = !row.isAvailable;
      const res = await updateMenuItem(row._id, {
        name: row.name,
        description: row.description,
        price: row.price,
        categoryId: row.category?._id || row.category,
        isAvailable: updatedStatus,
        isVeg: row.isVeg,
        preparationTime: row.preparationTime
      });
      const updated = res.data?.menuItem || res.menuItem;
      setItems(items.map(item => item._id === row._id ? { ...item, ...updated } : item));
    } catch (err) {
      console.error(err);
      alert('Failed to update item availability.');
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.name}"?`)) return;
    try {
      await deleteMenuItem(row._id);
      setItems(items.filter(item => item._id !== row._id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete item.');
    }
  };

  const handleDeleteCat = async (catId, catName) => {
    if (!window.confirm(`Delete category "${catName}"? This will not delete the items, but they will have no category.`)) return;
    try {
      await deleteMenuCategory(catId);
      setCategories(categories.filter(c => c._id !== catId));
      if (selectedCategoryId === catId) {
        setSelectedCategoryId('All');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete category.');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    
    // item.category could be populated object or ID string
    const itemCatId = item.category?._id || item.category;
    const matchesCategory = selectedCategoryId === 'All' || itemCatId === selectedCategoryId;
    
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      key: 'name', label: 'Item Details',
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span 
              className={`w-2.5 h-2.5 rounded-full ring-2 shrink-0 ${
                row.isVeg ? 'bg-green-500 ring-green-100' : 'bg-red-500 ring-red-100'
              }`} 
              title={row.isVeg ? 'Veg' : 'Non-Veg'}
            />
            <span className="font-bold text-gray-900 text-sm sm:text-base">{row.name}</span>
          </div>
          {row.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2 max-w-md">{row.description}</p>}
        </div>
      )
    },
    { 
      key: 'category', label: 'Category', 
      render: (row) => (
        <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl">
          {row.category?.name || 'Unassigned'}
        </span>
      )
    },
    { 
      key: 'price', label: 'Price', 
      render: (row) => <span className="font-extrabold text-gray-900">₹{row.price}</span> 
    },
    { 
      key: 'preparationTime', label: 'Prep Time', 
      render: (row) => <span className="text-xs font-bold text-gray-500">{row.preparationTime || 15} mins</span> 
    },
    {
      key: 'isAvailable', label: 'Available',
      render: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.isAvailable}
            onChange={() => handleToggleAvailable(row)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Menu Management" />
        <div className="flex gap-2">
          <button 
            onClick={() => setCategoryModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            Add Category
          </button>
          <button 
            onClick={() => { setEditingItem(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Main Categories Bar & Search */}
      <div className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Categories Tab list */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scroll-hide flex-1">
            <button
              onClick={() => setSelectedCategoryId('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategoryId === 'All' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-50 border border-slate-200 text-gray-500 hover:bg-slate-100 hover:text-gray-800'
              }`}
            >
              All Items ({items.length})
            </button>
            {categories.map(cat => {
              const count = items.filter(item => (item.category?._id || item.category) === cat._id).length;
              return (
                <div key={cat._id} className="flex items-center shrink-0 gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
                  <button
                    onClick={() => setSelectedCategoryId(cat._id)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCategoryId === cat._id 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                  <button 
                    onClick={() => handleDeleteCat(cat._id, cat.name)}
                    className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all font-semibold"
            />
          </div>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredItems} 
        loading={loading}
        onEdit={(item) => { setEditingItem(item); setModalOpen(true); }}
        onDelete={handleDelete}
      />

      {/* Menu Item Form Modal */}
      <MenuModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        item={editingItem}
        categories={categories}
        onCreateCategory={() => setCategoryModalOpen(true)}
        onSave={async (newItem) => {
          try {
            if (editingItem) {
              const res = await updateMenuItem(editingItem._id, newItem);
              const updated = res.data?.menuItem || res.menuItem;
              // Re-populate category object locally
              const catObj = categories.find(c => c._id === newItem.categoryId);
              updated.category = catObj ? { _id: catObj._id, name: catObj.name } : newItem.categoryId;
              setItems(items.map(i => i._id === editingItem._id ? updated : i));
            } else {
              const res = await createMenuItem(newItem);
              const created = res.data?.menuItem || res.menuItem;
              const catObj = categories.find(c => c._id === newItem.categoryId);
              created.category = catObj ? { _id: catObj._id, name: catObj.name } : newItem.categoryId;
              setItems([created, ...items]);
            }
            setModalOpen(false);
          } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to save menu item.');
          }
        }}
      />

      {/* Category Creation Modal */}
      <Modal isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} title="Add Menu Category" size="sm">
        <AddCategoryForm 
          onSave={async (catData) => {
            try {
              const res = await createMenuCategory(catData);
              const newCat = res.data?.menuCategory || res.menuCategory;
              setCategories([...categories, newCat]);
              setCategoryModalOpen(false);
            } catch (err) {
              console.error(err);
              alert(err.response?.data?.message || 'Failed to create category.');
            }
          }}
          onClose={() => setCategoryModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

const AddCategoryForm = ({ onSave, onClose }) => {
  const [form, setForm] = useState({ name: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">Category Name</label>
        <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-250 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-semibold" placeholder="e.g. Desserts" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">Description (Optional)</label>
        <textarea rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-250 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-semibold" placeholder="Short description..." />
      </div>
      <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">Cancel</button>
        <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer">Save Category</button>
      </div>
    </form>
  );
};const MenuModal = ({ isOpen, onClose, item, categories, onSave, onCreateCategory }) => {
  const [form, setForm] = useState({ name: '', categoryId: '', price: '', description: '', preparationTime: 15, isVeg: true, isAvailable: true });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        categoryId: item.category?._id || item.category || '',
        price: item.price,
        description: item.description || '',
        preparationTime: item.preparationTime || 15,
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true
      });
    } else {
      setForm({ 
        name: '', 
        categoryId: categories[0]?._id || '', 
        price: '', 
        description: '', 
        preparationTime: 15, 
        isVeg: true, 
        isAvailable: true 
      });
    }
  }, [item, isOpen, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.categoryId) {
      alert('Please create and select a category first.');
      return;
    }
    onSave({ 
      ...form, 
      price: Number(form.price),
      preparationTime: Number(form.preparationTime)
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Menu Item' : 'Add New Item'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Item Name</label>
          <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-250 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-semibold" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
            <SearchableSelect
              options={categories.map(c => ({ value: c._id, label: c.name }))}
              value={form.categoryId}
              onChange={val => setForm({...form, categoryId: val})}
              placeholder="Select category..."
              onCreateNew={onCreateCategory}
              createNewText="Add Category"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Price (₹)</label>
            <input required type="number" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-bold" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">Description (Optional)</label>
          <textarea rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-semibold" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Prep Time (minutes)</label>
            <input required type="number" min="1" value={form.preparationTime} onChange={e => setForm({...form, preparationTime: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-indigo-500 font-semibold" />
          </div>
          <div className="flex items-center gap-4 mt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isVeg} onChange={e => setForm({...form, isVeg: e.target.checked})} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Veg</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.checked})} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Available</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">Cancel</button>
          <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer">Save Item</button>
        </div>
      </form>
    </Modal>
  );
};
