import { useState }from 'react'

export default function Notifications() {
    const [notiEmail, setNotiEmail] = useState(true);
    const [notiMention, setNotiMention] = useState(true);
    const [notiTaskUpdate, setNotiTaskUpdate] = useState(false);
    return (
        <div>
            <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">Notification Preferences</h2>
            <p className="mb-6 text-[13px] text-[#9aa0a6]">Choose how you want to be notified</p>

            <div className="flex max-w-130 flex-col gap-1">
                <div className="flex items-center justify-between rounded-[10px] border border-[#eef0f5] px-4 py-3.5 transition-colors duration-100 hover:bg-[#f8fafb]">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#141b2b]">Email notifications</span>
                        <span className="mt-0.5 text-xs text-[#9aa0a6]">Receive email for important updates</span>
                    </div>
                    <button className={`relative h-6 w-11 shrink-0 rounded-xl border-none transition-colors duration-200 ${notiEmail ? 'bg-[#0058be]' : 'bg-[#dcdfe4]'}`}
                        onClick={() => setNotiEmail(!notiEmail)}>
                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${notiEmail ? 'translate-x-5' : ''}`} />
                    </button>
                </div>
                <div className="flex items-center justify-between rounded-[10px] border border-[#eef0f5] px-4 py-3.5 transition-colors duration-100 hover:bg-[#f8fafb]">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#141b2b]">Mention alerts</span>
                        <span className="mt-0.5 text-xs text-[#9aa0a6]">Get notified when someone @mentions you</span>
                    </div>
                    <button className={`relative h-6 w-11 shrink-0 rounded-xl border-none transition-colors duration-200 ${notiMention ? 'bg-[#0058be]' : 'bg-[#dcdfe4]'}`}
                        onClick={() => setNotiMention(!notiMention)}>
                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${notiMention ? 'translate-x-5' : ''}`} />
                    </button>
                </div>
                <div className="flex items-center justify-between rounded-[10px] border border-[#eef0f5] px-4 py-3.5 transition-colors duration-100 hover:bg-[#f8fafb]">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#141b2b]">Task status updates</span>
                        <span className="mt-0.5 text-xs text-[#9aa0a6]">Alerts when tasks you follow change status</span>
                    </div>
                    <button className={`relative h-6 w-11 shrink-0 rounded-xl border-none transition-colors duration-200 ${notiTaskUpdate ? 'bg-[#0058be]' : 'bg-[#dcdfe4]'}`}
                        onClick={() => setNotiTaskUpdate(!notiTaskUpdate)}>
                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${notiTaskUpdate ? 'translate-x-5' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    )
}
