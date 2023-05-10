import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from "@clerk/nextjs";

export const ClerkUserButton = () => {
  return (
    <div className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10">
      <SignedIn>
        <UserButton 
          showName 
          appearance={{
            elements: {
              userButtonOuterIdentifier: 'text-white',
              userButtonBox: 'flex flex-row-reverse'
            }
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
};