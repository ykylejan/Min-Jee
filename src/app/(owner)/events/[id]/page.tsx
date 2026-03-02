"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ImageUploader";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { ApolloError, useQuery } from "@apollo/client";
import { GET_EVENT_PACKAGE_BY_ID } from "@/graphql/people";
import apolloClient from "@/graphql/apolloClient";
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormActions,
} from "@/components/OwnerPage";

// Zod schemas
const eventPackageSchema = z.object({
  name: z.string().min(1, "Event package name is required"),
});

const addPaxSchema = z.object({
  addName: z.string().min(1, "Pax name is required"),
  addPrice: z.number().min(1, "Price must be at least 1"),
  addDescription: z.string().optional(),
});
type AddPaxFormValues = z.infer<typeof addPaxSchema>;

type PaxItem = {
  name: string;
  price: number;
  description?: string;
  id: string;
};

type EventPackageFormValues = z.infer<typeof eventPackageSchema>;

const editPaxSchema = z.object({
  editName: z.string().min(1, "Pax name is required"),
  editPrice: z.number().min(1, "Price must be at least 1"),
  editDescription: z.string().optional(),
  editId: z.string(),
});
type EditPaxFormValues = z.infer<typeof editPaxSchema>;

const EditEventPackagePage = () => {
  const router = useRouter();
  const params = useParams();
  const eventPackId = params.id as string;

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingPax, setIsAddingPax] = useState(false);
  const [paxItems, setPaxItems] = useState<PaxItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Main event package form
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EventPackageFormValues>({
    resolver: zodResolver(eventPackageSchema),
    defaultValues: {
      name: "",
    },
  });

  // Edit Pax form (modal)
  const {
    control: editControl,
    handleSubmit: editHandleSubmit,
    reset: editReset,
    formState: { errors: editErrors },
  } = useForm<EditPaxFormValues>({
    resolver: zodResolver(editPaxSchema),
    defaultValues: {
      editName: "",
      editPrice: 0,
      editDescription: "",
      editId: "",
    },
  });

  // Add Pax form (modal)
  const {
    register: addRegister,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
    formState: { errors: addErrors },
  } = useForm<AddPaxFormValues>({
    resolver: zodResolver(addPaxSchema),
    defaultValues: {
      addName: "",
      addPrice: 0,
      addDescription: "",
    },
  });

  // Fetch event package data
  const { data, loading, error } = useQuery(GET_EVENT_PACKAGE_BY_ID, {
    variables: { id: eventPackId },
    fetchPolicy: "network-only",
    client: apolloClient,
  });

  useEffect(() => {
    if (data && data.getEventsPackageById) {
      console.log("DATA:", data.getEventsPackageById);

      const eventPackage = data.getEventsPackageById;
      reset({
        name: eventPackage.name || "",
      });
      setPaxItems(eventPackage.pax || []);
      if (eventPackage.img) setCurrentImageUrl(eventPackage.img);
    }
  }, [data, reset]);

  // Add Pax handler
  const onAddPax = async (values: AddPaxFormValues) => {
    setIsAddingPax(true);
    try {
      const response = await api.post(
        `/o/events/event_package/${eventPackId}/pax`,
        {
          name: values.addName,
          price: values.addPrice,
          description: values.addDescription || "",
        }
      );

      if (response.data) {
        const newItem = {
          ...response.data,
          name: values.addName,
          price: values.addPrice,
          description: values.addDescription || "",
        };
        setPaxItems([...paxItems, newItem]);
        toast.success("Pax Added Successfully");
        setShowAddModal(false);
        resetAddForm();
      }
    } catch (error) {
      console.error("Error adding pax:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAddingPax(false);
    }
  };

  // Main form submit
  const onSubmit = async (data: EventPackageFormValues) => {
    setIsSubmitting(true);
    try {
      // Update event package name
      await api.patch(`/o/events/event_package/${eventPackId}`, {
        name: data.name,
      });

      // Update image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        await api.patch(`/o/events/event_package/${eventPackId}/img`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Event package updated successfully.");
      router.push("/events");
    } catch (error) {
      console.error("Error updating event package:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditPax = async (values: EditPaxFormValues) => {
    if (editingIndex === null) return;
    try {
      await api.patch(
        `/o/events/event_package/${eventPackId}/pax/${values.editId}`,
        {
          name: values.editName,
          price: values.editPrice,
          description: values.editDescription,
        }
      );

      // Update local state
      const updatedItems = [...paxItems];
      updatedItems[editingIndex] = {
        ...updatedItems[editingIndex],
        name: values.editName,
        price: values.editPrice,
        description: values.editDescription,
      };
      setPaxItems(updatedItems);
      toast.success("Pax updated successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating pax:", error);
      toast.error("Failed to update pax");
    }
  };

  const onDeletePax = async () => {
    if (editingIndex === null) return;
    const item = paxItems[editingIndex];
    try {
      await api.delete(`/o/events/event_package/${eventPackId}/pax/${item.id}`);
      // Remove the item from local state
      const updatedItems = [...paxItems];
      updatedItems.splice(editingIndex, 1);
      setPaxItems(updatedItems);
      toast.success("Pax deleted successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error deleting pax:", error);
      toast.error("Failed to delete pax");
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/o/events/event_package/${eventPackId}`);

      toast.success("Event Package Deleted Successfully");
      router.push("/events");
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

  return (
    <FormPageLayout
      title="Edit Event Package"
      isLoading={loading}
      loadingText="Loading event package..."
      error={error?.message}
      showDeleteButton
      onDelete={onDelete}
      isDeleting={isDeleting}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      deleteTitle="Delete Event Package?"
      deleteDescription="This action cannot be undone. This will permanently delete this event package and all associated pax data."
    >
      {/* Main Event Package Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Event Package Name */}
        <FormSection title="Event Package Information">
          <FormField label="Event Package Name" error={errors.name?.message}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  placeholder="Enter the event package name"
                  className="bg-gray-50 w-full h-11 px-4"
                  {...field}
                />
              )}
            />
          </FormField>
        </FormSection>

        {/* Add Pax Button */}
        <FormSection title="Add Pax">
          <div className="flex w-full justify-end">
            <Button
              type="button"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white w-fit"
              onClick={() => setShowAddModal(true)}
            >
              Add Pax
            </Button>
          </div>
        </FormSection>

        {/* Display Pax Items */}
        <FormSection title="Pax List">
          <div className="space-y-4">
            {paxItems.length > 0 ? (
              paxItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="border border-neutral-200 rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => {
                    setEditingIndex(index);
                    editReset({
                      editName: item.name,
                      editPrice: Number(item.price),
                      editDescription: item.description || "",
                      editId: item.id,
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
              <p className="text-neutral-500">No pax available.</p>
            )}
          </div>
        </FormSection>

        {/* Image Uploader */}
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
              "Update Event Package"
            )}
          </Button>
        </FormActions>
      </form>

      {/* Add Pax Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
            <h2 className="font-afacad text-xl mb-4">Add Pax</h2>
            <form onSubmit={handleAddSubmit(onAddPax)} className="space-y-4">
              <FormField label="Pax Name" error={addErrors.addName?.message}>
                <Input
                  placeholder="Enter pax name"
                  className="bg-gray-50 w-full h-11 px-4"
                  {...addRegister("addName")}
                />
              </FormField>
              <FormField label="Price" error={addErrors.addPrice?.message}>
                <Input
                  placeholder="Set the price"
                  className="bg-gray-50 w-full h-11 px-4"
                  type="number"
                  step="0.01"
                  {...addRegister("addPrice", { valueAsNumber: true })}
                />
              </FormField>
              <FormField label="Description">
                <Textarea
                  placeholder="Write the pax description here.."
                  className="bg-gray-50 w-full h-20 px-4 py-3"
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
                  disabled={isAddingPax}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white"
                  disabled={isAddingPax}
                >
                  {isAddingPax ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Pax"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pax Modal */}
      {showEditModal && editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
            <div className="w-full flex flex-row justify-between items-center mb-4">
              <h2 className="font-afacad text-xl">Edit Pax</h2>
              <X
                className="cursor-pointer hover:text-gray-600"
                onClick={() => setShowEditModal(false)}
              />
            </div>
            <form onSubmit={editHandleSubmit(onEditPax)} className="space-y-4">
              <FormField label="Pax Name" error={editErrors.editName?.message}>
                <Controller
                  control={editControl}
                  name="editName"
                  render={({ field }) => (
                    <Input
                      placeholder="Enter pax name"
                      className="bg-gray-50 w-full h-11 px-4"
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
                      className="bg-gray-50 w-full h-11 px-4"
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
                      placeholder="Write the pax description here.."
                      className="bg-gray-50 w-full h-20 px-4 py-3"
                      {...field}
                    />
                  )}
                />
              </FormField>
              <div className="flex justify-end gap-2 mt-8">
                <Button
                  type="button"
                  className="bg-transparent border-red-500 border hover:bg-gray-300 text-red-600"
                  onClick={onDeletePax}
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white"
                >
                  Update Pax
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FormPageLayout>
  );
};

export default EditEventPackagePage;