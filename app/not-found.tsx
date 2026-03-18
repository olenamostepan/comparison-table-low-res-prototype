import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-2xl font-bold text-[#1E2832]">Page not found</h1>
      <p className="text-[#4D5761]">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[#29B273] px-4 py-2 font-semibold text-white hover:bg-[#239f63] transition-colors"
      >
        Go to home
      </Link>
    </div>
  )
}
