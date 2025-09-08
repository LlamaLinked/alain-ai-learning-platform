type T = { name: string; role: string; quote: string };

const testimonials: T[] = [
  { name: "A. Patel", role: "ML Engineer", quote: "ALAIN helped my team onboard to new LLMs in days, not weeks." },
  { name: "K. Nguyen", role: "Student", quote: "The hands-on lessons demystified model behavior for my coursework." },
  { name: "R. Silva", role: "Data Scientist", quote: "I loved generating tutorials directly from the models we use." },
];

export default function Testimonials() {
  return (
    <section className="reveal mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-center text-2xl font-semibold">What people say</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <blockquote className="text-sm text-gray-700">“{t.quote}”</blockquote>
            <figcaption className="mt-3 flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

