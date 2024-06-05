import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { SignupForm } from "@/components/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup",
};

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="h-full overflow-hidden flex items-center justify-center">
        <div className="md:w-1/4 w-full">
          <h1 className="my-8 text-2xl font-bold text-center">Signup</h1>
          <SignupForm />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
