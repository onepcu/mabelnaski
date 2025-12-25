import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Instagram, Facebook, Music2 } from "lucide-react";

const Footer = () => {
  const { data: settings } = useSiteSettings();

  return (
    <footer className="bg-card py-12 border-t border-border mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">
              {settings?.site_name || "MebelKu"}
            </h3>
            <p className="text-muted-foreground">
              {settings?.site_description || "Solusi mebel berkualitas untuk rumah impian Anda"}
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Music2 className="h-5 w-5" />
                </a>
              )}
            </div>
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
              <li><Link to="/about" className="hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Kontak</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontak</h4>
            <ul className="space-y-2 text-muted-foreground">
              {settings?.phone && <li>Telp: {settings.phone}</li>}
              {settings?.email && <li>Email: {settings.email}</li>}
              {settings?.address && <li>{settings.address}</li>}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>{settings?.footer_text || `© ${new Date().getFullYear()} ${settings?.site_name || "MebelKu"}. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
