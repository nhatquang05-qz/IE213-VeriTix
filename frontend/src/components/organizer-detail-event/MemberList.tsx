import React from 'react';
import type { IOrganizerMember } from '../../types/organizer.type';
import EmptyState from '../../components/common/EmptyState';

/* ══════════════════════════════════════════
   MemberList — Bảng danh sách thành viên
   Empty state dùng EmptyState (shared component)
   ══════════════════════════════════════════ */

const ROLE_CONFIG: Record<string, { label: string; cls: string }> = {
  owner: { label: 'Chủ sự kiện', cls: 'text-amber-400 bg-amber-500/[0.08] border-amber-500/20' },
  admin: { label: 'Quản trị viên', cls: 'text-sky-400 bg-sky-500/[0.08] border-sky-500/20' },
  staff: { label: 'Nhân viên', cls: 'text-slate-400 bg-slate-500/[0.08] border-slate-500/20' },
};

type MemberListProps = {
  members: IOrganizerMember[];
  onDelete: (memberId: string) => void;
};

const MemberList: React.FC<MemberListProps> = ({ members, onDelete }) => {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
        title="Không tìm thấy thành viên nào"
      />
    );
  }

  return (
    <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {['Tên thành viên', 'Vai trò', 'Thành viên', 'Hành động'].map((h) => (
              <th
                key={h}
                className="text-left text-[12px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const roleCfg = ROLE_CONFIG[member.role] || ROLE_CONFIG.staff;
            return (
              <tr
                key={member._id}
                className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                {/* Name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-[13px] font-medium text-emerald-400">{member.name}</span>
                  </div>
                </td>

                {/* Role */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${roleCfg.cls}`}
                  >
                    {roleCfg.label}
                  </span>
                </td>

                {/* Wallet */}
                <td className="px-5 py-4">
                  <span className="text-[12px] text-slate-500 font-mono">
                    {member.walletAddress.slice(0, 6)}...{member.walletAddress.slice(-4)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  {member.role !== 'owner' ? (
                    <button
                      onClick={() => onDelete(member._id)}
                      className="text-[12px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      Xóa
                    </button>
                  ) : (
                    <span className="text-[12px] text-slate-700">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;
