"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { createProduct, updateProduct, deleteProduct } from "@/actions/product";
import { Select } from "@/components/ui/Select";

const CATEGORIES = ["Shalwar Kameez", "Jeans", "Shirt", "Dupatta", "Kurti", "Jacket", "Other"];

export default function InventoryClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Shalwar Kameez",
    buyingPrice: "",
    sellingPrice: "",
    stockQuantity: "",
    sizes: "",
    colors: "",
    barcode: "",
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.barcode && p.barcode.includes(searchTerm))
  );

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        buyingPrice: item.buyingPrice.toString(),
        sellingPrice: item.sellingPrice.toString(),
        stockQuantity: item.stockQuantity.toString(),
        sizes: JSON.parse(item.sizes).join(", "),
        colors: JSON.parse(item.colors).join(", "),
        barcode: item.barcode || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "", category: "Shalwar Kameez", buyingPrice: "", sellingPrice: "", stockQuantity: "", sizes: "", colors: "", barcode: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const dataToSave = {
      ...formData,
      sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean),
      colors: formData.colors.split(",").map(c => c.trim()).filter(Boolean),
    };

    if (editingItem) {
      await updateProduct(editingItem.id, dataToSave);
    } else {
      await createProduct(dataToSave);
    }
    setIsModalOpen(false);
    window.location.reload(); // Quick refresh to sync Server Component state
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Inventory</h2>
        <div className="flex w-full sm:w-auto space-x-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search products..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => handleOpenModal()} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const sizes = JSON.parse(product.sizes || "[]");
          const isLowStock = product.stockQuantity < 10;
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4 flex space-x-1">
                <button onClick={() => handleOpenModal(product)} className="p-1.5 text-gray-500 hover:text-primary hover:bg-teal-50 rounded-md transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <CardContent className="p-5">
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium mb-2 pr-8">{product.category}</span>
                <h3 className="font-semibold text-lg text-gray-800 mb-1">{product.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-bold text-primary">Rs {product.sellingPrice}</div>
                  <div className={`text-sm font-medium px-2 py-0.5 rounded-full ${isLowStock ? "bg-amber-100 text-accent" : "bg-teal-50 text-primary"}`}>
                    Stock: {product.stockQuantity}
                  </div>
                </div>
                {sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {sizes.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600 rounded-full">{s}</span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[12px] shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold">{editingItem ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <Select 
                label="Category" 
                value={formData.category} 
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                options={CATEGORIES.map(c => ({ value: c, label: c }))}
              />
              <Input label="Buying Price (Rs)" type="number" value={formData.buyingPrice} onChange={e => setFormData({ ...formData, buyingPrice: e.target.value })} required />
              <Input label="Selling Price (Rs)" type="number" value={formData.sellingPrice} onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })} required />
              <Input label="Stock Quantity" type="number" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} required />
              <Input label="Barcode (Optional)" value={formData.barcode} onChange={e => setFormData({ ...formData, barcode: e.target.value })} />
              <div className="md:col-span-2 space-y-4">
                <Input label="Sizes (Comma separated)" placeholder="e.g. S, M, L, XL or 32, 34, 36" value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} />
                <Input label="Colors (Comma separated)" placeholder="e.g. Red, Blue, Black" value={formData.colors} onChange={e => setFormData({ ...formData, colors: e.target.value })} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Product</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
