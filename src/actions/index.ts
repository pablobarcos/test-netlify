import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { createTransport } from 'nodemailer'

interface ISendEmail {
  email: string
}

async function sendEmail(props: ISendEmail) {
  let transporter = createTransport({
    host: 'beprosystem-com.correoseguro.dinaserver.com',
    port: 587,
    auth: {
      user: 'ticketpro@beprosystem.com',
      pass: 'Ticketpro@23',
    },
  })

  let message = {
    from: 'ticketpro@beprosystem.com',
    to: props.email,
    subject: 'Prueba de envio de correo',
    html: `<h1>Contact Form</h1><br>
    <b>Email</b>: ${props.email}`,
  }

  let info = await transporter.sendMail(message)
  console.log('🚀 ~ sendEmail ~ info:', info)

  return info
}

export const server = {
  getGreeting: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email(),
      terms: z.boolean(),
    }),
    handler: async ({ email, terms }) => {
      if (!terms) {
        return {
          error: 'You must accept the terms of service',
        }
      }

      await sendEmail({ email })
    },
  }),
}
