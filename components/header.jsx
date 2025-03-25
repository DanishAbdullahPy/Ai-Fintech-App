
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

const Header = async () => {
  await checkUser(); 

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
    <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
      <Link href="/">
        <Image
          src={"/logo.png"}
          alt="Welth Logo"
          width={200}
          height={60}
          className="h-12 w-auto object-contain"
        />
      </Link>
  
      {/* Navigation Links - Different for signed in/out users */}
      <div className="hidden md:flex items-center space-x-8">
        <SignedOut>
          {/* Commented out since we haven't created these sections yet */}
          {/* <a href="#features" className="text-gray-600 hover:text-blue-600">
            Features
          </a>
          <a href="#testimonials" className="text-gray-600 hover:text-blue-600">
            Testimonials
          </a> */}
        </SignedOut>
      </div>
  
      {/* Action Buttons */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <SignedIn>
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-blue-600 flex items-center gap-1 md:gap-2"
          >
            <Button variant="outline" className="text-sm px-2 py-1 md:px-4 md:py-2">
              {/* <LayoutDashboard size={18} /> */}
              <span className="text-xs md:text-base md:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href="/transaction/create">
            <Button className="flex items-center gap-1 md:gap-2 text-sm px-2 py-1 md:px-4 md:py-2">
              <PenBox size={14} className="md:size-18" />
              <span className="text-xs md:text-base md:inline">Add Transaction</span>
            </Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant="outline" className="text-sm px-2 py-1 md:px-4 md:py-2">
              Login
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 md:w-10 md:h-10",
              },
            }}
          />
        </SignedIn>
      </div>
    </nav>
  </header>
  );
};

export default Header;