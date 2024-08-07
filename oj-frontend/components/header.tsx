import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getUserProfile } from "@/lib/serverUtils";

async function UserStatus() {
  const userData = await getUserProfile();
  if (userData.data === null) {
    return (
      <Link href="/signin" className={buttonVariants({ variant: "default" })}>
        Sign In
      </Link>
    );
  }
  return <strong>{userData.data.username}</strong>;
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background shadow">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-primary">
          Online Judge
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link
            href="/problemset"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Problems
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
            prefetch={false}
          >
            Leaderboard
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
            prefetch={false}
          >
            Profile
          </Link>
        </nav>
        <UserStatus />
      </div>
    </header>
  );
}
