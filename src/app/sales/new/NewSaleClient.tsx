"use client";

import { useState, useMemo, useRef } from "react";
import { Search, Plus, Trash2, Printer, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { createSale } from "@/actions/sale";

export default function NewSaleClient({ products, customers }: { products: any[]; customers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [discount, setDiscount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter((p) => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.barcode && p.barcode.includes(searchTerm))
    ).slice(0, 5);
  }, [searchTerm, products]);

  const addToCart = (product: any, size: string = "", color: string = "") => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );
      if (existing) {
        if (existing.quantity >= product.stockQuantity) return prev;
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          size,
          color,
          quantity: 1,
          unitPrice: product.sellingPrice,
          subtotal: product.sellingPrice,
          maxStock: product.stockQuantity,
        },
      ];
    });
    setSearchTerm("");
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (newQty > item.maxStock) return item;
        return { ...item, quantity: newQty, subtotal: newQty * item.unitPrice };
      })
    );
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const discountAmount = parseFloat(discount) || 0;
  const grandTotal = Math.max(subtotal - discountAmount, 0);

  const handleCompleteSale = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    setIsProcessing(true);

    const result = await createSale({
      customerId: customerId || null,
      totalAmount: grandTotal,
      discount: discountAmount,
      paidAmount: grandTotal,
      paymentMethod,
      items: cart,
    });

    if (result.success) {
      setReceiptData({
        ...result.sale,
        items: cart,
        customerName: customers.find((c) => c.id === customerId)?.name || "Walk-in Customer",
      });
      setCart([]);
      setCustomerId("");
      setDiscount("0");
    } else {
      alert("Error: " + result.error);
    }
    setIsProcessing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (receiptData) {
    return (
      <Card className="max-w-md mx-auto print:max-w-full print:shadow-none print:border-none">
        <CardContent className="p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 print:hidden">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Sayyam Store</h2>
          <p className="text-gray-500 text-sm">{new Date(receiptData.saleDate).toLocaleString()}</p>
          <div className="border-t border-b border-dashed py-4 my-4 space-y-2 text-left">
            <div className="flex justify-between text-sm font-medium">
              <span>Customer:</span>
              <span>{receiptData.customerName}</span>
            </div>
            {receiptData.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-start text-sm">
                <div>
                  <p>{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} x Rs {item.unitPrice} {item.size ? `(${item.size})` : ""} {item.color ? `[${item.color}]` : ""}
                  </p>
                </div>
                <p>Rs {item.subtotal}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-sm text-right">
            <p className="flex justify-between"><span>Subtotal:</span> <span>Rs {receiptData.totalAmount + receiptData.discount}</span></p>
            {receiptData.discount > 0 && (
              <p className="flex justify-between text-red-500"><span>Discount:</span> <span>- Rs {receiptData.discount}</span></p>
            )}
            <p className="flex justify-between font-bold text-lg border-t border-gray-200 mt-2 pt-2">
              <span>Total:</span> <span>Rs {receiptData.totalAmount}</span>
            </p>
          </div>
          <p className="text-xs text-gray-400 pt-4">Paid via {receiptData.paymentMethod}</p>
          <div className="flex space-x-3 pt-6 print:hidden">
            <Button onClick={() => setReceiptData(null)} variant="outline" className="flex-1">New Sale</Button>
            <Button onClick={handlePrint} className="flex-1"><Printer className="w-4 h-4 mr-2" /> Print Receipt</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Product Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products by name or barcode..."
                className="pl-9 h-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredProducts.length > 0 && (
              <div className="mt-2 border rounded-md shadow-sm max-h-64 overflow-y-auto divide-y divide-gray-100 bg-white">
                {filteredProducts.map((p) => {
                  const sizes = JSON.parse(p.sizes || "[]");
                  const colors = JSON.parse(p.colors || "[]");
                  return (
                    <div key={p.id} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">{p.name}</p>
                        <p className="text-sm text-gray-500 border-r pr-2 inline-block mr-2">Rs {p.sellingPrice}</p>
                        <p className={`text-sm inline-block ${p.stockQuantity < 10 ? 'text-accent' : 'text-primary'}`}>{p.stockQuantity} in stock</p>
                      </div>
                      <div className="flex space-x-2 items-center">
                        {sizes.length > 0 && (
                          <Select 
                            options={sizes.map((s: string) => ({ value: s, label: s }))}
                            onChange={(e) => { p._selectedSize = e.target.value; }}
                            className="w-20 h-8 text-xs py-1 px-2"
                          />
                        )}
                        {colors.length > 0 && (
                          <Select 
                            options={colors.map((c: string) => ({ value: c, label: c }))}
                            onChange={(e) => { p._selectedColor = e.target.value; }}
                            className="w-24 h-8 text-xs py-1 px-2"
                          />
                        )}
                        <Button 
                          size="sm" 
                          onClick={() => addToCart(p, p._selectedSize || sizes[0] || "", p._selectedColor || colors[0] || "")}
                          disabled={p.stockQuantity === 0}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {searchTerm && filteredProducts.length === 0 && (
              <div className="mt-2 p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-md">
                No products found matching "{searchTerm}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cart Table */}
        <Card>
          <CardHeader>
            <CardTitle>Cart Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left align-middle border-t">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Qty</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cart.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Cart is empty</td>
                  </tr>
                )}
                {cart.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{item.productName}</div>
                      <div className="text-xs text-gray-500">
                        {item.size && `Size: ${item.size} `}
                        {item.color && `Color: ${item.color}`}
                      </div>
                    </td>
                    <td className="px-4 py-3">Rs {item.unitPrice}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <button 
                          className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                        >+</button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">Rs {item.subtotal}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => removeFromCart(index)} className="text-gray-400 hover:text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {/* Checkout Summary */}
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Checkout Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Customer (Optional)</label>
              <Select 
                options={[
                  { value: "", label: "Walk-in Customer" }, 
                  ...customers.map(c => ({ value: c.id, label: c.name }))
                ]}
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs {subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Discount (Rs)</span>
                <Input 
                  type="number" 
                  min="0"
                  className="w-24 h-8 text-right pr-2 py-1 placeholder:text-gray-400 placeholder:text-right"
                  placeholder="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Grand Total</span>
                <span>Rs {grandTotal}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <label className="text-sm font-medium text-gray-700 block mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {["Cash", "Card", "Easypaisa"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                      paymentMethod === method
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full h-12 text-base mt-6" 
              onClick={handleCompleteSale}
              disabled={cart.length === 0 || isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete Sale"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
