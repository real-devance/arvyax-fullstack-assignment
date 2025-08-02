import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
    return (
        <section className="text-center max-w-4xl mx-auto">
                <div className="mb-8">
                    <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-violet-100 text-blue-800 border-blue-200 hover:bg-gradient-to-r hover:from-blue-200 hover:to-violet-200">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Transform Your Wellness Journey 
                    </Badge>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                    <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                        Wellness Session
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Create, discover, and share transformative wellness sessions. Join a community of practitioners and
                    enthusiasts dedicated to mental health and mindful living.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <Link href="/register">
                        <Button
                            size="lg"
                            className="px-8 py-4 cursor-pointer text-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                        >
                            Start Creating
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-8 py-4 cursor-pointer text-lg border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 bg-transparent"
                        >
                            Explore Sessions
                        </Button>
                    </Link>
                </div>

            
        </section>
    )
}

