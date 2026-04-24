/* ═══════════════════════════════════════════════
   OVERVIEW VIEW
═══════════════════════════════════════════════ */
import { BarChart2, BookMarked, FileText, FolderOpen, Maximize2, MoreHorizontal, Plus, X, Clock, PenTool } from "lucide-react";

const WIDGETS = [
    { id: 'recent', title: 'Recent', icon: Clock, iconColor: '#E5A93B', emptyEmoji: '🕒', desc: 'Your recently accessed tasks and items will appear here.', btn: 'Browse items' },
    { id: 'docs', title: 'Docs', icon: FileText, iconColor: '#0058be', emptyEmoji: '📄', desc: 'There are no Docs in this location yet.', btn: 'Add a Doc' },
    { id: 'bookmarks', title: 'Bookmarks', icon: BookMarked, iconColor: '#e84393', emptyEmoji: '🔖', desc: 'Bookmarks make it easy to save items or any URL.', btn: 'Add Bookmark' },
    { id: 'whiteboards', title: 'Whiteboards', icon: PenTool, iconColor: '#27ae60', emptyEmoji: '🖌️', desc: 'Brainstorm and collaborate visually with your team.', btn: 'Add Whiteboard' },
];

import { useNavigate } from 'react-router-dom';
import type { SpaceTreeData } from '../../../../types/tree';

export default function OverviewView({ spaceId, currentSpaceTree }: { spaceId?: string, currentSpaceTree?: SpaceTreeData[string] }) {
    const navigate = useNavigate();
    return (
        <div className="flex-1 overflow-y-auto p-0 bg-[#f8fafc]">
            <div className="flex items-center justify-between border-b border-[#eef0f5] bg-white px-5 py-2.5 sticky top-0 z-10 shadow-sm">
                <button className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-[#5f6368] hover:bg-[#f0f4ff] hover:text-[#0058be] transition-colors"><BarChart2 size={14} /> Filters</button>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-[#9aa0a6]">🔄 Refreshed: Just now</span>
                    <span className="text-xs font-medium text-[#9aa0a6]">⏰ Auto refresh: On</span>
                    <button className="cursor-pointer rounded-md border border-[#eef0f5] bg-white px-3 py-1.5 text-xs font-semibold text-[#5f6368] hover:bg-[#f8fafb] transition-all shadow-sm">Customize</button>
                    <button className="cursor-pointer rounded-md border-none bg-[#7c5cfc] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#6b4ce6] transition-all shadow-sm shadow-[#7c5cfc]/30">Add card</button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-2">
                {WIDGETS.map(w => (
                    <div key={w.id} className="group overflow-hidden rounded-xl border border-[#eef0f5] bg-white shadow-sm transition-all hover:shadow-md hover:border-[#dcdfe4]">
                        <div className="flex items-center gap-2 border-b border-[#f0f2f5] bg-[#fafbfc] px-4 py-3">
                            <span className="cursor-grab text-sm text-[#dcdfe4] opacity-0 group-hover:opacity-100 transition-opacity">⠿</span>
                            <w.icon size={16} color={w.iconColor} className="shrink-0" />
                            <span className="flex-1 text-[14px] font-bold text-[#141b2b] tracking-tight">{w.title}</span>
                            <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="cursor-pointer rounded p-1 text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368] transition-colors"><Maximize2 size={13} /></button>
                                <button className="cursor-pointer rounded p-1 text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368] transition-colors"><Plus size={13} /></button>
                                <button className="cursor-pointer rounded p-1 text-[#9aa0a6] hover:bg-[#eef0f5] hover:text-[#5f6368] transition-colors"><MoreHorizontal size={13} /></button>
                            </div>
                        </div>
                        <div className="flex min-h-55 flex-col items-center justify-center px-6 py-8 text-center bg-white">
                            <div className="mb-4 text-5xl drop-shadow-sm">{w.emptyEmoji}</div>
                            <p className="mb-5 text-[13px] font-medium leading-relaxed text-[#5f6368]">{w.desc}</p>
                            <button className="cursor-pointer rounded-lg border border-[#eef0f5] bg-white px-5 py-2 text-[13px] font-bold text-[#141b2b] shadow-sm hover:bg-[#f8fafb] hover:border-[#dcdfe4] transition-all">
                                {w.btn}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-6 pb-10">
                <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#141b2b]">
                    <FolderOpen size={18} className="text-[#0058be]" />
                    Lists and Folders
                </h3>
                <div className="rounded-xl border border-[#eef0f5] bg-white shadow-sm overflow-hidden">
                    {currentSpaceTree?.folders.map(folder => (
                        <div key={folder.id} onClick={() => navigate(`/folder/${folder.id}`)} className="flex cursor-pointer items-center justify-between border-b border-[#f0f2f5] px-5 py-3.5 hover:bg-[#f8fafb] transition-colors">
                            <div className="flex items-center gap-3">
                                <FolderOpen size={16} className="text-[#f0a220]" />
                                <span className="text-[14px] font-semibold text-[#141b2b]">{folder.name}</span>
                            </div>
                            <span className="text-[12px] font-medium text-[#9aa0a6]">{folder.lists.length} lists</span>
                        </div>
                    ))}
                    {currentSpaceTree?.standaloneLists.map(list => (
                        <div key={list.id} onClick={() => navigate(`/list/${list.id}`)} className="flex cursor-pointer items-center justify-between border-b border-[#f0f2f5] px-5 py-3.5 hover:bg-[#f8fafb] transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-[#5f6368] pl-1">≡</span>
                                <span className="text-[14px] font-semibold text-[#141b2b]">{list.name}</span>
                            </div>
                        </div>
                    ))}
                    {currentSpaceTree?.folders.length === 0 && currentSpaceTree?.standaloneLists.length === 0 && (
                        <div className="px-5 py-3.5 text-sm text-[#9aa0a6] italic">No folders or lists found in this space.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
