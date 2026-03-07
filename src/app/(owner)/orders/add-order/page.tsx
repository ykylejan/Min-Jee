'use client'

import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from '@/components/OwnerPage'
import { useForm, Controller } from 'react-hook-form'
import { useQuery } from '@apollo/client'
import { GET_ALL_CUSTOMERS } from '@/graphql/people'
import apolloClientPartner from '@/graphql/apolloClientPartners'
import { toast } from 'sonner'
import api from '@/app/utils/api'
import { parse, format } from 'date-fns'

interface CustomerType {
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  address: string
}

interface OrderFormValues {
  customerId: string
  location: string
  orderDate: string
  orderTime: string
  returnDate: string
  obtainmentMethod: string
  deliveryPrice: string
  depositPrice: string
  orderStatus: string
}

const AddOrderPage = () => {
  const router = useRouter()
  const [customers, setCustomers] = useState<CustomerType[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null)

  // Fetch customers for the dropdown
  const { data: customersData, loading: customersLoading } = useQuery(GET_ALL_CUSTOMERS, {
    client: apolloClientPartner,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (customersData?.getCustomers) {
      setCustomers(customersData.getCustomers)
    }
  }, [customersData])

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<OrderFormValues>({
    defaultValues: {
      customerId: '',
      location: '',
      orderDate: '',
      orderTime: '',
      returnDate: '',
      obtainmentMethod: 'pickup',
      deliveryPrice: '0',
      depositPrice: '0',
      orderStatus: 'pending',
    },
  })

  // Debug: Log form errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors)
    }
  }, [errors])

  // Update location when customer is selected
  const watchCustomerId = watch('customerId')
  useEffect(() => {
    if (watchCustomerId) {
      const customer = customers.find((c) => c.id === watchCustomerId)
      if (customer) {
        setSelectedCustomer(customer)
        setValue('location', customer.address || '')
      }
    } else {
      setSelectedCustomer(null)
    }
  }, [watchCustomerId, customers, setValue])

  const onSubmit = async (formData: OrderFormValues) => {
    console.log('=== FORM SUBMITTED ===')
    console.log('Form data:', formData)
    console.log('Selected customer:', selectedCustomer)
    
    try {
      // Format order_time as "HH:mm:ss.SSS'Z'" to match backend expectations
      const order_time =
        formData.orderDate && formData.orderTime
          ? format(
              parse(
                `${formData.orderDate} ${formData.orderTime}`,
                'yyyy-MM-dd HH:mm',
                new Date()
              ),
              "HH:mm:ss.SSS'Z'"
            )
          : ''

      // We don't collect a separate return time on this form,
      // so we leave return_time empty for now.
      const return_time = ''

      // Build the customer name from the selected customer
      const customerName = selectedCustomer
        ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
        : ''

      // Build the payload matching backend schema (mirrors customer checkout shape)
      const order_data = {
        name: customerName,
        location: formData.location,
        order_total: 0,
        order_date: formData.orderDate,
        order_time,
        order_status: formData.orderStatus,
        return_date: formData.returnDate || formData.orderDate,
        return_time,
        overdue_days: 0,
        is_shipped: formData.obtainmentMethod === 'shipped',
        delivery_price: parseFloat(formData.deliveryPrice) || 0,
        deposit_price: parseFloat(formData.depositPrice) || 0,
        customer_id: formData.customerId,
      }

      const body = {
        order_data,
        services: [] as any[],
        rentals: [] as any[],
      }

      console.log('Submitting owner order payload:', JSON.stringify(body, null, 2))

      const response = await api.post('http://localhost:8000/api/v1/o/order/', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Order created successfully:', response.data)

      toast.success('Order Created Successfully', {
        description: 'The new order has been added to the system.',
      })
      router.push('/orders')
    } catch (error: any) {
      console.error('=== ORDER CREATION FAILED ===')
      console.error('Error:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)
      console.error('Error status:', error.response?.status)
      const errorMessage = error.response?.data?.detail || 'Failed to create order. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <FormPageLayout title="Create a New Order">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          <FormSection title="Customer Information">
            <div className="space-y-6">
              <FormRow cols={2}>
                <FormField label="Customer" error={errors.customerId?.message}>
                  <Controller
                    name="customerId"
                    control={control}
                    rules={{ required: 'Please select a customer' }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={customersLoading}
                      >
                        <SelectTrigger className="bg-gray-50 h-11 w-full">
                          <SelectValue placeholder={customersLoading ? 'Loading customers...' : 'Select a customer'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.firstName} {customer.lastName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
                <FormField label="Contact Number">
                  <Input
                    value={selectedCustomer?.contactNumber || ''}
                    placeholder="Select a customer"
                    className="bg-gray-50 h-11 px-4"
                    readOnly
                  />
                </FormField>
              </FormRow>
              <FormField label="Location" error={errors.location?.message}>
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: 'Location is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter customer's address"
                      className="bg-gray-50 h-11 px-4"
                    />
                  )}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Booking Schedule">
            <div className="space-y-6">
              <FormRow cols={2}>
                <FormField label="Obtainment Method">
                  <Controller
                    name="obtainmentMethod"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-gray-50 h-11 w-full sm:w-80">
                          <SelectValue placeholder="Select Obtainment Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="pickup">Pick-Up</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
                <FormField label="Order Time">
                  <Controller
                    name="orderTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="time"
                        className="bg-gray-50 h-11 px-4"
                      />
                    )}
                  />
                </FormField>
              </FormRow>
              <FormRow cols={2}>
                <FormField label="Date of Booking" error={errors.orderDate?.message}>
                  <Controller
                    name="orderDate"
                    control={control}
                    rules={{ required: 'Booking date is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        className="bg-gray-50 h-11 px-4"
                      />
                    )}
                  />
                </FormField>
                <FormField label="Date of Return">
                  <Controller
                    name="returnDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        className="bg-gray-50 h-11 px-4"
                      />
                    )}
                  />
                </FormField>
              </FormRow>
            </div>
          </FormSection>

          <FormSection title="Delivery Option">
            <div className="space-y-4">
              <FormRow cols={2}>
                <FormField label="Delivery Fee">
                  <Controller
                    name="deliveryPrice"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                          ₱
                        </span>
                        <Input
                          {...field}
                          placeholder="0.00"
                          className="bg-gray-50 h-11 pl-10 pr-4"
                          type="number"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    )}
                  />
                </FormField>
                <FormField label="Deposit Fee">
                  <Controller
                    name="depositPrice"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                          ₱
                        </span>
                        <Input
                          {...field}
                          placeholder="0.00"
                          className="bg-gray-50 h-11 pl-10 pr-4"
                          type="number"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    )}
                  />
                </FormField>
              </FormRow>
            </div>
          </FormSection>

          <FormSection title="Order Status">
            <FormField label="Select Status for this order item">
              <Controller
                name="orderStatus"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-gray-50 h-11 w-full sm:w-80">
                      <SelectValue placeholder="Select Order Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="font-afacad">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </FormSection>

          <FormActions>
            <Button
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-8 h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Finalize Order'
              )}
            </Button>
          </FormActions>
        </div>
      </form>
    </FormPageLayout>
  )
}

export default AddOrderPage
