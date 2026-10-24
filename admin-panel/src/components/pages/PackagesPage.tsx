import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, CheckCircle2, ShieldCheck, Sparkles, X, Clock, Camera, Film, Video, Image as ImageIcon } from 'lucide-react';
import { api, PackageItem } from '../../services/api';

export const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [currentPackage, setCurrentPackage] = useState<Partial<PackageItem>>({});
  const [featureInput, setFeatureInput] = useState('');

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await api.getPackages();
      setPackages(data);
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenCreate = () => {
    setCurrentPackage({
      name: '',
      tier: 'Gold',
      price: 65000,
      album: '1 Luxury Matte Album',
      drone: 'Drone Muhurtham Shoot',
      video: '4K Cinematic Film + Teaser',
      photoCount: '500+ Edited High-Res Photos',
      deliveryTime: '10 Working Days',
      description: '',
      features: ['Lead Candid Photographer', 'Traditional HD Videographer', '4K Drone Coverage', 'Custom Luxury Photobook'],
      isActive: true
    });
    setFeatureInput('');
    setModalMode('create');
  };

  const handleOpenEdit = (pkg: PackageItem) => {
    setCurrentPackage({ ...pkg });
    setFeatureInput('');
    setModalMode('edit');
  };

  const handleDelete = async (pkg: PackageItem) => {
    if (!window.confirm(`Are you sure you want to delete the "${pkg.name}" package?`)) return;
    try {
      await api.deletePackage(pkg.id);
      fetchPackages();
    } catch (err: any) {
      console.error('Error deleting package:', err);
    }
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    const currentFeatures = currentPackage.features || [];
    setCurrentPackage({
      ...currentPackage,
      features: [...currentFeatures, featureInput.trim()]
    });
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    const currentFeatures = currentPackage.features || [];
    setCurrentPackage({
      ...currentPackage,
      features: currentFeatures.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.createPackage(currentPackage as Omit<PackageItem, 'id'>);
      } else if (modalMode === 'edit' && currentPackage.id) {
        await api.updatePackage(currentPackage.id, currentPackage);
      }
      setModalMode(null);
      fetchPackages();
    } catch (err: any) {
      console.error('Failed to save package:', err);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121217] p-4 rounded-2xl border border-[#20202a]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-[#d4af37]" />
            Photography Packages Catalog
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">Manage Budget, Luxury, and Semi-Luxury wedding & studio photography tiers</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b39029] hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="p-12 text-center text-neutral-500">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading packages...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-[#121217] border border-[#20202a] hover:border-[#d4af37]/50 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#d4af37]/10 transition-colors" />

              <div>
                {/* Tier Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    pkg.tier === 'Premium' ? 'bg-amber-500/20 text-[#d4af37] border border-[#d4af37]/40' :
                    pkg.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
                    'bg-slate-400/20 text-slate-300 border border-slate-500/40'
                  }`}>
                    {pkg.tier} Tier
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-1.5 rounded-lg bg-[#1a1a24] hover:bg-[#d4af37] hover:text-black text-neutral-300 transition-colors"
                      title="Edit Package"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-extrabold text-white mb-2">{pkg.name}</h4>
                <p className="text-xs text-neutral-400 mb-4 leading-relaxed min-h-[40px]">{pkg.description}</p>

                {/* Price */}
                <div className="p-3.5 rounded-xl bg-[#181822] border border-neutral-800 mb-5 flex items-baseline justify-between">
                  <span className="text-xs text-neutral-400 uppercase font-semibold">Studio Price</span>
                  <span className="text-xl font-black text-white">₹{pkg.price.toLocaleString('en-IN')}</span>
                </div>

                {/* Key Deliverables Specs */}
                <div className="space-y-2.5 text-xs text-neutral-300 mb-5 border-t border-b border-[#1e1e2b] py-3.5">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span><strong className="text-white">Photos:</strong> {pkg.photoCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span><strong className="text-white">Video:</strong> {pkg.video}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span><strong className="text-white">Drone:</strong> {pkg.drone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span><strong className="text-white">Album:</strong> {pkg.album}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span><strong className="text-white">Delivery:</strong> {pkg.deliveryTime}</span>
                  </div>
                </div>

                {/* Inclusions List */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold block mb-1">Features Included:</span>
                  {(pkg.features || []).map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Package Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13131a] border border-[#282838] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#242433]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#997d26] p-0.5">
                <div className="w-full h-full bg-[#121217] rounded-[10px] flex items-center justify-center text-[#d4af37]">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {modalMode === 'create' ? 'Create Photography Package' : 'Update Photography Package'}
                </h3>
                <p className="text-xs text-neutral-400">Configure studio deliverables, pricing & features</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Package Name *</label>
                  <input
                    type="text"
                    required
                    value={currentPackage.name || ''}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, name: e.target.value })}
                    placeholder="e.g., Gold Royal Package"
                    className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Tier *</label>
                  <select
                    value={currentPackage.tier || 'Gold'}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, tier: e.target.value as any })}
                    className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                  >
                    <option value="Silver">Silver Tier</option>
                    <option value="Gold">Gold Tier</option>
                    <option value="Premium">Premium Signature Tier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={currentPackage.price ?? ''}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, price: Number(e.target.value) })}
                    placeholder="85000"
                    className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Estimated Delivery Time *</label>
                  <input
                    type="text"
                    required
                    value={currentPackage.deliveryTime || ''}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, deliveryTime: e.target.value })}
                    placeholder="10 Working Days"
                    className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Album Deliverable *</label>
                  <input
                    type="text"
                    required
                    value={currentPackage.album || ''}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, album: e.target.value })}
                    placeholder="2 Premium Canvera Albums"
                    className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Drone Coverage *</label>
                  <input
                    type="text"
                    required
                    value={currentPackage.drone || ''}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, drone: e.target.value })}
                    placeholder="Dual 4K Drone Coverage"
                    className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Video Deliverable *</label>
                  <input
                    type="text"
                    required
                    value={currentPackage.video || ''}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, video: e.target.value })}
                    placeholder="4K Cinematic Film + Teaser"
                    className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Photo Count *</label>
                  <input
                    type="text"
                    required
                    value={currentPackage.photoCount || ''}
                    onChange={(e) => setCurrentPackage({ ...currentPackage, photoCount: e.target.value })}
                    placeholder="600+ Edited Photos"
                    className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Package Description</label>
                <textarea
                  rows={2}
                  value={currentPackage.description || ''}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, description: e.target.value })}
                  placeholder="Summary of why this package is best suited for weddings..."
                  className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                />
              </div>

              {/* Dynamic Feature Bullets */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Package Inclusions / Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add custom feature (e.g. 48-Hour Instagram Reels Teaser)"
                    className="flex-1 bg-[#181824] border border-neutral-700 text-white text-xs rounded-xl px-3 py-2 outline-none"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-[#d4af37] hover:text-black text-xs font-bold text-white transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(currentPackage.features || []).map((feat, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#1a1a24] border border-neutral-700 text-[11px] text-neutral-200 flex items-center gap-1.5">
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(i)}
                        className="text-neutral-400 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#242433] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-extrabold text-xs transition-colors cursor-pointer"
                >
                  {modalMode === 'create' ? 'Create Package' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
