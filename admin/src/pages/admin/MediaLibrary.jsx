import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/media', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      toast.success('File uploaded successfully');
      fetchMedia();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/media/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fileName: filename })
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('File deleted');
      fetchMedia();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1c1c1c]">Media Library</h2>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*,video/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-[#4648d4] text-white rounded-lg font-medium hover:bg-[#3435b4] transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#e0e0e0] shadow-sm">
        {loading ? (
          <div className="text-center text-[#7e7e7e] py-12">Loading media...</div>
        ) : media.length === 0 ? (
          <div className="text-center text-[#7e7e7e] py-12">
            No media found. Upload some files to get started.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((file, idx) => {
              const fileUrl = file.url || (file.metadata && file.metadata.mimetype ? file.name : null);
              const displayName = file.filename || file.name;
              
              return (
                <div key={idx} className="group relative border border-[#e0e0e0] rounded-lg overflow-hidden flex flex-col">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    {/* Simplified preview assuming image. Supabase public URL needs to be constructed if missing, but we assume API sends it */}
                    {file.url ? (
                      <img src={file.url} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-500 break-all p-2">{displayName}</span>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button 
                        onClick={() => copyUrl(file.url)}
                        className="px-3 py-1 bg-white text-sm font-medium rounded-md hover:bg-gray-100"
                      >
                        Copy URL
                      </button>
                      <button 
                        onClick={() => handleDelete(displayName)}
                        className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="p-2 text-xs truncate text-[#4c4546] border-t border-[#e0e0e0]" title={displayName}>
                    {displayName}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
