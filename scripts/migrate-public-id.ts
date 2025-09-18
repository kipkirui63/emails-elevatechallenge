// scripts/migrate-public-id.ts
import { db } from "../db";
import { sql } from 'drizzle-orm';

async function migratePublicId() {
  try {
    console.log('Starting public_id migration...');
    
    // Use raw SQL to add the public_id column if it doesn't exist
    await db.execute(sql`
      DO $$ 
      BEGIN
        -- Add public_id column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'registrations' AND column_name = 'public_id'
        ) THEN
          ALTER TABLE registrations ADD COLUMN public_id UUID UNIQUE;
        END IF;
      END $$;
    `);
    
    console.log('Ensured public_id column exists');
    
    // Update all existing records to have a public_id if they don't have one
    const result = await db.execute(sql`
      UPDATE registrations 
      SET public_id = gen_random_uuid() 
      WHERE public_id IS NULL;
    `);
    
    console.log(`Updated records with public_id`);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migratePublicId();