import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    base44.entities.Testimonial.list().then(setTestimonials);
  }, []);

  return (
    <ul className="space-y-2">
      {testimonials.map((testimonial) => (
        <li key={testimonial.id}>
          “{testimonial.quote}” — {testimonial.author_name}
        </li>
      ))}
    </ul>
  );
}
