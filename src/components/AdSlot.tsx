import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  id?: string;
  className?: string;
  slotId?: string;
  client?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({
  id = 'ad-slot',
  className = '',
  slotId = '2958911185',
  client = 'ca-pub-8213264452996217',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isPushedRef = useRef(false);

  useEffect(() => {
    // Guard against multiple pushes to the same ad slot
    if (isPushedRef.current) return;

    try {
      if (typeof window !== 'undefined' && adRef.current) {
        // Verify element has not already been processed or filled by Google AdSense
        const status = adRef.current.getAttribute('data-adsbygoogle-status');
        const hasIframe = adRef.current.querySelector('iframe');
        if (!status && !hasIframe) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isPushedRef.current = true;
        }
      }
    } catch (err) {
      // Prevent uncaught AdSense errors (e.g. adblocker, network failure) from affecting React UI
      console.debug('AdSense notice:', err);
    }
  }, []);

  return (
    <div
      id={id}
      className={`w-full max-w-4xl mx-auto overflow-hidden text-center ${className}`}
      aria-label="Sponsored"
    >
      {/* Emoji_modoo Google AdSense Responsive Container without excessive min-height */}
      <div className="w-full overflow-hidden flex justify-center items-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
