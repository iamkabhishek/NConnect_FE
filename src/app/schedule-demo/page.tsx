"use client";

import { useRouter } from "next/navigation";
import { ScheduleDemo } from "@/app/components/ScheduleDemo";

export default function ScheduleDemoPage() {
  const router = useRouter();

  return (
    <ScheduleDemo
      onBack={() => router.push("/")}
      onNavigateToAboutUs={() => router.push("/company/about")}
      onNavigateToContact={() => router.push("/support/contact")}
      onNavigateToPrivacyPolicy={() => router.push("/legal/privacy-policy")}
      onNavigateToTermsOfService={() => router.push("/legal/general-terms-of-use")}
    />
  );
}
