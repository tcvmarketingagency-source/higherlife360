'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

// PLACEHOLDER: replace these answers with real, final copy — especially the
// tax-deductibility answer, which genuinely varies by country/region and
// needs to be confirmed against HigherLife360's actual registration status
// in each nation before this goes live.
const faqs = [
  {
    question: 'Is my gift tax-deductible?',
    answer:
      'This depends on your country and our registration status there. Tax treatment for religious giving varies widely by nation, so we’ll confirm the exact deductibility details for each region here once that’s finalized — please don’t rely on this page for tax advice until then.',
  },
  {
    question: 'Can I change or cancel recurring giving?',
    answer:
      'Yes, always — recurring giving should never feel locked in. Once online payments are live, you’ll be able to update the amount, pause, or cancel a recurring gift at any time from your giving account, or simply by reaching out to us directly. No questions asked.',
  },
  {
    question: 'How do I get a giving statement?',
    answer:
      'Giving statements will be available on request, and issued automatically at year-end once online giving is active — useful for your own records or, where applicable, for tax purposes. If you ever need one sooner, just ask.',
  },
  {
    question: 'Is online giving secure?',
    answer:
      'Yes. Every transaction is encrypted end-to-end and processed through a secure, trusted, PCI-compliant payment gateway. We never see or store your full card details on our own servers — your financial information stays with the payment processor, not us.',
  },
  {
    question: 'How much of my gift actually goes to the mission?',
    answer:
      'We are committed to full transparency in how every gift is used — funding branches, local outreach, global missions, and the weekly ministry that reaches thousands of people. Standard payment-processing fees are the only deduction from any online gift; everything else is stewarded directly toward the mission.',
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
