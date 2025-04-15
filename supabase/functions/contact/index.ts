import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'
import { CORS_HEADERS } from '../const.ts';

const MAIL_USER = Deno.env.get('MAIL_USER')
const MAIL_PASS = Deno.env.get('MAIL_PASS')
const MAIL_HOST = Deno.env.get('MAIL_HOST')
const MAIL_PORT = Deno.env.get('MAIL_PORT')
const MAIL_TLS = Deno.env.get('MAIL_TLS')
const SUPPORT_EMAIL = MAIL_USER // ou autre adresse email pour recevoir les messages

console.log(MAIL_HOST, MAIL_PORT, MAIL_TLS, MAIL_USER, MAIL_PASS)

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS });
    }
    if (req.method !== 'POST') {
        return new Response(null, { headers: CORS_HEADERS, status: 405 });
    }
    try {
      const { email, subject, message } = await req.json()
      
      const client = new SMTPClient({
        connection: {
          hostname: MAIL_HOST || '',
          port: parseInt(MAIL_PORT || '465'),
          tls: MAIL_TLS === 'true',
          auth: {
            username: MAIL_USER || '',
            password: MAIL_PASS || '',
          },
        },
      })
      
      await client.send({
        from: MAIL_USER,
        to: SUPPORT_EMAIL,
        subject: `${email}`,
        content: `
        From: ${email}\n\nSubject: ${subject}\n\n${message}
        `,
      })
      
      await client.close()
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      )
    } catch(error) {
      console.error('Error sending email:', error)
      return new Response(
        JSON.stringify({ success: false, error }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      )
    }
  });