"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MoveLeft, X } from "lucide-react";
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
import { GET_EVENT_PACKAGE_BY_ID } from "@/graphql/people"; // You'll need to create this query
import apolloClient from "@/graphql/apolloClient";

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
  const [isAddingPax, setIsAddingPax] = useState(false);
  const [paxItems, setPaxItems] = useState<PaxItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Main event package form
  const {
    register,
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
      const response = await api.patch(
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
            Edit Event Package
          </h1>
        </div>

        {/* Main Event Package Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Event Package Name */}
          <div className="mt-12">
            <h1 className="font-afacad text-neutral-500">
              Event Package Information
            </h1>
            <hr />
            <div className="pt-6 space-y-6">
              <div>
                <h1 className="text-sm text-neutral-500">Event Package Name</h1>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      placeholder="Enter the event package name"
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

          {/* Add Pax Button */}
          <div className="mt-6 pb-10">
            <div className="flex flex-col justify-between gap-y-2">
              <h1 className="font-afacad text-neutral-500">Add Pax</h1>
              <hr />

              <div className="flex w-full justify-end mt-3">
                <Button
                  type="button"
                  className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white w-fit"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Pax
                </Button>
              </div>
            </div>
          </div>

          {/* Display Pax Items */}
          <div className="mt-6 pb-10">
            <h1 className="font-afacad text-neutral-500">Pax List</h1>
            <hr />
            <div className="pt-6 space-y-4">
              {paxItems.length > 0 ? (
                paxItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="border border-neutral-200 rounded-lg p-4 shadow-sm bg-white cursor-pointer"
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
          <div className="pt-16 pb-10 flex justify-end">
            <Button
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Event Package"}
            </Button>
          </div>
        </form>

        {/* Add Pax Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
              <h2 className="font-afacad text-xl mb-4">Add Pax</h2>
              <form onSubmit={handleAddSubmit(onAddPax)} className="space-y-4">
                <div>
                  <h1 className="text-sm text-neutral-500">Pax Name</h1>
                  <Input
                    placeholder="Enter pax name"
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
                    placeholder="Write the pax description here.."
                    className="bg-neutral-100/50 w-full h-20 px-5 py-3"
                    {...addRegister("addDescription")}
                  />
                </div>
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
                    {isAddingPax ? "Adding..." : "Add Pax"}
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
                <X onClick={() => setShowEditModal(false)} />
              </div>
              <form onSubmit={editHandleSubmit(onEditPax)} className="space-y-4">
                <div>
                  <h1 className="text-sm text-neutral-500">Pax Name</h1>
                  <Controller
                    control={editControl}
                    name="editName"
                    render={({ field }) => (
                      <Input
                        placeholder="Enter pax name"
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
                        placeholder="Write the pax description here.."
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
      </div>
    </div>
  );
};

export default EditEventPackagePage;