import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingMembers, updateMemberStatus } from '../../api/admin';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ROLES = [
    "MEMBER", "VOLUNTEER", "VOLUNTEER_COORDINATOR",
    "MEDIA_MANAGER", "EVENT_COORDINATOR", "TREASURER",
    "GENERAL_SECRETARY", "VICE_PRESIDENT", "PRESIDENT", "ADMIN"
];

export default function ManageMembersModal({ isOpen, onClose }: Props) {
    const queryClient = useQueryClient();
    const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});

    const { data, isLoading } = useQuery({
        queryKey: ['pendingMembers'],
        queryFn: getPendingMembers,
        enabled: isOpen, // Modal ওপেন হলেই কেবল ডাটা আনবে
    });

    const members = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

    const mutation = useMutation({
        mutationFn: updateMemberStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingMembers'] });
        },
        onError: () => {
            alert("Failed to update member status.");
        }
    });

    if (!isOpen) return null;

    const handleRoleChange = (memberId: string, role: string) => {
        setSelectedRoles(prev => ({ ...prev, [memberId]: role }));
    };

    const handleAction = (memberId: string, status: 'APPROVED' | 'REJECTED') => {
        const role = selectedRoles[memberId] || 'MEMBER';
        mutation.mutate({ id: memberId, status, role });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-stone-800">Pending Memberships</h2>
                        <p className="text-sm text-stone-500 font-medium">Review and approve new member requests.</p>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200">✕</button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 bg-stone-50/30 flex-1">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 border-dashed">
                            <div className="text-4xl mb-3">✅</div>
                            <h3 className="text-lg font-bold text-stone-700">All Caught Up!</h3>
                            <p className="text-stone-500">There are no pending membership requests right now.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {members.map((member: any) => (
                                <div key={member.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:shadow-md">

                                    {/* Member Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-stone-800">{member.full_name}</h3>
                                            <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded-full border border-amber-200/50">Pending</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-sm">
                                            <div><span className="text-stone-400 text-xs uppercase font-bold block">University</span><span className="font-medium text-stone-700">{member.university || 'N/A'}</span></div>
                                            <div><span className="text-stone-400 text-xs uppercase font-bold block">Department</span><span className="font-medium text-stone-700">{member.department || 'N/A'}</span></div>
                                            <div><span className="text-stone-400 text-xs uppercase font-bold block">Session</span><span className="font-medium text-stone-700">{member.session || 'N/A'}</span></div>
                                            <div><span className="text-stone-400 text-xs uppercase font-bold block">Phone</span><span className="font-medium text-stone-700">{member.phone || 'N/A'}</span></div>
                                        </div>
                                    </div>

                                    {/* Action Area (Role + Buttons) */}
                                    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 bg-stone-50 p-3 rounded-xl border border-stone-100">
                                        <select
                                            className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-700 outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto"
                                            value={selectedRoles[member.id] || "MEMBER"}
                                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                        >
                                            {ROLES.map(role => (
                                                <option key={role} value={role}>{role.replace('_', ' ')}</option>
                                            ))}
                                        </select>

                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => handleAction(member.id, 'APPROVED')}
                                                disabled={mutation.isPending}
                                                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(member.id, 'REJECTED')}
                                                disabled={mutation.isPending}
                                                className="flex-1 sm:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}