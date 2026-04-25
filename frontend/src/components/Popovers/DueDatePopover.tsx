import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';

export interface DueDatePopoverProps {
    date: string | null;
    onSave: (dateStr: string | null) => void;
    onClose: () => void;
}

const QUICK_OPTIONS = [
    { label: 'Today', getDays: () => 0 },
    { label: 'Later', getDays: () => 0, suffix: '2:02 am' },
    { label: 'Tomorrow', getDays: () => 1 },
    { label: 'Next week', getDays: () => 7 },
    { label: 'Next weekend', getDays: () => { const d = dayjs(); return (6 - d.day() + 7) % 7 || 7; } },
    { label: '2 weeks', getDays: () => 14 },
    { label: '4 weeks', getDays: () => 28 },
    { label: '8 weeks', getDays: () => 56 },
];

function getDayLabel(daysFromNow: number): string {
    const d = dayjs().add(daysFromNow, 'day');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[d.day()];
}

function getDateLabel(days: number): string {
    const d = dayjs().add(days, 'day');
    return d.format('D MMM');
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DueDatePopover({ date, onSave, onClose }: DueDatePopoverProps) {
    const [activeTab, setActiveTab] = useState<'start' | 'due'>('due');
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const today = dayjs();

    const selectedDay = date ? dayjs(date, 'MM/DD/YY') : null;

    const handleQuickSelect = (daysFromNow: number) => {
        const d = dayjs().add(daysFromNow, 'day');
        onSave(d.format('MM/DD/YY'));
        onClose();
    };

    const handleCalendarClick = (d: Dayjs) => {
        onSave(d.format('MM/DD/YY'));
        onClose();
    };

    // Build calendar grid
    const startOfMonth = currentMonth.startOf('month');
    const startDow = startOfMonth.day(); // 0=Sun
    const daysInMonth = currentMonth.daysInMonth();

    const calendarDays: (Dayjs | null)[] = [];
    for (let i = 0; i < startDow; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(currentMonth.date(d));

    return (
        <div className="flex w-[490px] overflow-hidden rounded-xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
            {/* Left: Quick options */}
            <div className="flex w-[200px] shrink-0 flex-col border-r border-[#f0f1f3] py-1">
                {/* Tabs */}
                <div className="flex border-b border-[#f0f1f3]">
                    <button
                        className={`flex-1 py-2 text-[12px] font-medium transition-colors ${activeTab === 'start' ? 'text-[#7c68ee] border-b-2 border-[#7c68ee] -mb-px' : 'text-[#9ca3af] hover:text-[#374151]'}`}
                        onClick={() => setActiveTab('start')}
                    >
                        Start date
                    </button>
                    <button
                        className={`flex-1 py-2 text-[12px] font-medium transition-colors ${activeTab === 'due' ? 'text-[#7c68ee] border-b-2 border-[#7c68ee] -mb-px' : 'text-[#9ca3af] hover:text-[#374151]'}`}
                        onClick={() => setActiveTab('due')}
                    >
                        Due date
                    </button>
                </div>

                {/* Quick list */}
                <div className="flex flex-col py-1">
                    {QUICK_OPTIONS.map((opt, i) => {
                        const days = opt.getDays();
                        const showDate = days > 1;
                        return (
                            <button
                                key={i}
                                className="flex items-center justify-between px-3 py-[7px] text-[13px] hover:bg-[#f5f6f8] transition-colors"
                                onClick={() => handleQuickSelect(days)}
                            >
                                <span className="font-medium text-[#374151]">{opt.label}</span>
                                <span className="text-[11px] text-[#9ca3af]">
                                    {opt.suffix ?? (days === 0 ? getDayLabel(0) : showDate ? getDateLabel(days) : getDayLabel(days))}
                                </span>
                            </button>
                        );
                    })}

                    <div className="mx-3 my-1 h-px bg-[#f0f1f3]" />

                    {/* Set Recurring */}
                    <button className="flex items-center justify-between px-3 py-[7px] text-[13px] hover:bg-[#f5f6f8] transition-colors">
                        <span className="flex items-center gap-2 font-medium text-[#374151]">
                            <RefreshCw size={13} className="text-[#9ca3af]" />
                            Set Recurring
                        </span>
                        <ChevronRight size={13} className="text-[#9ca3af]" />
                    </button>
                </div>
            </div>

            {/* Right: Calendar */}
            <div className="flex flex-1 flex-col p-3">
                {/* Month navigation */}
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#374151]">
                        {currentMonth.format('MMMM YYYY')}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            className="rounded px-1 py-0.5 text-[11px] font-medium text-[#7c68ee] hover:bg-[#f0f0ff] transition-colors"
                            onClick={() => setCurrentMonth(dayjs())}
                        >
                            Today
                        </button>
                        <button
                            className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#f0f1f3] transition-colors"
                            onClick={() => setCurrentMonth(m => m.subtract(1, 'month'))}
                        >
                            <ChevronLeft size={13} className="text-[#6b7280]" />
                        </button>
                        <button
                            className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#f0f1f3] transition-colors"
                            onClick={() => setCurrentMonth(m => m.add(1, 'month'))}
                        >
                            <ChevronRight size={13} className="text-[#6b7280]" />
                        </button>
                    </div>
                </div>

                {/* Day of week headers */}
                <div className="mb-1 grid grid-cols-7 gap-0">
                    {DAYS_OF_WEEK.map(d => (
                        <div key={d} className="py-1 text-center text-[11px] font-medium text-[#9ca3af]">{d}</div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-0">
                    {calendarDays.map((d, i) => {
                        if (!d) return <div key={i} />;
                        const isToday = d.isSame(today, 'day');
                        const isSelected = selectedDay ? d.isSame(selectedDay, 'day') : false;
                        return (
                            <button
                                key={i}
                                className={`flex h-8 w-full items-center justify-center rounded-full text-[13px] font-medium transition-colors
                                    ${isSelected ? 'bg-[#7c68ee] text-white' : ''}
                                    ${isToday && !isSelected ? 'bg-[#7c68ee] text-white' : ''}
                                    ${!isToday && !isSelected ? 'text-[#374151] hover:bg-[#f5f6f8]' : ''}
                                `}
                                onClick={() => handleCalendarClick(d)}
                            >
                                {d.date()}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
