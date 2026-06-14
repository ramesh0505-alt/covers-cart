import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminRoles() {
  const [team] = useState([
    { name: 'Ramesh SuperAdmin', role: 'Super Admin', email: 'ramesh@coverscart.com', status: 'Active' },
    { name: 'Bob Designer', role: 'Designer', email: 'bob@coverscart.com', status: 'Active' },
    { name: 'Alice Customer Care', role: 'Support Agent', email: 'alice@coverscart.com', status: 'Active' }
  ]);

  const [permissions, setPermissions] = useState({
    superAdmin: { catalog: true, sales: true, crm: true, settings: true },
    designer: { catalog: true, sales: false, crm: false, settings: false },
    support: { catalog: false, sales: true, crm: true, settings: false }
  });

  const handleTogglePerm = (role, module) => {
    setPermissions(prev => {
      const updated = {
        ...prev,
        [role]: {
          ...prev[role],
          [module]: !prev[role][module]
        }
      };
      toast.success('Permission matrix modified successfully!');
      return updated;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Administrator Roles & Permissions Matrix</h1>
        <p className="text-xs text-zinc-500 font-medium">Add collaborators, modify role accessibility, and verify change permission settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Collaborators Listing */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs lg:col-span-2 space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Active Admin Team Members</h3>
          <div className="space-y-2.5">
            {team.map((t, idx) => (
              <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 flex justify-between items-center">
                <div>
                  <div className="font-bold text-black">{t.name}</div>
                  <div className="text-[10px] text-zinc-400 font-medium">{t.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-extrabold text-[9px] uppercase">{t.role}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Granular Module Permissions</h3>
          
          <div className="space-y-4">
            {Object.keys(permissions).map((roleKey) => (
              <div key={roleKey} className="space-y-2 border-b border-zinc-100 pb-3 last:border-b-0">
                <div className="font-bold text-black capitalize">{roleKey.replace(/([A-Z])/g, ' $1')} Role</div>
                
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  {Object.keys(permissions[roleKey]).map((moduleKey) => (
                    <label key={moduleKey} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={permissions[roleKey][moduleKey]}
                        onChange={() => handleTogglePerm(roleKey, moduleKey)}
                        className="rounded text-indigo-650"
                      />
                      <span className="capitalize">{moduleKey} access</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
