-- Add operational hours column to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN operational_hours text DEFAULT 'Senin - Sabtu: 08:00 - 17:00';