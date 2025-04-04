export const environment = {
  production: false,
  supabase: {
    url: 'http://localhost:54321',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  },
  stripe: {
    publicKey: 'pk_test_51R0h2VLJCrbo8n9zhGPY9DIVhwKrlLFzUQA8AhavloPHtavV2cVfoTbk1qRRD0R7SwYV5wyfE3jyCKhT9WyUAuLy00ax47FDgu',
    plans: [
      { 
        id: 'price_1R0iFlLJCrbo8n9zM2j9GA3X',
        name: 'Basic',
        price: 2, 
        quota: 100,
        features: [
          '100 translation units per month',
          'Basic support'
        ]
      },
      { 
        id: 'price_1R0iGDLJCrbo8n9zrSv4cf21',
        name: 'Pro',
        price: 5, 
        quota: 1000,
        features: [
          '1000 translation units per month',
          'Priority support'
        ]
      },
      { 
        id: 'price_1R0iGbLJCrbo8n9ztgW8Su83',
        name: 'Enterprise',
        price: 20, 
        quota: 5000,
        features: [
          '5000 translation units per month',
          'Premium support'
        ]
      }
    ]
  }
};