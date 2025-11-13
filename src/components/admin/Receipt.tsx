interface ReceiptProps {
  orderNumber: string;
  date: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  payment: number;
  change: number;
  couponCode?: string;
}

export default function Receipt({
  orderNumber,
  date,
  items,
  subtotal,
  discount,
  total,
  payment,
  change,
  couponCode,
}: ReceiptProps) {
  return (
    <div className="receipt-container bg-white text-black p-8 max-w-sm mx-auto font-mono text-sm">
      {/* Header */}
      <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
        <h1 className="text-2xl font-bold mb-2">MABEL NASKI</h1>
        <p className="text-xs">Furniture & Interior</p>
        <p className="text-xs mt-2">Jl. Contoh No. 123</p>
        <p className="text-xs">Telp: (021) 1234-5678</p>
      </div>

      {/* Order Info */}
      <div className="mb-4 text-xs">
        <div className="flex justify-between mb-1">
          <span>No. Transaksi:</span>
          <span className="font-bold">{orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Tanggal:</span>
          <span>{date}</span>
        </div>
      </div>

      {/* Items */}
      <div className="border-t-2 border-b-2 border-dashed border-gray-400 py-3 mb-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left pb-2">Item</th>
              <th className="text-center pb-2">Qty</th>
              <th className="text-right pb-2">Harga</th>
              <th className="text-right pb-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 pr-2">{item.name}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">{item.price.toLocaleString("id-ID")}</td>
                <td className="text-right font-semibold">
                  {(item.price * item.quantity).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="space-y-2 text-xs mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        {discount > 0 && (
          <>
            <div className="flex justify-between text-green-600">
              <span>Diskon {couponCode ? `(${couponCode})` : ""}:</span>
              <span>- Rp {discount.toLocaleString("id-ID")}</span>
            </div>
          </>
        )}
        <div className="flex justify-between font-bold text-base border-t-2 border-gray-400 pt-2">
          <span>TOTAL:</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between border-t border-gray-300 pt-2">
          <span>Bayar:</span>
          <span>Rp {payment.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Kembali:</span>
          <span>Rp {change.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 border-dashed border-gray-400 pt-4 text-xs">
        <p className="mb-2">Terima kasih atas kunjungan Anda!</p>
        <p className="mb-2">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
        <p className="font-bold">*** SIMPAN STRUK INI ***</p>
      </div>
    </div>
  );
}
