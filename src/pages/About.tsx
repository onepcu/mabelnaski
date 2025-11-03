import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Heart, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tentang MebelKu
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Menyediakan mebel berkualitas tinggi dengan desain modern untuk menciptakan 
            ruang hidup yang nyaman dan estetik sejak 2020.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Cerita Kami</h2>
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
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Nilai-Nilai Kami
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Kualitas</h3>
                <p className="text-muted-foreground">
                  Menggunakan material terbaik dan standar produksi tinggi
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Pelayanan</h3>
                <p className="text-muted-foreground">
                  Tim profesional siap membantu kebutuhan mebel Anda
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                  <Heart className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Kepercayaan</h3>
                <p className="text-muted-foreground">
                  Membangun hubungan jangka panjang dengan pelanggan
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                  <Target className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Inovasi</h3>
                <p className="text-muted-foreground">
                  Terus menghadirkan desain terbaru yang trendy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-primary-foreground/80">Pelanggan Puas</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-primary-foreground/80">Produk Terjual</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-primary-foreground/80">Garansi Resmi</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default About;
