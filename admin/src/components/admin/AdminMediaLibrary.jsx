import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminMediaLibrary() {
  const [files, setFiles] = useState([
    { id: 'file-1', name: 'neon-cyberpunk-banner.png', size: '1.2 MB', sizeCompressed: '340 KB', type: 'Banner Image', tag: 'Banners' },
    { id: 'file-2', name: 'leather-cover-front.jpg', size: '890 KB', sizeCompressed: '120 KB', type: 'Product View', tag: 'Products' },
    { id: 'file-3', name: 'unboxing-loop-promo.mp4', size: '15.4 MB', sizeCompressed: '4.8 MB', type: 'MP4 Video', tag: 'UGC' }
  ]);

  const [activeFolder, setActiveFolder] = useState('All');
  const [search, setSearch] = useState('');

  const handleUpload = () => {
    const newFile = {
      id: `file-${Date.now()}`,
      name: 'user-uploaded-custom-art.png',
      size: '2.4 MB',
      sizeCompressed: '450 KB',
      type: 'PNG Image',
      tag: activeFolder === 'All' ? 'Products' : activeFolder
    };
    setFiles(prev => [newFile, ...prev]);
    toast.success('Media file uploaded and auto-compressed using Google WebP encoder!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">Enterprise Media Library</h1>
          <p className="text-xs text-zinc-500 font-medium">Upload asset files, organize folders, compress banner headers, and browse visual libraries.</p>
        </div>
        <button onClick={handleUpload} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer">
          📤 Bulk Upload Files
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-150 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <div className="flex gap-2">
          {['All', 'Banners', 'Products', 'UGC', 'Icons'].map(folder => (
            <button 
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`px-3.5 py-1.5 font-bold rounded-lg ${activeFolder === folder ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'}`}
            >
              {folder} Folder
            </button>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="Search filenames..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs w-60"
        />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Filename</th>
              <th className="p-4">Type Tag</th>
              <th className="p-4">Raw Size</th>
              <th className="p-4">WebP Compressed Size</th>
              <th className="p-4 text-center">Saving Ratio</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files
              .filter(f => activeFolder === 'All' || f.tag === activeFolder)
              .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
              .map((f) => (
                <tr key={f.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="p-4 font-bold text-black flex items-center gap-2">
                    <span className="text-base">🖼️</span>
                    <span>{f.name}</span>
                  </td>
                  <td className="p-4 font-semibold text-indigo-600">{f.type}</td>
                  <td className="p-4 text-zinc-450 font-semibold">{f.size}</td>
                  <td className="p-4 text-emerald-600 font-bold">{f.sizeCompressed}</td>
                  <td className="p-4 text-center">
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">-72% Ratio</span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => toast.success('CDN download URL copied to clipboard!')} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">Copy CDN URL</button>
                    <button onClick={() => { setFiles(prev => prev.filter(item => item.id !== f.id)); toast.success('Media removed!'); }} className="text-xs font-bold text-red-650 hover:underline cursor-pointer">Delete</button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
