import React from 'react';
import { MdPeopleOutline, MdDelete } from 'react-icons/md';
import type { IOrganizerMember } from '../../types/organizer.type';
import EmptyState from '../../components/common/EmptyState';

/* ══════════════════════════════════════════
   MemberList — Responsive
   - Desktop (≥md): giữ bảng 4 cột như cũ
   - Mobile (<md): card stack
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
      <EmptyState icon={<MdPeopleOutline size={28} />} title="Không tìm thấy thành viên nào" />
    );
  }

  return (
    <>
      {/* ══ Desktop: Table ══ */}
      <div className="hidden md:block bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Tên thành viên', 'Vai trò', 'Ví', 'Hành động'].map((h) => (
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
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[13px] font-medium text-emerald-400">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${roleCfg.cls}`}
                    >
                      {roleCfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[12px] text-slate-500 font-mono">
                      {member.walletAddress.slice(0, 6)}...{member.walletAddress.slice(-4)}
                    </span>
                  </td>
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

      {/* ══ Mobile: Card stack ══ */}
      <div className="md:hidden flex flex-col gap-2.5">
        {members.map((member) => {
          const roleCfg = ROLE_CONFIG[member.role] || ROLE_CONFIG.staff;
          return (
            <div
              key={member._id}
              className="bg-[#0d1117] border border-white/[0.06] rounded-xl p-4"
            >
              {/* Row 1: name + role pill */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-[13.5px] font-semibold text-emerald-400 truncate">
                    {member.name}
                  </span>
                </div>
                <span
                  className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${roleCfg.cls}`}
                >
                  {roleCfg.label}
                </span>
              </div>

              {/* Row 2: wallet + delete */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11.5px] text-slate-500 font-mono truncate">
                  {member.walletAddress.slice(0, 6)}...{member.walletAddress.slice(-4)}
                </span>
                {member.role !== 'owner' ? (
                  <button
                    onClick={() => onDelete(member._id)}
                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] transition-colors cursor-pointer"
                  >
                    <MdDelete size={13} />
                    Xóa
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-700">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MemberList;
