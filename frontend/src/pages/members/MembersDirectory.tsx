import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getPublicMembers } from '../../api/users';

// 🌟 রোলের হায়ারার্কি (Hierarchy) সেট করা হলো
const ROLE_ORDER = [
    'PRESIDENT',
    'VICE_PRESIDENT',
    'GENERAL_SECRETARY',
    'JOINT_SECRETARY',
    'ORGANIZING_SECRETARY',
    'TREASURER',
    'EXECUTIVE_MEMBER',
    'GENERAL_MEMBER',
    'MEMBER'
];

// রোলগুলোকে সুন্দর করে দেখানোর জন্য ফরম্যাটার
const formatRoleName = (role: string) => role.replace(/_/g, ' ');

export default function MembersDirectory() {
    const { data: members, isLoading } = useQuery({
        queryKey: ['publicMembers'],
        queryFn: getPublicMembers,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-stone-500 font-bold animate-pulse">Loading amazing members...</p>
            </div>
        );
    }

    // 🌟 মেম্বারদের রোল অনুযায়ী গ্রুপ করার লজিক
    // 🌟 মেম্বারদের রোল অনুযায়ী গ্রুপ করার আপডেটেড লজিক
    const groupedMembers = ROLE_ORDER.reduce((acc, role) => {
        const membersInRole = members?.filter((m: any) => m.roles.includes(role)) || [];
        if (membersInRole.length > 0) {
            acc[role] = membersInRole;
        }
        return acc;
    }, {} as Record<string, any[]>);

    // 🌟 THE FIX: যাদের কোনো স্পেসিফিক রোল নেই বা অন্য রোল আছে, তাদেরকে "GENERAL_MEMBER" এ পাঠানো
    const membersWithKnownRoles = members?.filter((m: any) =>
        m.roles.some((r: string) => ROLE_ORDER.includes(r))
    ) || [];

    const unassignedMembers = members?.filter((m: any) =>
        !membersWithKnownRoles.includes(m)
    ) || [];

    if (unassignedMembers.length > 0) {
        groupedMembers['GENERAL_MEMBER'] = [
            ...(groupedMembers['GENERAL_MEMBER'] || []),
            ...unassignedMembers
        ];
    }
    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-stone-800 tracking-tight mb-4">
                        Meet Our <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">Dedicated Team</span>
                    </h1>
                    <p className="text-lg text-stone-500 font-medium">
                        The passionate individuals working tirelessly behind the scenes to make a difference in the lives of street children.
                    </p>
                </div>

                {/* Render Members Grouped by Role */}
                <div className="space-y-20">
                    {Object.entries(groupedMembers).map(([role, roleMembers]) => (
                        <div key={role} className="animate-fade-in-up">
                            {/* Role Title */}
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl font-black text-stone-800 uppercase tracking-widest">
                                    {formatRoleName(role)}
                                </h2>
                                <div className="h-px bg-stone-200 flex-1"></div>
                            </div>

                            {/* Member Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {roleMembers.map((member: any) => (
                                    <Link
                                        to={`/member/${member.crc_id}`}
                                        key={member.id}
                                        className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center"
                                    >
                                        {/* Avatar */}
                                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-teal-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                                            <div className="w-full h-full bg-white rounded-full p-1">
                                                <img
                                                    src={member.avatar_url || `https://ui-avatars.com/api/?name=${member.full_name}&background=10b981&color=fff`}
                                                    alt={member.full_name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <h3 className="text-lg font-bold text-stone-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                            {member.full_name}
                                        </h3>
                                        <p className="text-sm font-bold text-emerald-600/80 mb-2">{member.crc_id}</p>

                                        <div className="mt-auto w-full pt-4 border-t border-stone-100 space-y-1">
                                            <p className="text-xs font-medium text-stone-500 line-clamp-1">{member.department || 'N/A'}</p>
                                            <p className="text-xs font-medium text-stone-400">{member.session || 'Session: N/A'}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {Object.keys(groupedMembers).length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200">
                            <p className="text-stone-500 font-medium">No active members found at the moment.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}