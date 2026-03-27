"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { createExpense, deleteExpense } from "@/actions/expense";

const CATEGORIES = ["Rent", "Electricity", "Salaries", "Maintenance", "Supplies", "Other"];

export default function ExpensesClient({ initialExpenses }: { initialExpenses: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Other",
  });

  const handleSave = async () => {
    if (!formData.title || !formData.amount) return alert("Title and Amount are required");
    await createExpense(formData);
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this expense record?")) {
      await deleteExpense(id);
      window.location.reload();
    }
  };

  const totalExpenses = initialExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">Store Expenses</h2>
        <Button onClick={() => setIsModalOpen(true)} className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" /> Add Expense
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-800">Total Expenses (All Time)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">Rs {totalExpenses}</div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Expense History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left align-middle">
                <thead className="text-xs text-gray-700 bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Title</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {initialExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No expenses recorded.</td>
                    </tr>
                  ) : (
                    initialExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(exp.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">{exp.title}</td>
                        <td className="px-4 py-3">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{exp.category}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-red-500">-Rs {exp.amount}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleDelete(exp.id)} className="text-gray-400 hover:text-red-500 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[12px] shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Record Expense</h3>
            <div className="space-y-4">
              <Input label="Title/Description" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Amount (Rs)" type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                <Input label="Date" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              <Select 
                label="Category" 
                options={CATEGORIES.map(c => ({ value: c, label: c }))} 
                value={formData.category} 
                onChange={e => setFormData({ ...formData, category: e.target.value })} 
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Expense</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
