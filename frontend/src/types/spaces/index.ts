export interface SpaceMember {
    user_id: number;
    name: string;
    email: string;
    avatar_url: string | null;
    role_name: string;
}

export interface SpaceItem {
    id: string;
    name: string;
    color: string;
}

// ── Types moved from /pages per project rules ──────────────────────────────

export type ViewType = 'overview';

export interface ViewOption {
    id: string;
    icon: React.ElementType;
    label: string;
    desc: string;
    color: string;
    bg: string;
}

export interface SpaceHeaderProps {
    currentSpace: SpaceItem | undefined;
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
}

export interface ViewPickerProps {
    viewOptions: ViewOption[];
    search: string;
    onSearchChange: (value: string) => void;
    onSelect: (viewId: string) => void;
    onClose: () => void;
}
