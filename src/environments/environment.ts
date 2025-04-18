export const environment = {
  production: false,
  supabase: {
    url: 'http://localhost:54321',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  },
  stripe: {
    publicKey: 'pk_test_51R0h2VLJCrbo8n9zhGPY9DIVhwKrlLFzUQA8AhavloPHtavV2cVfoTbk1qRRD0R7SwYV5wyfE3jyCKhT9WyUAuLy00ax47FDgu',
    silverPriceId: 'price_1RF87TLJCrbo8n9z2Vgs4x4l',
    goldPriceId: 'price_1RF87lLJCrbo8n9zeqgvvQKy',
    diamondPriceId: 'price_1RF881LJCrbo8n9zaar5Bcvg'
  }
};

