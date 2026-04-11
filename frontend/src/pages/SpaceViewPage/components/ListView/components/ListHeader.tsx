
interface ListHeaderProps {
    columns: Record<string, boolean>;
}

export default function ListHeader({ columns }: ListHeaderProps) {
    return (
        <div className="mb-0.5 flex items-center border-b border-[#eef0f5] py-1">
            <div className="min-w-65 flex-1 pl-9 text-[11px] font-bold uppercase tracking-[0.05em] text-[#9aa0a6]">
                Name
            </div>
            {columns.assignee && (
                <div className="w-27.5 text-center text-[11px] font-bold uppercase tracking-[0.05em] text-[#9aa0a6]">
                    Assignee
                </div>
            )}
            {columns.dueDate && (
                <div className="w-30 text-[11px] font-bold uppercase tracking-[0.05em] text-[#9aa0a6]">
                    Due date
                </div>
            )}
            {columns.priority && (
                <div className="w-27.5 text-[11px] font-bold uppercase tracking-[0.05em] text-[#9aa0a6]">
                    Priority
                </div>
            )}
            <div className="w-9" />
        </div>
    );
}
