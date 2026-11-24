import Image from "next/image";

// The spot where the 3D bike is drawn. The camera reads this element's size
// and position (data-bike-anchor), so the bike always sits exactly here.
// Without 3D the static photo shows instead.
export function BikeAnchor({ className = "" }: { className?: string }) {
  return (
    <div
      data-bike-anchor
      className={`relative aspect-[4/3] w-full md:aspect-[6/5] ${className}`}
    >
      <Image
        src="/images/hero/bicycle.png"
        alt=""
        width={1570}
        height={1001}
        sizes="(min-width: 768px) 40vw, 90vw"
        className="bike-fallback absolute top-1/2 left-1/2 h-auto w-full max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
