function Footer() {
  return (
    <footer className="mt-20 border-t border-line dark:border-line-dark">
      <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
        <div className="flex flex-wrap justify-center gap-6 font-label text-xs uppercase tracking-wide">
          <a
            href="https://github.com/moningi-nidhi25/ReviewSense-AI"
            className="text-ink-soft transition hover:text-forest dark:text-ink-soft-dark dark:hover:text-forest-dark"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-ink-soft transition hover:text-forest dark:text-ink-soft-dark dark:hover:text-forest-dark"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="text-ink-soft transition hover:text-forest dark:text-ink-soft-dark dark:hover:text-forest-dark"
          >
            Contact
          </a>
        </div>

        <p className="font-label text-[11px] text-ink-soft/70 dark:text-ink-soft-dark/70">
          © 2026 ReviewSense AI — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
