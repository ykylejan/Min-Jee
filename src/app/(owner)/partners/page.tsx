"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UserRoundPlus, Contact, MapPin, Phone, Building2 } from "lucide-react";
import { PageHeader, DataTable, StatsCard, TableFilters } from "@/components/OwnerPage";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "@/graphql/products";
import { GET_ALL_PARTNERS } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import apolloClient from "@/graphql/apolloClient";
import { toast } from "sonner";

interface PartnerTypes {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  categoryId: string;
}

const PartnersPage = () => {
  const router = useRouter();
  const [partners, setPartners] = useState<PartnerTypes[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    loading: partnersLoading,
    error: partnersError,
    data: partnersData,
  } = useQuery(GET_ALL_PARTNERS, {
    client: apolloClientPartner,
    fetchPolicy: "network-only",
  });

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(GET_ALL_CATEGORIES, {
    client: apolloClient,
    fetchPolicy: "cache-and-network",
  });

  const getPartnerCategories = (categories: any[] = []) => {
    return categories.filter((category) => category.type === "Partner");
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  useEffect(() => {
    try {
      if (partnersData?.getPartner && categoriesData?.getCategories) {
        const partnerCategories = getPartnerCategories(
          categoriesData.getCategories
        );
        setCategories(partnerCategories);
        setPartners(partnersData.getPartner);
      }
    } catch (error) {
      toast.error("Failed to fetch data. Please try again later.");
    }
  }, [partnersData, partnersLoading, categoriesData, categoriesLoading]);

  const { filteredPartners, stats } = useMemo(() => {
    const filtered = partners.filter((partner) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        partner.name.toLowerCase().includes(searchLower) ||
        partner.address.toLowerCase().includes(searchLower) ||
        partner.contactNumber.includes(searchTerm) ||
        getCategoryName(partner.categoryId).toLowerCase().includes(searchLower);

      const matchesCategory =
        categoryFilter === "all" || partner.categoryId === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    const categoryCounts = partners.reduce(
      (acc: Record<string, number>, partner) => {
        const cat = getCategoryName(partner.categoryId);
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      },
      {}
    );

    return {
      filteredPartners: filtered,
      stats: {
        total: partners.length,
        categories: Object.keys(categoryCounts).length,
      },
    };
  }, [partners, searchTerm, categories, categoryFilter]);

  const columns = [
    {
      key: "name",
      header: "Partner",
      render: (partner: PartnerTypes) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-camouflage-300 to-camouflage-500 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="font-medium text-gray-900">{partner.name}</div>
        </div>
      ),
    },
    {
      key: "address",
      header: "Address",
      render: (partner: PartnerTypes) => (
        <span className="inline-flex items-center gap-1.5 text-gray-600">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{partner.address}</span>
        </span>
      ),
    },
    {
      key: "contactNumber",
      header: "Phone",
      render: (partner: PartnerTypes) => (
        <span className="inline-flex items-center gap-1.5 text-gray-600">
          <Phone className="w-3.5 h-3.5" />
          {partner.contactNumber}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (partner: PartnerTypes) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-camouflage-50 text-camouflage-700">
          {getCategoryName(partner.categoryId)}
        </span>
      ),
    },
  ];

  const isLoading = partnersLoading || categoriesLoading;
  const hasError = partnersError || categoriesError;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard
          title="Total Partners"
          value={stats.total}
          icon={<Contact className="w-5 h-5" />}
        />
        <StatsCard
          title="Partner Categories"
          value={stats.categories}
          icon={<Building2 className="w-5 h-5" />}
        />
      </div>

      {/* Page Header */}
      <PageHeader
        title="Partner List"
        description="Click a partner row to view or edit details"
        searchPlaceholder="Search by name, address, or category..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        actionLabel="Add Partner"
        actionIcon={<UserRoundPlus className="w-4 h-4" />}
        onAction={() => router.push("/partners/add-partner")}
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
              ...categories.map((cat: any) => ({ label: cat.name, value: cat.id })),
            ],
          },
        ]}
        onClearAll={() => setCategoryFilter("all")}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredPartners}
        loading={isLoading}
        error={hasError || null}
        emptyTitle="No partners found"
        emptyDescription="No partners match your search criteria. Try adjusting your search or add a new partner."
        emptyIcon={<Contact className="w-10 h-10 text-gray-400" />}
        onRowClick={(partner: PartnerTypes) =>
          router.push(`/partners/${partner.id}`)
        }
        keyExtractor={(partner: PartnerTypes) => partner.id}
      />
    </div>
  );
};

export default PartnersPage;
