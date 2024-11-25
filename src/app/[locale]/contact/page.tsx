import { ContactTemplate } from "@/components/templates/ContactTemplate"

export default function ContactPage({ params }: { params: { locale: string } }) {
  return <ContactTemplate params={params} />
}
