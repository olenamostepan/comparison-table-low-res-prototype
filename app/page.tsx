import Link from "next/link"
import Image from "next/image"
import { tenderList } from "@/lib/tender-data"

const getIconPath = (slug: string) => {
  const iconMap: Record<string, string> = {
    "led": "/site elements/LED.svg",
    "solar-pv": "/site elements/solar.svg",
    "hvac": "/site elements/heat pumps.svg",
  }
  return iconMap[slug] || "/site elements/Avatar.svg"
}

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
            Explore interactive prototypes for different tender scenarios. Click on any scenario below to test the comparison interface and see how suppliers are evaluated across various project types.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid gap-6 md:grid-cols-2">
        {tenderList.map((tender) => (
          <div
            key={tender.slug}
            className="group rounded-2xl border border-[#E4E7EC] bg-white shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col gap-4 h-full"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                <Image
                  src={getIconPath(tender.slug)}
                  alt={tender.title}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#4D5761] uppercase tracking-wide mb-1">Scenario</p>
                <h2 className="text-2xl font-extrabold text-[#1E2832] mb-2">{tender.title}</h2>
                <p className="text-sm text-[#4D5761]">{tender.description}</p>
          </div>
            </div>
            <Link
              href={`/tender/${tender.slug}`}
              className="flex h-10 px-4 flex-col justify-center items-center gap-2 rounded-lg bg-[#29B273] text-white hover:bg-[#239f63] transition-colors mt-auto"
              style={{ boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.02)', fontSize: '14px', fontWeight: 700, lineHeight: 'normal' }}
            >
              View Scenario
            </Link>
          </div>
        ))}
      </main>
    </div>
  )
}
