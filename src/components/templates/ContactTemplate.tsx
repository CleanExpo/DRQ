"use client"

import { useState } from 'react'
import { ErrorBoundary } from '@/components/errors/ErrorBoundary'
import { PageTemplate } from '@/components/templates/PageTemplate'
import { ServiceAreaSelector } from '@/components/service-areas'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApiService, ApiError } from '@/lib/api-service'
import { analytics } from '@/lib/analytics'
import { ContactFormData, ContactFormErrorData } from '@/types/forms'
import { ControllerRenderProps } from 'react-hook-form'

const formSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),
  email: z.string()
    .email("Invalid email address")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"),
  phone: z.string()
    .regex(/^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/, "Please enter a valid Australian phone number")
    .transform(val => val.replace(/\s+/g, '')), // Normalize phone number
  message: z.string()
    .min(10, "Please provide more details")
    .max(1000, "Message is too long"),
  urgency: z.enum(["high", "medium", "low"]), // Required field
  serviceType: z.enum(["water", "fire", "mould"]).optional(),
}) satisfies z.ZodType<ContactFormData>

type FormData = z.infer<typeof formSchema>

export function ContactTemplate({ params }: { params: { locale: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      urgency: "medium", // Default value
      serviceType: undefined
    }
  })

  async function onSubmit(data: FormData) {
    try {
      setIsSubmitting(true)
      
      // Submit form
      const response = await ApiService.submitContactForm(data)
      
      // Track successful submission
      await analytics.trackFormSubmission({
        formType: 'contact',
        urgency: data.urgency,
        serviceType: data.serviceType
      })
      
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible.",
      })
      
      form.reset()
    } catch (error: unknown) {
      // Handle specific API errors
      if (error instanceof ApiError) {
        const errorData: ContactFormErrorData = {
          ...data,
          statusCode: error.statusCode,
          error: error.message
        }
        
        // Track error with specific error details
        await analytics.trackFormError(error.message, errorData)
        
        // Show appropriate error message based on status code
        let errorMessage = error.message;
        if (error.statusCode === 408) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.statusCode === 400) {
          errorMessage = "Please check your form details and try again.";
        } else if (error.statusCode === 429) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
        }
        
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })
      } else {
        // Handle unexpected errors
        const errorData: ContactFormErrorData = {
          ...data,
          error: 'Unexpected error'
        }
        await analytics.trackFormError('Unexpected error', errorData)
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageTemplate
      params={params}
      heading="Contact Us"
      subheading="Get in touch with our emergency response team"
      breadcrumbs={[{ label: 'Contact', href: '/contact' }]}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgency Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="high">Emergency - Need immediate response</SelectItem>
                              <SelectItem value="medium">Urgent - Need response within 24 hours</SelectItem>
                              <SelectItem value="low">Normal - General inquiry</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="water">Water Damage</SelectItem>
                              <SelectItem value="fire">Fire Damage</SelectItem>
                              <SelectItem value="mould">Mould Remediation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </ErrorBoundary>
        </div>
        
        <div className="space-y-6">
          <ErrorBoundary>
            <ServiceAreaSelector />
          </ErrorBoundary>
        </div>
      </div>
    </PageTemplate>
  )
}
