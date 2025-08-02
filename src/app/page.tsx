/**
 * Main landing page of the app.
 * Includes header, hero section, footer, and a cookie consent popup.
 * Provides a welcoming introduction to the wellness session platform.
 */
import { CookiesPopup } from "@/components/cookies-popup"
import { Header } from "@/components/section/header"
import { Hero } from "@/components/section/hero"
import { Footer } from "@/components/section/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-6">
        <Hero />
      </main>
      <Footer />
      <CookiesPopup />
    </div>
  )
}
