export const environment = {
  production: true,
  supabase: {
    url: 'https://jfrdmhsrklrvtaatdvbt.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcmRtaHNya2xydnRhYXRkdmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NjU5ODMsImV4cCI6MjA1NzI0MTk4M30.1pMgwZcAKuPC1dDOi4MA64ncu2KsIx2mnEGK30obzBk'
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