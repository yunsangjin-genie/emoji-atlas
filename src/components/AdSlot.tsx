import React from 'react';

interface AdSlotProps {
  id?: string;
  className?: string;
  slotId?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ id = 'ad-slot', className = '', slotId = '1234567890' }) => {
  return (
    <div
      id={id}
      className={`w-full max-w-4xl mx-auto my-8 p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-900/40 text-center ${className}`}
      aria-label="Advertisement"
    >
      <div className="text-[11px] font-semibold tracking-wider text-neutral-600 dark:text-neutral-400 uppercase mb-2 select-none">
        ADVERTISEMENT
      </div>
      {/* Standard Google AdSense Responsive Container */}
      <div className="min-h-[90px] flex flex-col items-center justify-center text-xs text-neutral-600 dark:text-neutral-400">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <span className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">
          Google AdSense Area (ca-pub-XXXXXXXXXXXXXXXX)
        </span>
      </div>
    </div>
  );
};
