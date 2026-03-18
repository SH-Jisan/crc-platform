import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingMembers, updateMemberStatus, getApprovedMembers, updateMemberInfo } from '../../api/admin';

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
    const [activeTab, setActiveTab] = useState<'PENDING' | 'MEMBERS'>('PENDING');
    const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
    const [editingMember, setEditingMember] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [crcIds, setCrcIds]=useState<Record<string, string>>({});

    // 🌟 Queries
    const { data: pendingData, isLoading: isPendingLoading } = useQuery({
        queryKey: ['pendingMembers'],
        queryFn: getPendingMembers,
        enabled: isOpen && activeTab === 'PENDING',
    });

    const { data: membersData, isLoading: isMembersLoading } = useQuery({
        queryKey: ['approvedMembers'],
        queryFn: getApprovedMembers,
        enabled: isOpen && activeTab === 'MEMBERS',
    });

    const pendingMembers = Array.isArray(pendingData) ? pendingData : (Array.isArray(pendingData?.data) ? pendingData.data : []);
    const approvedMembers = Array.isArray(membersData) ? membersData : (Array.isArray(membersData?.data) ? membersData.data : []);

    // 🌟 Mutations
    const statusMutation = useMutation({
        mutationFn: updateMemberStatus,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pendingMembers'] }),
    });

    const updateInfoMutation = useMutation({
        mutationFn: updateMemberInfo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvedMembers'] });
            setEditingMember(null);
            alert("Member updated successfully! If role was changed, the user will be logged out automatically.");
        },
    });

    if (!isOpen) return null;

    // --- Action Handlers ---
    const handleStatusAction = (memberId: string, status: 'APPROVED' | 'REJECTED') => {
        const role = selectedRoles[memberId] || 'MEMBER';
        const crc_id = crcIds[memberId];
        statusMutation.mutate({ id: memberId, status, role, crc_id });
    };

    const startEditing = (member: any) => {
        setEditingMember(member.id);
        setEditForm({
            crc_id: member.crc_id || '',
            full_name: member.full_name || '',
            phone: member.phone || '',
            university: member.university || '',
            department: member.department || '',
            session: member.session || '',
            roleName: member.user_roles?.[0]?.role?.name || 'MEMBER'
        });
    };

    const handleSaveUpdate = (memberId: string) => {
        updateInfoMutation.mutate({ id: memberId, data: editForm });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header & Tabs */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl  font-extrabold text-[#222222] tracking-tight">User Management</h2>
                            <p className="text-sm text-[#666666] font-medium mt-1">Manage pending requests and update existing members.</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-[#666666] bg-white shadow-sm border border-slate-100 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-all">✕</button>
                    </div>

                    <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab('PENDING')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'PENDING' ? 'bg-white text-[#D64A26] shadow-sm' : 'text-slate-500 hover:text-[#666666]'}`}
                        >
                            Pending Requests
                            {pendingMembers.length > 0 && <span className="ml-2 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px]">{pendingMembers.length}</span>}
                        </button>
                        <button
                            onClick={() => setActiveTab('MEMBERS')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'MEMBERS' ? 'bg-white text-[#D64A26] shadow-sm' : 'text-slate-500 hover:text-[#666666]'}`}
                        >
                            All Members
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="overflow-y-auto p-6 bg-[#FAFAFA] flex-1">

                    {/* ---------------- PENDING TAB ---------------- */}
                    {activeTab === 'PENDING' && (
                        isPendingLoading ? (
                            <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-4 border-[#D64A26] border-t-transparent rounded-full animate-spin"></div></div>
                        ) : pendingMembers.length === 0 ? (
                            <div className="text-center py-16"><h3 className="text-lg font-bold text-[#222222]">All Caught Up!</h3><p className="text-[#666666]">No pending requests right now.</p></div>
                        ) : (
                            <div className="space-y-4">
                                {pendingMembers.map((member: any) => (
                                    <div key={member.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-all">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-[#222222]">{member.full_name}</h3>
                                                <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded-full border border-amber-200">Pending</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-1 text-sm text-[#666666]"><p>Uni: <span className="font-bold text-[#222222]">{member.university}</span></p><p>Dept: <span className="font-bold text-[#222222]">{member.department}</span></p></div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                            <input
                                                type="text"
                                                placeholder="CRC-ID (e.g. CRC-26-001)"
                                                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none text-sm font-bold w-full sm:w-40 bg-[#F4F4F4]/50"
                                                value={crcIds[member.id] || ""}
                                                onChange={(e) => setCrcIds({ ...crcIds, [member.id]: e.target.value })}
                                            />
                                            <select className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none text-sm font-bold bg-[#F4F4F4]/50" value={selectedRoles[member.id] || "MEMBER"} onChange={(e) => setSelectedRoles({ ...selectedRoles, [member.id]: e.target.value })}>
                                                {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                            </select>
                                            <button onClick={() => handleStatusAction(member.id, 'APPROVED')} className="px-4 py-2 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white text-sm font-bold rounded-lg shadow-sm">Approve</button>
                                            <button onClick={() => handleStatusAction(member.id, 'REJECTED')} className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-sm font-bold rounded-lg transition-colors">Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* ---------------- MEMBERS TAB ---------------- */}
                    {activeTab === 'MEMBERS' && (
                        isMembersLoading ? (
                            <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-4 border-[#D64A26] border-t-transparent rounded-full animate-spin"></div></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {approvedMembers.map((member: any) => (
                                    <div key={member.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">

                                        {editingMember === member.id ? (
                                            // 🌟 Edit Mode Form
                                            <div className="space-y-3">

                                                <input type="text" className="w-full text-sm p-2 border border-slate-200 focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none rounded-lg font-bold bg-[#F4F4F4]/50" value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} placeholder="Full Name" />
                                                <input type="text" className="w-full text-sm p-2 border border-orange-300 bg-orange-50 rounded-lg font-bold text-[#D64A26] placeholder:text-orange-400 focus:ring-2 focus:ring-orange-200 outline-none" value={editForm.crc_id} onChange={e => setEditForm({...editForm, crc_id: e.target.value})} placeholder="Assign CRC-ID" />
                                                <input type="text" className="w-full text-sm p-2 border border-slate-200 focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none rounded-lg bg-[#F4F4F4]/50" value={editForm.university} onChange={e => setEditForm({...editForm, university: e.target.value})} placeholder="University" />
                                                <input type="text" className="w-full text-sm p-2 border border-slate-200 focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none rounded-lg bg-[#F4F4F4]/50" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} placeholder="Phone" />

                                                <select className="w-full text-sm p-2 border border-orange-200 focus:ring-2 focus:ring-orange-200 outline-none rounded-lg font-bold text-[#D64A26] bg-orange-50" value={editForm.roleName} onChange={e => setEditForm({...editForm, roleName: e.target.value})}>
                                                    {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                                </select>

                                                <div className="flex gap-2 pt-2">
                                                    <button onClick={() => handleSaveUpdate(member.id)} className="flex-1 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">Save</button>
                                                    <button onClick={() => setEditingMember(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#666666] py-2 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            // 🌟 View Mode
                                            <>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="w-12 h-12 bg-orange-100 text-[#D64A26] rounded-full flex items-center justify-center font-bold text-lg">{member.full_name?.charAt(0)}</div>
                                                    <span className="px-2.5 py-1 bg-slate-100 text-[#666666] text-[10px] font-bold uppercase rounded-full border border-slate-200">
                                                        {member.user_roles?.[0]?.role?.name || 'MEMBER'}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-[#222222] text-lg">{member.full_name}</h3>
                                                <p className="text-xs text-[#666666] mb-4">{member.university}</p>

                                                <button onClick={() => startEditing(member)} className="w-full py-2 bg-slate-50 hover:bg-orange-50 text-[#666666] hover:text-[#D64A26] text-sm font-bold rounded-xl border border-slate-200 transition-colors">
                                                    Edit Info & Role
                                                </button>
                                            </>
                                        )}

                                    </div>
                                ))}
                            </div>
                        )
                    )}

                </div>
            </div>
        </div>
    );
}