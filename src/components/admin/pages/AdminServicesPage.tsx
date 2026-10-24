import React, { useState } from 'react';
import { 
  Camera, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  X, 
  Eye, 
  Search, 
  DollarSign, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminService } from '../../../types/admin';

export const AdminServicesPage: React.FC = () => {
  const { services, addService, updateService, deleteService } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Weddings');
  const [startingPrice, setStartingPrice] = useState('₹45,000');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80');
  const [featuresStr, setFeaturesStr] = useState('Full Event Coverage\nDrone Cinematography\nPre-Wedding Teaser\nHigh-Res Album');
  const [isActive, setIsActive] = useState(true);

  // Edit Modal
  const [editingService, setEditingService] = useState<AdminService | null>(null);

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startingPrice) return;

    const features = featuresStr.split('\n').map(f => f.trim()).filter(Boolean);

    addService({
      title,
      category,
      startingPrice: startingPrice.startsWith('₹') ? startingPrice : `₹${startingPrice}`,
      description,
      imageUrl,
      features,
      isActive
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    updateService(editingService.id, editingService);
    setEditingService(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete service "${name}"?`)) {
      deleteService(id);
    }
  };

  return (
    <div className="space-y-6 font-sans-clean">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold text-[#aa820a] uppercase tracking-widest">
            OFFERINGS & COVERAGE
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-cinzel">
            Services Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure studio photography categories, descriptions, inclusions, and starting price points.
          </p>
        </div>

        <button
          id="btn-add-service-open"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Service</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="text-xs text-neutral-500 font-semibold">
          {filteredServices.length} Services Listed
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#d4af37]/60 hover:shadow-md transition-all group"
          >
            <div>
              {/* Service Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[#f3e5ab] text-[10px] font-bold uppercase tracking-wider border border-[#d4af37]/40">
                  {service.category}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm ${
                    service.isActive 
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50' 
                      : 'bg-neutral-900/80 text-neutral-400 border border-neutral-700'
                  }`}>
                    {service.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-neutral-900 font-cinzel">
                    {service.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#aa820a] shrink-0 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    From {service.startingPrice}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-2">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-1 pt-2 border-t border-neutral-100 text-xs">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Inclusions:</span>
                  <div className="space-y-1">
                    {service.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-neutral-700 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-[#aa820a] shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <span className="text-[10px] text-neutral-400 italic">
                        +{service.features.length - 3} more items included
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-medium">
                {service.totalBookings} lifetime shoots
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingService(service)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(service.id, service.title)}
                  className="p-1.5 rounded-lg bg-neutral-200 hover:bg-red-100 text-neutral-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ADD SERVICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                Add Photography Service
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Destination Wedding Photography"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Weddings, Portraits..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Starting Price *</label>
                  <input
                    type="text"
                    required
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    placeholder="₹45,000"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the aesthetic and coverage scope..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Key Features / Inclusions (One per line)</label>
                <textarea
                  rows={3}
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 font-mono text-[11px] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-service-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#d4af37] accent-[#d4af37]"
                />
                <label htmlFor="chk-service-active" className="text-neutral-700 font-semibold cursor-pointer">
                  Publish Service to Customer Website
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                Edit Service ({editingService.title})
              </h3>
              <button onClick={() => setEditingService(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Starting Price</label>
                  <input
                    type="text"
                    value={editingService.startingPrice}
                    onChange={(e) => setEditingService({ ...editingService, startingPrice: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={editingService.imageUrl}
                  onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-service-active-edit"
                  checked={editingService.isActive}
                  onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#d4af37] accent-[#d4af37]"
                />
                <label htmlFor="chk-service-active-edit" className="text-neutral-700 font-semibold cursor-pointer">
                  Active Status
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
