import React from 'react';

interface LogoBrandingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
  onClick?: () => void;
}

export const LogoBranding: React.FC<LogoBrandingProps> = ({
  size = 'md',
  showSlogan = true,
  className = '',
  onClick,
}) => {
  const logoSize =
    size === 'sm'
      ? 'w-9 h-9'
      : size === 'lg'
      ? 'w-14 h-14'
      : size === 'xl'
      ? 'w-20 h-20'
      : 'w-11 h-11';

  const textSize =
    size === 'sm'
      ? 'text-sm'
      : size === 'lg'
      ? 'text-xl'
      : size === 'xl'
      ? 'text-2xl'
      : 'text-base sm:text-lg';

  const sloganSize =
    size === 'sm'
      ? 'text-[9px]'
      : size === 'lg'
      ? 'text-xs'
      : size === 'xl'
      ? 'text-sm'
      : 'text-[10px] sm:text-[11px]';

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer group select-none ${className}`}
    >
      {/* Original Studio Logo */}
      <div className="shrink-0">
        <img
          src="/images of studio/123232.jpg"
          alt="NG Digital Studio Logo"
          className={`${logoSize} rounded-full object-cover border border-[#d4af37]/40 shadow-sm transition-transform duration-300 group-hover:scale-105`}
        />
      </div>

      {/* Studio Name and Tagline */}
      <div className="flex flex-col text-left">
        <span
          className={`font-cinzel tracking-[0.18em] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f7e7b4] to-[#d4af37] leading-tight ${textSize}`}
        >
          NG DIGITAL STUDIO
        </span>

        {showSlogan && (
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span
              className={`tracking-[0.1em] font-sans-clean font-medium text-[#c5a059] uppercase leading-tight ${sloganSize}`}
            >
              Add Glamour to Your Memories.
            </span>

            <span className="text-neutral-500 text-[9px] hidden sm:inline">
              •
            </span>

            <span className="text-[#d4af37] font-semibold text-[9px] tracking-wider uppercase hidden sm:inline">
              Madurai
            </span>
          </div>
        )}
      </div>
    </div>
  );
};