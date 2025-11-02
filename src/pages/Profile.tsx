import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().trim().min(1, { message: "Nama harus diisi" }).max(100),
  phone: z.string().trim().min(10, { message: "Nomor telepon harus valid" }).max(15),
  address: z.string().trim().min(10, { message: "Alamat minimal 10 karakter" }).max(500),
});

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/auth");
      return;
    }

    // Load profile data
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      toast.error("Gagal memuat profil");
      console.error(error);
    }

    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }

    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const validated = profileSchema.parse({
        full_name: fullName,
        phone: phone,
        address: address,
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Sesi berakhir, silakan login kembali");
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: session.user.id,
          full_name: validated.full_name,
          phone: validated.phone,
          address: validated.address,
        });

      if (error) throw error;

      toast.success("Profil berhasil disimpan!");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Gagal menyimpan profil: " + (error.message || "Terjadi kesalahan"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Memuat profil...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Profil Saya</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xx xxxx xxxx"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan alamat lengkap pengiriman"
                  required
                  disabled={isSaving}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Menyimpan..." : "Simpan Profil"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
