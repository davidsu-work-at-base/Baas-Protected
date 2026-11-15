import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export function VipPerks() {
  const [perks, setPerks] = useState([]);

  useEffect(() => {
    base44.entities.VipPerk.list().then(setPerks);
  }, []);

  const joinVip = () => base44.auth.updateMe({ is_vip: true });

  return (
    <div>
      <Button onClick={joinVip}>Join VIP</Button>
      <ul>
        {perks.map((perk) => (
          <li key={perk.id}>{perk.title}: {perk.coupon_code}</li>
        ))}
      </ul>
    </div>
  );
}
