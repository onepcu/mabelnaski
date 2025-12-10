-- Allow super_admin to view all profiles for user management
CREATE POLICY "Super admin can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'super_admin'));

-- Allow super_admin to update all profiles (for password reset, etc.)
CREATE POLICY "Super admin can update all profiles"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'super_admin'));