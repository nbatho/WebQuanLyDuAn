import { ChevronDown, Check, Building2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/configureStore';
import { setCurrentWorkspaceId } from '../../../store/modules/workspaces';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';

type Props = {
    onOpenCreate: () => void;
};

export default function WorkspaceSwitcher({ onOpenCreate }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const { listWorkspaces, currentWorkspaceId, isLoadingWorkspaces } = useSelector(
        (s: RootState) => s.workspaces,
    );

    const current = listWorkspaces.find((w) => w.workspace_id === currentWorkspaceId);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-auto w-full justify-between gap-1 px-2 py-1.5 text-left font-normal hover:bg-[#f0f4ff]"
                >
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                        <span className="truncate text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#0058be]">
                            Workspace
                        </span>
                        <span className="truncate text-xs font-bold text-[#141b2b]">
                            {isLoadingWorkspaces
                                ? 'Đang tải…'
                                : current?.name ?? (listWorkspaces[0]?.name || 'Chưa có workspace')}
                        </span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#9aa0a6]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                {listWorkspaces.length === 0 && !isLoadingWorkspaces ? (
                    <div className="px-2 py-2 text-xs text-[#9aa0a6]">
                        Chưa có workspace. Tạo mới bên dưới.
                    </div>
                ) : (
                    listWorkspaces.map((w) => (
                        <DropdownMenuItem
                            key={w.workspace_id}
                            onClick={() => dispatch(setCurrentWorkspaceId(w.workspace_id))}
                            className="gap-2"
                        >
                            <Building2 className="h-4 w-4 text-[#0058be]" />
                            <span className="flex-1 truncate">{w.name}</span>
                            {w.workspace_id === currentWorkspaceId ? (
                                <Check className="h-4 w-4 text-[#0058be]" />
                            ) : null}
                        </DropdownMenuItem>
                    ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onOpenCreate}>Tạo workspace mới…</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
