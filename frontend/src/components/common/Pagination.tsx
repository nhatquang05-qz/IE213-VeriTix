import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2 mt-6 flex-wrap">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-9 h-9 rounded-lg border border-white/[0.08] bg-[#0d1117] flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-white/[0.15] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <MdChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center text-[13px] font-semibold transition-all ${
            currentPage === page
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_2px_8px_rgba(16,185,129,0.3)]'
              : 'border-white/[0.08] bg-[#0d1117] text-slate-500 hover:text-slate-300 hover:border-white/[0.15]'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-9 h-9 rounded-lg border border-white/[0.08] bg-[#0d1117] flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-white/[0.15] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <MdChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
