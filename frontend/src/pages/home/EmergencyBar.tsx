import { useQuery } from '@tanstack/react-query';
import { getCustomCauses } from '../../api/customCausesDonations.ts';

const AlertCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export default function EmergencyBar() {
    const { data: causesData, isLoading } = useQuery({ queryKey: ['custom-causes'], queryFn: getCustomCauses });
    const causes = Array.isArray(causesData) ? causesData : (Array.isArray(causesData?.data) ? causesData.data : []);
    const hasActiveEmergency = causes.length > 0 && !isLoading;

    if (!hasActiveEmergency) return null;

    return (
        <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white px-4 py-1.5 shadow-lg relative z-50 text-xs">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
                <div className="flex items-center gap-1.5 font-bold animate-pulse">
                    <AlertCircleIcon />
                    <span className="uppercase tracking-widest text-[10px] sm:text-xs">Urgent Appeal</span>
                </div>
                <span className="hidden sm:inline opacity-40">|</span>
                <p className="font-medium text-rose-50">
                    We are actively responding to an emergency. Please consider donating below.
                </p>
            </div>
        </div>
    );
}