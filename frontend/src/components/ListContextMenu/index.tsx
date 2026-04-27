import { useEffect, useRef } from 'react';
import {
    Pencil, Link2, Palette, Columns3, Copy, Archive, Trash2,
} from 'lucide-react';


export interface ListContextMenuProps {
    listId: string;
    position: { x: number; y: number };
    onClose: () => void;
    onDelete: (listId: string) => Promise<void>;
}


export default function ListContextMenu({
    listId,
    position,
    onClose,
    onDelete,
}: ListContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, [onClose]);

    const top = Math.min(position.y, typeof window !== 'undefined' ? window.innerHeight - 320 : position.y);
    const left = Math.min(position.x, typeof window !== 'undefined' ? window.innerWidth - 230 : position.x);

    const itemCls =
        'flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#1e1f21] hover:bg-[#f3f4f8]';
    const iconCls = 'text-[#6b6f76]';
    const divider = <div className="my-1 mx-2.5 h-px bg-[#eef0f3]" />;

    return (
        <div
            ref={menuRef}
            className="fixed z-9999 w-55 rounded-lg border border-[#e2e4e9] bg-white py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
            style={{ top, left }}
            onClick={(e) => e.stopPropagation()}
        >
            <button type="button" className={itemCls} onClick={onClose}>
                <Pencil size={14} className={iconCls} />
                <span className="font-medium">Rename</span>
            </button>
            <button type="button" className={itemCls} onClick={onClose}>
                <Link2 size={14} className={iconCls} />
                <span className="font-medium">Copy link</span>
            </button>

            {divider}

            <button type="button" className={itemCls} onClick={onClose}>
                <Palette size={14} className={iconCls} />
                <span className="font-medium">Color &amp; Icon</span>
            </button>
            <button type="button" className={itemCls} onClick={onClose}>
                <Columns3 size={14} className={iconCls} />
                <span className="font-medium">Custom Fields</span>
            </button>

            {divider}

            <button type="button" className={itemCls} onClick={onClose}>
                <Copy size={14} className={iconCls} />
                <span className="font-medium">Duplicate</span>
            </button>
            <button type="button" className={itemCls} onClick={onClose}>
                <Archive size={14} className={iconCls} />
                <span className="font-medium">Archive</span>
            </button>
            <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-1.5 text-left text-[13px] text-[#dc3545] hover:bg-[#fef2f2]"
                onClick={async () => {
                    await onDelete(listId);
                    onClose();
                }}
            >
                <Trash2 size={14} className="text-[#dc3545]" />
                <span className="font-medium">Delete</span>
            </button>
        </div>
    );
}
