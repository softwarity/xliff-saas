export const environment = {
  production: true,
  supabase: {
    url: 'https://jfrdmhsrklrvtaatdvbt.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcmRtaHNya2xydnRhYXRkdmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NjU5ODMsImV4cCI6MjA1NzI0MTk4M30.1pMgwZcAKuPC1dDOi4MA64ncu2KsIx2mnEGK30obzBk'
  },
  stripe: {
    publicKey: 'pk_test_51R0h2VLJCrbo8n9zhGPY9DIVhwKrlLFzUQA8AhavloPHtavV2cVfoTbk1qRRD0R7SwYV5wyfE3jyCKhT9WyUAuLy00ax47FDgu',
    silverPriceId: 'price_1RFBiJLJCrbo8n9z67PMhxsk',
    goldPriceId: 'price_1RFBiWLJCrbo8n9zyOOLbe9N',
    diamondPriceId: 'price_1RFBioLJCrbo8n9zR96wfMdY'
  },
};
const prod = {
  publicKey: 'pk_live_51R0h2VLJCrbo8n9zlLDzmtJPvWeW9sRq4NExsNCW0Zzuhe25npbQNv5DfEtX4uoi2gVUQf6gKFFjJ9xdmwd7UwHe00eA06BK0e',
  silverPriceId: 'price_1RF87TLJCrbo8n9z2Vgs4x4l',
  goldPriceId: 'price_1RF87lLJCrbo8n9zeqgvvQKy',
  diamondPriceId: 'price_1RF881LJCrbo8n9zaar5Bcvg'
}