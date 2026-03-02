# Blog Feature Setup

## Supabase Storage (Post Images)

To enable image uploads for blog posts:

1. In Supabase Dashboard, go to **Storage** and create a new bucket named `post-images`.
2. Set the bucket to **Public** (or add a policy that allows public read access).
3. Add a policy for authenticated uploads:
   - Operation: `INSERT`
   - Policy: Allow authenticated users to upload (e.g. `auth.role() = 'authenticated'`).
   - Optional: Restrict to `userId` folder for organization.

The frontend uploads directly to Supabase Storage and sends the public URL to the backend.

## Database Migration

Run the Post model migration:

```bash
cd backend && npx prisma migrate dev --name add_post_model
```

## Environment Variables

Ensure these are set:

- **Frontend:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Backend:** Standard Supabase vars (for auth; storage is client-side)
