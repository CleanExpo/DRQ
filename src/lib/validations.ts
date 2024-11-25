import * as z from 'zod'

// Phone number validation for Australian numbers
const phoneRegex = /^(?:\+?61|0)[2-478](?:[ -]?\d{4}){2}$/

// Australian postcodes
const postcodeRegex = /^[0-9]{4}$/

export const formValidations = {
  // Emergency Contact Form
  emergencyContact: z.object({
    name: z.string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    phone: z.string()
      .regex(phoneRegex, "Please enter a valid Australian phone number")
      .transform(val => val.replace(/\s+/g, '')),
    email: z.string()
      .email("Invalid email address")
      .toLowerCase(),
    location: z.object({
      suburb: z.string().min(2, "Please enter your suburb"),
      postcode: z.string().regex(postcodeRegex, "Please enter a valid postcode"),
    }),
    serviceType: z.enum(["water", "sewage", "mould"]),
    urgency: z.enum(["emergency", "urgent", "standard"]),
    propertyType: z.enum(["residential", "commercial"]),
    message: z.string()
      .min(10, "Please provide more details")
      .max(1000, "Message is too long"),
    propertyAccess: z.boolean(),
    contactPreference: z.enum(["phone", "email", "either"])
  }),

  // Quick Service Check
  serviceCheck: z.object({
    suburb: z.string().min(2, "Please enter your suburb"),
    postcode: z.string().regex(postcodeRegex, "Please enter a valid postcode")
  }),

  // Commercial Enquiry
  commercialEnquiry: z.object({
    companyName: z.string().min(2, "Company name is required"),
    contactName: z.string().min(2, "Contact name is required"),
    position: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
    industry: z.enum([
      "office",
      "retail",
      "healthcare",
      "education",
      "hospitality",
      "industrial",
      "strata"
    ]),
    propertyCount: z.number().min(1).optional(),
    message: z.string().min(10, "Please provide more details")
  })
}

// Error messages for user feedback
export const errorMessages = {
  required: "This field is required",
  invalid: "Please enter a valid value",
  phone: {
    invalid: "Please enter a valid Australian phone number",
    format: "Format: 04XX XXX XXX or +61 4XX XXX XXX"
  },
  email: {
    invalid: "Please enter a valid email address",
    format: "Format: example@domain.com"
  },
  location: {
    notServiced: "This location is currently not in our service area",
    invalid: "Please enter a valid suburb and postcode"
  }
}

// Helper types
export type EmergencyContactForm = z.infer<typeof formValidations.emergencyContact>
export type ServiceCheckForm = z.infer<typeof formValidations.serviceCheck>
export type CommercialEnquiryForm = z.infer<typeof formValidations.commercialEnquiry>

// Validation helpers
export const validatePhoneNumber = (phone: string) => {
  return phoneRegex.test(phone)
}

export const validatePostcode = (postcode: string) => {
  return postcodeRegex.test(postcode)
}

export const formatPhoneNumber = (phone: string) => {
  return phone.replace(/\s+/g, '').replace(/^(\+?61|0)(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3 $4')
}

export const validateEmail = (email: string) => {
  return z.string().email().safeParse(email).success
}
