import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const commonFAQs = {
  'water-damage': [
    {
      question: "How quickly can you respond to water damage?",
      answer: "We provide 24/7 emergency response with arrival times between 15-30 minutes in Brisbane CBD and surrounding areas. Our rapid response helps minimize damage and prevent secondary issues like mould growth."
    },
    {
      question: "What should I do while waiting for your arrival?",
      answer: "If safe, turn off the water source, remove valuable items from wet areas, and start removing excess water. However, don't enter areas with electrical hazards or contaminated water."
    },
    {
      question: "Does insurance cover water damage restoration?",
      answer: "Most insurance policies cover sudden water damage. We work directly with insurance companies and can help guide you through the claims process."
    },
    {
      question: "How long does water damage restoration take?",
      answer: "The timeline varies depending on damage severity, but typically ranges from 3-5 days for drying and initial restoration. We use advanced moisture monitoring to ensure thorough drying."
    }
  ],
  'fire-damage': [
    {
      question: "Can you remove smoke odour completely?",
      answer: "Yes, we use professional-grade deodorization equipment and techniques to completely remove smoke odours, not just mask them."
    },
    {
      question: "Is it safe to stay in the house after a fire?",
      answer: "We recommend professional assessment first. Even minor fires can create hidden hazards and unsafe air quality conditions."
    }
  ],
  'mould-remediation': [
    {
      question: "Is all mould dangerous?",
      answer: "While not all moulds are toxic, any extensive mould growth should be professionally assessed and removed as it can cause health issues and indicate moisture problems."
    },
    {
      question: "How do you prevent mould from returning?",
      answer: "We address the root cause of moisture issues and provide recommendations for ongoing prevention, including proper ventilation and moisture control."
    }
  ]
} as const;

interface ServiceFAQProps {
  serviceType: keyof typeof commonFAQs
}

export function ServiceFAQ({ serviceType }: ServiceFAQProps) {
  const faqs = commonFAQs[serviceType]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
