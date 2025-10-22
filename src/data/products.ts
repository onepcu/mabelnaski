import productTable from "@/assets/product-table.jpg";
import productSofa from "@/assets/product-sofa.jpg";
import productBookshelf from "@/assets/product-bookshelf.jpg";
import productChair from "@/assets/product-chair.jpg";
import productBed from "@/assets/product-bed.jpg";
import productWardrobe from "@/assets/product-wardrobe.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  material: string;
  dimensions: string;
  color: string;
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Meja Makan Minimalis Jati",
    price: 4500000,
    image: productTable,
    category: "Meja Makan",
    description: "Meja makan minimalis dengan desain modern terbuat dari kayu jati pilihan. Cocok untuk ruang makan keluarga dengan kapasitas 6 orang. Finishing natural yang menampilkan keindahan serat kayu alami.",
    material: "Kayu Jati Solid",
    dimensions: "180cm x 90cm x 75cm",
    color: "Natural Wood",
    stock: 8
  },
  {
    id: 2,
    name: "Sofa Modern 3 Seater",
    price: 6800000,
    image: productSofa,
    category: "Sofa",
    description: "Sofa modern dengan bahan fabric premium yang nyaman dan tahan lama. Desain minimalis cocok untuk ruang tamu modern. Dilengkapi dengan bantal cushion yang empuk.",
    material: "Fabric Premium & Kayu Mahoni",
    dimensions: "200cm x 85cm x 80cm",
    color: "Beige",
    stock: 5
  },
  {
    id: 3,
    name: "Rak Buku Skandinavia",
    price: 3200000,
    image: productBookshelf,
    category: "Rak & Storage",
    description: "Rak buku dengan desain Skandinavia yang fungsional dan estetik. Lima tingkat penyimpanan yang luas untuk koleksi buku dan dekorasi Anda. Material kayu berkualitas dengan finishing natural.",
    material: "Kayu Oak & MDF",
    dimensions: "120cm x 40cm x 180cm",
    color: "Natural Oak",
    stock: 12
  },
  {
    id: 4,
    name: "Kursi Santai Arm Chair",
    price: 2400000,
    image: productChair,
    category: "Kursi",
    description: "Kursi santai dengan desain ergonomis yang nyaman untuk bersantai. Bahan fabric lembut dengan warna hijau yang menenangkan. Cocok untuk sudut baca atau ruang keluarga.",
    material: "Fabric & Kayu Solid",
    dimensions: "75cm x 80cm x 85cm",
    color: "Forest Green",
    stock: 15
  },
  {
    id: 5,
    name: "Tempat Tidur Queen Size",
    price: 5500000,
    image: productBed,
    category: "Tempat Tidur",
    description: "Tempat tidur queen size dengan frame kayu solid yang kokoh. Desain headboard minimalis yang elegan. Sudah termasuk divan penyimpanan di bagian bawah.",
    material: "Kayu Jati & MDF",
    dimensions: "160cm x 200cm x 120cm",
    color: "Walnut Brown",
    stock: 6
  },
  {
    id: 6,
    name: "Lemari Pakaian 3 Pintu",
    price: 7200000,
    image: productWardrobe,
    category: "Lemari",
    description: "Lemari pakaian besar dengan 3 pintu dan cermin di tengah. Ruang penyimpanan yang luas dengan gantungan baju dan rak. Material kayu berkualitas tinggi dengan finishing glossy.",
    material: "Kayu Mahoni & Kaca",
    dimensions: "180cm x 60cm x 200cm",
    color: "Dark Brown",
    stock: 4
  }
];
