export default function HomepageMaster() {
  return (
    <div className="min-h-screen bg-white px-4 py-20">
      <main className="mx-auto max-w-5xl">
        <section className="text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            CSOAI Ltd · England and Wales · Company 16939677 · incorporated 2 January 2026
          </p>
          <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-7xl">
            Council of AI
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600">
            Independent AI measurement with published tests, signed evidence, free verification and public corrections.
            We measure; we do not certify, accredit or issue legal-compliance determinations.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a href="https://councilof.ai/" className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white">
              Open the current Council of AI
            </a>
            <a href="https://councilof.ai/api/gspc" className="rounded-lg border border-emerald-600 px-6 py-3 font-semibold text-emerald-700">
              Read the living board
            </a>
          </div>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          <a href="https://councilof.ai/gspc-verify" className="rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900">Verify</h2>
            <p className="mt-2 text-sm text-gray-600">Check published signed records for free.</p>
          </a>
          <a href="https://councilof.ai/api/corrections" className="rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900">Corrections</h2>
            <p className="mt-2 text-sm text-gray-600">Our mistakes and replacements stay public and dated.</p>
          </a>
          <a href="https://councilof.ai/claim-maintenance/" className="rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900">Claim Maintenance</h2>
            <p className="mt-2 text-sm text-gray-600">Claims are re-read, re-measured and superseded when evidence changes.</p>
          </a>
        </section>

        <section className="mt-12 rounded-xl bg-gray-50 p-6">
          <h2 className="text-lg font-bold text-gray-900">Legacy-source notice</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Earlier revisions of this repository contain superseded certification, compliance, council-size, partner,
            pricing and product claims from an experimental phase. They are retained in Git history, not asserted as
            current facts. Current claims and mutable counts belong to councilof.ai and its named live endpoints.
          </p>
        </section>
      </main>
    </div>
  );
}
