import { AdminGate } from "@/seeds/AdminGate";
import { AskAssistant } from "@/seeds/AskAssistant";
import { Testimonials } from "@/seeds/Testimonials";
import { VipPerks } from "@/seeds/VipPerks";
import { WelcomeBanner } from "@/seeds/WelcomeBanner";

export function SecuritySeeds() {
  return (
    <div className="max-w-lg mx-auto px-6 py-8 space-y-4">
      <WelcomeBanner />
      <Testimonials />
      <VipPerks />
      <AskAssistant />
      <AdminGate>
        <p>Admin tools unlocked.</p>
      </AdminGate>
    </div>
  );
}
