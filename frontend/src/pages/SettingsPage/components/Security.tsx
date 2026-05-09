
export default function Security() {
  return (
    <div>
      <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Security</h2>
      <p className="mb-6 text-[13px] text-[#9aa0a6]">Manage your account security</p>
      <div className="flex max-w-120 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">Current Password</label>
          <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" type="password" placeholder="Enter current password" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">New Password</label>
          <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" type="password" placeholder="Enter new password" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#5f6368]">Confirm Password</label>
          <input className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]" type="password" placeholder="Confirm new password" />
        </div>
        <button className="mt-2 self-start rounded-lg border-none bg-[#0058be] px-6 py-2.5 text-[13px] font-bold text-white transition-colors duration-150 hover:bg-[#004aab]">Update Password</button>
      </div>
    </div>
  )
}
