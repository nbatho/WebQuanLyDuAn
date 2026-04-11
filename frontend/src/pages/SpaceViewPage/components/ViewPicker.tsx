import { Search } from 'lucide-react';

type ViewOption = {
    id: string;
    icon: React.ElementType;
    label: string;
    desc: string;
    color: string;
    bg: string;
};

interface ViewPickerProps {
    viewOptions: ViewOption[];
    search: string;
    onSearchChange: (value: string) => void;
    onSelect: (viewId: string) => void;
    onClose: () => void;
}

export default function ViewPicker({ viewOptions, search, onSearchChange, onSelect, onClose }: ViewPickerProps) {
    const filtered = viewOptions.filter(
        (v) =>
            v.label.toLowerCase().includes(search.toLowerCase()) ||
            v.desc.toLowerCase().includes(search.toLowerCase()),
    );
    const popularViews = filtered.slice(0, 7);
    const moreViews = filtered.slice(7);

    return (
        <div className="absolute left-0 top-[calc(100%+4px) z-1000 w-125 rounded-xl border border-(--color-border-light) bg-white p-3 shadow-[0_8px_32px_rgba(0,0,0,0.14)">
            <div className="mb-3.5 flex items-center gap-2 rounded-lg border border-(--color-border) px-3 py-1.5">
                <Search size={14} className="shrink-0 text-(--color-text-tertiary)" />
                <input
                    autoFocus
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search or describe views"
                    className="flex-1 border-none bg-transparent text-[13px] text-(--color-on-surface) outline-none"
                />
            </div>

            <div className="mb-2 mt-1 text-[11px] font-bold uppercase tracking-[0.06em] text-(--color-text-tertiary)">
                Popular
            </div>
            <div className="mb-3 grid grid-cols-2 gap-1">
                {popularViews.map((v) => (
                    <button
                        key={v.id}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg border-none bg-transparent px-2.5 py-2 text-left transition-colors duration-150 hover:bg-(--color-surface-subtle)"
                        onClick={() => {
                            onSelect(v.id);
                            onClose();
                        }}
                    >
                        <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                            style={{ backgroundColor: v.bg }}
                        >
                            <v.icon size={18} color={v.color} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[13px] font-bold text-(--color-on-surface)">{v.label}</span>
                            <span className="text-[11px] text-(--color-text-tertiary)">{v.desc}</span>
                        </div>
                    </button>
                ))}
            </div>

            {moreViews.length > 0 && (
                <>
                    <div className="mb-2 mt-1 text-[11px] font-bold uppercase tracking-[0.06em] text-(--color-text-tertiary)">
                        More views
                    </div>
                    <div className="mb-3 grid grid-cols-2 gap-1">
                        {moreViews.map((v) => (
                            <button
                                key={v.id}
                                className="flex cursor-pointer items-center gap-2.5 rounded-lg border-none bg-transparent px-2.5 py-2 text-left transition-colors duration-150 hover:bg-(--color-surface-subtle)"
                                onClick={() => onClose()}
                            >
                                <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: v.bg }}
                                >
                                    <v.icon size={18} color={v.color} />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[13px] font-bold text-(--color-on-surface)">{v.label}</span>
                                    <span className="text-[11px] text-(--color-text-tertiary)">{v.desc}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}

            <div className="mt-1 flex gap-5 border-t border-(--color-border-light) pt-2.5">
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-(--color-text-secondary)">
                    <input type="checkbox" /> Private view
                </label>
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-(--color-text-secondary)">
                    <input type="checkbox" /> Pin view
                </label>
            </div>
        </div>
    );
}
