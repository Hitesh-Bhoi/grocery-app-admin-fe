"use client";

import { useState } from "react";
import { useInventory, ProductItem } from "@/hooks/useInventory";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Edit2, Check, X, Loader2, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const statusColors: Record<string, string> = {
  "In Stock": "bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50",
  "Low Stock": "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:ring-orange-900/50",
  "Out of Stock": "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50",
};

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  // Edit mode state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editStock, setEditStock] = useState<string>("");

  const { data, isLoading, updateProduct, isUpdatingProduct } = useInventory({
    page,
    limit: 10,
    search,
    status: statusFilter,
    category: categoryFilter,
  });

  // Fetch full inventory to derive categories dynamically
  const { data: fullInventory } = useInventory({
    page: 1,
    limit: 1000,
  });

  const categoryOptions = useMemo(() => {
    if (!fullInventory?.data) return [];
    const categories = new Set(fullInventory.data.map((item) => item.category));
    return Array.from(categories).sort();
  }, [fullInventory?.data]);

  const productsList = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, pages: 1 };

  const handleStartEdit = (product: ProductItem) => {
    setEditingId(product._id);
    setEditPrice(String(product.price));
    setEditStock(String(product.stock));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id: string) => {
    const priceNum = parseFloat(editPrice);
    const stockNum = parseInt(editStock);
    if (isNaN(priceNum) || isNaN(stockNum)) return;

    updateProduct({ id, price: priceNum, stock: stockNum });
    setEditingId(null);
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
            Inventory & Stock
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 font-normal">
            Manage product stock quantities, pricing list, and category flags.
          </p>
        </div>
      </div>

      {/* Control filters bar */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search SKU or Name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-8 pr-3 py-2 w-full text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="pl-3 pr-8 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-200 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="pl-3 pr-8 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-200 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Inventory table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[350px]">
          {isLoading ? (
            <div className="p-6 space-y-4 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2.5">
                  <div className="h-4 w-32 bg-gray-100 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-20 bg-gray-100 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-12 bg-gray-100 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-12 bg-gray-100 dark:bg-slate-800 rounded" />
                  <div className="h-6 w-20 bg-gray-100 dark:bg-slate-800 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">SKU</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Product Name</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Category</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Price</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Stock Quantity</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {productsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                      No inventory items found.
                    </td>
                  </tr>
                ) : (
                  productsList.map((product) => {
                    const isEditing = editingId === product._id;
                    const statusClass = statusColors[product.status] || "bg-gray-50 text-gray-700";

                    return (
                      <tr key={product._id} className="hover:bg-gray-50/40 dark:hover:bg-slate-800/20 transition-colors">
                        {/* SKU */}
                        <td className="px-6 py-4.5 text-sm font-mono text-slate-500 dark:text-slate-400">{product.sku}</td>

                        {/* Name */}
                        <td className="px-6 py-4.5 text-sm font-semibold text-slate-800 dark:text-slate-200">{product.name}</td>

                        {/* Category */}
                        <td className="px-6 py-4.5 text-sm text-slate-600 dark:text-slate-400">{product.category}</td>

                        {/* Price */}
                        <td className="px-6 py-4.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-20 px-2 py-1 text-xs border border-gray-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-green-500"
                            />
                          ) : (
                            `₹${product.price.toFixed(2)}`
                          )}
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4.5 text-sm">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                              className="w-16 px-2 py-1 text-xs border border-gray-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-green-500"
                            />
                          ) : (
                            product.stock
                          )}
                        </td>

                        {/* Status badge */}
                        <td className="px-6 py-4.5">
                          <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", statusClass)}>
                            {product.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4.5 text-center">
                          {isEditing ? (
                            <div className="flex justify-center gap-1.5">
                              <button
                                onClick={() => handleSaveEdit(product._id)}
                                className="p-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors mx-auto"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
          <div className="text-gray-500 dark:text-slate-400">
            Showing <span className="font-semibold text-gray-800 dark:text-slate-200">{Math.min((page - 1) * 10 + 1, pagination.total)}</span> to{" "}
            <span className="font-semibold text-gray-800 dark:text-slate-200">{Math.min(page * 10, pagination.total)}</span> of{" "}
            <span className="font-semibold text-gray-800 dark:text-slate-200">{pagination.total}</span> entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-2.5 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
