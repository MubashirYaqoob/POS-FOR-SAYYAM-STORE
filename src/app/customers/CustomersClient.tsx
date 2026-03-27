"use client";

import { useState } from "react";
import { Plus, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { createCustomer } from "@/actions/customer";

export default function CustomersClient({ initialCustomers }: { initialCustomers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });

  const filteredCustomers = initialCustomers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleSave = async () => {
    if (!formData.name || !formData.phone) return alert("Name and phone are required");
    await createCustomer(formData);
    setIsModalOpen(false);
    setFormData({ name: "", phone: "", address: "" });
    window.location.reload();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-800">Customers</h2>
          <Button onClick={() => setIsModalOpen(true)} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" /> Add Customer
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <CardTitle>Directory</CardTitle>
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search name or phone..." 
                className="pl-9 h-9 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filteredCustomers.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">No customers found.</div>
              ) : (
                filteredCustomers.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedCustomer(c)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCustomer?.id === c.id ? 'bg-teal-50 border-l-4 border-primary' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.phone}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">Rs {c.totalPurchases}</p>
                        <p className="text-xs text-gray-500">
                          {c.lastVisit ? new Date(c.lastVisit).toLocaleDateString() : 'Never visited'}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${selectedCustomer?.id === c.id ? 'text-primary' : 'text-gray-300'}`} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-1">
        {selectedCustomer ? (
          <Card className="sticky top-6">
            <CardHeader className="pb-4 border-b bg-gray-50/50">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4">
                {selectedCustomer.name.charAt(0)}
              </div>
              <CardTitle className="text-xl mb-1">{selectedCustomer.name}</CardTitle>
              <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
              {selectedCustomer.address && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{selectedCustomer.address}</p>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-gray-800 mb-4 tracking-tight">Purchase History</h4>
              {selectedCustomer.sales.length > 0 ? (
                <div className="space-y-4">
                  {selectedCustomer.sales.map((sale: any) => (
                    <div key={sale.id} className="border bg-white rounded-lg p-3 text-sm flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800 mb-1">
                          {new Date(sale.saleDate).toLocaleDateString()}
                        </p>
                        <ul className="text-xs text-gray-500 space-y-0.5 max-w-[140px]">
                          {sale.items.slice(0, 2).map((i: any) => (
                            <li key={i.id} className="truncate">• {i.product.name} ({i.quantity})</li>
                          ))}
                          {sale.items.length > 2 && <li>• +{sale.items.length - 2} more</li>}
                        </ul>
                      </div>
                      <p className="font-semibold text-primary">Rs {sale.totalAmount}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No purchases yet.</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 min-h-[400px]">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium tracking-tight">Select a customer to view details</p>
          </Card>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[12px] shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 tracking-tight text-gray-800">Add Customer</h3>
            <div className="space-y-4">
              <Input label="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <Input label="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              <Input label="Address (Optional)" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
