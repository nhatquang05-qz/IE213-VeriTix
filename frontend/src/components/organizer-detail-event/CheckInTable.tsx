import React from 'react';

/* ══════════════════════════════════════════
   CheckInTable — Responsive
   - Desktop (≥md): bảng 4 cột như cũ
   - Mobile (<md): cards stack với progress bar
   ══════════════════════════════════════════ */

type CheckInTableRow = {
  ticketType: string;
  price: number;
  checkedIn: number;
  totalSold: number;
};

type CheckInTableProps = {
  rows: CheckInTableRow[];
};

const CheckInTable: React.FC<CheckInTableProps> = ({ rows }) => {
  if (rows.length === 0) {
    return (
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl py-10 text-center">
        <p className="text-[13px] text-slate-600">Chưa có dữ liệu check-in</p>
      </div>
    );
  }

  return (
    <>
      {/* ══ Desktop: Table ══ */}
      <div className="hidden md:block bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Loại vé', 'Giá bán', 'Đã check-in', 'Tỉ lệ check-in'].map((h) => (
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
            {rows.map((row) => {
              const percent =
                row.totalSold > 0 ? Math.round((row.checkedIn / row.totalSold) * 100) : 0;
              return (
                <tr
                  key={row.ticketType}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4 text-[13px] text-slate-200 font-medium">
                    {row.ticketType}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">
                    Ξ {row.price.toFixed(4)}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">
                    {row.checkedIn} / {row.totalSold}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-amber-400 font-mono w-10 text-right">
                        {percent}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ══ Mobile: Cards ══ */}
      <div className="md:hidden flex flex-col gap-2.5">
        {rows.map((row) => {
          const percent = row.totalSold > 0 ? Math.round((row.checkedIn / row.totalSold) * 100) : 0;
          return (
            <div
              key={row.ticketType}
              className="bg-[#0d1117] border border-white/[0.06] rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-200 truncate">
                    {row.ticketType}
                  </p>
                  <p className="text-[11.5px] text-slate-500 font-mono mt-0.5">
                    Ξ {row.price.toFixed(4)}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-slate-400 font-mono">
                  {row.checkedIn}/{row.totalSold}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-amber-400 font-mono w-10 text-right">
                  {percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CheckInTable;
