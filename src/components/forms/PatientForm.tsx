'use client'

import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from '../ui/form'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { UserFormValidation } from '@/app/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser } from '@/app/lib/actions/patient.actions'

const formSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(25),
})

export enum FormFieldType {
    INPUT = 'input',
    TEXT_AREA = 'textArea',
    CHECKBOX = 'checkbox',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',

}

export default function PatientForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })

    async function onSubmit(values: z.infer<typeof UserFormValidation>) {
        setIsLoading(true)
        try {
            const user = { name: values.phone, email: values.email, phone: values.phone }

            const newUser = await createUser(user)

            if (newUser) router.push(`/patients/${newUser.$id}/register`)

        } catch (error) {
            console.log(error);

        }
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
                <section className='mb-12 space-y-4'>
                    <h1 className='header'>Hi there 👋</h1>
                    <p className='text-dark-700'>Schedule your first appointment.</p>
                </section>
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Full name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="johndoe@test.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />
                <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone number"
                    placeholder="(555) 123-4567"
                />
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}