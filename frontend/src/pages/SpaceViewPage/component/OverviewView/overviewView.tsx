/* ═══════════════════════════════════════════════
   OVERVIEW VIEW
═══════════════════════════════════════════════ */
import { BarChart2, BookMarked, FileText, FolderOpen, Maximize2, MoreHorizontal, Plus, X } from "lucide-react";
export default function OverviewView() {
    return (
        <div className="flex-1 overflow-y-auto p-0">
            <div className="flex items-center justify-between border-b border-[#fff176] bg-[#fffde7] px-5 py-2.5 text-[13px] text-[#5f6368]">
                <span>Get the most out of your Overview! Add, reorder, and resize cards to customize this page <a href="#" className="font-semibold text-[#0058be] underline">Get Started</a></span>
                <button className="flex items-center text-[#9aa0a6]"><X size={14} /></button>
            </div>
            <div className="flex items-center justify-between border-b border-[#eef0f5] bg-white px-5 py-2.5">
                <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be]"><BarChart2 size={14} /> Filters</button>
                <div className="flex items-center gap-2.5">
                    <span className="text-xs text-[#9aa0a6]">🔄 Refreshed: 9 mins ago</span>
                    <span className="text-xs text-[#9aa0a6]">⏰ Auto refresh: On</span>
                    <button className="cursor-pointer rounded-md border border-[#eef0f5] bg-transparent px-2.5 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafc]">Customize</button>
                    <button className="cursor-pointer rounded-md border border-[#0058be] bg-[#0058be] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#004aab]">Add card</button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2].map(i => (
                    <div key={i} className="overflow-hidden rounded-[10px] border border-[#eef0f5] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center gap-1.5 border-b border-[#eef0f5] px-3 py-2.5">
                            <span className="cursor-grab text-sm text-[#dcdfe4]">⠿</span>
                            <FileText size={15} className="text-[#5f6368]" />
                            <span className="flex-1 text-[13px] font-bold text-[#141b2b]">Docs</span>
                            <div className="ml-auto flex gap-0.5">
                                <button className="cursor-pointer rounded p-0.75 px-1.25 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Maximize2 size={12} /></button>
                                <button className="cursor-pointer rounded p-0.75 px-1.25 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Plus size={12} /></button>
                                <button className="cursor-pointer rounded p-0.75 px-1.25 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]"><MoreHorizontal size={12} /></button>
                            </div>
                        </div>
                        <div className="flex min-h-40 flex-col items-center justify-center px-5 py-8 text-center">
                            <div className="mb-2.5 text-4xl opacity-50">📄</div>
                            <p className="mb-3.5 text-xs leading-relaxed text-[#9aa0a6]">There are no Docs in this location yet.</p>
                            <button className="cursor-pointer rounded-md border-none bg-[#141b2b] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#0058be]">Add a Doc</button>
                        </div>
                    </div>
                ))}
                <div className="overflow-hidden rounded-[10px] border border-[#eef0f5] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-1.5 border-b border-[#eef0f5] px-3 py-2.5">
                        <span className="cursor-grab text-sm text-[#dcdfe4]">⠿</span>
                        <BookMarked size={15} className="text-[#5f6368]" />
                        <span className="flex-1 text-[13px] font-bold text-[#141b2b]">Bookmarks</span>
                        <div className="ml-auto flex gap-0.5">
                            <button className="cursor-pointer rounded p-0.75 px-1.25 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Maximize2 size={12} /></button>
                            <button className="cursor-pointer rounded p-0.75 px-1.25 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]"><Plus size={12} /></button>
                            <button className="cursor-pointer rounded p-0.75 px-1.25 text-[#9aa0a6] hover:bg-[#f0f4ff] hover:text-[#0058be]"><MoreHorizontal size={12} /></button>
                        </div>
                    </div>
                    <div className="flex min-h-40 flex-col items-center justify-center px-5 py-8 text-center">
                        <div className="mb-2.5 text-4xl opacity-50">🔖</div>
                        <p className="mb-3.5 text-xs leading-relaxed text-[#9aa0a6]">Bookmarks make it easy to save items or any URL.</p>
                        <button className="cursor-pointer rounded-md border-none bg-[#141b2b] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#0058be]">Add Bookmark</button>
                    </div>
                </div>
            </div>
            <div className="px-5 pb-6">
                <h3 className="mb-3 text-[15px] font-bold text-[#141b2b]">Folders</h3>
                <div className="rounded-lg border border-[#eef0f5] py-1">
                    <div className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-[#141b2b]"><FolderOpen size={16} className="text-[#5f6368]" /><span>Task Management</span></div>
                </div>
            </div>
        </div>
    );
}
