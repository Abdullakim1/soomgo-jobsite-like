import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function migrateData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log('Starting migration...');

  // 1. Get existing profile to use as reference
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single();

  if (!existingProfile?.id) {
    console.error('No existing profiles found to reference');
    return;
  }

  // 2. Create instructor rates
  console.log('Creating instructor rates...');
  const { error: ratesError } = await supabase
    .from('instructor_rates')
    .upsert([{
      instructor_id: existingProfile.id,
      min_rate: 50,
      desired_rate: 80
    }]);

  if (ratesError) {
    console.error('Error creating rates:', ratesError);
    return;
  }

  console.log('Migration completed successfully!');
}

migrateData().catch(console.error);
