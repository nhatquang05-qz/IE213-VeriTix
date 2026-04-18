import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { EventDetailContext, IOrganizerMember } from '../../../types/organizer.type';
import MemberList from '../../../components/organizer-detail-event/MemberList';
import AddMemberModal from '../../../components/organizer-detail-event/AddMemberModal';
import type { UserSearchResult } from '../../../components/organizer-detail-event/AddMemberModal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { MOCK_MEMBERS_BY_EVENT } from '../../../mocks/members.mock';

/* ══════════════════════════════════════════
   EventMembersPage — Trang "Thành viên" (Fixed)

   Thay đổi:
   - ✅ Filter theo vai trò hoạt động (All / Owner / Admin / Staff)
   - ✅ Filter kết hợp với search (both cùng áp dụng)
   - ✅ AddMemberModal nhận UserSearchResult thay cho wallet string
   - ✅ Toast khi trùng thành viên (wallet đã tồn tại)
   ══════════════════════════════════════════ */

type RoleFilter = 'all' | 'owner' | 'admin' | 'staff';

const ROLE_TABS: { key: RoleFilter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'owner', label: 'Chủ sự kiện' },
  { key: 'admin', label: 'Quản trị viên' },
  { key: 'staff', label: 'Nhân viên' },
];

export default function EventMembersPage() {
  const { event } = useOutletContext<EventDetailContext>();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [members, setMembers] = useState<IOrganizerMember[]>([]);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    member: IOrganizerMember | null;
  }>({ open: false, member: null });

  // ── Load mock members theo eventId ──
  useEffect(() => {
    if (!event) return;
    const eventMembers = MOCK_MEMBERS_BY_EVENT[event._id] || [];
    setMembers(eventMembers.map((m) => ({ ...m })));
  }, [event]);

  // ── Filtered list: kết hợp search + roleFilter ──
  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q || m.name.toLowerCase().includes(q) || m.walletAddress.toLowerCase().includes(q);
      const matchRole = roleFilter === 'all' || m.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [members, search, roleFilter]);

  // ── Count per role cho badge ──
  const roleCounts = useMemo(() => {
    return {
      all: members.length,
      owner: members.filter((m) => m.role === 'owner').length,
      admin: members.filter((m) => m.role === 'admin').length,
      staff: members.filter((m) => m.role === 'staff').length,
    };
  }, [members]);

  if (!event) return null;

  // ── Handler thêm thành viên từ search result ──
  const handleAddMember = (user: UserSearchResult, role: 'admin' | 'staff') => {
    try {
      // Check trùng wallet (nếu có) hoặc trùng name
      if (user.walletAddress) {
        const dup = members.find(
          (m) => m.walletAddress.toLowerCase() === user.walletAddress?.toLowerCase()
        );
        if (dup) {
          toast.error('Người dùng này đã là thành viên');
          return;
        }
      }

      // TODO: call API khi backend sẵn sàng:
      //   POST ${VITE_API_URL}/api/events/${event._id}/members
      //   body: { userId: user._id, role }
      const newMember: IOrganizerMember = {
        _id: Date.now().toString(),
        userId: user._id,
        walletAddress: user.walletAddress?.toLowerCase() || '',
        name: user.displayName || user.username,
        role,
        addedAt: new Date().toISOString(),
      };
      setMembers((prev) => [...prev, newMember]);
      toast.success(`Đã thêm ${newMember.name} vào sự kiện`);
    } catch (err) {
      toast.error('Không thể thêm thành viên. Vui lòng thử lại.');
      console.error(err);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteModal.member) return;
    try {
      // TODO: call API DELETE ${VITE_API_URL}/api/events/${event._id}/members/${memberId}
      setMembers((prev) => prev.filter((m) => m._id !== deleteModal.member!._id));
      toast.success('Đã xoá thành viên');
      setDeleteModal({ open: false, member: null });
    } catch (err) {
      toast.error('Không thể xoá thành viên. Vui lòng thử lại.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-[960px] mx-auto animate-[vtx-fade_0.35s_ease]">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-lg font-bold text-white">Thành viên</h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="
            flex items-center gap-2 px-4 py-2.5
            bg-emerald-500 hover:bg-emerald-400 text-white
            text-[13px] font-semibold rounded-xl transition-all cursor-pointer
            shadow-[0_2px_12px_rgba(16,185,129,0.25)]
            justify-center sm:justify-start
          "
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Thêm thành viên
        </button>
      </div>

      {/* ── Search + Role Filter Tabs ── */}
      <div className="flex flex-col gap-3 mb-5">
        {/* Search */}
        <div className="relative">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm thành viên..."
            className="
              w-full bg-[#0d1117] border border-white/[0.08] rounded-xl
              pl-11 pr-4 py-3 text-sm text-slate-200
              placeholder:text-slate-700 outline-none
              focus:border-emerald-500/30 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.06)]
              transition-all
            "
          />
        </div>

        {/* Role filter tabs – responsive pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {ROLE_TABS.map((tab) => {
            const active = roleFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setRoleFilter(tab.key)}
                className={`
                  shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                  text-[12px] font-semibold cursor-pointer transition-all
                  ${
                    active
                      ? 'bg-emerald-500/[0.1] border border-emerald-500/30 text-emerald-400'
                      : 'bg-[#0d1117] border border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/[0.12]'
                  }
                `}
              >
                {tab.label}
                <span
                  className={`
                    text-[10px] font-mono px-1.5 rounded-full
                    ${active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.04] text-slate-600'}
                  `}
                >
                  {roleCounts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result counter */}
      <div className="flex justify-end mb-3">
        <span className="text-[12px] text-slate-500 flex items-center gap-1.5">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Hiển thị {filtered.length} / {members.length}
        </span>
      </div>

      {/* MemberList */}
      <MemberList
        members={filtered}
        onDelete={(memberId) => {
          const member = members.find((m) => m._id === memberId) || null;
          setDeleteModal({ open: true, member });
        }}
      />

      {/* AddMemberModal – search by username/email/name */}
      <AddMemberModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddMember}
      />

      {/* ConfirmDialog xoá */}
      <ConfirmDialog
        open={deleteModal.open}
        variant="danger"
        title="Xoá thành viên?"
        message={
          <>
            Bạn có chắc muốn xoá{' '}
            <span className="text-slate-300 font-medium">{deleteModal.member?.name}</span>? Hành
            động này không thể hoàn tác.
          </>
        }
        confirmLabel="Xoá"
        onClose={() => setDeleteModal({ open: false, member: null })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
