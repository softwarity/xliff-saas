export const environment = {
  production: false,
  supabase: {
    url: 'http://localhost:54321',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  },
  stripe: {
    publicKey: 'pk_test_51R0h2VLJCrbo8n9zhGPY9DIVhwKrlLFzUQA8AhavloPHtavV2cVfoTbk1qRRD0R7SwYV5wyfE3jyCKhT9WyUAuLy00ax47FDgu',
    silverPriceId: 'price_1RFBiJLJCrbo8n9z67PMhxsk',
    goldPriceId: 'price_1RFBiWLJCrbo8n9zyOOLbe9N',
    diamondPriceId: 'price_1RFBioLJCrbo8n9zR96wfMdY'
  }
};