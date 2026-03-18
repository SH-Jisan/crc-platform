import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toPng } from 'html-to-image'; // 🌟 The New Modern Engine
import jsPDF from 'jspdf';
import { getPublicProfile } from '../../api/auth';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function CertificateModal({ isOpen, onClose, user }: Props) {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const { data: profile, isLoading } = useQuery({
        queryKey: ['publicProfile', user?.crc_id],
        queryFn: () => getPublicProfile(user!.crc_id!),
        enabled: isOpen && !!user?.crc_id,
    });

    if (!isOpen) return null;

    const handleDownloadPDF = async () => {
        if (!certificateRef.current) return;
        setIsDownloading(true);

        try {
            // 🌟 Using html-to-image to completely bypass the oklch parsing bug!
            const imgData = await toPng(certificateRef.current, {
                pixelRatio: 3, // For ultra HD print quality
                backgroundColor: '#ffffff'
            });

            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            // A4 landscape dimensions logic (maintaining aspect ratio)
            const pdfHeight = (794 * pdfWidth) / 1123;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${user?.crc_id}_Certificate.pdf`);
        } catch (error) {
            console.error("PDF Generation Error: ", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl flex flex-col my-auto overflow-hidden">

                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-[#222222]">Certificate Preview</h2>
                        <p className="text-sm text-[#666666] font-medium">Download or print your official club certificate.</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm">✕</button>
                </div>

                {/* Certificate Area */}
                <div className="p-8 overflow-x-auto flex justify-center bg-[#FAFAFA]">
                    {isLoading ? (
                        <div className="py-32 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-[#D64A26]/20 border-t-[#D64A26] rounded-full animate-spin"></div>
                            <span className="text-[#666666] font-bold tracking-widest uppercase text-sm animate-pulse">Generating Certificate...</span>
                        </div>
                    ) : !profile ? (
                        <div className="py-32 text-center text-rose-500 font-bold">Could not load profile data. Make sure you have a valid CRC-ID.</div>
                    ) : (
                        // 🌟 THE ACTUAL CERTIFICATE DESIGN 🌟
                            <div className="relative flex-shrink-0 bg-white"
                            style={{
                                width: '1123px',
                                height: '794px',
                                backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')`,
                                border: '20px solid #D64A26'
                            }}
                        >
                            {/* Inner Border */}
                            <div className="absolute inset-2 border-[4px] border-double border-[#D64A26]/30 m-4"></div>

                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <span className="text-[250px] font-black tracking-tighter text-[#D64A26] transform -rotate-45">CRC</span>
                            </div>

                            <div className="relative z-10 h-full flex flex-col items-center justify-center px-24 text-center">
                                {/* Header */}
                                <div className="mb-12 flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black shadow-lg mb-6 border-4 bg-linear-to-br from-[#D64A26] to-[#F1795D] text-white border-white ring-2 ring-orange-100">
                                        CR
                                    </div>
                                    <h1 className="text-6xl font-black tracking-tight uppercase text-stone-800" style={{ fontFamily: 'Georgia, serif' }}>Certificate of Appreciation</h1>
                                    <p className="font-bold tracking-[0.3em] uppercase mt-4 text-sm text-[#D64A26]">Come for Road Child (CRC)</p>
                                </div>

                                {/* Body Text */}
                                <div className="max-w-4xl mx-auto space-y-6">
                                    <p className="text-2xl italic text-stone-500" style={{ fontFamily: 'Georgia, serif' }}>This is proudly presented to</p>

                                    <h2 className="text-5xl font-extrabold uppercase tracking-wide border-b-2 border-orange-200 pb-4 text-[#D64A26] inline-block px-12">
                                        {profile.full_name}
                                    </h2>

                                    <p className="text-xl leading-relaxed font-medium mt-6 text-stone-600">
                                        from the department of <strong className="text-stone-800">{profile.department || 'N/A'}</strong> at <strong className="text-stone-800">{profile.university || 'N/A'}</strong>.
                                        <br/><br/>
                                        In recognition of their outstanding dedication and service as a <strong className="uppercase text-[#D64A26]">{profile.roles?.[0]?.replace('_', ' ') || 'Member'}</strong> during the academic session <strong className="text-stone-800">{profile.session || 'N/A'}</strong>. Their contribution has made a significant impact on our community initiatives.
                                    </p>
                                </div>

                                {/* Footer & Signatures */}
                                <div className="w-full flex justify-between items-end mt-24 px-16">
                                    <div className="text-center">
                                        <div className="w-48 border-b-2 border-stone-800 mb-2"></div>
                                        <p className="text-sm font-bold uppercase tracking-wider text-stone-600">President</p>
                                        <p className="text-xs mt-1 text-stone-400">CRC Club</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="w-24 h-24 rounded-full border border-orange-200 bg-orange-50 flex items-center justify-center mb-2">
                                            <span className="text-xs font-bold text-center leading-tight text-[#D64A26]">OFFICIAL<br/>SEAL</span>
                                        </div>
                                        <p className="text-xs font-bold text-stone-400">ID: {profile.crc_id}</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-48 border-b-2 border-stone-800 mb-2"></div>
                                        <p className="text-sm font-bold uppercase tracking-wider text-stone-600">General Secretary</p>
                                        <p className="text-xs mt-1 text-stone-400">CRC Club</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500 hover:text-[#666666] hover:bg-slate-200/50 rounded-xl transition-all">Cancel</button>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading || isLoading || !profile}
                        className="relative overflow-hidden group/btn px-8 py-3 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold tracking-widest uppercase text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isDownloading ? (
                                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> Generating PDF...</>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Official Certificate
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}