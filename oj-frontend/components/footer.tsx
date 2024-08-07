import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-muted-foreground">&copy; 2024 Online Judge. All rights reserved.</p>
          <nav className="mt-4 space-x-4 md:mt-0">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              prefetch={false}
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              prefetch={false}
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              prefetch={false}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
