import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowRight, Upload, HelpCircle, Settings, Grid3X3, Users, Puzzle, Eye } from 'lucide-react';
import './workspace-branding.css';

const COLORS = [
    { id: 'blue',   hex: '#0058be' },
    { id: 'purple', hex: '#7c5cfc' },
    { id: 'pink',   hex: '#e84393' },
    { id: 'red',    hex: '#e74c3c' },
    { id: 'orange', hex: '#f0a220' },
    { id: 'green',  hex: '#27ae60' },
    { id: 'cyan',   hex: '#00cec9' },
    { id: 'dark',   hex: '#1a1a2e' },
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
        <div className="wb-page">
            {/* ── Top Nav ── */}
            <nav className="wb-topnav">
                <span className="wb-topnav-brand">Flowise</span>
                <div className="wb-topnav-actions">
                    <button className="wb-topnav-icon-btn">
                        <HelpCircle size={18} />
                    </button>
                    <button className="wb-topnav-icon-btn">
                        <Settings size={18} />
                    </button>
                    <div className="wb-topnav-avatar">
                        <img
                            src="https://ui-avatars.com/api/?name=A+R&background=1a1a2e&color=fff&size=32&bold=true"
                            alt="User"
                            className="wb-topnav-avatar-img"
                        />
                    </div>
                </div>
            </nav>

            <div className="wb-body">
                {/* ═══════ LEFT — Form ═══════ */}
                <section className="wb-form-section">
                    <div className="wb-form-inner">
                        <h1 className="wb-heading">
                            Brand your<br />Workspace
                        </h1>
                        <p className="wb-subheading">
                            Choose a primary color and upload your logo to
                            make this space your own.
                        </p>

                        {/* Color Picker */}
                        <div className="wb-field">
                            <label className="wb-label">WORKSPACE COLOR</label>
                            <div className="wb-color-picker">
                                {COLORS.map((c) => (
                                    <button
                                        key={c.id}
                                        className={`wb-color-swatch ${selectedColor === c.hex ? 'wb-color-swatch--active' : ''}`}
                                        style={{ backgroundColor: c.hex }}
                                        onClick={() => setSelectedColor(c.hex)}
                                        aria-label={`Select ${c.id} color`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="wb-field">
                            <label className="wb-label">WORKSPACE LOGO</label>
                            <div
                                className={`wb-drop-zone ${isDragging ? 'wb-drop-zone--dragging' : ''}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={() => setIsDragging(false)}
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo preview" className="wb-drop-preview" />
                                ) : (
                                    <>
                                        <div className="wb-drop-icon-wrap">
                                            <Upload size={24} className="wb-drop-icon" />
                                        </div>
                                        <p className="wb-drop-text">Drop your logo here</p>
                                        <p className="wb-drop-hint">PNG, JPG or SVG (Max 5MB)</p>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.svg"
                                    className="wb-file-input"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileSelect(file);
                                    }}
                                />
                                <button
                                    className="wb-select-file-btn"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Select File
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="wb-actions">
                            <button className="wb-back-btn" onClick={() => navigate('/workspace-setup')}>
                                Back
                            </button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleNext}
                                className="wb-next-btn"
                                style={{ backgroundColor: selectedColor }}
                            >
                                <span>Next</span>
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* ═══════ RIGHT — Preview ═══════ */}
                <section className="wb-preview-section">
                    <div className="wb-preview-wrap">
                        {/* Sidebar Mock */}
                        <div className="wb-sidebar">
                            {/* Header */}
                            <div className="wb-sb-header">
                                <div className="wb-sb-avatar" style={{ backgroundColor: selectedColor }}>
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="" className="wb-sb-avatar-img" />
                                    ) : (
                                        'A'
                                    )}
                                </div>
                                <div className="wb-sb-info">
                                    <span className="wb-sb-name">Acme Corp</span>
                                    <span className="wb-sb-plan" style={{ color: selectedColor }}>ONBOARDING</span>
                                </div>
                            </div>

                            {/* Nav */}
                            <nav className="wb-sb-nav">
                                <div className="wb-sb-item wb-sb-item--active" style={{ backgroundColor: selectedColor }}>
                                    <Grid3X3 size={16} className="wb-sb-item-icon" />
                                    <span>WORKSPACE</span>
                                </div>
                                <div className="wb-sb-item">
                                    <Users size={16} className="wb-sb-item-icon--muted" />
                                    <span>TEAM</span>
                                </div>
                                <div className="wb-sb-item">
                                    <Puzzle size={16} className="wb-sb-item-icon--muted" />
                                    <span>INTEGRATIONS</span>
                                </div>
                                <div className="wb-sb-item">
                                    <Eye size={16} className="wb-sb-item-icon--muted" />
                                    <span>REVIEW</span>
                                </div>
                            </nav>

                            {/* Bottom User */}
                            <div className="wb-sb-user">
                                <img
                                    src="https://ui-avatars.com/api/?name=Alex+Rivera&background=4285F4&color=fff&size=32&bold=true"
                                    alt=""
                                    className="wb-sb-user-img"
                                />
                                <div className="wb-sb-user-info">
                                    <span className="wb-sb-user-name">Alex Rivera</span>
                                    <span className="wb-sb-user-role">Owner</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Mock */}
                        <div className="wb-content-mock">
                            <div className="wb-mock-bar wb-mock-bar--top" />
                            <div className="wb-mock-cards-row">
                                <div className="wb-mock-card wb-mock-card--tall" />
                            </div>
                            <div className="wb-mock-cards-row">
                                <div className="wb-mock-card wb-mock-card--sm" />
                                <div className="wb-mock-card wb-mock-card--sm" />
                            </div>
                        </div>
                    </div>

                    {/* Caption */}
                    <div className="wb-caption-box" style={{ borderColor: selectedColor + '30', backgroundColor: selectedColor + '08' }}>
                        <p>This color and logo will be applied to the entire application interface.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
