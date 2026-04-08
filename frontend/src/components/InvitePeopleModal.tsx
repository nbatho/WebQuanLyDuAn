import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, UserRound, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Input } from './ui/Input';

type InvitePeopleModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type InviteRole = 'member' | 'limited_member' | 'guest' | 'admin';

const roleOptions: Array<{
    id: InviteRole;
    label: string;
    description: string;
    badge?: string;
}> = [
    {
        id: 'member',
        label: 'Member',
        description: 'Can access all public items in your Workspace.',
    },
    {
        id: 'limited_member',
        label: 'Limited Member',
        description: 'Can only access items shared with them.',
        badge: 'Chat Collaborator',
    },
    {
        id: 'guest',
        label: 'Guest',
        description: "Can't use all features or be added to Spaces. Can only access items shared with them.",
    },
    {
        id: 'admin',
        label: 'Admin',
        description: 'Can manage Spaces, People, Billing and other Workspace settings.',
    },
];

export default function InvitePeopleModal({ open, onOpenChange }: InvitePeopleModalProps) {
    const [emails, setEmails] = useState('');
    const [role, setRole] = useState<InviteRole>('member');
    const [showRolePicker, setShowRolePicker] = useState(false);

    const roleValue = useMemo(
        () => roleOptions.find((r) => r.id === role) ?? roleOptions[0],
        [role],
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[500px] gap-0 rounded-2xl border-0 bg-[#f7f7f8] p-0 [&>button]:hidden">
                <div className="relative px-5 pb-4 pt-5">
                    <button
                        type="button"
                        className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full border-0 bg-[#ececec] text-[#6b7280] transition-colors hover:bg-[#e2e2e2]"
                        onClick={() => onOpenChange(false)}
                    >
                        <X size={15} />
                    </button>
                    <DialogTitle className="mb-3 text-[24px] font-black tracking-[-0.02em] text-[#202124]">
                        Invite people for free
                    </DialogTitle>

                    <div className="mb-3">
                        <div className="mb-1.5 text-[12px] font-bold text-[#5f6368]">Invite by email</div>
                        <Input
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
                            placeholder="Email, comma or space separated"
                            className="h-9 rounded-xl border-[#c8c8c8] bg-[#f7f7f8] px-3 text-[13px] font-medium text-[#202124] placeholder:text-[#8b8b8b]"
                        />
                    </div>

                    <div className="relative">
                        <div className="mb-1.5 text-[12px] font-bold text-[#5f6368]">Invite as</div>
                        <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-xl border-0 bg-[#efefef] px-2.5 py-2 text-left"
                            onClick={() => setShowRolePicker((v) => !v)}
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e3e3e3] text-[#666]">
                                <UserRound size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="mb-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#202124]">
                                    {roleValue.label}
                                    {showRolePicker ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </div>
                                <div className="text-[11px] leading-[1.3] text-[#7a7a7a]">
                                    {roleValue.description}
                                </div>
                            </div>
                        </button>

                        <div
                            className={`absolute left-0 top-[calc(100%+8px)] z-20 w-[340px] origin-top rounded-2xl border border-[#dfdfdf] bg-[#f7f7f8] p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-180 ease-out ${
                                showRolePicker
                                    ? 'translate-y-0 scale-100 opacity-100'
                                    : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0'
                            }`}
                        >
                                <div className="max-h-[240px] overflow-y-auto pr-1">
                                    {roleOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            className="mb-1 w-full rounded-xl border-0 bg-transparent px-2 py-1.5 text-left hover:bg-[#ededee]"
                                            onClick={() => {
                                                setRole(opt.id);
                                                setShowRolePicker(false);
                                            }}
                                        >
                                            <div className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-[#2a2a2a]">
                                                {opt.label}
                                                {opt.badge ? (
                                                    <span className="rounded-xl bg-[#e4e2ff] px-2 py-0.5 text-[9px] font-semibold text-[#5850d6]">
                                                        {opt.badge}
                                                    </span>
                                                ) : null}
                                                {role === opt.id ? (
                                                    <span className="ml-auto text-xs">✓</span>
                                                ) : null}
                                            </div>
                                            <p className="m-0 text-[10px] leading-[1.35] text-[#637083]">
                                                {opt.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 border-t border-[#e2e2e2] pt-2 text-[12px] font-semibold text-[#5f6368]">
                                    + Add custom role
                                </div>
                            </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            className="border-0 bg-transparent text-[13px] font-semibold text-[#5f6368]"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="rounded-xl border-0 bg-[#1f2125] px-5 py-2 text-[13px] font-bold text-white"
                            onClick={() => onOpenChange(false)}
                        >
                            Send free invite
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
