import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card py-12 border-t border-border mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">MebelKu</h3>
            <p className="text-muted-foreground">
              Solusi mebel berkualitas untuk rumah impian Anda
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produk</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/products" className="hover:text-primary transition-colors">Semua Produk</Link></li>
              <li>Meja & Kursi</li>
              <li>Sofa</li>
              <li>Tempat Tidur</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Tentang Kami</li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Kontak</Link></li>
              <li>Blog</li>
              <li>Karir</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Bantuan</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>FAQ</li>
              <li>Pengiriman</li>
              <li>Pengembalian</li>
              <li>Garansi</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 MebelKu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
