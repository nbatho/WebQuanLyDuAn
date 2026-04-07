import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Calendar as AntCalendar } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export interface DueDatePopoverProps {
    date: string | null;
    onSave: (dateStr: string | null) => void;
    onClose: () => void;
}

export default function DueDatePopover({ date, onSave, onClose }: DueDatePopoverProps) {
    const [input, setInput] = useState('');

    const handleQuickSelect = (daysFromNow: number) => {
        const d = new Date();
        d.setDate(d.getDate() + daysFromNow);
        const formatted = d.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
        });
        onSave(formatted);
        onClose();
    };

    const handleDateChange = (val: Dayjs | null) => {
        if (!val) {
            onSave(null);
        } else {
            onSave(val.format('MM/DD/YY'));
        }
        onClose();
    };

    return (
        <div className="flex w-[260px] flex-col rounded-xl bg-white p-2">
            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Date or natural language"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full rounded border border-[#dcdfe4] bg-[#f8fbff] px-2.5 py-1.5 text-[13px] outline-none placeholder:text-[#9aa0a6] focus:border-[#0058be]"
                    autoFocus
                />
            </div>
            
            {/* Quick Presets */}
            <div className="mb-3 grid grid-cols-2 gap-1 px-1">
                <button
                    className="flex w-full items-center gap-1.5 rounded p-1.5 text-left text-[12px] font-medium text-[#141b2b] hover:bg-[#f8fafb]"
                    onClick={() => handleQuickSelect(0)}
                >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-[#eef0f5] text-[#0058be]">
                        <Calendar size={12} />
                    </div>
                    Today
                </button>
                <button
                    className="flex w-full items-center gap-1.5 rounded p-1.5 text-left text-[12px] font-medium text-[#141b2b] hover:bg-[#f8fafb]"
                    onClick={() => handleQuickSelect(1)}
                >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-[#eef0f5] text-[#E5A93B]">
                        <Calendar size={12} />
                    </div>
                    Tomorrow
                </button>
                <button
                    className="flex w-full items-center gap-1.5 rounded p-1.5 text-left text-[12px] font-medium text-[#141b2b] hover:bg-[#f8fafb]"
                    onClick={() => handleQuickSelect(7)}
                >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-[#eef0f5] text-[#7c5cfc]">
                        <Calendar size={12} />
                    </div>
                    Next week
                </button>
                <button
                    className="flex w-full items-center gap-1.5 rounded p-1.5 text-left text-[12px] font-medium text-[#141b2b] hover:bg-[#f8fafb]"
                    onClick={() => handleQuickSelect(30)}
                >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-[#eef0f5] text-[#55e098]">
                        <Calendar size={12} />
                    </div>
                    Next month
                </button>
            </div>

            <div className="mt-1 border-t border-[#eef0f5] pt-2">
                <div className="mb-2 px-1 text-[11px] font-semibold text-[#9aa0a6]">Custom Date</div>
                <div className="antd-datepicker-wrapper">
                     <AntCalendar 
                        fullscreen={false} 
                        onSelect={handleDateChange} 
                        value={date ? dayjs(date, 'MM/DD/YY') : undefined}
                        style={{ width: '100%', border: 'none' }} 
                     />
                </div>
            </div>
             <style>{`
                .antd-datepicker-wrapper .ant-picker-panel {
                    border: none;
                }
                .antd-datepicker-wrapper .ant-picker-body {
                    padding: 0 4px;
                }
            `}</style>
        </div>
    );
}
