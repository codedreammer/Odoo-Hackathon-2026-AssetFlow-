-- Adds the columns the Asset Registry table needs that weren't
-- part of the original minimal schema.
alter table assets
  add column if not exists assigned_to text,
  add column if not exists location text,
  add column if not exists purchase_date date,
  add column if not exists value numeric(12, 2);

-- Helpful index for the registry's default sort
create index if not exists assets_created_at_idx on assets (created_at desc);
