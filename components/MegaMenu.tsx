'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface MegaMenuSection {
  title: string;
  items: Array<{ href: string; label: string; description?: string; icon?: ReactNode }>;
}

interface MegaMenuProps {
  sections: MegaMenuSection[];
  open: boolean;
}

export default function MegaMenu({ sections, open }: MegaMenuProps) {
  if (!open) return null;

  return (
    <div className="absolute top-full left-0 w-[720px] max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-2xl p-4 grid grid-cols-2 gap-4 animate-slide-down">
      {sections.map(section => (
        <div key={section.title} className="">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {section.title}
          </div>
          <ul className="space-y-1">
            {section.items.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-start gap-2 rounded-lg px-2 py-2 hover:bg-gray-50 transition"
                >
                  {item.icon ? <span className="mt-0.5 text-gray-600">{item.icon}</span> : <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-gray-400" />}
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-gray-600">{item.description}</div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}


