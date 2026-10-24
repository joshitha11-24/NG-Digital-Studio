import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, MapPin, X, Upload, Check } from 'lucide-react';
import { api, GalleryItem } from '../../services/api';

const CATEGORIES: GalleryItem['category'][] = [
  'Wedding',
  'Birthday',
  'Pre-Wedding',
  'Post-Wedding',
  'Outdoor Shoot',
  'Baby Shower',
  'Engagement',
  'Housewarming',
  'Product Shoot'
];

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Image Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryItem['category']>('Wedding');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLocation, setNewLocation] = useState('Madurai');
  const [newDescription, setNewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async (cat?: string) => {
    try {
      setLoading(true);
      const data = await api.getGallery(cat);
      setItems(data);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(activeCategory);
  }, [activeCategory]);

  const handleDelete = async (item: GalleryItem) => {
    if (!window.confirm(`Delete "${item.title}" from the studio gallery?`)) return;
    try {
      await api.deleteGalleryItem(item.id);
      fetchGallery(activeCategory);
    } catch (err: any) {
      console.error('Error deleting image:', err);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    try {
      setSubmitting(true);
      await api.addGalleryItem({
        title: newTitle.trim(),
        category: newCategory,
        imageUrl: newImageUrl.trim(),
        location: newLocation.trim(),
        description: newDescription.trim()
      });
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewImageUrl('');
      setNewDescription('');
      fetchGallery(activeCategory);
    } catch (err: any) {
      console.error('Failed to add photo:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121217] p-4 rounded-2xl border border-[#20202a]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#d4af37]" />
            Studio Gallery & Portfolio Media
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">Manage photos across all 9 photography categories</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b39029] hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photo</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('All')}
          className={`
            px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
            ${activeCategory === 'All'
              ? 'bg-[#d4af37] text-black font-extrabold shadow-sm'
              : 'bg-[#14141c] border border-neutral-800 text-neutral-400 hover:text-white'}
          `}
        >
          All Photos ({items.length})
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
              ${activeCategory === cat
                ? 'bg-[#d4af37] text-black font-extrabold shadow-sm'
                : 'bg-[#14141c] border border-neutral-800 text-neutral-400 hover:text-white'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="p-12 text-center text-neutral-500">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading studio gallery...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-[#121217] rounded-2xl border border-[#20202a] text-neutral-400 text-xs">
          No photos currently uploaded for &quot;{activeCategory}&quot;. Click &quot;Add New Photo&quot; to upload photos.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-[#121217] border border-[#20202a] hover:border-[#d4af37]/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Category Chip Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold">
                    {item.category}
                  </span>
                </div>

                {/* Delete overlay button */}
                <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 backdrop-blur-sm border border-red-800 transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-xs font-bold text-white truncate mb-1">{item.title}</h4>
                {item.description && (
                  <p className="text-[11px] text-neutral-400 line-clamp-2 mb-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-2 border-t border-neutral-800/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d4af37]" />
                    {item.location || 'Madurai'}
                  </span>
                  <span>{item.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13131a] border border-[#282838] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#242433]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#997d26] p-0.5">
                <div className="w-full h-full bg-[#121217] rounded-[10px] flex items-center justify-center text-[#d4af37]">
                  <Upload className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Add Photo to Gallery</h3>
                <p className="text-xs text-neutral-400">Add high-resolution studio shoots into categorized gallery</p>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Shoot Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Royal Pre-Wedding Silhouette at Dhanushkodi"
                  className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Madurai / Rameshwaram"
                    className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Image URL (Cloudinary / Unsplash / Direct) *</label>
                <input
                  type="text"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                />
              </div>

              {newImageUrl && (
                <div className="p-2 rounded-xl bg-[#161622] border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold block mb-1">Preview</span>
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Candid golden hour moments..."
                  className="w-full bg-[#181824] border border-neutral-700 focus:border-[#d4af37] text-white text-xs rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#242433] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newTitle.trim() || !newImageUrl.trim()}
                  className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-extrabold text-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Adding Photo...' : 'Publish to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
