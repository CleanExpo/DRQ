"use client"

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { analytics } from '@/lib/analytics'

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(2, "Please enter your location"),
  serviceType: z.enum(["water", "sewage", "mould"]),
  urgency: z.enum(["emergency", "urgent", "standard"]),
  message: z.string().min(10, "Please provide more details")
})

type FormData = z.infer<typeof formSchema>

export function EmergencyContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urgency: "standard"
    }
  })

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    try {
      // Track form submission
      analytics.trackEvent({
        event: 'emergency_form_submit',
        category: 'Forms',
        action: 'submit',
        label: data.serviceType
      })

      // Here you would typically send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSubmitStatus('success')
      analytics.trackFormSubmission('emergency_contact', true)
    } catch (error) {
      setSubmitStatus('error')
      analytics.trackFormSubmission('emergency_contact', false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {submitStatus === 'success' && (
        <Alert className="bg-green-50 border-green-500">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Request Sent Successfully</AlertTitle>
          <AlertDescription>
            We'll contact you shortly regarding your request.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Submission Failed</AlertTitle>
          <AlertDescription>
            Please try again or call us directly at 1300 309 361.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Required</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="water">Water Damage</SelectItem>
                    <SelectItem value="sewage">Sewage Cleanup</SelectItem>
                    <SelectItem value="mould">Mould Remediation</SelectItem>
                  </SelectContent>
                </Select>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency - Need immediate response</SelectItem>
                    <SelectItem value="urgent">Urgent - Within 24 hours</SelectItem>
                    <SelectItem value="standard">Standard - General enquiry</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
