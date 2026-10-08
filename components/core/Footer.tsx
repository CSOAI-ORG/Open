export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="font-bold text-gray-900">Council of AI · CSOAI Ltd</div>
            <p className="mt-2 text-sm text-gray-600">
              Independent AI measurement, signed evidence, free verification and public corrections.
              Measurement, not certification.
            </p>
          </div>
          <div className="md:text-right">
            <a className="text-sm font-semibold text-emerald-700" href="https://councilof.ai/">
              Current public source
            </a>
            <div className="mt-2 text-xs text-gray-500">
              UK Companies House 16939677 · incorporated 2 January 2026
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-xs text-gray-500">
          © {year} CSOAI Ltd. Historical certification, compliance, partner, pricing or council-size copy in earlier revisions is superseded by councilof.ai.
        </div>
      </div>
    </footer>
  );
}
