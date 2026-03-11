"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Tag, FolderTree, Layers } from "lucide-react";
import { PageHeader, DataTable, StatusBadge, StatsCard, TableFilters } from "@/components/OwnerPage";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "@/graphql/products";
import apolloClient from "@/graphql/apolloClient";

interface CategoryTypes {
  id: string;
  name: string;
  type: string;
}

const CategoriesPage: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { loading, error, data } = useQuery(GET_ALL_CATEGORIES, {
    client: apolloClient,
  });

  useEffect(() => {
    if (data?.getCategories) {
      setCategories(data.getCategories);
    }
  }, [data]);

  const { filteredCategories, stats, typeOptions } = useMemo(() => {
    const filtered = categories.filter(
      (category) => {
        const matchesSearch =
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType =
          typeFilter === "all" || category.type.toLowerCase() === typeFilter.toLowerCase();
        return matchesSearch && matchesType;
      }
    );

    const typeCounts = categories.reduce(
      (acc: Record<string, number>, cat) => {
        acc[cat.type] = (acc[cat.type] || 0) + 1;
        return acc;
      },
      {}
    );

    const typeOptions = [...new Set(categories.map((c) => c.type))];

    return {
      filteredCategories: filtered,
      stats: {
        total: categories.length,
        types: Object.keys(typeCounts).length,
        rental: typeCounts["Rental"] || 0,
        partner: typeCounts["Partner"] || 0,
      },
      typeOptions,
    };
  }, [categories, searchTerm, typeFilter]);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "rental":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "partner":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "service":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const columns = [
    {
      key: "name",
      header: "Category Name",
      render: (category: CategoryTypes) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-camouflage-100 to-camouflage-200 flex items-center justify-center flex-shrink-0">
            <Tag className="w-4 h-4 text-camouflage-600" />
          </div>
          <span className="font-medium text-gray-900">{category.name}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (category: CategoryTypes) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(category.type)}`}
        >
          {category.type}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Total Categories"
          value={stats.total}
          icon={<FolderTree className="w-5 h-5" />}
        />
        <StatsCard
          title="Category Types"
          value={stats.types}
          icon={<Layers className="w-5 h-5" />}
        />
        <StatsCard
          title="Rental Categories"
          value={stats.rental}
          icon={<Tag className="w-5 h-5" />}
        />
        <StatsCard
          title="Partner Categories"
          value={stats.partner}
          icon={<Tag className="w-5 h-5" />}
        />
      </div>

      {/* Page Header */}
      <PageHeader
        title="Categories"
        description="Manage categories for rentals, partners, and other items"
        searchPlaceholder="Search by name or type..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        actionLabel="Add Category"
        actionIcon={<Plus className="w-4 h-4" />}
        onAction={() => router.push("/categories/add-category")}
      />

      {/* Filters */}
      <TableFilters
        filters={[
          {
            key: "type",
            label: "Type",
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { label: "All Types", value: "all" },
              ...typeOptions.map((t) => ({ label: t, value: t.toLowerCase() })),
            ],
          },
        ]}
        onClearAll={() => setTypeFilter("all")}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredCategories}
        loading={loading}
        error={error || null}
        emptyTitle="No categories found"
        emptyDescription="No categories match your search criteria. Try adjusting your search or add a new category."
        emptyIcon={<FolderTree className="w-10 h-10 text-gray-400" />}
        onRowClick={(category: CategoryTypes) =>
          router.push(`/categories/${category.id}`)
        }
        keyExtractor={(category: CategoryTypes) => category.id}
      />
    </div>
  );
};

export default CategoriesPage;
