import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Input, Button } from 'antd';
import type { AppDispatch, RootState } from '../../../store/configureStore';
import { addWorkspace } from '../../../store/modules/workspaces';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CreateWorkspaceDialog({ open, onOpenChange }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const error = useSelector((s: RootState) => s.workspaces.error);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [slugTouched, setSlugTouched] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const workspaceSlugFromName = (name: string): string => {
        const base = name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return base.length > 0 ? base : 'workspace';
    };
    const syncSlug = (n: string) => {
        if (!slugTouched) setSlug(workspaceSlugFromName(n));
    };

    const reset = () => {
        setName('');
        setSlug('');
        setDescription('');
        setSlugTouched(false);
        setSubmitting(false);
    };

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        const trimmedSlug = slug.trim() || workspaceSlugFromName(trimmedName);
        if (!trimmedName) return;
        setSubmitting(true);
        try {
            dispatch(addWorkspace({ name: trimmedName, slug: trimmedSlug, description: description.trim() }));
            onOpenChange(false);
            reset();
        } catch (error) {
            console.error('Failed to create workspace:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            title={
                <span className="text-lg font-bold text-[var(--color-on-surface)]">
                    Tạo workspace mới
                </span>
            }
            footer={
                <div className="flex justify-end gap-2">
                    <Button onClick={handleCancel}>Huỷ</Button>
                    <Button
                        type="primary"
                        disabled={!name.trim() || submitting}
                        onClick={handleSubmit}
                    >
                        {submitting ? 'Đang tạo…' : 'Tạo workspace'}
                    </Button>
                </div>
            }
            width={448}
            destroyOnClose
        >
            <p className="mt-0 mb-4 text-sm text-[var(--color-text-secondary)]">
                Workspace nhóm các space và thành viên. Slug dùng trong URL (chữ thường, số,
                dấu gạch ngang).
            </p>

            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="ws-name"
                        className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]"
                    >
                        Tên
                    </label>
                    <Input
                        id="ws-name"
                        value={name}
                        placeholder="Ví dụ: Sản phẩm A"
                        onChange={(e) => {
                            setName(e.target.value);
                            syncSlug(e.target.value);
                        }}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="ws-slug"
                        className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]"
                    >
                        Slug
                    </label>
                    <Input
                        id="ws-slug"
                        value={slug}
                        placeholder="san-pham-a"
                        onChange={(e) => {
                            setSlugTouched(true);
                            setSlug(e.target.value);
                        }}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="ws-desc"
                        className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)]"
                    >
                        Mô tả (tuỳ chọn)
                    </label>
                    <Input
                        id="ws-desc"
                        value={description}
                        placeholder="Ngắn gọn về workspace"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                {error ? (
                    <p className="text-xs font-medium text-[var(--color-error)]">{error}</p>
                ) : null}
            </div>
        </Modal>
    );
}
