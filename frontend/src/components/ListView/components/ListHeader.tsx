import { Plus } from 'lucide-react';

interface ListHeaderProps {
    columns: Record<string, boolean>;
}

export default function ListHeader({ columns }: ListHeaderProps) {
    return (
        <div className="flex items-center border-b border-[#e5e7eb] py-[6px]">
            {/* Name */}
            <div className="flex flex-1 items-center pl-[52px] pr-3">
                <span className="text-[11px] font-medium text-[#9ca3af]">Name</span>
            </div>

            {/* Assignee */}
            {columns.assignee !== false && (
                <div className="w-[120px] shrink-0 px-2">
                    <span className="text-[11px] font-medium text-[#9ca3af]">Assignee</span>
                </div>
            )}

            {/* Due date */}
            {columns.dueDate !== false && (
                <div className="w-[130px] shrink-0 px-2">
                    <span className="text-[11px] font-medium text-[#9ca3af]">Due date</span>
                </div>
            )}

            {/* Priority */}
            {columns.priority !== false && (
                <div className="w-[110px] shrink-0 px-2">
                    <span className="text-[11px] font-medium text-[#9ca3af]">Priority</span>
                </div>
            )}

            {/* Add field + circle */}
            <div className="w-9 shrink-0 flex items-center justify-center">
                <button
                    type="button"
                    className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#d1d5db] text-[#9ca3af] hover:border-[#9ca3af] hover:text-[#6b7280] transition-colors"
                    title="Add field"
                >
                    <Plus size={10} />
                </button>
            </div>
        </div>
    );
}
