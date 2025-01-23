'use client'

import React, { use, useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from '../ui/form'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { getAppointmentSchema } from '@/app/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser, getPatient } from '@/app/lib/actions/patient.actions'
import { Doctors } from '@/constants'
import { SelectItem } from '../ui/select'
import Image from 'next/image'
import { createAppointment } from '@/app/lib/actions/appointment.action'

const formSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(25),
})

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textArea',
    CHECKBOX = 'checkbox',
    PHONE_INPUT = 'phoneInput',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',

}

export default function AppointmentForm({ userId, patientId, type }: { userId: string, patientId: string, type: "create" | "cancel" | "schedule" }) {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const AppointmentFormValidation = getAppointmentSchema(type);
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: "",
            schedule: new Date(),
            reason: "",
            note: "",
            cancellationReason: ""
        },
    })

    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true)

        let status

        switch (type) {
            case 'cancel':
                status = "cancelled"
                break;
            case 'create':
                status = "pending"
                break;
            case 'schedule':
                status = "scheduled"
                break;
            default:
                status = "pending"
                break;
        }
        try {

            if (type === "create" && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: values.schedule,
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status,

                }

                console.log("appointmentData", appointmentData); //TODO: remove this line


                const appointment = await createAppointment(appointmentData)
                console.log("appointment", appointment); //TODO: remove this line



                if (appointment) router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
            }
        } catch (error) {
            console.log(error);

        }
    }

    let buttonLabel

    switch (type) {
        case 'cancel':
            buttonLabel = "Cancel Appointment"
            break;
        case 'create':
            buttonLabel = "Create Appointment"
            break;
        case 'schedule':
            buttonLabel = "Schedule Appointment"
            break;
        default:
            break;
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
                <section className='mb-12 space-y-4'>
                    <h1 className='header'>New Appointment</h1>
                    <p className='text-dark-700'>Request a new appointment in 10 seconds.</p>
                </section>

                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a Doctor"
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

                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="Expected appointment date"
                            showTimeSelect
                            dateFormat={"MMMM d, yyyy - h:mm aa"}
                        />

                        <div className='flex flex-col gap-6 xl:flex-row'>
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Reason for appointment"
                                placeholder="Enter reason for appointment" />
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="notes"
                                label="Notes"
                                placeholder="Enter Notes" />
                        </div>
                    </>
                )}

                {type === "cancel" && (
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="reason"
                        label="Reason for cancellation"
                        placeholder="Enter reason for cancellation" />
                )}

                <SubmitButton isLoading={isLoading} className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}>{buttonLabel}</SubmitButton>
            </form>
        </Form>
    )
}