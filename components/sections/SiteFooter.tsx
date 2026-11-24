import Link from "next/link";

// TODO(content): real addresses, phone, email and social links from the client.
const COLUMNS = [
  {
    title: "Bikes",
    links: [
      { href: "/bikes", label: "All bikes" },
      { href: "/accessories", label: "Accessories" },
      { href: "/test-ride", label: "Book a test ride" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/stores", label: "Find a store" },
      { href: "/service", label: "Service" },
      { href: "/warranty", label: "Warranty" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Lumira" },
      { href: "/contact", label: "Contact" },
      { href: "/careers", label: "Careers" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer id="service" className="relative z-10 bg-night text-ocean-mist">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-3xl font-bold tracking-tight text-white">
            lumira
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6">
            Electric city bikes, made in India.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-xs font-semibold tracking-widest text-white uppercase">
              {column.title}
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs sm:px-8">
          © Lumira. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
