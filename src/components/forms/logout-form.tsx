import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function LogoutForm() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
            })

            if (response.ok) {
                toast.success("Logged out successfully")
                router.push("/")
            } else {
                throw new Error("Logout failed")
            }
        } catch (error) {
            console.error(error)
            toast.error("An error occurred while logging out")
        }
    }

    return (
        <Button variant="ghost" className="cursor-pointer" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
        </Button>
    )
}

 