import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPublicProfile } from '../../api/auth';

// SVG Icons
const VerifiedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-500 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z"/>
    </svg>
);

const UnivIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" />
    </svg>
);

const DeptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const SessionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export default function PublicProfile() {
    const { crcId } = useParams<{ crcId: string }>();

    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ['publicProfile', crcId],
        queryFn: () => getPublicProfile(crcId!),
        enabled: !!crcId,
        retry: false, // ডাটা না পেলে বারবার ট্রাই করবে না
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="w-10 h-10 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin flex items-center justify-center shadow-lg"></div>
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 relative">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

                <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-100 text-center max-w-md w-full relative z-10">
                    <div className="w-20 h-20 bg-stone-50 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-200 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h2 className="text-2xl font-black text-stone-800 tracking-tight mb-2">Member Not Found</h2>
                    <p className="text-stone-500 font-medium mb-8">The ID you searched for is invalid or the member's application is pending.</p>
                    <Link to="/" className="px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 hover:shadow-lg transition-all inline-block">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 relative flex items-center justify-center font-sans overflow-hidden">
            {/* Soft Background Elements for Beauty */}
            <div className="absolute top-[0%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/40 blur-[130px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-teal-100/40 blur-[130px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-[440px] relative z-10 animate-fade-in-up">
                
                {/* Premium Card Container */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] ring-1 ring-stone-900/5 overflow-hidden relative">
                    
                    {/* Elegant Cover */}
                    <div className="h-44 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 relative flex items-start justify-between p-6 overflow-hidden">
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        
                        {/* Decorative glow inside cover */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

                        <div className="relative z-10 flex items-center gap-2 text-white">
                            <span className="font-extrabold tracking-widest text-lg">CRC.</span>
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                        </div>
                        
                        <div className="relative z-10 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-stone-50 text-xs font-bold tracking-widest border border-white/20 shadow-lg">
                            ID: {profile.crc_id}
                        </div>
                    </div>

                    {/* Avatar Overlap */}
                    <div className="flex justify-center -mt-20 relative z-20">
                        <div className="w-36 h-36 bg-white rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                            <div className="w-full h-full bg-stone-100 rounded-full flex items-center justify-center text-5xl font-extrabold text-stone-300 overflow-hidden border border-stone-100 relative group">
                                {profile.avatar_url ? (
                                    <>
                                        <div className="absolute inset-0 bg-stone-900/10 group-hover:opacity-0 transition-opacity z-10"></div>
                                        <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover relative z-0" />
                                    </>
                                ) : (
                                    profile.full_name?.charAt(0).toUpperCase()
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 pt-5 pb-10 text-center">
                        {/* Name & Badge */}
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">{profile.full_name}</h1>
                            <VerifiedIcon />
                        </div>

                        {/* Roles Badge List */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 mb-8">
                            {profile.roles && profile.roles.length > 0 ? (
                                profile.roles.map((role: string) => (
                                    <span key={role} className="px-5 py-2 bg-stone-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md">
                                        {role.replace('_', ' ')}
                                    </span>
                                ))
                            ) : (
                                <span className="px-5 py-2 bg-stone-100 text-stone-600 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">MEMBER</span>
                            )}
                        </div>

                        {/* Bio / Quote (Optional) */}
                        {profile.bio && (
                            <div className="mb-8 p-5 bg-stone-50/80 rounded-2xl border border-stone-100 text-sm text-stone-600 font-semibold italic relative shadow-inner">
                                <svg className="absolute top-2.5 left-3 w-5 h-5 text-emerald-600/20" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/></svg>
                                <span className="relative z-10 px-6 block tracking-wide">{profile.bio}</span>
                            </div>
                        )}

                        {/* Info Grid */}
                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 group">
                                <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0">
                                    <UnivIcon />
                                </div>
                                <div className="flex-1">
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">University</span>
                                    <span className="font-extrabold text-stone-800 text-sm">{profile.university || 'N/A'}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-cyan-100 transition-all duration-300 group">
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center shrink-0 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                                        <DeptIcon />
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">Department</span>
                                        <span className="font-extrabold text-stone-800 text-sm leading-tight inline-block">{profile.department || 'N/A'}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300 group">
                                    <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center shrink-0 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                        <SessionIcon />
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">Session</span>
                                        <span className="font-extrabold text-stone-800 text-sm leading-tight inline-block">{profile.session || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-8 flex justify-center pb-8">
                    <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md rounded-full border border-white/40 shadow-sm text-stone-400 hover:text-emerald-700 hover:bg-white hover:shadow-md transition-all font-bold text-[10px] tracking-widest uppercase">
                        University Volunteer Network
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}