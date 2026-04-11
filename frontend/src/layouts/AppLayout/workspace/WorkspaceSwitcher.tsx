import { ChevronDown, Check, Building2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import type { AppDispatch, RootState } from '../../../store/configureStore';
import { setCurrentWorkspaceId } from '../../../store/modules/workspaces';

type Props = {
    onOpenCreate: () => void;
};

export default function WorkspaceSwitcher({ onOpenCreate }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const { listWorkspaces, currentWorkspaceId, isLoadingWorkspaces } = useSelector(
        (s: RootState) => s.workspaces,
    );

    const current = listWorkspaces.find((w) => w.workspace_id === currentWorkspaceId);

    const items: MenuProps['items'] = [
        {
            key: 'label',
            type: 'group',
            label: (
                <span className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--color-text-tertiary)]">
                    Workspaces
                </span>
            ),
        },
        ...(listWorkspaces.length === 0 && !isLoadingWorkspaces
            ? [
                  {
                      key: 'empty',
                      label: (
                          <span className="text-xs text-[var(--color-text-tertiary)]">
                              Chưa có workspace. Tạo mới bên dưới.
                          </span>
                      ),
                      disabled: true,
                  },
              ]
            : listWorkspaces.map((w) => ({
                  key: String(w.workspace_id),
                  label: (
                      <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[var(--color-primary)]" />
                          <span className="flex-1 truncate">{w.name}</span>
                          {w.workspace_id === currentWorkspaceId ? (
                              <Check className="h-4 w-4 text-[var(--color-primary)]" />
                          ) : null}
                      </div>
                  ),
                  onClick: () => dispatch(setCurrentWorkspaceId(w.workspace_id)),
              }))),
        { type: 'divider' },
        {
            key: 'create',
            label: 'Tạo workspace mới…',
            onClick: onOpenCreate,
        },
    ];

    return (
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomLeft">
            <button
                type="button"
                className="flex h-auto w-full cursor-pointer items-center justify-between gap-1 rounded-md border-none bg-transparent px-2 py-1.5 text-left hover:bg-[var(--color-primary-bg)]"
            >
                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                    <span className="truncate text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--color-primary)]">
                        Workspace
                    </span>
                    <span className="truncate text-xs font-bold text-[var(--color-on-surface)]">
                        {isLoadingWorkspaces
                            ? 'Đang tải…'
                            : current?.name ?? (listWorkspaces[0]?.name || 'Chưa có workspace')}
                    </span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]" />
            </button>
        </Dropdown>
    );
}
