-- Run this in your Supabase SQL Editor

create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  extracted_content jsonb,
  ux_review jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
