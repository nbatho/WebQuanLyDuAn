import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';

export interface DueDatePopoverProps {
    date: string | null;
    onSave: (dateStr: string | null) => void;
    onClose: () => void;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DueDatePopover({ date, onSave, onClose }: DueDatePopoverProps) {
    const [currentMonth, setCurrentMonth] = useState(date ? dayjs(date) : dayjs());
    const today = dayjs();
    const selectedDay = date ? dayjs(date) : null;

    const handleCalendarClick = (d: Dayjs) => { onSave(d.toISOString()); onClose(); };

    const startDow = currentMonth.startOf('month').day();
    const daysInMonth = currentMonth.daysInMonth();
    const calendarDays: (Dayjs | null)[] = [
        ...Array.from({ length: startDow }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => currentMonth.date(i + 1))
    ];

    return (
        <div className="flex w-65 flex-col overflow-hidden rounded-xl bg-white p-3 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#374151]">{currentMonth.format('MMMM YYYY')}</span>
                <div className="flex items-center gap-1">
                    <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#f0f1f3]" onClick={() => setCurrentMonth(m => m.subtract(1, 'month'))}><ChevronLeft size={13} /></button>
                    <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#f0f1f3]" onClick={() => setCurrentMonth(m => m.add(1, 'month'))}><ChevronRight size={13} /></button>
                </div>
            </div>
            <div className="mb-1 grid grid-cols-7 gap-0">
                {DAYS_OF_WEEK.map(d => <div key={d} className="py-1 text-center text-[11px] font-medium text-[#9ca3af]">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0">
                {calendarDays.map((d, i) => {
                    if (!d) return <div key={i} />;
                    const isToday = d.isSame(today, 'day');
                    const isSelected = selectedDay ? d.isSame(selectedDay, 'day') : false;
                    return (
                        <button key={i} onClick={() => handleCalendarClick(d)} className={`flex h-8 w-full items-center justify-center rounded-full text-[13px] font-medium transition-colors ${isSelected ? 'bg-[#7c68ee] text-white' : ''} ${isToday && !isSelected ? 'border border-[#7c68ee] text-[#7c68ee]' : ''} ${!isToday && !isSelected ? 'text-[#374151] hover:bg-[#f5f6f8]' : ''}`}>
                            {d.date()}
                        </button>
                    );
                })}
            </div>
            {date && <button className="mt-3 w-full rounded-md bg-[#fef2f2] py-1.5 text-[12px] font-semibold text-[#ef4444] hover:bg-[#fee2e2]" onClick={() => { onSave(null); onClose(); }}>Clear date</button>}
        </div>
    );
}