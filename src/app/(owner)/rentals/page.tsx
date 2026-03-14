"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Utensils, Package, AlertTriangle } from "lucide-react";
import { PageHeader, DataTable, StatusBadge, StatsCard, TableFilters } from "@/components/OwnerPage";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES, GET_ALL_RENTALS } from "@/graphql/products";
import apolloClient from "@/graphql/apolloClient";

interface RentalTypes {
  id: string;
  categoryId: string;
  img: string;
  name: string;
  price: number;
  currentQuantity: number;
  totalQuantity: number;
}

interface CategoryTypes {
  id: string;
  name: string;
}

const RentalsPage: React.FC = () => {
  const router = useRouter();
  const [rentals, setRentals] = useState<RentalTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const { loading, error, data } = useQuery(GET_ALL_RENTALS, {
    client: apolloClient,
    fetchPolicy: "network-only",
  });

  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryData,
  } = useQuery(GET_ALL_CATEGORIES, {
    client: apolloClient,
  });

  useEffect(() => {
    if (data?.getRentals && categoryData?.getCategories) {
      setCategories(categoryData.getCategories);
      setRentals(data.getRentals);
    }
  }, [data, categoryData]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const getStockStatus = (current: number, total: number): string => {
    if (current <= 0) return "Out of Stock";
    if (current <= total * 0.2) return "Low Stock";
    return "In Stock";
  };

  const { filteredRentals, stats } = useMemo(() => {
    const filtered = rentals.filter(
      (rental) => {
        const matchesSearch =
          rental.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getCategoryName(rental.categoryId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
          categoryFilter === "all" || rental.categoryId === categoryFilter;

        const stockStatus = getStockStatus(rental.currentQuantity, rental.totalQuantity);
        const matchesStock =
          stockFilter === "all" ||
          stockStatus.toLowerCase().replace(/\s+/g, "-") === stockFilter;

        return matchesSearch && matchesCategory && matchesStock;
      }
    );

    const stats = {
      total: rentals.length,
      inStock: rentals.filter((r) => r.currentQuantity > r.totalQuantity * 0.2)
        .length,
      lowStock: rentals.filter(
        (r) =>
          r.currentQuantity > 0 && r.currentQuantity <= r.totalQuantity * 0.2
      ).length,
      outOfStock: rentals.filter((r) => r.currentQuantity <= 0).length,
    };

    return { filteredRentals: filtered, stats };
  }, [rentals, searchTerm, categories, categoryFilter, stockFilter]);

  const columns = [
    {
      key: "name",
      header: "Rental Item",
      render: (rental: RentalTypes) => (
        <div className="flex items-center gap-3">
          {rental.img && (
            <img
              src={rental.img}
              alt={rental.name}
              className="w-10 h-10 rounded-lg object-cover bg-gray-100"
            />
          )}
          <div className="font-medium text-gray-900">{rental.name}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (rental: RentalTypes) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {getCategoryName(rental.categoryId)}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (rental: RentalTypes) => (
        <span className="font-medium text-gray-900">
          ₱{rental.price.toLocaleString()}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Stock",
      render: (rental: RentalTypes) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                rental.currentQuantity <= 0
                  ? "bg-red-500"
                  : rental.currentQuantity <= rental.totalQuantity * 0.2
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
              style={{
                width: `${Math.min((rental.currentQuantity / rental.totalQuantity) * 100, 100)}%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {rental.currentQuantity}/{rental.totalQuantity}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (rental: RentalTypes) => (
        <StatusBadge
          status={getStockStatus(rental.currentQuantity, rental.totalQuantity)}
        />
      ),
    },
  ];

  const isLoading = loading || categoryLoading;
  const hasError = error || categoryError;

  return (
    <div className="space-y-3">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Total Items"
          value={stats.total}
          icon={<Utensils className="w-5 h-5" />}
        />
        <StatsCard
          title="In Stock"
          value={stats.inStock}
          icon={<Package className="w-5 h-5" />}
        />
        <StatsCard
          title="Low Stock"
          value={stats.lowStock}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <StatsCard
          title="Out of Stock"
          value={stats.outOfStock}
          icon={<Package className="w-5 h-5" />}
        />
      </div>

      {/* Page Header */}
      <PageHeader
        title="Rental Products"
        description="Manage all rental items available in the system"
        searchPlaceholder="Search by name or category..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        actionLabel="Add Rental"
        actionIcon={<Plus className="w-4 h-4" />}
        onAction={() => router.push("/rentals/add-rental")}
      />

      {/* Filters */}
      <TableFilters
        filters={[
          {
            key: "category",
            label: "Category",
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { label: "All Categories", value: "all" },
              ...categories.map((cat) => ({ label: cat.name, value: cat.id })),
            ],
          },
          {
            key: "stock",
            label: "Stock Status",
            value: stockFilter,
            onChange: setStockFilter,
            options: [
              { label: "All Stock", value: "all" },
              { label: "In Stock", value: "in-stock" },
              { label: "Low Stock", value: "low-stock" },
              { label: "Out of Stock", value: "out-of-stock" },
            ],
          },
        ]}
        onClearAll={() => {
          setCategoryFilter("all");
          setStockFilter("all");
        }}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredRentals}
        loading={isLoading}
        error={hasError || null}
        emptyTitle="No rentals found"
        emptyDescription="No rental items match your search criteria. Try adjusting your search or add a new rental."
        emptyIcon={<Utensils className="w-10 h-10 text-gray-400" />}
        onRowClick={(rental: RentalTypes) =>
          router.push(`/rentals/${rental.id}`)
        }
        keyExtractor={(rental: RentalTypes) => rental.id}
      />
    </div>
  );
};

export default RentalsPage;