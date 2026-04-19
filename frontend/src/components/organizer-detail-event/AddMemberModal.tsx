import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';

/* ══════════════════════════════════════════
   AddMemberModal — Popup thêm thành viên
   
   Thay đổi:
   - ✅ Swap SVG icons → react-icons
   - ✅ Responsive padding (px-4 sm:px-6)
   - ✅ Footer buttons stack trên mobile
   - Logic search / debounce / abort: giữ nguyên
   ══════════════════════════════════════════ */

const API_URL = import.meta.env.VITE_API_URL || '';

interface UserSearchResult {
  _id: string;
  username: string;
  displayName?: string;
  email?: string;
  walletAddress?: string;
  avatar?: string;
}

type AddMemberModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (user: UserSearchResult, role: 'admin' | 'staff') => void;
};

const AddMemberModal: React.FC<AddMemberModalProps> = ({ open, onClose, onAdd }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [selected, setSelected] = useState<UserSearchResult | null>(null);
  const [role, setRole] = useState<'admin' | 'staff'>('staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setSelected(null);
      setRole('staff');
      setLoading(false);
      setError(null);
    }
  }, [open]);

  const mockUsers: UserSearchResult[] = useMemo(
    () => [
      {
        _id: 'u1',
        username: 'nguyenvana',
        displayName: 'Nguyễn Văn A',
        email: 'vana@example.com',
        walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      },
      {
        _id: 'u2',
        username: 'tranthib',
        displayName: 'Trần Thị B',
        email: 'thib@example.com',
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      },
      {
        _id: 'u3',
        username: 'lehoangc',
        displayName: 'Lê Hoàng C',
        email: 'hoangc@example.com',
        walletAddress: '0xdeadbeef1234567890abcdef1234567890abcdef',
      },
    ],
    []
  );

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        if (!API_URL) {
          const filtered = mockUsers.filter(
            (u) =>
              u.username.toLowerCase().includes(q.toLowerCase()) ||
              u.displayName?.toLowerCase().includes(q.toLowerCase()) ||
              u.email?.toLowerCase().includes(q.toLowerCase())
          );
          setResults(filtered);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(q)}&limit=8`, {
          headers,
          signal: ctrl.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list: UserSearchResult[] = Array.isArray(data) ? data : data?.data || [];
        setResults(list);
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === 'AbortError') return;
        setError('Không tìm được người dùng. Vui lòng thử lại.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open, mockUsers]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!selected) return;
    onAdd(selected, role);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4">
        <div
          className="
            bg-[#111827] border border-white/[0.08] rounded-2xl
            w-full max-w-md shadow-[0_24px_64px_rgba(0,0,0,0.5)]
            animate-[vtx-fade_0.2s_ease]
            max-h-[90vh] flex flex-col
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06] shrink-0">
            <h3 className="text-[15px] font-bold text-white">Thêm thành viên</h3>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer p-1 -m-1"
              aria-label="Đóng"
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 sm:px-6 py-5 flex flex-col gap-4 overflow-y-auto">
            <div>
              <label className="text-[13px] font-medium text-slate-400 mb-2 block">
                Tìm người dùng
              </label>

              {!selected && (
                <>
                  <div className="relative">
                    <MdSearch
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Nhập username, email hoặc tên..."
                      autoFocus
                      className="
                        w-full bg-[#080b14] border border-white/[0.1] rounded-xl
                        pl-10 pr-10 py-3 text-sm text-slate-100
                        placeholder:text-slate-700 outline-none
                        focus:border-emerald-500/40 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]
                        transition-all
                      "
                    />
                    {loading && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    )}
                  </div>

                  {/* Results */}
                  {query.trim() && !loading && (
                    <div className="mt-2 bg-[#080b14] border border-white/[0.06] rounded-xl max-h-56 overflow-y-auto">
                      {error ? (
                        <p className="px-4 py-3 text-[12px] text-rose-400">{error}</p>
                      ) : results.length === 0 ? (
                        <p className="px-4 py-3 text-[12px] text-slate-600">
                          Không tìm thấy người dùng phù hợp
                        </p>
                      ) : (
                        results.map((u) => (
                          <button
                            key={u._id}
                            type="button"
                            onClick={() => setSelected(u)}
                            className="
                              w-full text-left px-4 py-2.5 flex items-center gap-3
                              hover:bg-white/[0.03] border-b border-white/[0.04]
                              last:border-b-0 transition-colors cursor-pointer
                            "
                          >
                            <div className="w-8 h-8 rounded-full bg-emerald-500/[0.1] border border-emerald-500/20 flex items-center justify-center shrink-0">
                              <span className="text-[12px] font-bold text-emerald-400">
                                {(u.displayName || u.username).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-medium text-slate-200 truncate">
                                {u.displayName || u.username}
                              </p>
                              <p className="text-[11px] text-slate-600 truncate font-mono">
                                @{u.username}
                                {u.email && ` • ${u.email}`}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Selected user card */}
              {selected && (
                <div
                  className="
                    bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl
                    px-3.5 sm:px-4 py-3 flex items-center gap-3
                  "
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/[0.15] border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <span className="text-[14px] font-bold text-emerald-400">
                      {(selected.displayName || selected.username).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-slate-100 truncate">
                      {selected.displayName || selected.username}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate font-mono">
                      @{selected.username}
                      {selected.walletAddress &&
                        ` • ${selected.walletAddress.slice(0, 6)}...${selected.walletAddress.slice(-4)}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer p-1 shrink-0"
                    title="Chọn lại"
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="text-[13px] font-medium text-slate-400 mb-2 block">Vai trò</label>
              <div className="flex gap-2">
                {(['admin', 'staff'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`
                      flex-1 px-3 sm:px-4 py-2.5 rounded-xl text-[12.5px] sm:text-[13px] font-medium
                      border cursor-pointer transition-all
                      ${
                        role === r
                          ? 'bg-emerald-500/[0.1] border-emerald-500/30 text-emerald-400'
                          : 'bg-transparent border-white/[0.08] text-slate-500 hover:border-white/[0.15] hover:text-slate-300'
                      }
                    `}
                  >
                    {r === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer: stack mobile, row desktop */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2.5 sm:gap-3 px-5 sm:px-6 py-4 border-t border-white/[0.06] shrink-0">
            <button
              onClick={onClose}
              className="
                px-4 py-2.5 rounded-xl text-[13px] font-medium
                text-slate-400 border border-white/[0.08]
                hover:bg-white/[0.04] transition-colors cursor-pointer
              "
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selected}
              className="
                px-5 py-2.5 rounded-xl text-[13px] font-semibold
                bg-emerald-500 text-white
                hover:bg-emerald-400 transition-all cursor-pointer
                shadow-[0_2px_12px_rgba(16,185,129,0.25)]
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Thêm thành viên
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMemberModal;

export type { UserSearchResult };
