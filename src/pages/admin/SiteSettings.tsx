import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSiteSettings, useUpdateSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Store, Phone, Palette, FileText, Share2, Upload, X } from "lucide-react";
import { toast } from "sonner";

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "";
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Helper function to convert HSL to hex
const hslToHex = (hsl: string): string => {
  const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (!match) return "#000000";
  
  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const SiteSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

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
    operational_hours: "",
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
        primary_color: settings.primary_color || "142 70% 45%",
        secondary_color: settings.secondary_color || "142 40% 90%",
        accent_color: settings.accent_color || "142 60% 55%",
        theme_mode: settings.theme_mode || "light",
        hero_title: settings.hero_title || "",
        hero_subtitle: settings.hero_subtitle || "",
        about_content: settings.about_content || "",
        footer_text: settings.footer_text || "",
        operational_hours: settings.operational_hours || "",
      });
    }
  }, [settings]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (field: string, hexValue: string) => {
    const hslValue = hexToHsl(hexValue);
    setFormData((prev) => ({ ...prev, [field]: hslValue }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      handleChange("logo_url", publicUrl);
      toast.success("Logo berhasil diupload");
    } catch (error: any) {
      toast.error("Gagal upload logo: " + error.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    handleChange("logo_url", "");
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
                    <Label>Logo Toko</Label>
                    <div className="flex items-center gap-4">
                      {formData.logo_url ? (
                        <div className="relative">
                          <img 
                            src={formData.logo_url} 
                            alt="Logo" 
                            className="h-16 w-16 object-contain border rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={handleRemoveLogo}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-16 w-16 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                          <Store className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={uploadingLogo}
                        >
                          {uploadingLogo ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          Format: JPG, PNG. Maks 2MB
                        </p>
                      </div>
                    </div>
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
                <div className="space-y-2">
                  <Label htmlFor="operational_hours">Jam Operasional</Label>
                  <Textarea
                    id="operational_hours"
                    value={formData.operational_hours}
                    onChange={(e) => handleChange("operational_hours", e.target.value)}
                    placeholder="Senin - Jumat: 08:00 - 17:00&#10;Sabtu: 09:00 - 15:00&#10;Minggu: Tutup"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pisahkan setiap baris dengan enter untuk format yang rapi
                  </p>
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
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <Label htmlFor="primary_color">Warna Primary</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        id="primary_color"
                        value={hslToHex(formData.primary_color)}
                        onChange={(e) => handleColorChange("primary_color", e.target.value)}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <div 
                        className="h-10 flex-1 rounded border"
                        style={{ backgroundColor: hslToHex(formData.primary_color) }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Warna utama untuk tombol dan aksen</p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="secondary_color">Warna Secondary</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        id="secondary_color"
                        value={hslToHex(formData.secondary_color)}
                        onChange={(e) => handleColorChange("secondary_color", e.target.value)}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <div 
                        className="h-10 flex-1 rounded border"
                        style={{ backgroundColor: hslToHex(formData.secondary_color) }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Warna untuk elemen sekunder</p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="accent_color">Warna Accent</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        id="accent_color"
                        value={hslToHex(formData.accent_color)}
                        onChange={(e) => handleColorChange("accent_color", e.target.value)}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <div 
                        className="h-10 flex-1 rounded border"
                        style={{ backgroundColor: hslToHex(formData.accent_color) }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Warna untuk highlight dan aksen</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme_mode">Mode Tema</Label>
                  <Select
                    value={formData.theme_mode}
                    onValueChange={(value) => handleChange("theme_mode", value)}
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
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