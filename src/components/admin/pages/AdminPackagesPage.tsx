import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  X, 
  DollarSign, 
  Sparkles, 
  Star,
  Clock
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminPackage } from '../../../types/admin';

export const AdminPackagesPage: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage, services } = useAdmin();
  
  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('₹45,000');
  const [duration, setDuration] = useState('Full Day (8-10 Hours)');
  const [serviceCategory, setServiceCategory] = useState('Wedding Photography');
  const [isPopular, setIsPopular] = useState(false);
  const [featuresStr, setFeaturesStr] = useState('2 Master Cinematographers\n1 Candid Still Photographer\n4K Cinematic Teaser Video\nLuxury Leatherbound Album (40 Pages)');

  // Edit Modal
  const [editingPkg, setEditingPkg] = useState<AdminPackage | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const rawAmount = parseInt(price.replace(/[^0-9]/g, '')) || 45000;
    const features = featuresStr.split('\n').map(f => f.trim()).filter(Boolean);

    addPackage({
      name,
      price: price.startsWith('₹') ? price : `₹${price}`,
      rawPrice: rawAmount,
      duration,
      serviceCategory,
      features,
      isPopular
    });

    setShowAddModal(false);
    setName('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;

    const rawAmount = parseInt(editingPkg.price.replace(/[^0-9]/g, '')) || editingPkg.rawPrice;
    updatePackage(editingPkg.id, {
      ...editingPkg,
      rawPrice: rawAmount
    });
    setEditingPkg(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete package "${name}"?`)) {
      deletePackage(id);
    }
  };

  return (
    <div className="space-y-6 font-sans-clean">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold text-[#aa820a] uppercase tracking-widest">
            TIERED PRICING PLANS
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-cinzel">
            Packages Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure studio packages, inclusions, deliverables, crew allocations and pricing tiers.
          </p>
        </div>

        <button
          id="btn-add-package-open"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Package</span>
        </button>
      </div>

      {/* PACKAGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-3xl border shadow-sm p-6 flex flex-col justify-between transition-all relative ${
              pkg.isPopular 
                ? 'border-[#d4af37] shadow-[0_4px_25px_rgba(212,175,55,0.12)]' 
                : 'border-neutral-200/90 hover:border-neutral-300'
            }`}
          >
            {pkg.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#d4af37] text-black text-[10px] uppercase font-bold tracking-widest shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Most Popular</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#aa820a] block">
                  {pkg.serviceCategory}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 font-cinzel mt-1">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-neutral-900 font-cinzel">{pkg.price}</span>
                  <span className="text-xs text-neutral-500 font-medium">/ session</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60">
                <Clock className="w-3.5 h-3.5 text-[#aa820a]" />
                <span className="font-semibold">{pkg.duration}</span>
              </div>

              {/* Inclusions */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Deliverables & Crew:</span>
                <div className="space-y-2 text-xs text-neutral-700">
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#aa820a] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-medium">
                {pkg.features.length} Features included
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingPkg(pkg)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(pkg.id, pkg.name)}
                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ADD PACKAGE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                Add Photography Package
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Imperial Heritage Wedding"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Package Price *</label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="₹45,000"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Duration / Time</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Full Day / 6 Hours"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Target Service Category</label>
                <input
                  type="text"
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  placeholder="Weddings, Portraits..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Deliverables & Features (One per line)</label>
                <textarea
                  rows={4}
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 font-mono text-[11px] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-package-popular"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 text-[#d4af37] accent-[#d4af37]"
                />
                <label htmlFor="chk-package-popular" className="text-neutral-700 font-semibold cursor-pointer">
                  Mark as "Most Popular" Ribbon
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
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PACKAGE MODAL */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                Edit Package ({editingPkg.name})
              </h3>
              <button onClick={() => setEditingPkg(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Price</label>
                  <input
                    type="text"
                    value={editingPkg.price}
                    onChange={(e) => setEditingPkg({ ...editingPkg, price: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingPkg.duration}
                    onChange={(e) => setEditingPkg({ ...editingPkg, duration: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Service Category</label>
                <input
                  type="text"
                  value={editingPkg.serviceCategory}
                  onChange={(e) => setEditingPkg({ ...editingPkg, serviceCategory: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-package-popular-edit"
                  checked={editingPkg.isPopular}
                  onChange={(e) => setEditingPkg({ ...editingPkg, isPopular: e.target.checked })}
                  className="w-4 h-4 text-[#d4af37] accent-[#d4af37]"
                />
                <label htmlFor="chk-package-popular-edit" className="text-neutral-700 font-semibold cursor-pointer">
                  Featured / Most Popular
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
                >
                  Update Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
