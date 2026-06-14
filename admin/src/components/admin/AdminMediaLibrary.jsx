import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function AdminMediaLibrary() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const [fileToReplace, setFileToReplace] = useState(null);

  const getToken = () => localStorage.getItem('admin_portal_token') || localStorage.getItem('token');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Failed to fetch media');
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    const toastId = toast.loading('Uploading file...');
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      toast.success('File uploaded successfully!', { id: toastId });
      fetchMedia();
    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReplaceSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !fileToReplace) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    const toastId = toast.loading('Replacing file...');
    try {
      // 1. Upload new file
      const uploadRes = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

      // 2. Delete old file
      const delRes = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ fileName: fileToReplace.filename || fileToReplace.name })
      });
      if (!delRes.ok) console.warn('Failed to delete old file during replacement');

      toast.success('File replaced successfully!', { id: toastId });
      setFileToReplace(null);
      fetchMedia();
    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    } finally {
      setUploading(false);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  const handleDelete = async (fileObj) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;
    
    const toastId = toast.loading('Deleting file...');
    try {
      const res = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ fileName: fileObj.filename || fileObj.name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      
      toast.success('File deleted successfully!', { id: toastId });
      fetchMedia();
    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Support both Prisma schema (filename, url, mimeType) and direct Supabase fallback (name, metadata.mimetype)
  const getDisplayData = (f) => {
    const isDbRecord = !!f.filename;
    return {
      id: f.id,
      name: f.filename || f.name,
      url: f.url || `https://[SUPABASE_PROJECT_REF].supabase.co/storage/v1/object/public/media/${f.name}`,
      type: f.mimeType || f.metadata?.mimetype || 'unknown',
      size: f.size || f.metadata?.size || 0,
      createdAt: new Date(f.createdAt || f.created_at).toLocaleString()
    };
  };

  const filteredFiles = files.filter(f => {
    const disp = getDisplayData(f);
    return disp.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">Enterprise Media Library</h1>
          <p className="text-xs text-zinc-500 font-medium">Manage product images, banners, and store assets securely on Supabase Storage.</p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/*"
          />
          <input 
            type="file" 
            ref={replaceInputRef} 
            onChange={handleReplaceSelect} 
            className="hidden" 
            accept="image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={uploading}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload New File'}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-150 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <input 
          type="text" 
          placeholder="Search filenames..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs w-60"
        />
        <div className="text-zinc-500 font-semibold text-[10px]">
          {filteredFiles.length} file(s) found
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4 w-16 text-center">Preview</th>
              <th className="p-4">Filename</th>
              <th className="p-4">Type</th>
              <th className="p-4">Size</th>
              <th className="p-4">Uploaded At</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-zinc-500 font-semibold">Loading media library...</td>
              </tr>
            ) : filteredFiles.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-zinc-500 font-semibold">
                  {search ? 'No files match your search.' : 'No files uploaded yet. Click "Upload New File" to get started.'}
                </td>
              </tr>
            ) : (
              filteredFiles.map((fRaw) => {
                const f = getDisplayData(fRaw);
                return (
                  <tr key={f.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                    <td className="p-4 flex justify-center">
                      {f.type.startsWith('image/') ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                          <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg border border-zinc-200 bg-zinc-100 flex items-center justify-center text-lg">
                          📄
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-black">
                      <div className="truncate max-w-[200px]" title={f.name}>{f.name}</div>
                    </td>
                    <td className="p-4 font-semibold text-indigo-600">{f.type}</td>
                    <td className="p-4 text-zinc-500 font-semibold">{formatSize(f.size)}</td>
                    <td className="p-4 text-zinc-500 font-semibold">{f.createdAt}</td>
                    <td className="p-4 text-right space-x-3">
                      <button 
                        onClick={() => handleCopy(f.url)} 
                        className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Copy URL
                      </button>
                      <button 
                        onClick={() => {
                          setFileToReplace(fRaw);
                          replaceInputRef.current?.click();
                        }} 
                        className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                      >
                        Replace
                      </button>
                      <button 
                        onClick={() => handleDelete(fRaw)} 
                        className="text-xs font-bold text-red-650 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
