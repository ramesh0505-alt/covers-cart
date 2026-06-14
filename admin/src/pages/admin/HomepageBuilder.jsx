import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function HomepageBuilder() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/cms/homepage-sections');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setSections(data.map(d => ({
            ...d,
            config: typeof d.config === 'string' ? JSON.parse(d.config) : d.config
          })));
        } else {
          // Default layout if none exists
          setSections([
            { id: '1', type: 'HERO', active: true, config: { title: 'Welcome', subtitle: 'Best Covers' } },
            { id: '2', type: 'FEATURED_PRODUCTS', active: true, config: { limit: 8 } }
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/cms/homepage-sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sections })
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Homepage layout saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    }
    setSections(newSections);
  };

  const toggleActive = (index) => {
    const newSections = [...sections];
    newSections[index].active = !newSections[index].active;
    setSections(newSections);
  };

  const removeSection = (index) => {
    if (!window.confirm('Remove this section?')) return;
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const addSection = () => {
    setSections([...sections, {
      id: Date.now().toString(),
      type: 'CUSTOM',
      active: true,
      config: {}
    }]);
  };

  const updateConfig = (index, newConfigStr) => {
    const newSections = [...sections];
    try {
      newSections[index].config = JSON.parse(newConfigStr);
      setSections(newSections);
    } catch (e) {
      // Invalid JSON, don't update state yet or show error
    }
  };

  if (loading) return <div className="p-8 text-[#7e7e7e]">Loading Builder...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1c1c1c]">Homepage Builder</h2>
        <div className="flex gap-4">
          <button
            onClick={addSection}
            className="px-4 py-2 border border-[#4648d4] text-[#4648d4] rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Add Section
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-[#4648d4] text-white rounded-lg font-medium hover:bg-[#3435b4] transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Layout'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={section.id} className={`bg-white p-4 rounded-xl border ${section.active ? 'border-[#e0e0e0]' : 'border-dashed border-gray-300 opacity-75'} shadow-sm flex gap-4`}>
            <div className="flex flex-col gap-1 items-center justify-center border-r border-[#e0e0e0] pr-4">
              <button 
                onClick={() => moveSection(idx, 'up')}
                disabled={idx === 0}
                className="text-gray-400 hover:text-[#4648d4] disabled:opacity-30"
              >
                ▲
              </button>
              <button 
                onClick={() => moveSection(idx, 'down')}
                disabled={idx === sections.length - 1}
                className="text-gray-400 hover:text-[#4648d4] disabled:opacity-30"
              >
                ▼
              </button>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <select 
                    value={section.type}
                    onChange={(e) => {
                      const newSections = [...sections];
                      newSections[idx].type = e.target.value;
                      setSections(newSections);
                    }}
                    className="font-bold text-[#1c1c1c] border-none bg-gray-50 rounded p-1"
                  >
                    <option value="HERO">Hero Banner</option>
                    <option value="CATEGORIES">Category Grid</option>
                    <option value="FEATURED_PRODUCTS">Featured Products</option>
                    <option value="MYSTERY_POUCH">Mystery Pouch Promo</option>
                    <option value="CUSTOM">Custom JSON block</option>
                  </select>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${section.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {section.active ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(idx)} className="text-sm font-medium text-[#4648d4] hover:underline">
                    {section.active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => removeSection(idx)} className="text-sm font-medium text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7e7e7e] uppercase tracking-wider mb-1">JSON Configuration</label>
                <textarea 
                  defaultValue={JSON.stringify(section.config, null, 2)}
                  onBlur={(e) => updateConfig(idx, e.target.value)}
                  className="w-full h-24 font-mono text-xs p-2 border border-gray-200 rounded bg-gray-50 focus:ring-[#4648d4]"
                />
              </div>
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="text-center p-12 bg-white border border-dashed border-gray-300 rounded-xl text-gray-500">
            No sections added. Build your homepage layout!
          </div>
        )}
      </div>
    </div>
  );
}
