# XLIFF SaaS

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

## Supabase

```bash
npm run supabase
npx supabase init
# start local env
npx supabase start
# login
npx supabase login
# list projects
supabase projects list
# link project
supabase link --project-ref "jfrdmhsrklrvtaatdvbt"
# database: rFF8%zVEAPAGwy
```

## Functions

```bash
#local
supabase functions serve
#deploy remote
supabase functions deploy hello-world --project-ref jfrdmhsrklrvtaatdvbt
```

### xliffrunner

```bash
#local
supabase functions serve
# test local
curl --request POST 'http://localhost:54321/functions/v1/xliffrunner' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
--header 'Content-Type: application/json'
# test remote
curl -L -X POST 'https://jfrdmhsrklrvtaatdvbt.supabase.co/functions/v1/xliffrunner' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcmRtaHNya2xydnRhYXRkdmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NjU5ODMsImV4cCI6MjA1NzI0MTk4M30.1pMgwZcAKuPC1dDOi4MA64ncu2KsIx2mnEGK30obzBk' \
--data '{"name":"Francois"}'
```

### webhook-runner

```bash
#local
curl --request POST 'http://localhost:54321/functions/v1/webhook-runner' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
--header 'Content-Type: application/json' \
--data '{ "name":"Francois" }'
# avec serveo
curl --request POST 'http://serveo.net:54321/functions/v1/webhook-runner' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
--header 'Content-Type: application/json' \
--data '{ "name":"Francois" }'
```

## Migrations

```bash
#local
supabase db push --local
#remote
supabase db push
```

```bash
curl --request POST 'http://localhost:54321/functions/v1/xliffrunner' \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
--H 'Content-Type: application/json' \
--data '{ "GITHUB_TOKEN": "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"}'
```

## Create user

```bash
# local
curl -X POST 'http://localhost:54321/auth/v1/signup' \
-H 'Content-Type: application/json' \
-H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
-d '{
  "email": "newuser@example.com",
  "password": "yourpassword"
}'
```

## SET SECRET
```bash
# local
export GITHUB_TOKEN=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

# set secret
supabase secrets set --env-file supabase/.env
supabase secrets set GITHUB_TOKEN=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
supabase functions set-env GITHUB_TOKEN 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
# remove secret
supabase secrets unset GITHUB_TOKEN
# list secrets
supabase secrets --project-ref "jfrdmhsrklrvtaatdvbt" list
# visible in UI
https://supabase.com/dashboard/project/jfrdmhsrklrvtaatdvbt/functions/secrets
```

## WEBHOOKS

The local server will be exposed to the internet using localtunnel.

```bash
npm install -g localtunnel
lt --port 54321
# alternative using serveo
ssh -R 54321:localhost:54321 serveo.net
```

