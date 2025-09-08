Tailwind utility conventions for ALAIN homepage

- Color: professional blues/teals
  - Primary: `bg-blue-600` hover `bg-blue-700`
  - Accent: `bg-teal-500/20` backgrounds for decorative blobs
  - Text: gray scale with at least AA contrast for body and buttons

- Typography
  - Headings use responsive scales, e.g., `text-4xl md:text-6xl`
  - Body copy: `text-sm md:text-base` or `text-base md:text-lg`
  - `text-pretty`/`text-balance` to improve rag and line breaking

- Spacing & Layout
  - 8px-based scale: `p-4`, `py-12`, `gap-4`, etc.
  - Cards: `rounded-2xl border border-gray-200 bg-white shadow-sm`
  - Sections: `mx-auto max-w-6xl px-6 py-12`

- Interactions & Motion
  - Buttons: `focus-ring` class for visible focus
  - Hover elevation: `transition hover:shadow-md` on cards
  - Entrance on scroll: `.reveal` + JS adds `.reveal-visible`
  - Respect reduced motion via `prefers-reduced-motion`

- Accessibility
  - Semantic landmarks: header, main, footer
  - “Skip to content” link present in layout
  - Use `details/summary` for FAQ for built-in keyboard a11y

- Performance
  - Lazy-load below-the-fold sections via `next/dynamic`
  - Avoid layout thrash: use transform/opacity for animations
  - No external animation deps; swap console with real analytics when ready

