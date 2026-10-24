import React, { useState } from 'react';
import { 
  FolderHeart, 
  Plus, 
  Trash2, 
  Eye, 
  Image as ImageIcon, 
  ChevronLeft, 
  X, 
  Upload, 
  Calendar, 
  Tag, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminGalleryAlbum } from '../../../types/admin';

export const AdminGalleryPage: React.FC = () => {
  const { galleryAlbums, addAlbum, updateAlbum, deleteAlbum, addPhotosToAlbum, deletePhotoFromAlbum } = useAdmin();
  
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  
  // Add Album Modal
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumCategory, setNewAlbumCategory] = useState('Weddings');
  const [newAlbumCover, setNewAlbumCover] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');

  // Add Photos Modal
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');

  const activeAlbum = galleryAlbums.find(a => a.id === selectedAlbumId) || null;

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle || !newAlbumCover) return;

    addAlbum({
      title: newAlbumTitle,
      category: newAlbumCategory,
      coverImage: newAlbumCover,
      description: newAlbumDesc
    });

    setShowAddAlbumModal(false);
    setNewAlbumTitle('');
    setNewAlbumDesc('');
  };

  const handleAddPhotosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbumId || !photoUrlInput) return;

    // Support comma or newline separated URLs
    const urls = photoUrlInput.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
    const photosToAdd = urls.map(url => ({
      url,
      caption: photoCaptionInput || (activeAlbum ? activeAlbum.title : 'Shoot Photo')
    }));

    addPhotosToAlbum(selectedAlbumId, photosToAdd);
    setShowAddPhotosModal(false);
    setPhotoUrlInput('');
    setPhotoCaptionInput('');
  };

  const handleDeleteAlbum = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete album "${title}" and all its photos?`)) {
      deleteAlbum(id);
      if (selectedAlbumId === id) setSelectedAlbumId(null);
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!selectedAlbumId) return;
    if (window.confirm('Delete this photo from album?')) {
      deletePhotoFromAlbum(selectedAlbumId, photoId);
    }
  };

  return (
    <div className="space-y-6 font-sans-clean">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold text-[#aa820a] uppercase tracking-widest">
            PHOTO ALBUMS & ARCHIVES
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-cinzel">
            {activeAlbum ? activeAlbum.title : 'Gallery & Album Management'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {activeAlbum 
              ? `Viewing ${activeAlbum.photoCount} high-resolution photographs in this album` 
              : 'Organize high-res client galleries, album deliverables, and digital proofs.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeAlbum ? (
            <>
              <button
                onClick={() => setSelectedAlbumId(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Albums</span>
              </button>
              
              <button
                onClick={() => setShowAddPhotosModal(true)}
                className="px-4 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Photos</span>
              </button>
            </>
          ) : (
            <button
              id="btn-create-album-open"
              onClick={() => setShowAddAlbumModal(true)}
              className="px-4 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Album</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: ALBUMS DIRECTORY */}
      {!activeAlbum ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryAlbums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#d4af37]/60 hover:shadow-md transition-all group"
            >
              <div>
                {/* Album Cover */}
                <div 
                  onClick={() => setSelectedAlbumId(album.id)}
                  className="relative h-56 w-full overflow-hidden bg-neutral-100 cursor-pointer"
                >
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[#f3e5ab] text-[10px] font-bold uppercase tracking-wider border border-[#d4af37]/40">
                    {album.category}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <h3 className="text-base font-bold font-cinzel leading-tight">
                        {album.title}
                      </h3>
                      <span className="text-[11px] text-neutral-300 mt-0.5 block">
                        {album.photoCount} Photographs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 space-y-2">
                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {album.description || 'Curated high-resolution studio photo album.'}
                  </p>
                  <div className="text-[11px] text-neutral-400">
                    Created on {album.createdDate}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedAlbumId(album.id)}
                  className="text-xs font-bold text-[#aa820a] hover:text-neutral-900 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Album</span>
                </button>

                <button
                  onClick={() => handleDeleteAlbum(album.id, album.title)}
                  className="p-1.5 rounded-lg bg-neutral-200 hover:bg-red-100 text-neutral-600 hover:text-red-600 transition-colors"
                  title="Delete Album"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* VIEW 2: SINGLE ALBUM PHOTOS GRID */
        <div className="space-y-6">
          
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-600">
              <span className="font-bold text-neutral-900">{activeAlbum.title}</span> • Category:{' '}
              <span className="text-[#aa820a] font-semibold">{activeAlbum.category}</span>
            </div>

            <button
              onClick={() => setShowAddPhotosModal(true)}
              className="px-4 py-2 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload / Add More Photos</span>
            </button>
          </div>

          {activeAlbum.photos.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200 space-y-3">
              <ImageIcon className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-base font-bold text-neutral-900 font-cinzel">This album is empty</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Add photo URLs or uploaded photoshoot links to display them in this album.
              </p>
              <button
                onClick={() => setShowAddPhotosModal(true)}
                className="px-5 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Photo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeAlbum.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden group relative"
                >
                  <div className="h-48 w-full bg-neutral-100 overflow-hidden relative">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Hover delete button */}
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3 bg-white">
                    <p className="text-[11px] font-medium text-neutral-800 truncate">
                      {photo.caption}
                    </p>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      {photo.uploadedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* CREATE ALBUM MODAL */}
      {showAddAlbumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                Create New Gallery Album
              </h3>
              <button onClick={() => setShowAddAlbumModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  placeholder="e.g. Royal Leela Palace Wedding"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                <select
                  value={newAlbumCategory}
                  onChange={(e) => setNewAlbumCategory(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Weddings">Weddings</option>
                  <option value="Candid">Candid</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Pre-Wedding">Pre-Wedding</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={newAlbumCover}
                  onChange={(e) => setNewAlbumCover(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  placeholder="Album highlights, event date, venue..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddAlbumModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PHOTOS TO ALBUM MODAL */}
      {showAddPhotosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                Add Photos to {activeAlbum?.title}
              </h3>
              <button onClick={() => setShowAddPhotosModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhotosSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Photo Image URL(s) *</label>
                <textarea
                  rows={4}
                  required
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  placeholder="Paste image URLs (one per line, or separated by comma)"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 font-mono text-[11px] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Default Caption / Tag</label>
                <input
                  type="text"
                  value={photoCaptionInput}
                  onChange={(e) => setPhotoCaptionInput(e.target.value)}
                  placeholder="e.g. Wedding Muhurtham Ritual"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddPhotosModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
                >
                  Add to Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
