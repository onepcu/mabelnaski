import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase: number;
  applicable_products: string[] | null;
  max_uses: number | null;
  used_count: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { products } = useProducts();

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    min_purchase: "0",
    applicable_products: [] as string[],
    max_uses: "",
    valid_from: new Date().toISOString().slice(0, 16),
    valid_until: "",
    is_active: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoupons((data || []) as Coupon[]);
    } catch (error: any) {
      toast.error("Gagal memuat kupon: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      min_purchase: "0",
      applicable_products: [],
      max_uses: "",
      valid_from: new Date().toISOString().slice(0, 16),
      valid_until: "",
      is_active: true,
    });
    setEditingCoupon(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_purchase: parseFloat(formData.min_purchase) || 0,
        applicable_products: formData.applicable_products.length > 0 ? formData.applicable_products : null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until || null,
        is_active: formData.is_active,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from("coupons")
          .update(couponData)
          .eq("id", editingCoupon.id);

        if (error) throw error;
        toast.success("Kupon berhasil diperbarui");
      } else {
        const { error } = await supabase.from("coupons").insert(couponData);

        if (error) throw error;
        toast.success("Kupon berhasil ditambahkan");
      }

      setIsDialogOpen(false);
      resetForm();
      loadCoupons();
    } catch (error: any) {
      toast.error("Gagal menyimpan kupon: " + error.message);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_purchase: coupon.min_purchase.toString(),
      applicable_products: coupon.applicable_products || [],
      max_uses: coupon.max_uses?.toString() || "",
      valid_from: coupon.valid_from.slice(0, 16),
      valid_until: coupon.valid_until?.slice(0, 16) || "",
      is_active: coupon.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kupon ini?")) return;

    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id);

      if (error) throw error;
      toast.success("Kupon berhasil dihapus");
      loadCoupons();
    } catch (error: any) {
      toast.error("Gagal menghapus kupon: " + error.message);
    }
  };

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      applicable_products: prev.applicable_products.includes(productId)
        ? prev.applicable_products.filter((id) => id !== productId)
        : [...prev.applicable_products, productId],
    }));
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Kupon</h1>
          <p className="text-muted-foreground">Kelola kode kupon dan diskon</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? "Edit Kupon" : "Tambah Kupon Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Kode Kupon</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="DISKON50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_type">Tipe Diskon</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: "percentage" | "fixed") =>
                      setFormData({ ...formData, discount_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Persentase (%)</SelectItem>
                      <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discount_value">
                    Nilai Diskon {formData.discount_type === "percentage" ? "(%)" : "(Rp)"}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({ ...formData, discount_value: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="min_purchase">Minimum Pembelian (Rp)</Label>
                <Input
                  id="min_purchase"
                  type="number"
                  min="0"
                  value={formData.min_purchase}
                  onChange={(e) =>
                    setFormData({ ...formData, min_purchase: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="max_uses">Maksimal Penggunaan</Label>
                <Input
                  id="max_uses"
                  type="number"
                  min="1"
                  value={formData.max_uses}
                  onChange={(e) =>
                    setFormData({ ...formData, max_uses: e.target.value })
                  }
                  placeholder="Kosongkan untuk unlimited"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">Berlaku Dari</Label>
                  <Input
                    id="valid_from"
                    type="datetime-local"
                    value={formData.valid_from}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_from: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="valid_until">Berlaku Hingga</Label>
                  <Input
                    id="valid_until"
                    type="datetime-local"
                    value={formData.valid_until}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_until: e.target.value })
                    }
                    placeholder="Kosongkan untuk tanpa batas"
                  />
                </div>
              </div>

              <div>
                <Label>Produk yang Berlaku</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Kosongkan untuk berlaku pada semua produk
                </p>
                <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={product.id}
                        checked={formData.applicable_products.includes(product.id)}
                        onCheckedChange={() => handleProductToggle(product.id)}
                      />
                      <Label htmlFor={product.id} className="cursor-pointer">
                        {product.name} - Rp {product.price.toLocaleString("id-ID")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Kupon Aktif</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Batal
                </Button>
                <Button type="submit">
                  {editingCoupon ? "Update" : "Tambah"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Diskon</TableHead>
              <TableHead>Min. Belanja</TableHead>
              <TableHead>Penggunaan</TableHead>
              <TableHead>Berlaku</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="font-mono font-bold">{coupon.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {coupon.discount_type === "percentage"
                    ? `${coupon.discount_value}%`
                    : `Rp ${coupon.discount_value.toLocaleString("id-ID")}`}
                </TableCell>
                <TableCell>
                  Rp {coupon.min_purchase.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  {coupon.used_count} / {coupon.max_uses || "∞"}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(coupon.valid_from).toLocaleDateString("id-ID")}</div>
                    {coupon.valid_until && (
                      <div className="text-muted-foreground">
                        s/d {new Date(coupon.valid_until).toLocaleDateString("id-ID")}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      coupon.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {coupon.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {coupons.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Belum ada kupon. Tambahkan kupon pertama Anda!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
