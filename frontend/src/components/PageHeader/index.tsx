 
import { useNavigate } from 'react-router-dom';
import {
    ChevronDown, Star, FolderClosed, Bot, Share2,
    LayoutDashboard, LayoutList, Trello,
} from 'lucide-react';


export interface PageTab {
    icon?: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

export interface PageHeaderProps {
    parentSpace: { id: string; name: string; color: string };
    parentFolder?: { id: string; name: string } | null;
    entityIcon: React.ReactNode;
    entityName: string;
    tabs?: PageTab[];
}


// eslint-disable-next-line react-refresh/only-export-components
export const FOLDER_TABS: PageTab[] = [
    { icon: <LayoutDashboard size={14} />, label: 'Overview', active: true },
];

// eslint-disable-next-line react-refresh/only-export-components
export const LIST_TABS: PageTab[] = [
    { icon: <LayoutList size={14} />, label: 'List', active: true },
    { icon: <Trello size={14} />, label: 'Board' },
];


export default function PageHeader({
    parentSpace,
    parentFolder,
    entityIcon,
    entityName,
    tabs = [],
}: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="shrink-0 border-b border-[var(--color-border-light)] bg-[var(--color-surface-container-lowest)]">
            <div className="flex items-center justify-between px-5 pb-2 pt-2.5">
                <div className="flex items-center gap-2">
                    <div
                        className="flex h-5 w-5 items-center justify-center rounded"
                        style={{ backgroundColor: parentSpace.color }}
                    >
                        <span className="text-[9px] font-bold text-white">
                            {parentSpace.name.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <span
                        className="cursor-pointer text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[#1a73e8]"
                        onClick={() => navigate(`/space/${parentSpace.id}`)}
                    >
                        {parentSpace.name}
                    </span>

                    {parentFolder && (
                        <>
                            <span className="text-[13px] text-[var(--color-text-tertiary)]">/</span>
                            <FolderClosed size={14} className="text-[var(--color-text-secondary)]" />
                            <span
                                className="cursor-pointer text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[#1a73e8]"
                            >
                                {parentFolder.name}
                            </span>
                        </>
                    )}

                    <span className="text-[13px] text-[var(--color-text-tertiary)]">/</span>
                    <span className="text-[var(--color-text-secondary)]">{entityIcon}</span>
                    <h1 className="m-0 text-base font-bold text-[var(--color-on-surface)]">{entityName}</h1>

                    <button className="flex items-center rounded px-1 py-0.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-primary-bg)] hover:text-[var(--color-primary)]">
                        <ChevronDown size={16} />
                    </button>
                    <button className="flex items-center rounded px-1 py-0.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-primary-bg)] hover:text-[#f0a220]">
                        <Star size={15} />
                    </button>
                </div>

                <div className="flex items-center gap-1.5">
                    <button className="flex cursor-pointer items-center gap-1.25 rounded-md border border-[var(--color-border-light)] bg-transparent px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border)] hover:bg-[#f8fafc]">
                        <Bot size={14} /> Ask AI
                    </button>
                    <button className="flex cursor-pointer items-center gap-1.25 rounded-md border border-[var(--color-primary)] bg-[var(--color-primary)] px-2.5 py-1 text-xs font-semibold text-white transition-all hover:bg-[#004aab]">
                        <Share2 size={14} /> Share
                    </button>
                </div>
            </div>

            {tabs.length > 0 && (
                <div className="flex items-center gap-0.5 px-5">
                    {tabs.map((tab, idx) => (
                        <button
                            key={idx}
                            onClick={tab.onClick}
                            className={[
                                'flex items-center gap-1.25 whitespace-nowrap rounded-t-md border-b-2 px-3 py-2 text-[13px]',
                                tab.active
                                    ? 'border-b-[#0058be] font-semibold text-[var(--color-primary)]'
                                    : 'border-b-transparent font-medium text-[var(--color-text-secondary)] hover:bg-[#f8fafc]',
                            ].join(' ')}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
}
