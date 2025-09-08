import { formattedStats } from "@/lib/brand";

export default function SocialProof() {
  const stats = formattedStats();
  return (
    <section className="reveal mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-center text-2xl font-semibold">Trusted by learners and builders</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600">We share honest stats and neutral logos only.</p>

      {/* Stats row */}
      <dl className="mx-auto mt-6 grid max-w-3xl grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs text-gray-500">Users</dt>
          <dd className="mt-1 text-base font-semibold">{stats.users}</dd>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs text-gray-500">Lessons</dt>
          <dd className="mt-1 text-base font-semibold">{stats.lessons}</dd>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <dt className="text-xs text-gray-500">Models</dt>
          <dd className="mt-1 text-base font-semibold">{stats.models}</dd>
        </div>
      </dl>

      {/* Logos marquee (Magic UI style) */}
      <div className="marquee mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="marquee__inner gap-8 pr-8">
          {[...Array(2)].flatMap((_, dup) =>
            ["LOGO", "LOGO", "LOGO", "LOGO", "LOGO", "LOGO", "LOGO", "LOGO"].map((label, i) => (
              <div
                key={`${dup}-${i}`}
                className="h-8 w-24 shrink-0 rounded-md bg-gray-100 text-center text-[10px] leading-8 text-gray-400"
                aria-label="Logo placeholder"
              >
                {label}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
