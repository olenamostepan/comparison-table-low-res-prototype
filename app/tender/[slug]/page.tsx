import { notFound } from "next/navigation"
import { getTenderConfig, tenderList } from "@/lib/tender-data"
import { TenderComparisonPage } from "@/components/tender-comparison-page"

interface TenderPageProps {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return tenderList.map((tender) => ({ slug: tender.slug }))
}

export default function TenderPage({ params }: TenderPageProps) {
  const config = getTenderConfig(params.slug)

  if (!config) {
    return notFound()
  }

  return <TenderComparisonPage config={config} />
}

