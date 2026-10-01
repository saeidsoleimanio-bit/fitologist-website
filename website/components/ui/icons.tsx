import { MessageCircle } from "lucide-react";

type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return <MessageCircle aria-hidden className={className} strokeWidth={1.75} />;
}

/** Instagram glyph (camera outline) — currentColor, so it can take the orange accent. */
export function InstagramGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="17.6" cy="6.4" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const WHATSAPP_GREEN = "#25D366";

/** WhatsApp glyph: speech bubble with tail + handset. Brand green by default. */
export function WhatsAppGlyph({
  className,
  color = WHATSAPP_GREEN,
  handset = "#fff",
}: IconProps & { color?: string; handset?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill={color}
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Z"
      />
      <path
        fill={handset}
        d="M16.88 14.37c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.61-1.47-.83-2.01-.22-.53-.45-.46-.61-.46h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.63 1.11 2.81c.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.55.57.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.83-1.29.22-.63.22-1.18.16-1.29-.07-.11-.25-.18-.52-.31Z"
      />
    </svg>
  );
}

/** Instagram app icon in its official gradient (yellow → orange → magenta → purple). */
export function InstagramBrandIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <defs>
        <radialGradient id="ig-brand-grad" cx="0.28" cy="1.02" r="1.25">
          <stop offset="0" stopColor="#FFD600" />
          <stop offset="0.24" stopColor="#FF7A00" />
          <stop offset="0.5" stopColor="#FF0069" />
          <stop offset="0.72" stopColor="#D300C5" />
          <stop offset="1" stopColor="#7638FA" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6.2" fill="url(#ig-brand-grad)" />
      <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="4.1" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.25" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16.25" cy="7.75" r="1.05" fill="#fff" />
    </svg>
  );
}
