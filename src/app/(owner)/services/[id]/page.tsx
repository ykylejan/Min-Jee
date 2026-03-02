"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ImageUploader";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { useQuery } from "@apollo/client";
import { GET_SERVICE_BY_ID } from "@/graphql/people";
import apolloClient from "@/graphql/apolloClient";
import { ApolloError } from "@apollo/client";
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormActions,
} from "@/components/OwnerPage";

// Zod schemas
const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  service_items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        price: z.number().min(1, "Price must be at least 1"),
        description: z.string().optional(),
      })
    )
    .min(1, "At least one service item is required"),
});

const addServiceItemSchema = z.object({
  addName: z.string().min(1, "Item name is required"),
  addPrice: z.number().min(1, "Price must be at least 1"),
  addDescription: z.string().optional(),
});
type AddServiceItemFormValues = z.infer<typeof addServiceItemSchema>;

type AddServiceItem = {
  name: string;
  price: number;
  description?: string;
  id?: string;
};

type ServiceFormValues = z.infer<typeof serviceSchema>;

const editServiceItemSchema = z.object({
  editName: z.string().min(1, "Item name is required"),
  editPrice: z.number().min(1, "Price must be at least 1"),
  editDescription: z.string().optional(),
  ediId: z.string(),
});
type EditServiceItemFormValues = z.infer<typeof editServiceItemSchema>;

const EditServicePage = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [serviceItems, setServiceItems] = useState<AddServiceItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Main service form
  const {
    register,
    handleSubmit,
    resetField,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      service_items: [{ name: "", price: 0, description: "" }],
    },
  });

  const {
    control: editControl,
    handleSubmit: editHandleSubmit,
    reset: editReset,
    formState: { errors: editErrors },
  } = useForm<EditServiceItemFormValues>({
    resolver: zodResolver(editServiceItemSchema),
    defaultValues: {
      editName: "",
      editPrice: 0,
      editDescription: "",
      ediId: "",
    },
  });
  // Add Service Item form (modal)
  const {
    register: addRegister,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
    formState: { errors: addErrors },
  } = useForm<AddServiceItemFormValues>({
    resolver: zodResolver(addServiceItemSchema),
    defaultValues: {
      addName: "",
      addPrice: 0,
      addDescription: "",
    },
  });

  // Fetch service data
  const { data, loading, error } = useQuery(GET_SERVICE_BY_ID, {
    variables: { id: serviceId },
    fetchPolicy: "network-only",
    client: apolloClient,
  });

  useEffect(() => {
    if (data && data.getServiceById) {
      const service = data.getServiceById;
      reset({
        name: service.name || "",
        service_items: service.serviceItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          description: item.description || "",
        })),
      });
      setServiceItems(service.serviceItems);
      if (service.img) setCurrentImageUrl(service.img);
    }
  }, [data, reset]);

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/o/services/${serviceId}`);
      toast.success("Service Deleted Successfully");
      router.push("/services");
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error instanceof ApolloError) {
        errorMessage = error.message;
      } else if (error.response?.data?.detail?.[0]?.msg === "Field required") {
        errorMessage = "Please fill in all the required fields.";
      }
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Add Service Item handler
  const onAddServiceItem = async (values: AddServiceItemFormValues) => {
    setIsAddingItem(true);
    try {
      // API call to add service item
      const response = await api.post(
        `/o/services/${serviceId}/service_item`,
        {
          name: values.addName,
          price: values.addPrice,
          description: values.addDescription || "",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data) {
        const newItem = {
          name: values.addName,
          price: values.addPrice,
          description: values.addDescription || "",
        };
        setServiceItems([...serviceItems, newItem]);
        toast.success("Service Item Added Successfully");
        setShowAddModal(false);
        resetAddForm();
      }
    } catch (error) {
      console.error("Error adding service item:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAddingItem(false);
    }
  };

  // Main form submit
  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        await api.patch(`/o/services/${serviceId}/img`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      await api.patch(
        `/o/services/${serviceId}`,
        {
          name: data.name,
          service_items: serviceItems,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Service updated successfully.");
      router.push("/services");
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditServiceItem = async (values: EditServiceItemFormValues) => {
    if (editingIndex === null) return;
    try {
      const response = await api.patch(
        `/o/services/${serviceId}/service_item/${values.ediId}`,
        {
          name: values.editName,
          price: values.editPrice,
          description: values.editDescription,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // Update local state if API call is successful
      const updatedItems = [...serviceItems];
      updatedItems[editingIndex] = {
        ...updatedItems[editingIndex],
        name: values.editName,
        price: values.editPrice,
        description: values.editDescription,
      };
      setServiceItems(updatedItems);
      toast.success("Service Item updated successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating service item:", error);
      toast.error("Failed to update service item");
    }
  };

  const onDeleteServiceItem = async () => {
    if (editingIndex === null) return;
    const item = serviceItems[editingIndex];
    try {
      await api.delete(`o/services/${serviceId}/service_item/${item.id}`);
      // Remove the item from local state
      const updatedItems = [...serviceItems];
      updatedItems.splice(editingIndex, 1);
      setServiceItems(updatedItems);
      toast.success("Service Item deleted successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error deleting service item:", error);
      toast.error("Failed to delete service item");
    }
  };

  return (
    <FormPageLayout
      title="Edit Service"
      isLoading={loading}
      loadingText="Loading service..."
      error={error?.message}
      showDeleteButton={true}
      onDelete={onDelete}
      isDeleting={isDeleting}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      deleteTitle="Delete Service?"
      deleteDescription="This action cannot be undone. This will permanently delete this service and all its items."
    >
      {/* Main Service Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Service Information */}
        <FormSection title="Service Information">
          <FormField label="Service Name" error={errors.name?.message}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  placeholder="Enter the service name"
                  className="bg-gray-50 h-11 px-4"
                  {...field}
                />
              )}
            />
          </FormField>
        </FormSection>

        {/* Add Service Item */}
        <FormSection title="Add Service Item">
          <div className="flex w-full justify-end">
            <Button
              type="button"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white w-fit"
              onClick={() => setShowAddModal(true)}
            >
              Add Service Item
            </Button>
          </div>
        </FormSection>

        {/* Service Item List */}
        <FormSection title="Service Item List">
          <div className="space-y-4">
            {serviceItems.length > 0 ? (
              serviceItems.map((item: any, index) => (
                <div
                  key={index}
                  className="border border-neutral-200 rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => {
                    setEditingIndex(index);

                    editReset({
                      editName: item.name,
                      editPrice: Number(item.price),
                      editDescription: item.description || "",
                      ediId: item.id,
                    });
                    setShowEditModal(true);
                  }}
                >
                  <h2 className="text-lg font-semibold text-neutral-800">
                    {item.name}
                  </h2>
                  <p className="text-sm text-neutral-500 mt-2">
                    {item.description || "No description provided."}
                  </p>
                  <p className="text-base font-bold text-neutral-800 mt-4">
                    Price: ₱{item.price}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-neutral-500">No service items available.</p>
            )}
          </div>
        </FormSection>

        {/* Media */}
        <FormSection title="Media">
          <ImageUploader
            onImageSelect={(file) => setSelectedImage(file)}
            supportedFormats={["JPEG", "JPG", "PNG"]}
            currentImageUrl={currentImageUrl}
          />
        </FormSection>

        {/* Submit Button */}
        <FormActions>
          <Button
            type="submit"
            className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Service"
            )}
          </Button>
        </FormActions>
      </form>

      {/* Add Service Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
            <h2 className="font-afacad text-xl mb-4">Add Service Item</h2>
            <form
              onSubmit={handleAddSubmit(onAddServiceItem)}
              className="space-y-4"
            >
              <FormField label="Item Name" error={addErrors.addName?.message}>
                <Input
                  placeholder="Enter item name"
                  className="bg-gray-50 h-11 px-4"
                  {...addRegister("addName")}
                />
              </FormField>
              <FormField label="Price" error={addErrors.addPrice?.message}>
                <Input
                  placeholder="Set the price"
                  className="bg-gray-50 h-11 px-4"
                  type="number"
                  step="0.01"
                  {...addRegister("addPrice", { valueAsNumber: true })}
                />
              </FormField>
              <FormField label="Description">
                <Textarea
                  placeholder="Write the item description here.."
                  className="bg-gray-50 h-20 px-4 py-3"
                  {...addRegister("addDescription")}
                />
              </FormField>
              <div className="flex justify-end gap-2 mt-8">
                <Button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => {
                    setShowAddModal(false);
                    resetAddForm();
                  }}
                  disabled={isAddingItem}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white"
                  disabled={isAddingItem}
                >
                  {isAddingItem ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Item"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
            <div className="w-full flex flex-row justify-between items-center mb-4">
              <h2 className="font-afacad text-xl">Edit Service Item</h2>
              <X
                className="cursor-pointer hover:text-gray-600"
                onClick={() => setShowEditModal(false)}
              />
            </div>
            <form
              onSubmit={editHandleSubmit(onEditServiceItem)}
              className="space-y-4"
            >
              <FormField label="Item Name" error={editErrors.editName?.message}>
                <Controller
                  control={editControl}
                  name="editName"
                  render={({ field }) => (
                    <Input
                      placeholder="Enter item name"
                      className="bg-gray-50 h-11 px-4"
                      {...field}
                    />
                  )}
                />
              </FormField>
              <FormField label="Price" error={editErrors.editPrice?.message}>
                <Controller
                  control={editControl}
                  name="editPrice"
                  render={({ field }) => (
                    <Input
                      placeholder="Set the price"
                      className="bg-gray-50 h-11 px-4"
                      type="number"
                      step="0.01"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  )}
                />
              </FormField>
              <FormField label="Description">
                <Controller
                  control={editControl}
                  name="editDescription"
                  render={({ field }) => (
                    <Textarea
                      placeholder="Write the item description here.."
                      className="bg-gray-50 h-20 px-4 py-3"
                      {...field}
                    />
                  )}
                />
              </FormField>
              <div className="flex justify-end gap-2 mt-8">
                <Button
                  type="button"
                  className="bg-transparent border-red-500 border hover:bg-red-50 text-red-600"
                  onClick={onDeleteServiceItem}
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white"
                >
                  Update Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FormPageLayout>
  );
};

export default EditServicePage;
