-- Add unique constraint on section column to enable proper upserts
ALTER TABLE public.portfolio_content 
ADD CONSTRAINT portfolio_content_section_unique UNIQUE (section);