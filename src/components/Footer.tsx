import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} CP Tracker. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link href="https://github.com/your-repo" className="text-sm text-muted-foreground hover:text-primary">
              GitHub
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

