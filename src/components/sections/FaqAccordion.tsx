'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

// PLACEHOLDER: replace these answers with real, final copy.
const faqs = [
  {
    question: 'Is my gift tax-deductible?',
    answer:
      'This depends on your country and our registration status there. We’ll confirm exact tax-deductibility details for each region here.',
  },
  {
    question: 'Can I change or cancel recurring giving?',
    answer:
      'Yes — once online payments are live, you’ll be able to update or cancel a recurring gift at any time from your giving account or by contacting us directly.',
  },
  {
    question: 'How do I get a giving statement?',
    answer:
      'Giving statements will be available on request and issued automatically at year-end once online giving is active.',
  },
  {
    question: 'Is online giving secure?',
    answer:
      'Yes. All transactions are encrypted and processed through a secure, trusted payment gateway — we never store your card details.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-2xl divide-y divide-ink/10 border border-ink/10">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-display text-h4 font-semibold text-ink">{faq.question}</span>
              <span
                aria-hidden
                className={cn(
                  'flex-shrink-0 text-xl text-gold transition-transform duration-200',
                  isOpen && 'rotate-45'
                )}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-5">
                <p className="text-sm text-ink/70">{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
