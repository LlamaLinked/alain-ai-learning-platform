export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white/60 px-6 py-8 text-sm text-gray-600">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <div className="font-semibold text-gray-800">ALAIN</div>
          <div className="text-xs text-gray-500">Applied Learning AI Notebooks</div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-3">
          <a className="hover:underline" href="/generate">Generate</a>
          <a className="hover:underline" href="/stream">Demo</a>
          <a className="hover:underline" href="/tutorials">Tutorials</a>
          <a className="hover:underline" href="#">Docs</a>
          <a className="hover:underline" href="#">Contact</a>
          <a className="hover:underline" href="#">Privacy</a>
        </nav>
      </div>
    </footer>
  );
}

