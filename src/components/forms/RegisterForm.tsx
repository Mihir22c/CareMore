'use client'

import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl } from '../ui/form'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { UserFormValidation } from '@/app/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser } from '@/app/lib/actions/patient.actions'
import { FormFieldType } from './PatientForm'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Doctors, GenderOptions } from '@/constants'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem } from '../ui/select'
import Image from 'next/image'

const formSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(25),
})


export default function RegisterForm({ user }: { user: User }) {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
                <section className='space-y-4'>
                    <h1 className='header'>Welcome 👋</h1>
                    <p className='text-dark-700'>Let us know more about yourself.</p>
                </section>

                {/* Personal Information Section */}
                <section className='space-y-6'>
                    <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Personal Information</h2>
                    </div>

                    {/* NAME */}
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="name"
                        placeholder="John Doe"
                        iconSrc="/assets/icons/user.svg"
                        iconAlt="user"
                    />

                    {/* EMAIL & PHONE */}
                    <div className='flex flex-col gap-6 xl:flex-row'>
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="email"
                            label="Email address"
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
                    </div>

                    {/* BIRTH & GENDER */}
                    <div className='flex flex-col gap-6 xl:flex-row'>
                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="birthDate"
                            label="Date of Birth"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.SKELETON}
                            control={form.control}
                            name="gender"
                            label="Gender"
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <RadioGroup
                                        className='flex h-11 gap-6 xl:justify-between'
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                        {GenderOptions.map((option) => (
                                            <div key={option} className='radio-group'>
                                                <RadioGroupItem id={option} value={option} />
                                                <Label htmlFor={option} className='cursor-pointer'>{option}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                    </div>

                    {/* ADDRESS & OCCUPATION */}
                    <div className='flex flex-col gap-6 xl:flex-row'>
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="address"
                            label="Address"
                            placeholder="1234 Main St"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="occupation"
                            label="Occupation"
                            placeholder="Software Engineer"
                        />
                    </div>

                    {/* EMERGENCY CONTACT Name & Emergency Contact Number*/}
                    <div className='flex flex-col gap-6 xl:flex-row'>
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="emergencyContactName"
                            label="Emergency Contact Name"
                            placeholder="Guardian's Name"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="emergencyContactNumber"
                            label="Emergency Contact Number"
                            placeholder="(555) 123-4567"
                        />
                    </div>
                </section>

                {/* Medical Information Section */}
                <section className='space-y-6'>
                    <div className='mb-9 space-y-1'>
                        <h2 className='sub-header'>Medical Information</h2>
                    </div>

                    {/* PRIMARY CARE PHYSICIAN */}
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="primaryPhysician"
                        label="Primary Physician"
                        placeholder="Select a Physician"
                    >
                        {Doctors?.map((doctor, i) => (
                            <SelectItem key={doctor.name + i} value={doctor.name}>
                                <div className='flex cursor-pointer items-center gap-2'>
                                    <Image
                                        src={doctor.image}
                                        width={32}
                                        height={32}
                                        alt={doctor.name}
                                        className='rounded-full border border-dark-500'
                                    />
                                    <p>{doctor.name}</p>
                                </div>
                            </SelectItem>
                        ))}
                    </CustomFormField>


                    <div className='flex flex-col gap-6 xl:flex-row'>
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="insuranceProvider"
                            label="Insurance Provider"
                            placeholder="Blue Cross Blue Shield"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="insurancePolicyNumber"
                            label="Insurance Policy Number"
                            placeholder="ABC123456789"
                        />
                    </div>

                    <div className='flex flex-col gap-6 xl:flex-row'>
                        <CustomFormField
                            fieldType={FormFieldType.TEXT_AREA}
                            control={form.control}
                            name="allergies"
                            label="Allergies(if any)"
                            placeholder="Peanuts, Penicillin, Pollen, etc."
                        />
                        <CustomFormField
                            fieldType={FormFieldType.TEXT_AREA}
                            control={form.control}
                            name="currentMedications"
                            label="Current Medications"
                            placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
                        />
                    </div>
                </section>
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}