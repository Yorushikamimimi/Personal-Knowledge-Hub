"use client";

import { useEffect, useState } from "react";

type SectionTocProps = {
  items: Array<{ id: string; label: string }>;
};

// Sticky section list that marks the section currently in view.
export function SectionToc({ items }: SectionTocProps) {
  const [current, setCurrent] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrent(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="c2-toc" aria-label="本页目录">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={current === item.id ? "true" : undefined}
          onClick={() => setTimeout(() => setCurrent(item.id), 600)}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
