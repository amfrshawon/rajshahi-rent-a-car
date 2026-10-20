/** Inline icons. Stroke-based, inherit currentColor, no icon library shipped. */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ClockIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function SteeringIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v6M4.5 16.5 9.6 13.5M19.5 16.5 14.4 13.5" />
    </svg>
  );
}

export function TagIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z" />
      <circle cx="7.5" cy="7.5" r="1.3" />
    </svg>
  );
}

export function ShieldIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function PhoneIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function WhatsAppIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2m0 1.8a8.2 8.2 0 1 1-4.2 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8m-3 3.6c-.2 0-.5.1-.7.4-.2.3-.8.8-.8 2s.8 2.3.9 2.4c.1.2 1.6 2.6 4 3.5 1.9.8 2.3.6 2.7.6.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.3-1.4-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5.3-.5v-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4z" />
    </svg>
  );
}

export function MailIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.7 6 8.7-6" />
    </svg>
  );
}

export function AmbulanceIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17V8a1 1 0 0 1 1-1h9v10z" />
      <path d="M13 10h4l3 3.5V17h-7z" />
      <circle cx="7.5" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
      <path d="M8 10v3M6.5 11.5h3" />
    </svg>
  );
}

export function BoltIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M13 3 5 13h6l-1 8 8-10h-6z" />
    </svg>
  );
}

export function MapPinIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ChecklistIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M9 5h9M9 12h9M9 19h9" />
      <path d="m4 4.5 1.2 1.2L7 4M4 11.5l1.2 1.2L7 11M4 18.5l1.2 1.2L7 18" />
    </svg>
  );
}

export function CalendarIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function ArrowRightIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function UsersIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3 2.9-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 5.8M17.8 15.4c1.6.7 2.6 2 3 4.1" />
    </svg>
  );
}

export function GearIcon(props: { className?: string }) {
  return (
    <svg {...base} {...props}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19 12c0-.5 0-1-.1-1.4l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2.4-1.4L13.7 2h-3.4l-.4 2.6a7 7 0 0 0-2.4 1.4l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2.8l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2.4 1.4l.4 2.6h3.4l.4-2.6a7 7 0 0 0 2.4-1.4l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.4z" />
    </svg>
  );
}
