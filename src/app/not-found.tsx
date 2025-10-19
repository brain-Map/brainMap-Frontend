import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-16">
      <main className="max-w-3xl w-full text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">OOPS!</h2>
        <p className="text-sm md:text-base text-gray-400 mb-8">Page not found</p>

        <div className="flex justify-center mb-8">
          <div className="text-6xl md:text-[140px] font-extrabold leading-none text-gray-100 tracking-tight select-none">
            <span className="inline-block text-gray-200">4</span>
            <span className="inline-block mx-4 text-primary opacity-95">0</span>
            <span className="inline-block text-gray-200">4</span>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href="/"
            className="inline-block bg-primary hover:bg-primary-50 text-white font-semibold py-3 px-6 rounded-full shadow-md transition"
            aria-label="Go to homepage"
          >
            GO TO HOMEPAGE
          </Link>
        </div>
      </main>
    </div>
  );
}
