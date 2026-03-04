import { ArrowRight, ArrowLeft } from 'lucide-react'
import React, { useRef, useEffect, useState } from 'react'
import ProductItem from './ProductItem'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { GET_ALL_RENTALS } from '@/graphql/products'
import apolloClient from '@/graphql/apolloClient'
import { Skeleton } from './ui/skeleton'

interface RentalsSectionProps {
  label?: string
}

const RentalsSection = ({ label }: RentalsSectionProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null)

  const scrollLeft = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: -600, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: 600, behavior: 'smooth' })
    }
  }

  // Rentals data from API
  const {
    data: rentalsData,
    loading,
    error,
  } = useQuery(GET_ALL_RENTALS, {
    client: apolloClient,
    fetchPolicy: 'network-only',
  })
  const [rentals, setRentals] = useState<any[]>([])

  useEffect(() => {
    if (rentalsData?.getRentals) {
      setRentals(rentalsData.getRentals)
    }
  }, [rentalsData])

  return (
    <div className="pb-12 md:pb-24">
      <section className="relative">
        <h1 className="flex justify-between items-center mb-3">
          <span className="text-2xl md:text-3xl font-afacad_semibold">
            {label ? label : 'Our Rentals'}
          </span>
          <Link href="/shop">
            <span className="text-base md:text-xl font-afacad_medium flex items-center gap-x-1 md:gap-x-2 hover:text-[#778768] cursor-pointer">
              View all <ArrowRight size={18} className="md:w-5 md:h-5" />
            </span>
          </Link>
        </h1>

        <button
          className="hidden md:block absolute left-1 top-[48%] transform -translate-y-[50%] bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-200"
          onClick={scrollLeft}
          aria-label="Scroll Left"
        >
          <ArrowLeft size={20} color="black" />
        </button>

        <ScrollArea ref={viewportRef}>
          <div className="flex space-x-5 lg:space-x-10 mb-8">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 w-[200px] md:w-[250px] lg:w-[280px] flex-shrink-0"
                >
                  <Skeleton className="w-full aspect-square rounded-lg bg-camouflage-100" />
                  <Skeleton className="h-5 w-3/4 bg-camouflage-100" />
                  <Skeleton className="h-4 w-1/2 bg-camouflage-100" />
                </div>
              ))
            ) : error ? (
              <div className="text-red-400 py-6">Failed to load rentals.</div>
            ) : rentals.length > 0 ? (
              rentals.map((rental) => (
                <Link
                  key={rental.id}
                  href={`/shop/rental/${rental.id}`}
                  className="w-[200px] md:w-[250px] lg:w-[280px] flex-shrink-0"
                >
                  <ProductItem
                    image={rental.img?.toString() || '/placeholder-product.jpg'}
                    name={rental.name}
                    price={
                      rental.price ? 'PHP ' + rental.price : 'Price May Vary'
                    }
                  />
                </Link>
              ))
            ) : (
              <div className="text-neutral-400 py-6">No rentals found.</div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <button
          className="hidden md:block absolute right-1 top-[48%] transform -translate-y-[50%] bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-200"
          onClick={scrollRight}
          aria-label="Scroll Right"
        >
          <ArrowRight size={20} color="black" />
        </button>
      </section>
    </div>
  )
}

export default RentalsSection
