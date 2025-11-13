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
    <div className="receipt-container bg-white text-black font-mono text-sm" style={{
      width: '80mm',
      maxWidth: '80mm',
      margin: '0 auto',
      padding: '20px',
      fontSize: '12px',
      lineHeight: '1.4'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '2px dashed #666', paddingBottom: '12px', marginBottom: '12px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '6px' }}>MABEL NASKI</h1>
        <p style={{ fontSize: '10px' }}>Furniture & Interior</p>
        <p style={{ fontSize: '10px', marginTop: '6px' }}>Jl. Contoh No. 123</p>
        <p style={{ fontSize: '10px' }}>Telp: (021) 1234-5678</p>
      </div>

      {/* Order Info */}
      <div style={{ marginBottom: '12px', fontSize: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>No. Transaksi:</span>
          <span style={{ fontWeight: 'bold' }}>{orderNumber}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Tanggal:</span>
          <span>{date}</span>
        </div>
      </div>

      {/* Items */}
      <div style={{ borderTop: '2px dashed #666', borderBottom: '2px dashed #666', paddingTop: '10px', paddingBottom: '10px', marginBottom: '10px' }}>
        <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #999' }}>
              <th style={{ textAlign: 'left', paddingBottom: '6px' }}>Item</th>
              <th style={{ textAlign: 'center', paddingBottom: '6px' }}>Qty</th>
              <th style={{ textAlign: 'right', paddingBottom: '6px' }}>Harga</th>
              <th style={{ textAlign: 'right', paddingBottom: '6px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ paddingTop: '6px', paddingBottom: '6px', paddingRight: '6px' }}>{item.name}</td>
                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{item.price.toLocaleString("id-ID")}</td>
                <td style={{ textAlign: 'right', fontWeight: '600' }}>
                  {(item.price * item.quantity).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{ fontSize: '10px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span>Subtotal:</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', marginBottom: '6px' }}>
            <span>Diskon {couponCode ? `(${couponCode})` : ""}:</span>
            <span>- Rp {discount.toLocaleString("id-ID")}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', borderTop: '2px solid #666', paddingTop: '6px', marginBottom: '6px' }}>
          <span>TOTAL:</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '6px', marginBottom: '6px' }}>
          <span>Bayar:</span>
          <span>Rp {payment.toLocaleString("id-ID")}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
          <span>Kembali:</span>
          <span>Rp {change.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', borderTop: '2px dashed #666', paddingTop: '12px', fontSize: '10px' }}>
        <p style={{ marginBottom: '6px' }}>Terima kasih atas kunjungan Anda!</p>
        <p style={{ marginBottom: '6px' }}>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
        <p style={{ fontWeight: 'bold' }}>*** SIMPAN STRUK INI ***</p>
      </div>
    </div>
  );
}
