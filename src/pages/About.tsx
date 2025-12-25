import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Heart, Target } from "lucide-react";
import aboutShowroom from "@/assets/about-showroom.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const About = () => {
  const { data: settings } = useSiteSettings();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Hero Section with Image */}
        <div className="relative mb-16 rounded-2xl overflow-hidden">
          <img 
            src={aboutShowroom} 
            alt="Showroom furniture modern dengan sofa elegan dan dekorasi stylish" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-end">
            <div className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Tentang {settings?.site_name || "MebelKu"}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                {settings?.about_content || "Menyediakan mebel berkualitas tinggi dengan desain modern untuk menciptakan ruang hidup yang nyaman dan estetik sejak 2020."}
              </p>
            </div>
          </div>
        </div>

        {/* Story Section with Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Cerita Kami</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                MebelKu dimulai dari passion terhadap desain interior dan keinginan untuk 
                membuat mebel berkualitas lebih terjangkau bagi masyarakat Indonesia. Kami 
                percaya bahwa setiap rumah layak memiliki furnitur yang tidak hanya fungsional, 
                tetapi juga indah dipandang.
              </p>
              <p>
                Dengan tim pengrajin berpengalaman dan desainer berbakat, kami menghadirkan 
                koleksi mebel yang menggabungkan keindahan desain modern dengan kualitas material 
                pilihan. Setiap produk dirancang dengan cermat untuk memastikan kenyamanan dan 
                ketahanan jangka panjang.
              </p>
              <p>
                Kepuasan pelanggan adalah prioritas utama kami. Itulah mengapa kami terus 
                berinovasi dan meningkatkan kualitas produk serta layanan untuk memberikan 
                pengalaman berbelanja mebel yang menyenangkan dan memuaskan.
              </p>
            </div>
          </div>
          
          {/* Stats Card */}
          <Card className="bg-primary text-primary-foreground h-fit">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Pencapaian Kami</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-lg bg-primary-foreground/10">
                  <div className="text-4xl font-bold mb-1">1000+</div>
                  <div className="text-primary-foreground/80 text-sm">Pelanggan Puas</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary-foreground/10">
                  <div className="text-4xl font-bold mb-1">500+</div>
                  <div className="text-primary-foreground/80 text-sm">Produk Terjual</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary-foreground/10">
                  <div className="text-4xl font-bold mb-1">5+</div>
                  <div className="text-primary-foreground/80 text-sm">Tahun Pengalaman</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary-foreground/10">
                  <div className="text-4xl font-bold mb-1">100%</div>
                  <div className="text-primary-foreground/80 text-sm">Garansi Resmi</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Nilai-Nilai Kami
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Kualitas</h3>
                <p className="text-muted-foreground">
                  Menggunakan material terbaik dan standar produksi tinggi
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Pelayanan</h3>
                <p className="text-muted-foreground">
                  Tim profesional siap membantu kebutuhan mebel Anda
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Kepercayaan</h3>
                <p className="text-muted-foreground">
                  Membangun hubungan jangka panjang dengan pelanggan
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Inovasi</h3>
                <p className="text-muted-foreground">
                  Terus menghadirkan desain terbaru yang trendy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-secondary/50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Siap Untuk Mengubah Ruang Anda?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Jelajahi koleksi mebel kami dan temukan furnitur impian Anda. 
              Tim kami siap membantu Anda menciptakan ruang yang nyaman dan estetik.
            </p>
            <a 
              href="/products" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Lihat Produk Kami
            </a>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default About;
