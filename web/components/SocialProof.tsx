import { formattedStats } from "@/lib/brand";

export default function SocialProof() {
  const stats = formattedStats();
  return (
    <section className="reveal mx-auto max-w-6xl px-6 py-12">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Trusted by learners and builders</h2>
          <p className="mt-2 text-sm text-gray-600">We share honest stats and neutral logos only.</p>
          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
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
        </div>
        <div className="grid grid-cols-3 items-center justify-items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Neutral logo placeholders */}
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 rounded-md bg-gray-100 text-center text-[10px] leading-8 text-gray-400"
              aria-label="Logo placeholder"
            >
              LOGO
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
