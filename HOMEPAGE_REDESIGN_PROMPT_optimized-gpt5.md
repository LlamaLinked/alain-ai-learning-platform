Redesign the ALAIN AI Learning Platform homepage into a modern, conversion-optimized landing page and return production-ready code and docs per the Output Format.

Task and Role
- Task: Produce a complete homepage redesign that elevates clarity, trust, and conversions while showcasing interactive AI learning via hands-on model experimentation.
- Role: You are a senior Next.js/Tailwind/TypeScript product engineer and UX writer pairing with a brand designer.

Conceptual Checklist
- Clear value proposition with dual CTAs and strong visual hierarchy
- Credibility: social proof, usage stats, logos, trust badges, and testimonials
- Visual storytelling: interactive features, process flow, before/after examples
- Cohesive design system: color, type, spacing, cards, responsive behavior
- Delight and clarity: animations, micro-interactions, loading and empty states
- Performance and accessibility: fast, semantic, keyboard/screen-reader friendly
- Ethical claims: avoid unverifiable numbers; use placeholders where needed

Steps the model SHOULD follow
1) Foundation
   - Convert any inline styles to Tailwind utilities; enforce a consistent spacing scale.
   - Establish a responsive layout with clear typographic hierarchy and grid.
2) Hero and Core Content
   - Author a bold, benefit-led headline and supportive subheadline.
   - Add trust indicators, usage stats, and dual CTAs (primary “Start Learning”, secondary “View Demo”).
   - Create Social Proof, Feature Showcase, How It Works, Testimonials, FAQ, and Footer.
3) Interactivity and Motion
   - Add hover, focus, and press micro-interactions; smooth entrance-on-scroll animations.
   - Provide loading, error, and empty states for model preview and demo interactions.
4) Performance and A11y
   - Lazy-load heavy/below-the-fold sections; optimize images; prefer transform-based animations.
   - Ensure semantic HTML, landmarks, ARIA, visible focus, trap-free dialogs, and reduced-motion support.
5) Polish and Validation
   - Run a self-check against the Implementation Checklist and Success Metrics.
   - Produce A/B copy variants for the hero and CTA microcopy, and a lightweight test plan.

Output Format
- Return these deliverables in the exact order:
  1) Files (code blocks; each begins with a comment containing the file path):
     - app/page.tsx: Next.js 14 App Router page composed of sections listed below
     - components/Hero.tsx: animated background, headline, subheadline, trust badges, dual CTAs
     - components/SocialProof.tsx: logos row, usage stats, trust badges
     - components/FeatureShowcase.tsx: interactive feature cards with hover animations
     - components/HowItWorks.tsx: step-by-step visualization
     - components/Testimonials.tsx: avatar testimonials with outcomes
     - components/FAQ.tsx: progressive disclosure Q&A, keyboard-accessible
     - components/Footer.tsx: links, legal, contact, socials
     - lib/metrics.ts: typed helpers for tracking CTA clicks and scroll depth (no external deps)
     - styles/util.md: brief Tailwind utility conventions used (docs)
     - Note: Use TypeScript, Tailwind v3, and optional Framer Motion. Integrate Clerk links/guards where relevant without requiring secrets.
  2) Copy Deck (JSON, not fenced) with fields:
     {
       "brand": "ALAIN AI Learning Platform",
       "hero": { "headline": "string", "subheadline": "string", "primary_cta": "string", "secondary_cta": "string", "badges": ["string"] },
       "stats": { "users": "Trusted by [USER_COUNT]+ developers", "lessons": "[LESSONS_GENERATED]+ lessons generated", "models": "[MODELS_SUPPORTED]+ models supported" },
       "features": [{ "title": "string", "benefit": "string", "microcopy": "string" }],
       "process": [{ "step": 1, "title": "string", "what_happens": "string" }],
       "before_after": { "before": "string", "after": "string" },
       "testimonials": [{ "name": "string", "role": "string", "quote": "string" }],
       "faq": [{ "q": "string", "a": "string" }],
       "footer": { "links": [{ "label": "string", "href": "string" }] }
     }
  3) A/B Variants (JSON, not fenced):
     { "hero_headlines": ["H1 A", "H1 B"], "cta_primary": ["Start Learning", "Try the Demo"], "subheadlines": ["string A", "string B"] }
  4) Implementation Checklist (Markdown checklist reflecting status for each item below; check off what you implemented)
     - Hero: compelling headline, subheadline, animated background, trust badges, dual CTAs, responsive layout
     - Social Proof: testimonials with avatars, logos, usage stats, trust badges, press mentions placeholders
     - Feature Showcase: interactive cards, process flow, model preview UI stub, hover animations, mobile layout
     - Technical: Tailwind-only styling, TypeScript types, a11y compliance, performance optimizations, SEO structure
  5) Performance & Accessibility Notes (Markdown, concise bullets)
     - Decisions, tradeoffs, Lighthouse targets, and WCAG AA considerations
  6) Test Plan (Markdown)
     - Manual QA matrix across breakpoints; reduced motion; keyboard-only; screen reader smoke test
     - A/B test approach and primary conversion events
  7) Risks & TODOs (JSON, not fenced):
     { "risks": ["string"], "mitigations": ["string"], "todos": ["string"] }

Design System Requirements
- Color palette: professional blues/teals with a distinct accent for CTAs; maintain contrast ratios meeting WCAG AA.
- Typography: clean sans-serif with clear heading scales; set comfortable line lengths; use Tailwind’s responsive text utilities.
- Spacing: follow an 8px-based scale via Tailwind (p-2, p-4, etc.); consistent card paddings and section gaps.
- Cards: rounded-2xl, soft shadows, subtle borders; meaningful hover elevation.
- Responsive: mobile-first layouts; touch targets >= 44px; fluid typography; stack sections gracefully.

Interactive Elements and Animations
- Use transform and opacity for performant motion; respect prefers-reduced-motion.
- Entrance-on-scroll for sections; micro-interactions for buttons and inputs; progress indicators for async states.
- Provide skeletons for loading and friendly, actionable error messages.

Technical Requirements
- Next.js 14 App Router, TypeScript, Tailwind v3; Clerk auth-aware CTAs (e.g., sign-in vs dashboard).
- Image optimization with next/image; WebP; responsive sizes; lazy-loading below the fold.
- Bundle hygiene: dynamic import for heavy or below-the-fold components; avoid layout thrash.
- Accessibility: semantic landmarks, ARIA where needed, visible focus, skip-to-content, no keyboard traps.

Content and Ethics
- Favor benefit-focused copy over feature lists; progressive disclosure for advanced options.
- Social proof and stats MUST be truthful. If unverifiable, use placeholders like [USER_COUNT], [LESSONS_GENERATED], [MODELS_SUPPORTED] and comment them in code.
- Avoid unlicensed third-party brand marks; provide logo placeholders and alt text.

Safety and Stop Conditions
- Stop and return TODOs if a requirement conflicts with performance or accessibility constraints.
- Do not invent real partner logos, press quotes, or numbers. Use neutral placeholders and clearly label them.
- For any destructive action (e.g., removing an existing analytics snippet), require an explicit TODO instead of executing.

Example (short)
Reasoning: We need a headline that makes the benefit explicit and reduces cognitive load while aligning with hands-on AI learning.
Conclusion: “Build AI skills by experimenting with real models — learn faster by doing.”

Delta summary
- Applies a phased plan: Foundation, Core Content, Motion, Performance/A11y, then Polish and Validation, aligned with conversion goals and technical constraints.