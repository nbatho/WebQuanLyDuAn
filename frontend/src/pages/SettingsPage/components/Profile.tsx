import { useState } from 'react'
import {
  Camera
} from 'lucide-react';
import { Avatar } from 'antd';
export default function Profile() {
  const [profileName, setProfileName] = useState('Alex Rivera');
  const [profileEmail, setProfileEmail] = useState('alex.rivera@flowise.io');
  const [profileRole, setProfileRole] = useState('Project Manager');
  return (
    <div>
      <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Profile Settings</h2>
      <p className="mb-6 text-[13px] text-[#9aa0a6]">Manage your personal information</p>

      <div className="mb-6 flex items-center gap-5 rounded-xl bg-[#f8fafb] p-5">
        <div className="relative">
          <Avatar size={72} style={{ backgroundColor: '#4285F4', fontSize: '24px', fontWeight: 'bold' }}>AR</Avatar>
          <button className="absolute bottom-0 right-0 flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-white bg-[#0058be] text-white transition-colors duration-150 hover:bg-[#004aab]"><Camera size={14} /></button>
        </div>
        <div>
          <p className="m-0 text-base font-extrabold text-[#141b2b]">{profileName}</p>
          <p className="mt-0.5 text-[13px] text-[#9aa0a6]">{profileRole}</p>
        </div>
      </div>

      <div className="flex max-w-120 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">Full Name</label>
          <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" value={profileName} onChange={e => setProfileName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">Email</label>
          <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">Role</label>
          <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" value={profileRole} onChange={e => setProfileRole(e.target.value)} />
        </div>
        <button className="mt-2 self-start rounded-lg border-none bg-[#0058be] px-6 py-2.5 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#004aab]">Save Changes</button>
      </div>
    </div>
  )
}
