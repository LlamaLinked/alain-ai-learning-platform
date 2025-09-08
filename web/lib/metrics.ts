/*
  Lightweight metrics helpers without external deps.
  - trackCtaClick: send CTA click events (replace console with your analytics)
  - initScrollDepth: emit 25/50/75/100% scroll milestones once per page

  NOTE: Replace console.log with your analytics provider. Keep placeholders honest.
*/

export type CtaClick = { label: string; context?: string };

export function trackCtaClick(evt: CtaClick) {
  try {
    // Example: window.dataLayer?.push({ event: 'cta_click', ...evt })
    console.log("metrics:cta_click", evt);
  } catch {}
}

type DepthBucket = 25 | 50 | 75 | 100;

export function initScrollDepth(onDepth?: (d: DepthBucket) => void) {
  if (typeof window === "undefined") return;
  const fired = new Set<DepthBucket>();
  const handler = () => {
    const scrollTop = window.scrollY;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    const winHeight = window.innerHeight;
    const percent = Math.min(100, Math.round(((scrollTop + winHeight) / docHeight) * 100));
    const buckets: DepthBucket[] = [25, 50, 75, 100];
    for (const b of buckets) {
      if (percent >= b && !fired.has(b)) {
        fired.add(b);
        try {
          console.log("metrics:scroll_depth", b);
          onDepth?.(b);
        } catch {}
      }
    }
    if (fired.size === 4) window.removeEventListener("scroll", handler);
  };
  window.addEventListener("scroll", handler, { passive: true });
  handler();
}

export function initRevealOnScroll() {
  if (typeof window === "undefined") return;
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!("IntersectionObserver" in window) || els.length === 0) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("reveal-visible");
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
  els.forEach((el) => io.observe(el));
}

