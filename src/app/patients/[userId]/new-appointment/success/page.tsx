import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SuccessPage = () => {
    return (
        <div className='flex h-screen max-h-screen px-[5%]'>
            <div className='success-img'>
                <Link href={"/"}>
                    <Image
                        src="/assets/icons/logo-full.svg"
                        alt="logo"
                        width={1000}
                        height={1000}
                        className="h-10 w-fit"
                    />
                </Link>
                <section className='flex flex-col items-center'>
                    <Image
                        src='/assets/gifs/success.gif'
                        alt='success'
                        height={300}
                        width={280}
                        className='mb-12'
                    />
                    <h2 className='header mb-6 max-w-[600px] text-center'>
                        Your <span className='text-green-500'>appointment request</span> has been successfully submitted.
                    </h2>
                    <p>We'll be in touch shortly to confirm!</p>
                </section>

                <section className='request-details'>
                    <p>Requested appointment details:</p>
                    <div className='flex items-center gap-3'>

                    </div>
                </section>
            </div>
        </div>
    )
}

export default SuccessPage