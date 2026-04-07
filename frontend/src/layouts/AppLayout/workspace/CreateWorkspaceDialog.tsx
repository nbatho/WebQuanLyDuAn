import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/configureStore';
import { addWorkspace } from '../../../store/modules/workspaces';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/label';
import { workspaceSlugFromName } from './slugFromName';

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
            await dispatch(
                addWorkspace({
                    name: trimmedName,
                    slug: trimmedSlug,
                    description: description.trim(),
                }),
            ).unwrap();
            onOpenChange(false);
            reset();
        } catch {
            /* rejected — error in store */
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                onOpenChange(v);
                if (!v) reset();
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tạo workspace mới</DialogTitle>
                    <DialogDescription>
                        Workspace nhóm các space và thành viên. Slug dùng trong URL (chữ thường, số,
                        dấu gạch ngang).
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                    <div className="grid gap-1.5">
                        <Label htmlFor="ws-name">Tên</Label>
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
                    <div className="grid gap-1.5">
                        <Label htmlFor="ws-slug">Slug</Label>
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
                    <div className="grid gap-1.5">
                        <Label htmlFor="ws-desc">Mô tả (tuỳ chọn)</Label>
                        <Input
                            id="ws-desc"
                            value={description}
                            placeholder="Ngắn gọn về workspace"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    {error ? <p className="text-xs font-medium text-[#e74c3c]">{error}</p> : null}
                </div>
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                        Huỷ
                    </Button>
                    <Button type="button" disabled={!name.trim() || submitting} onClick={handleSubmit}>
                        {submitting ? 'Đang tạo…' : 'Tạo workspace'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
