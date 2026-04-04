import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowRight, Upload, HelpCircle, Settings, Grid3X3, Users, Puzzle, Eye } from 'lucide-react';

const COLORS = [
    { id: 'blue', hex: '#0058be' },
    { id: 'purple', hex: '#7c5cfc' },
    { id: 'pink', hex: '#e84393' },
    { id: 'red', hex: '#e74c3c' },
    { id: 'orange', hex: '#f0a220' },
    { id: 'green', hex: '#27ae60' },
    { id: 'cyan', hex: '#00cec9' },
    { id: 'dark', hex: '#1a1a2e' },
];

export default function WorkspaceBrandingPage() {
    const navigate = useNavigate();
    const [selectedColor, setSelectedColor] = useState('#0058be');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleNext = () => {
        console.log('Branding:', { selectedColor, logoFile: logoFile?.name });
        navigate('/invite-team');
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-white">
            {/* ── Top Nav ── */}
            <nav className="flex h-[52px] shrink-0 items-center justify-between border-b border-[#eef0f5] px-7">
                <span className="text-[20px] font-black tracking-[-0.04em] text-[#141b2b]">Flowise</span>
                <div className="flex items-center gap-2">
                    <button type="button" className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border-none bg-[#e8edf5] text-[#5f6368] transition-colors hover:bg-[#d4dbe8]">
                        <HelpCircle size={18} />
                    </button>
                    <button type="button" className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border-none bg-[#e8edf5] text-[#5f6368] transition-colors hover:bg-[#d4dbe8]">
                        <Settings size={18} />
                    </button>
                    <div className="h-[34px] w-[34px] cursor-pointer overflow-hidden rounded-full">
                        <img
                            src="https://ui-avatars.com/api/?name=A+R&background=1a1a2e&color=fff&size=32&bold=true"
                            alt="User"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </nav>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                {/* ═══════ LEFT — Form ═══════ */}
                <section className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-6 lg:px-12">
                    <div className="w-full max-w-[420px]">
                        <h1 className="mb-2 text-[32px] leading-[1.12] font-black tracking-[-0.03em] text-[#141b2b]">
                            Brand your<br />Workspace
                        </h1>
                        <p className="mb-6 text-[14px] leading-[1.5] font-medium text-[#6b7280]">
                            Choose a primary color and upload your logo to
                            make this space your own.
                        </p>

                        {/* Color Picker */}
                        <div className="mb-5">
                            <label className="mb-2.5 block text-[11px] font-extrabold tracking-[0.08em] text-[#141b2b] uppercase">WORKSPACE COLOR</label>
                            <div className="flex flex-wrap gap-2.5">
                                {COLORS.map((c) => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        className={`relative h-10 w-10 cursor-pointer rounded-[10px] border-3 border-transparent outline-none transition-all hover:scale-110 ${selectedColor === c.hex ? 'scale-[1.08] border-[#141b2b] ring-2 ring-white ring-offset-2' : ''
                                            }`}
                                        style={{ backgroundColor: c.hex }}
                                        onClick={() => setSelectedColor(c.hex)}
                                        aria-label={`Select ${c.id} color`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="mb-5">
                            <label className="mb-2.5 block text-[11px] font-extrabold tracking-[0.08em] text-[#141b2b] uppercase">WORKSPACE LOGO</label>
                            <div
                                className={`relative flex min-h-[160px] flex-col items-center justify-center rounded-[14px] border-2 border-dashed p-6 transition-all ${isDragging
                                        ? 'border-[#0058be] bg-[#eef2ff]'
                                        : 'border-[#c2c9e0] bg-[#fafbff]'
                                    }`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={() => setIsDragging(false)}
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo preview" className="mb-2.5 h-20 w-20 rounded-[10px] object-contain" />
                                ) : (
                                    <>
                                        <div className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8edff]">
                                            <Upload size={24} className="text-[#0058be]" />
                                        </div>
                                        <p className="mb-1 text-[14px] font-bold text-[#141b2b]">Drop your logo here</p>
                                        <p className="mb-3 text-[12px] font-medium text-[#9aa0a6]">PNG, JPG or SVG (Max 5MB)</p>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.svg"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileSelect(file);
                                    }}
                                />
                                <button
                                    type="button"
                                    className="cursor-pointer rounded-lg border-2 border-[#d2d6e8] bg-white px-5 py-1.5 text-[13px] font-bold text-[#141b2b] transition-colors hover:border-[#0058be] hover:text-[#0058be]"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Select File
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex items-center gap-3">
                            <button
                                type="button"
                                className="cursor-pointer rounded-[10px] border-2 border-[#e2e6f0] bg-white px-6 py-2.5 text-[14px] font-bold text-[#5f6368] transition-colors hover:border-[#141b2b] hover:text-[#141b2b]"
                                onClick={() => navigate('/workspace-setup')}
                            >
                                Back
                            </button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleNext}
                                className="!flex !h-11 !min-w-[120px] !items-center !justify-center !gap-1.5 !rounded-[10px] !border-none !text-[15px] !font-extrabold hover:!brightness-110"
                                style={{ backgroundColor: selectedColor }}
                            >
                                <span>Next</span>
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* ═══════ RIGHT — Preview ═══════ */}
                <section className="hidden flex-1 flex-col items-center justify-center gap-4 overflow-hidden bg-[#f0f4ff] px-10 py-6 lg:flex">
                    <div className="overflow-hidden rounded-[14px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_28px_rgba(0,88,190,0.07)]">
                        {/* Sidebar Mock */}
                        <div className="flex">
                            <div className="flex min-h-[340px] w-[200px] flex-col gap-1.5 border-r border-[#f0f2f5] px-3 py-4">
                                {/* Header */}
                                <div className="flex items-center gap-2.5 border-b border-[#f0f2f5] pb-3">
                                    <div
                                        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-lg text-[16px] font-extrabold text-white transition-colors duration-300"
                                        style={{ backgroundColor: selectedColor }}
                                    >
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            'A'
                                        )}
                                    </div>
                                    <div className="flex min-w-0 flex-col">
                                        <span className="text-[13px] font-extrabold text-[#141b2b]">Acme Corp</span>
                                        <span
                                            className="text-[9px] font-bold tracking-[0.08em] uppercase transition-colors duration-300"
                                            style={{ color: selectedColor }}
                                        >
                                            ONBOARDING
                                        </span>
                                    </div>
                                </div>

                                {/* Nav */}
                                <nav className="flex flex-1 flex-col gap-0.5 pt-1.5">
                                    <div
                                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-bold tracking-[0.04em] text-white"
                                        style={{ backgroundColor: selectedColor }}
                                    >
                                        <Grid3X3 size={16} className="text-white" />
                                        <span>WORKSPACE</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-bold tracking-[0.04em] text-[#5f6368]">
                                        <Users size={16} className="text-[#9aa0a6]" />
                                        <span>TEAM</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-bold tracking-[0.04em] text-[#5f6368]">
                                        <Puzzle size={16} className="text-[#9aa0a6]" />
                                        <span>INTEGRATIONS</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-bold tracking-[0.04em] text-[#5f6368]">
                                        <Eye size={16} className="text-[#9aa0a6]" />
                                        <span>REVIEW</span>
                                    </div>
                                </nav>

                                {/* Bottom User */}
                                <div className="mt-auto flex items-center gap-2.5 border-t border-[#f0f2f5] pt-2.5">
                                    <img
                                        src="https://ui-avatars.com/api/?name=Alex+Rivera&background=4285F4&color=fff&size=32&bold=true"
                                        alt=""
                                        className="h-[30px] w-[30px] rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-bold text-[#141b2b]">Alex Rivera</span>
                                        <span className="text-[10px] font-semibold text-[#9aa0a6]">Owner</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Mock */}
                            <div className="flex w-[180px] flex-col gap-3 bg-[#f9faff] p-4">
                                <div className="h-2.5 w-3/5 rounded-[5px] bg-[#e2e6f0]" />
                                <div className="flex gap-2">
                                    <div className="h-[100px] flex-1 rounded-lg bg-[#e8edf5]" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-[70px] flex-1 rounded-lg bg-[#e8edf5]" />
                                    <div className="h-[70px] flex-1 rounded-lg bg-[#e8edf5]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Caption */}
                    <div
                        className="max-w-[380px] rounded-[10px] border px-5 py-3 text-center"
                        style={{ borderColor: selectedColor + '30', backgroundColor: selectedColor + '08' }}
                    >
                        <p className="text-[13px] leading-[1.5] font-semibold text-[#5f6368]">
                            This color and logo will be applied to the entire application interface.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
