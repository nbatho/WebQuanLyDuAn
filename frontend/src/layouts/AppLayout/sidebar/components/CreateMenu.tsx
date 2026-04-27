import { useRef, useEffect } from 'react';
import {
    ListTodo,
    FolderClosed,
    FileText,
    LayoutDashboard,
    PenTool,
    FileSpreadsheet,
    Import,
    LayoutTemplate,
    ChevronRightIcon,
} from 'lucide-react';
import { useSpaceTree } from '../../SpaceTreeContext';
import type { CreateMenuProps } from '../types';

export const CreateMenu = ({ position, onClose, spaceId, spaceName }: CreateMenuProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const tree = useSpaceTree();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const top = Math.min(position.y, window.innerHeight - 350);
    const left = Math.min(position.x, window.innerWidth - 260);

    const items = [
        {
            icon: <ListTodo size={16} />,
            label: 'List',
            sublabel: 'Track tasks, projects, people & more',
            onClick: () => {
                tree.setCreateListTarget({ spaceId, folderId: null, folderName: spaceName });
                onClose();
            },
        },
        {
            icon: <FolderClosed size={16} />,
            label: 'Folder',
            sublabel: 'Group Lists, Docs & more',
            onClick: () => {
                tree.setCreateFolderTarget({ spaceId, spaceName });
                onClose();
            },
        },
    ];

    const extraItems = [
        { icon: <FileText size={16} />, label: 'Doc' },
        { icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        { icon: <PenTool size={16} />, label: 'Whiteboard' },
        { icon: <FileSpreadsheet size={16} />, label: 'Form' },
    ];

    return (
        <div
            ref={ref}
            className="fixed z-9999 w-60 rounded-lg bg-white py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#e2e4e9]"
            style={{ top, left }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="px-3.5 py-1.5 text-[11px] font-semibold text-[#6b6f76] uppercase tracking-wide">
                Create
            </div>

            {items.map((item, i) => (
                <button
                    key={i}
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.75 text-left text-[13px] text-[#1e1f21] transition-all hover:bg-[#f3f4f8]"
                    onClick={item.onClick}
                >
                    <span className="shrink-0 text-[#6b6f76]">{item.icon}</span>
                    <div className="flex flex-col min-w-0">
                        <span className="font-medium">{item.label}</span>
                        {item.sublabel && (
                            <span className="text-[11px] leading-tight text-[#6b6f76] font-normal mt-0.5">
                                {item.sublabel}
                            </span>
                        )}
                    </div>
                </button>
            ))}

            <div className="my-1 mx-2.5 h-px bg-[#eef0f3]" />

            {extraItems.map((item, i) => (
                <button
                    key={i}
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#1e1f21] transition-all hover:bg-[#f3f4f8]"
                    onClick={() => {}}
                >
                    <span className="shrink-0 text-[#6b6f76]">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                </button>
            ))}

            <div className="my-1 mx-2.5 h-px bg-[#eef0f3]" />

            {/* Bottom: Imports & Templates */}
            <button type="button" className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#1e1f21] transition-all hover:bg-[#f3f4f8]">
                <Import size={15} className="text-[#6b6f76]" />
                <span className="flex-1 font-medium">Imports</span>
                <ChevronRightIcon size={13} className="text-[#9b9ea4]" />
            </button>
            <button type="button" className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#1e1f21] transition-all hover:bg-[#f3f4f8]">
                <LayoutTemplate size={15} className="text-[#6b6f76]" />
                <span className="flex-1 font-medium">Templates</span>
                <ChevronRightIcon size={13} className="text-[#9b9ea4]" />
            </button>
        </div>
    );
};
