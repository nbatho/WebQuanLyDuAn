import { useEffect, useRef } from 'react';
import {
    Copy, Trash2, Move, Archive, Link2, Edit3,
    ArrowRight, CheckCircle2, Flag
} from 'lucide-react';
import './context-menu.css';

interface ContextMenuProps {
    x: number;
    y: number;
    isOpen: boolean;
    onClose: () => void;
    onAction: (action: string) => void;
    taskTitle?: string;
}

const MENU_ITEMS = [
    { id: 'rename', icon: Edit3, label: 'Rename', divider: false },
    { id: 'duplicate', icon: Copy, label: 'Duplicate', divider: false },
    { id: 'copy-link', icon: Link2, label: 'Copy Link', divider: true },
    { id: 'change-status', icon: CheckCircle2, label: 'Change Status', hasSubmenu: true, divider: false },
    { id: 'change-priority', icon: Flag, label: 'Change Priority', hasSubmenu: true, divider: true },
    { id: 'move', icon: Move, label: 'Move to...', divider: false },
    { id: 'archive', icon: Archive, label: 'Archive', divider: true },
    { id: 'delete', icon: Trash2, label: 'Delete', danger: true, divider: false },
];

export default function ContextMenu({ x, y, isOpen, onClose, onAction, taskTitle }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    // Adjust position to fit viewport
    useEffect(() => {
        if (!isOpen || !menuRef.current) return;
        const rect = menuRef.current.getBoundingClientRect();
        const el = menuRef.current;
        if (rect.right > window.innerWidth) {
            el.style.left = `${x - rect.width}px`;
        }
        if (rect.bottom > window.innerHeight) {
            el.style.top = `${y - rect.height}px`;
        }
    }, [isOpen, x, y]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="ctx-menu"
            style={{ top: y, left: x }}
        >
            {taskTitle && (
                <div className="ctx-menu-title">{taskTitle.length > 30 ? taskTitle.slice(0, 30) + '...' : taskTitle}</div>
            )}
            {MENU_ITEMS.map(item => (
                <div key={item.id}>
                    <button
                        className={`ctx-menu-item ${item.danger ? 'ctx-menu-item--danger' : ''}`}
                        onClick={() => { onAction(item.id); onClose(); }}
                    >
                        <item.icon size={14} />
                        <span>{item.label}</span>
                        {item.hasSubmenu && <ArrowRight size={12} className="ctx-submenu-arrow" />}
                    </button>
                    {item.divider && <div className="ctx-menu-divider" />}
                </div>
            ))}
        </div>
    );
}
