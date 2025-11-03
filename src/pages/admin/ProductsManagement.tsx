import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description: string;
  material: string;
  dimensions: string;
  color: string;
  stock: number;
  order_count?: number;
}

const ProductsManagement = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
    material: "",
    dimensions: "",
    color: "",
    stock: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast.error("Tidak memiliki akses admin");
        navigate("/");
        return;
      }

      await loadProducts();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memuat produk");
      return;
    }

    setProducts(data || []);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsUploading(true);

    try {
      let allImages = [...existingImages];

      // Upload new images if selected
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => handleImageUpload(file));
        const newImageUrls = await Promise.all(uploadPromises);
        allImages = [...allImages, ...newImageUrls];
      }

      // Use first image as main image
      const mainImage = allImages[0] || formData.image;

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        image: mainImage,
        images: allImages,
        category: formData.category,
        description: formData.description,
        material: formData.material,
        dimensions: formData.dimensions,
        color: formData.color,
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast.success("Produk berhasil diupdate");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;
        toast.success("Produk berhasil ditambahkan");
      }

      setIsDialogOpen(false);
      resetForm();
      await loadProducts();
    } catch (error: any) {
      toast.error("Gagal menyimpan produk: " + error.message);
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      description: product.description,
      material: product.material,
      dimensions: product.dimensions,
      color: product.color,
      stock: product.stock.toString(),
    });
    setExistingImages(product.images || [product.image]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Gagal menghapus produk");
      return;
    }

    toast.success("Produk berhasil dihapus");
    await loadProducts();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      image: "",
      category: "",
      description: "",
      material: "",
      dimensions: "",
      color: "",
      stock: "",
    });
    setEditingProduct(null);
    setImageFiles([]);
    setExistingImages([]);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Manajemen Produk">
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Memuat data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manajemen Produk">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Produk</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Gambar Produk (Bisa Lebih dari 1)</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        setImageFiles(files);
                      }
                    }}
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pilih beberapa gambar sekaligus dengan Ctrl+Click (Windows) atau Cmd+Click (Mac)
                  </p>
                  
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Gambar saat ini:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {existingImages.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`Preview ${idx + 1}`} 
                              className="w-full h-24 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* New Images Preview */}
                  {imageFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Gambar baru ({imageFiles.length}):</p>
                      <div className="grid grid-cols-4 gap-2">
                        {imageFiles.map((file, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`New ${idx + 1}`} 
                              className="w-full h-24 object-cover rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stok</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensi</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Warna</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading 
                    ? "Mengupload..." 
                    : editingProduct 
                    ? "Update Produk" 
                    : "Tambah Produk"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>Rp {product.price.toLocaleString("id-ID")}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ProductsManagement;