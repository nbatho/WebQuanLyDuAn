
export default function Workspace() {
  return (
    <div>
      <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Workspace Settings</h2>
      <p className="mb-6 text-[13px] text-[#9aa0a6]">Configure your workspace</p>
      <div className="flex max-w-120 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">Workspace Name</label>
          <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" defaultValue="Flowise PM" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">Default Language</label>
          <select className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]">
            <option>English</option>
            <option>Vietnamese</option>
            <option>Japanese</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">Timezone</label>
          <select className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]">
            <option>UTC+7 (Ho Chi Minh City)</option>
            <option>UTC+0 (London)</option>
            <option>UTC-5 (New York)</option>
          </select>
        </div>
        <button className="mt-2 self-start rounded-lg border-none bg-[#0058be] px-6 py-2.5 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#004aab]">Save Settings</button>
      </div>
    </div>
  )
}
