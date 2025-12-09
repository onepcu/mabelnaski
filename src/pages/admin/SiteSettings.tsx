import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSiteSettings, useUpdateSiteSettings } from "@/hooks/useSiteSettings";
import { Loader2, Save, Store, Phone, Palette, FileText, Share2 } from "lucide-react";

const SiteSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [formData, setFormData] = useState({
    site_name: "",
    site_description: "",
    logo_url: "",
    whatsapp_number: "",
    email: "",
    phone: "",
    address: "",
    instagram_url: "",
    facebook_url: "",
    tiktok_url: "",
    primary_color: "",
    secondary_color: "",
    accent_color: "",
    theme_mode: "light",
    hero_title: "",
    hero_subtitle: "",
    about_content: "",
    footer_text: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || "",
        site_description: settings.site_description || "",
        logo_url: settings.logo_url || "",
        whatsapp_number: settings.whatsapp_number || "",
        email: settings.email || "",
        phone: settings.phone || "",
        address: settings.address || "",
        instagram_url: settings.instagram_url || "",
        facebook_url: settings.facebook_url || "",
        tiktok_url: settings.tiktok_url || "",
        primary_color: settings.primary_color || "",
        secondary_color: settings.secondary_color || "",
        accent_color: settings.accent_color || "",
        theme_mode: settings.theme_mode || "light",
        hero_title: settings.hero_title || "",
        hero_subtitle: settings.hero_subtitle || "",
        about_content: settings.about_content || "",
        footer_text: settings.footer_text || "",
      });
    }
  }, [settings]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSettings.mutate(formData);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pengaturan Website</h1>
            <p className="text-muted-foreground">Kelola konfigurasi website Anda</p>
          </div>
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan Perubahan
          </Button>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Info Dasar</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Kontak</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Sosial Media</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Tema</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Konten</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
                <CardDescription>Konfigurasi nama dan deskripsi toko</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Nama Toko</Label>
                    <Input
                      id="site_name"
                      value={formData.site_name}
                      onChange={(e) => handleChange("site_name", e.target.value)}
                      placeholder="Nama toko Anda"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo_url">URL Logo</Label>
                    <Input
                      id="logo_url"
                      value={formData.logo_url}
                      onChange={(e) => handleChange("logo_url", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_description">Deskripsi Toko</Label>
                  <Textarea
                    id="site_description"
                    value={formData.site_description}
                    onChange={(e) => handleChange("site_description", e.target.value)}
                    placeholder="Deskripsi singkat tentang toko Anda"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
                <CardDescription>Konfigurasi nomor telepon, email, dan alamat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">Nomor WhatsApp</Label>
                    <Input
                      id="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                      placeholder="628123456789"
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: kode negara + nomor (tanpa + atau spasi)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="(021) 12345678"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="info@tokosaya.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Alamat lengkap toko Anda"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Media Sosial</CardTitle>
                <CardDescription>Link ke akun media sosial toko</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Instagram</Label>
                  <Input
                    id="instagram_url"
                    value={formData.instagram_url}
                    onChange={(e) => handleChange("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/tokosaya"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook</Label>
                  <Input
                    id="facebook_url"
                    value={formData.facebook_url}
                    onChange={(e) => handleChange("facebook_url", e.target.value)}
                    placeholder="https://facebook.com/tokosaya"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok_url">TikTok</Label>
                  <Input
                    id="tiktok_url"
                    value={formData.tiktok_url}
                    onChange={(e) => handleChange("tiktok_url", e.target.value)}
                    placeholder="https://tiktok.com/@tokosaya"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Tema</CardTitle>
                <CardDescription>Kustomisasi warna dan tampilan website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Warna Primary (HSL)</Label>
                    <Input
                      id="primary_color"
                      value={formData.primary_color}
                      onChange={(e) => handleChange("primary_color", e.target.value)}
                      placeholder="142 70% 45%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Warna Secondary (HSL)</Label>
                    <Input
                      id="secondary_color"
                      value={formData.secondary_color}
                      onChange={(e) => handleChange("secondary_color", e.target.value)}
                      placeholder="142 40% 90%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent_color">Warna Accent (HSL)</Label>
                    <Input
                      id="accent_color"
                      value={formData.accent_color}
                      onChange={(e) => handleChange("accent_color", e.target.value)}
                      placeholder="142 60% 55%"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme_mode">Mode Tema</Label>
                  <Select
                    value={formData.theme_mode}
                    onValueChange={(value) => handleChange("theme_mode", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mode tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Terang</SelectItem>
                      <SelectItem value="dark">Gelap</SelectItem>
                      <SelectItem value="system">Ikuti Sistem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Konten Halaman</CardTitle>
                <CardDescription>Edit teks di berbagai bagian website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hero_title">Judul Hero</Label>
                    <Input
                      id="hero_title"
                      value={formData.hero_title}
                      onChange={(e) => handleChange("hero_title", e.target.value)}
                      placeholder="Selamat Datang"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_subtitle">Subtitle Hero</Label>
                    <Input
                      id="hero_subtitle"
                      value={formData.hero_subtitle}
                      onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                      placeholder="Temukan Produk Berkualitas"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about_content">Konten Halaman Tentang Kami</Label>
                  <Textarea
                    id="about_content"
                    value={formData.about_content}
                    onChange={(e) => handleChange("about_content", e.target.value)}
                    placeholder="Cerita tentang toko Anda..."
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footer_text">Teks Footer</Label>
                  <Textarea
                    id="footer_text"
                    value={formData.footer_text}
                    onChange={(e) => handleChange("footer_text", e.target.value)}
                    placeholder="Teks yang muncul di footer..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SiteSettings;
