import { Link } from "react-router";

// collapsible menu, labels match routes
const groups = [
  {
    title: "Explore",
    links: [
      { label: "All hikes", to: "/allhikes" },
      { label: "Reviews", to: "/reviews" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Paintings and artists", to: "/allhikes?filter=artist" },
      { label: "Near me", to: "/allhikes?filter=near-me" },
    ],
  },
  {
    title: "Support",
    links: [{ label: "Donate", to: "/donate" }],
  },
  {
    title: "About",
    links: [{ label: "About LYSTT", to: "/" }],
  },
];

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: <path d="M14 8h2V4h-3a4 4 0 0 0-4 4v2H7v4h2v7h4v-7h2.5l.5-4h-3V8.5a.5.5 0 0 1 .5-.5z" />,
  },
  {
    label: "X",
    href: "#",
    icon: <path d="M4 4l16 16M20 4L4 20" />,
  },
  {
    label: "TikTok",
    href: "#",
    icon: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.6 2 4.2 5 4.4" />,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#f3eee8] text-ink">
      <nav aria-label="Footer" className="w-full">
        {groups.map((group) => (
          <details key={group.title} className="group border-b border-ink">
            <summary className="flex cursor-pointer list-none items-center justify-center gap-3 px-6 py-4 text-details font-bold uppercase tracking-wide marker:hidden focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#879fd0] [&::-webkit-details-marker]:hidden">
              {group.title}
              <svg
                viewBox="0 0 24 24"
                className="size-4 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <ul className="flex flex-col items-center gap-2 pb-4 text-details">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-3 px-6 pb-8 pt-8 text-center">
        <p className="text-[0.7rem] font-bold">Follow the Journey</p>
        <ul className="flex gap-3">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                className="grid size-8 place-items-center rounded-lg bg-ink text-background transition hover:brightness-125 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {s.icon}
                </svg>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-1 text-details text-mist">
          © {new Date().getFullYear()} LYSTTi · Privacy Policy · Terms &amp; Conditions · Cookies
        </p>
      </div>
    </footer>
  );
}
