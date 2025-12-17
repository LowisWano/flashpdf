import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signup } from "@/app/login/actions"

export default function SignUpPage({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form action={signup} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
        Let&apos;s get started. Fill in the details below to create your account.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="John Doe" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="johndoe@gmail.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" name="password" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="confirm password">Confirm Password</Label>
          </div>
          <Input id="confirm password" type="password" required />
        </div>
        <Button type="submit" className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA] px-8 py-3 w-full">
          Sign in
        </Button>
      </div>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        </div>
      <div className="text-center text-sm">
       Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 text-cyan-500">
          Login
        </Link>
      </div>
    </form>
  )
}
