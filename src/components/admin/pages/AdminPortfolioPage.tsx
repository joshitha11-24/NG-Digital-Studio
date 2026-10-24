import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Star, 
  MapPin, 
  X, 
  Image as ImageIcon 
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminPortfolioItem } from '../../../types/admin';

export const AdminPortfolioPage: React.FC = () => {
  const { portfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Weddings');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('Chennai');
  const [isFeatured, setIsFeatured] = useState(true);

  // Edit Modal
  const [editingItem, setEditingItem] = useState<AdminPortfolioItem | null>(null);

  const categories = ['All', 'Weddings', 'Candid', 'Fashion', 'Pre-Wedding', 'Maternity', 'Events'];

  const filteredPortfolio = portfolio.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.clientName && item.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    addPortfolioItem({
      title,
      category,
      imageUrl,
      clientName: clientName || undefined,
      location: location || undefined,
      isFeatured
    });

    setShowAddModal(false);
    setTitle('');
    setClientName('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updatePortfolioItem(editingItem.id, editingItem);
    setEditingItem(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from portfolio showcase?`)) {
      deletePortfolioItem(id);
    }
  };

  return (
    <div className="space-y-6 font-sans-clean">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold text-[#aa820a] uppercase tracking-widest">
            CREATIVE SHOWCASE
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-cinzel">
            Portfolio Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Curate the master portfolio highlights, client tags, and featured photoshoot entries on the website.
          </p>
        </div>

        <button
          id="btn-add-portfolio-open"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Portfolio Work</span>
        </button>
      </div>

      {/* Filter & Category Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, client, location..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-neutral-900 text-[#f3e5ab] shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PORTFOLIO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolio.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#d4af37]/60 hover:shadow-md transition-all group"
          >
            <div>
              {/* Image Preview */}
              <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[#f3e5ab] text-[10px] font-bold uppercase tracking-wider border border-[#d4af37]/40">
                  {item.category}
                </div>
                {item.isFeatured && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-black" />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold text-neutral-900 font-cinzel">
                  {item.title}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                  {item.clientName && (
                    <span className="font-medium text-neutral-800">
                      Client: {item.clientName}
                    </span>
                  )}
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#aa820a]" />
                      <span>{item.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                Added {item.uploadDate}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingItem(item)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1.5 rounded-lg bg-neutral-200 hover:bg-red-100 text-neutral-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ADD PORTFOLIO MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                Add Portfolio Photograph
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Twilight Vows"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Weddings">Weddings</option>
                    <option value="Candid">Candid</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Location / Venue</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Chennai"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Client / Couple Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Anand & Divya"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-portfolio-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#d4af37] accent-[#d4af37]"
                />
                <label htmlFor="chk-portfolio-featured" className="text-neutral-700 font-semibold cursor-pointer">
                  Feature in website homepage spotlight
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PORTFOLIO MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                Edit Portfolio Photo
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingItem.imageUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-portfolio-featured-edit"
                  checked={editingItem.isFeatured}
                  onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[#d4af37] accent-[#d4af37]"
                />
                <label htmlFor="chk-portfolio-featured-edit" className="text-neutral-700 font-semibold cursor-pointer">
                  Featured
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
                >
                  Update Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
