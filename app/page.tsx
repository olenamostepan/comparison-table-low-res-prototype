import Link from "next/link"
import { tenderList } from "@/lib/tender-data"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-white border-b border-[#F3F4F6]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-2">
          <p className="text-sm text-[#4D5761] font-semibold uppercase tracking-wide">CQuel Prototype Library</p>
          <h1 className="text-[32px] font-extrabold text-[#1E2832] leading-tight">
            Pick a tender scenario to explore
          </h1>
          <p className="text-base text-[#4D5761] max-w-3xl">
            Each prototype applies the new design system across different project types.
            Jump into the scenario you want to demo and tweak in Cursor.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid gap-6 md:grid-cols-2">
        {tenderList.map((tender) => (
          <Link
            key={tender.slug}
            href={`/tender/${tender.slug}`}
            className="group rounded-2xl border border-[#E4E7EC] bg-white shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#4D5761] uppercase tracking-wide">Scenario</p>
                <h2 className="text-2xl font-extrabold text-[#1E2832]">{tender.title}</h2>
              </div>
              <span className="text-sm font-bold text-[#1C75BC] group-hover:underline">View</span>
            </div>
            <p className="text-sm text-[#4D5761]">{tender.description}</p>
            <div className="flex flex-wrap items-center gap-2">
              {tender.tags.map((tag) => (
                <span
                  key={`${tender.slug}-${tag}`}
                  className="px-3 py-1 bg-[#F3F4F6] text-xs font-medium rounded-full text-[#1E2832]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-[#4D5761] flex items-center gap-2">
              <span className="font-semibold">
                {tender.overview.submitted} / {tender.overview.invited}
              </span>
              suppliers
              <span className="text-[#D3D7DC]">•</span>
              Closed {tender.overview.closedDate}
            </div>
          </Link>
        ))}
      </main>
    </div>
  )
}
