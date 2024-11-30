import React from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  faqs: FAQItem[];
  className?: string;
}

export const FAQ: React.FC<FAQProps> = ({ 
  title = "Frequently Asked Questions",
  faqs,
  className = "px-4 py-16 bg-gray-50"
}) => {
  return (
    <section className={className}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          {title}
        </h2>
        <div 
          className="space-y-6"
          itemScope 
          itemType="https://schema.org/FAQPage"
        >
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              itemScope 
              itemProp="mainEntity" 
              itemType="https://schema.org/Question"
            >
              <h3 
                className="text-xl font-semibold mb-2"
                itemProp="name"
              >
                {faq.question}
              </h3>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p 
                  className="text-gray-600"
                  itemProp="text"
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Add display name for better debugging
FAQ.displayName = 'FAQ';
