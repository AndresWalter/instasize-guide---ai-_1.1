import React from 'react';

interface MobileFrameProps {
    type: 'iphone' | 'android';
    children: React.ReactNode;
    className?: string;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ type, children, className = '' }) => {
    const isIphone = type === 'iphone';

    return (
        <div className={`relative mx-auto bg-black border-[8px] border-slate-900 shadow-xl overflow-hidden ${isIphone ? 'rounded-[40px]' : 'rounded-[20px]'} ${className}`}
            style={{ aspectRatio: '9/19.5', maxWidth: '300px' }}>

            {/* Status Bar Fake */}
            <div className="absolute top-0 left-0 right-0 h-8 z-20 flex justify-between px-6 text-[10px] text-white font-medium pt-2 select-none pointer-events-none">
                <span>9:41</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 bg-current rounded-full opacity-20"></div>
                    <div className="w-3 h-3 bg-current rounded-full opacity-20"></div>
                    <div className="w-4 h-3 border border-white rounded-[2px]"></div>
                </div>
            </div>

            {/* Notch / Punch Hole */}
            {isIphone ? (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>
            ) : (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-20"></div>
            )}

            {/* Screen Content */}
            <div className="w-full h-full bg-slate-900 relative z-10 overflow-hidden">
                {children}
            </div>

            {/* Home Indicator (iPhone) */}
            {isIphone && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-20 pointer-events-none"></div>
            )}
        </div>
    );
};

export default MobileFrame;
