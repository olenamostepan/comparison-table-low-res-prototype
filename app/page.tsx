import Link from "next/link"
import Image from "next/image"

const projects = [
  {
    slug: "solar",
    title: "Solar",
    description: "Project 322 — ranked by £/kWp with cluster tabs, view modes, and CQuel Intelligence.",
    href: "/supplier-comparison",
    icon: "/site elements/solar.svg",
  },
  {
    slug: "led",
    title: "LED",
    description: "Project 310 — Alexanderstraße 1/3/5, Berlin. 2,494 luminaires, ranked by €/luminaire.",
    href: "/supplier-comparison/led",
    icon: "/site elements/Avatar.svg",
  },
]

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

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2 max-w-2xl">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={project.href}
              className="group rounded-2xl border border-[#E4E7EC] bg-white shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                  <Image
                    src={project.icon}
                    alt={project.title}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#4D5761] uppercase tracking-wide mb-1">Project</p>
                  <h2 className="text-2xl font-extrabold text-[#1E2832] mb-2">{project.title}</h2>
                  <p className="text-sm text-[#4D5761]">{project.description}</p>
                </div>
              </div>
              <span className="flex h-10 px-4 items-center gap-2 rounded-lg bg-[#29B273] text-white font-bold text-sm group-hover:bg-[#239f63] transition-colors w-fit">
                View Comparison
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
