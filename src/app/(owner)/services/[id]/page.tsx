"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MoveLeft, Trash2, X } from "lucide-react";
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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import {close}\

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

// type ServiceItem = {
//   name: string;
//   price: number;
//   description?: string;
//   id: string;
// };

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
    <div className="flex justify-center">
      <div className="bg-white min-h-screen w-[800px] rounded-lg border border-neutral-200 px-12 py-8">
        <div className="flex gap-x-3 items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
          >
            <MoveLeft width={20} height={20} className="text-neutral-600" />
          </button>
          <h1 className="font-afacad_medium text-3xl pl-3 ml-1">
            Edit Service
          </h1>
        </div>

        {/* Main Service Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Service Name */}
          <div className="mt-12">
            <h1 className="font-afacad text-neutral-500">
              Service Information
            </h1>
            <hr />
            <div className="pt-6 space-y-6">
              <div>
                <h1 className="text-sm text-neutral-500">Service Name</h1>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      placeholder="Enter the service name"
                      className="bg-neutral-100/50 w-full h-12 px-5"
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Add Service Item Button */}
          <div className="mt-6 pb-10">
            <div className="flex flex-col justify-between gap-y-2">
              <h1 className="font-afacad text-neutral-500">Add Service Item</h1>
              <hr />

              <div className="flex w-full justify-end mt-3">
                <Button
                  type="button"
                  className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white w-fit"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Service Item
                </Button>
              </div>
            </div>
          </div>

          {/* Display Service Items */}
          <div className="mt-6 pb-10">
            <h1 className="font-afacad text-neutral-500">Service Item List</h1>
            <hr />
            <div className="pt-6 space-y-4">
              {serviceItems.length > 0 ? (
                serviceItems.map((item: any, index) => (
                  <div
                    key={index}
                    className="border border-neutral-200 rounded-lg p-4 shadow-sm bg-white cursor-pointer"
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
          </div>

          {/* Image Uploader */}
          <div className="mt-6">
            <h1 className="font-afacad text-neutral-500">Media</h1>
            <hr />
            <ImageUploader
              onImageSelect={(file) => setSelectedImage(file)}
              supportedFormats={["JPEG", "JPG", "PNG"]}
              currentImageUrl={currentImageUrl}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-16 pb-10 flex items-center justify-end gap-x-4">
            <Button
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Service"}
            </Button>

            <Dialog>
              <DialogTrigger>
                <Trash2 className="text-red-700 hover:text-red-700/80 cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-medium">Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete this rental item
                    and remove your data from our servers.
                  </DialogDescription>
                  <div className="flex justify-end gap-3 pt-6">
                    <DialogClose asChild>
                      <Button variant="outline" className="px-4">Cancel</Button>
                    </DialogClose>
                    <Button className="bg-red-600 hover:bg-red-700 px-4">Delete</Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
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
                <div>
                  <h1 className="text-sm text-neutral-500">Item Name</h1>
                  <Input
                    placeholder="Enter item name"
                    className="bg-neutral-100/50 w-full h-12 px-5"
                    {...addRegister("addName")}
                  />
                  {addErrors.addName && (
                    <p className="text-red-500 text-xs mt-1">
                      {addErrors.addName.message}
                    </p>
                  )}
                </div>
                <div>
                  <h1 className="text-sm text-neutral-500">Price</h1>
                  <Input
                    placeholder="Set the price"
                    className="bg-neutral-100/50 w-full h-12 px-5"
                    type="number"
                    step="0.01"
                    {...addRegister("addPrice", { valueAsNumber: true })}
                  />
                  {addErrors.addPrice && (
                    <p className="text-red-500 text-xs mt-1">
                      {addErrors.addPrice.message}
                    </p>
                  )}
                </div>
                <div>
                  <h1 className="text-sm text-neutral-500">Description</h1>
                  <Textarea
                    placeholder="Write the item description here.."
                    className="bg-neutral-100/50 w-full h-20 px-5 py-3"
                    {...addRegister("addDescription")}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-8">
                  <Button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                    onClick={() => {
                      handleAddSubmit(onAddServiceItem);
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
                    {isAddingItem ? "Adding..." : "Add Item"}
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
                <X onClick={() => setShowEditModal(false)} />
              </div>
              <form
                onSubmit={editHandleSubmit(onEditServiceItem)}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-sm text-neutral-500">Item Name</h1>
                  <Controller
                    control={editControl}
                    name="editName"
                    render={({ field }) => (
                      <Input
                        placeholder="Enter item name"
                        className="bg-neutral-100/50 w-full h-12 px-5"
                        {...field}
                      />
                    )}
                  />
                  {editErrors.editName && (
                    <p className="text-red-500 text-xs mt-1">
                      {editErrors.editName.message}
                    </p>
                  )}
                </div>
                <div>
                  <h1 className="text-sm text-neutral-500">Price</h1>
                  <Controller
                    control={editControl}
                    name="editPrice"
                    render={({ field }) => (
                      <Input
                        placeholder="Set the price"
                        className="bg-neutral-100/50 w-full h-12 px-5"
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
                  {editErrors.editPrice && (
                    <p className="text-red-500 text-xs mt-1">
                      {editErrors.editPrice.message}
                    </p>
                  )}
                </div>
                <div>
                  <h1 className="text-sm text-neutral-500">Description</h1>
                  <Controller
                    control={editControl}
                    name="editDescription"
                    render={({ field }) => (
                      <Textarea
                        placeholder="Write the item description here.."
                        className="bg-neutral-100/50 w-full h-20 px-5 py-3"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-8">
                  <Button
                    type="button"
                    className="bg-transparent border-red-500 border hover:bg-gray-300 text-red-600"
                    onClick={onDeleteServiceItem}
                  >
                    Delete
                  </Button>
                  <Button
                    type="submit"
                    className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white"
                    onClick={() => {}}
                  >
                    Update Item
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditServicePage;
