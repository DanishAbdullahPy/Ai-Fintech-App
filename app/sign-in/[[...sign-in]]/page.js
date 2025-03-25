import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "w-full",
            headerTitle: "text-2xl font-bold text-center",
            headerSubtitle: "text-center text-muted-foreground",
            socialButtonsBlockButton:
              "w-full h-12 text-base border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            socialButtonsBlockButtonText: "flex items-center",
            socialButtonsBlockButtonIcon: "mr-2 h-5 w-5",
            dividerLine: "w-full",
            dividerText: "bg-background px-2 text-muted-foreground text-xs uppercase",
            formButtonPrimary:
              "w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white",
            footer: "text-center text-sm text-muted-foreground w-full",
            footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
          },
        }}
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        redirectUrl="/dashboard"
      />
      
    </div>
  );
}