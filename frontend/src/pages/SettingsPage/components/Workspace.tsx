import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { AppDispatch, RootState } from '../../../store/configureStore';
import {
    fetchWorkspaceById,
    editWorkspace,
} from '../../../store/modules/workspaces';

export default function Workspace() {
    const dispatch = useDispatch<AppDispatch>();

    const {
        currentWorkspaceId,
        currentWorkspaceDetail,
        isLoadingWorkspaceDetail,
        isUpdatingWorkspace,
        updateWorkspaceError,
    } = useSelector((s: RootState) => s.workspaces);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Load workspace detail whenever the selected workspace changes
    useEffect(() => {
        if (currentWorkspaceId) {
            dispatch(fetchWorkspaceById(currentWorkspaceId));
        }
    }, [currentWorkspaceId, dispatch]);

    // Populate form whenever detail arrives
    useEffect(() => {
        if (currentWorkspaceDetail) {
            setName(currentWorkspaceDetail.name ?? '');
            setDescription(currentWorkspaceDetail.description ?? '');
            setSuccessMsg(null);
        }
    }, [currentWorkspaceDetail]);

    const isDirty =
        name !== (currentWorkspaceDetail?.name ?? '') ||
        description !== (currentWorkspaceDetail?.description ?? '');

    const handleSave = async () => {
        if (!currentWorkspaceId || !currentWorkspaceDetail) return;
        setSuccessMsg(null);

        const result = await dispatch(
            editWorkspace({
                workspace_id: currentWorkspaceId,
                name: name.trim(),
                slug: currentWorkspaceDetail.slug,
                description: description.trim(),
            }),
        );

        if (editWorkspace.fulfilled.match(result)) {
            setSuccessMsg('Workspace đã được cập nhật thành công!');
            setTimeout(() => setSuccessMsg(null), 4000);
        }
    };

    /* ── Loading skeleton ── */
    if (isLoadingWorkspaceDetail) {
        return (
            <div className="flex flex-col gap-6">
                <div>
                    <div className="mb-1 h-7 w-48 animate-pulse rounded-md bg-[#e8eaed]" />
                    <div className="h-4 w-64 animate-pulse rounded-md bg-[#e8eaed]" />
                </div>
                <div className="flex max-w-lg flex-col gap-5">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                            <div className="h-3.5 w-28 animate-pulse rounded bg-[#e8eaed]" />
                            <div className="h-10 w-full animate-pulse rounded-lg bg-[#e8eaed]" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* ── No workspace selected ── */
    if (!currentWorkspaceId || !currentWorkspaceDetail) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <Building2 className="h-12 w-12 text-[#dcdfe4]" />
                <p className="text-sm font-medium text-[#9aa0a6]">
                    Chưa có workspace nào được chọn.
                    <br />
                    Vui lòng chọn workspace từ thanh điều hướng bên trái.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h2 className="mb-1 text-xl font-extrabold text-[#141b2b]">
                    Workspace Settings
                </h2>
                <p className="text-[13px] text-[#9aa0a6]">
                    Cấu hình thông tin cho workspace&nbsp;
                    <span className="font-semibold text-[#0058be]">
                        {currentWorkspaceDetail.name}
                    </span>
                </p>
            </div>

            {/* Workspace identity card */}
            <div className="flex items-center gap-3 rounded-xl border border-[#e8eaed] bg-[#f8f9fa] px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0058be]/10">
                    <Building2 className="h-5 w-5 text-[#0058be]" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#141b2b]">
                        {currentWorkspaceDetail.name}
                    </p>
                    <p className="text-xs text-[#9aa0a6]">
                        Slug:&nbsp;
                        <code className="rounded bg-[#e8eaed] px-1 py-0.5 text-[11px] font-mono text-[#5f6368]">
                            {currentWorkspaceDetail.slug}
                        </code>
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="flex max-w-lg flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="ws-name"
                        className="text-xs font-bold text-[#5f6368]"
                    >
                        Tên Workspace <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="ws-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên workspace..."
                        className="rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="ws-desc"
                        className="text-xs font-bold text-[#5f6368]"
                    >
                        Mô tả
                    </label>
                    <textarea
                        id="ws-desc"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Mô tả ngắn về workspace này..."
                        className="resize-none rounded-lg border border-[#dcdfe4] bg-white px-3 py-2.5 text-sm text-[#141b2b] outline-none transition-all duration-150 focus:border-[#0058be] focus:shadow-[0_0_0_3px_rgba(0,88,190,0.08)]"
                    />
                </div>

                {/* Feedback messages */}
                {successMsg && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {successMsg}
                    </div>
                )}
                {updateWorkspaceError && !isUpdatingWorkspace && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {updateWorkspaceError}
                    </div>
                )}

                {/* Save button */}
                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isUpdatingWorkspace || !isDirty || !name.trim()}
                        className="flex items-center gap-2 rounded-lg border-none bg-[#0058be] px-5 py-2.5 text-[13px] font-bold text-white transition-all duration-150 hover:bg-[#004aab] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isUpdatingWorkspace ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isUpdatingWorkspace ? 'Đang lưu…' : 'Save Changes'}
                    </button>

                    {isDirty && !isUpdatingWorkspace && (
                        <button
                            type="button"
                            onClick={() => {
                                setName(currentWorkspaceDetail.name ?? '');
                                setDescription(currentWorkspaceDetail.description ?? '');
                            }}
                            className="rounded-lg border border-[#dcdfe4] bg-white px-4 py-2.5 text-[13px] font-medium text-[#5f6368] transition-colors duration-150 hover:bg-[#f1f3f4]"
                        >
                            Huỷ
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
