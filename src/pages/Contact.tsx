import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form
    if (!formData.name || !formData.message) {
      toast.error("Nama dan pesan harus diisi!");
      return;
    }

    // Format pesan WhatsApp
    let whatsappMessage = `Halo, saya ingin berkonsultasi:\n\n`;
    whatsappMessage += `Nama: ${formData.name}\n`;
    if (formData.email) whatsappMessage += `Email: ${formData.email}\n`;
    if (formData.phone) whatsappMessage += `Telepon: ${formData.phone}\n`;
    whatsappMessage += `\nPesan:\n${formData.message}`;

    // Nomor WhatsApp Alam
    const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp Alam
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Buka WhatsApp
    window.open(whatsappUrl, "_blank");
    
    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" });
    toast.success("Mengarahkan ke WhatsApp...");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex-1">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ada pertanyaan atau butuh konsultasi? Tim kami siap membantu Anda
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Alamat</h3>
                    <p className="text-sm text-muted-foreground">
                      Jl. Mebel Raya No. 123<br />
                      Jakarta Selatan 12345<br />
                      Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Telepon</h3>
                    <p className="text-sm text-muted-foreground">
                      +62 812-3456-7890<br />
                      +62 21-1234-5678
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      info@mebelku.com<br />
                      support@mebelku.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Jam Operasional</h3>
                    <p className="text-sm text-muted-foreground">
                      Senin - Jumat: 08.00 - 17.00<br />
                      Sabtu: 09.00 - 15.00<br />
                      Minggu: Tutup
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary text-secondary-foreground">
              <CardContent className="p-6">
                <MessageCircle className="h-8 w-8 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Chat WhatsApp</h3>
                <p className="text-sm mb-4 opacity-90">
                  Hubungi kami langsung via WhatsApp untuk respons yang lebih cepat
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
                  onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
                >
                  Chat Sekarang
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Kirim Pesan
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nama Lengkap <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Masukkan nama Anda"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@contoh.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="08xx-xxxx-xxxx"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Pesan <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tulis pesan, pertanyaan, atau keluhan Anda..."
                      className="min-h-[150px]"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full h-12 text-lg">
                    Kirim Pesan via WhatsApp
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Pesan akan dikirim melalui WhatsApp untuk respons yang lebih cepat
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Pertanyaan Umum
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Berapa lama pengiriman?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Untuk area Jabodetabek estimasi 3-5 hari kerja. Area luar Jabodetabek 7-14 hari kerja.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Apakah bisa custom desain?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Ya, kami melayani pembuatan mebel custom sesuai kebutuhan dan desain Anda.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Bagaimana cara pembayaran?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Kami menerima transfer bank, e-wallet, dan cicilan 0% untuk pembelian tertentu.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Apakah ada garansi?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Semua produk kami memiliki garansi 1 tahun untuk kerusakan produksi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
