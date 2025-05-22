import { gql } from "@apollo/client";

export const GET_ALL_RENTALS = gql`
  query getAllRentals {
    getCategories {
      id
      name
      type
    }
  }
`;

export const GET_PARTNER_BY_ID = gql`
  query getIndividualPartnerById($id: UUID!) {
    getPartnerById(id: $id) {
      address
      categoryId
      contactNumber
      id
      name
    }
  }
`;

export const GET_ALL_PARTNERS = gql`
  query getAllPartners {
    getPartner {
      id
      name
      address
      contactNumber
      categoryId
    }
  }
`;

export const GET_CUSTOMER_BY_ID = gql`
  query getIndividualCustomerById($id: UUID!) {
    getCustomersById(id: $id) {
      address
      bookings
      contactNumber
      email
      firstName
      id
      isActive
      lastName
      userId
    }
  }
`;

export const GET_ALL_CUSTOMERS = gql`
  query getAllCustomers {
    getCustomers {
      address
      bookings
      contactNumber
      email
      firstName
      id
      isActive
      lastName
    }
  }
`;

export const GET_SERVICE_BY_ID = gql`
  query getIndividualServiceById($id: UUID!) {
    getServiceById(id: $id) {
      id
      img
      name
      serviceItems {
        description
        id
        name
        price
        serviceId
      }
    }
  }
`;

export const GET_ALL_SERVICES = gql`
  query getAllServices {
    getServices {
      id
      name
      img
    }
  }
`;

export const GET_ALL_EVENT_PACKAGES = gql`
  query getAllEventPackages {
    getEventPackages {
      id
      img
      name
    }
  }
`;

export const GET_EVENT_PACKAGE_BY_ID = gql`
  query getIndividualPackageById($id: UUID!) {
    getEventsPackageById(id: $id) {
      id
      img
      name
      pax {
        description
        eventPackageId
        id
        name
        price
      }
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query getIndividualEventById($id: UUID!) {
    getEventsById(id: $id) {
      addonsList {
        addons {
          availability
          id
          name
          price
        }
        addonsId
        eventsId
        id
      }
      customer {
        address
        bookings
        contactNumber
        email
        firstName
        id
        isActive
        lastName
        userId
        verifyNumber
        verifyEmail
      }
      customerId
      customizations
      customizationsPrice
      eventAddress
      eventDate
      eventEnd
      eventStart
      eventStatus
      id
      isDone
      location
      minjeeVenue
      name
      pax {
        description
        eventPackageId
        eventPackages {
          id
          img
          name
        }
        id
        name
        price
      }
      paxId
      transactionDetails {
        date
        eventId
        id
        img
        isVerified
        isEvent
        orderId
        payment
        paymentStatus
      }
    }
  }
`;
export const GET_ALL_EVENTS_CUSTOMER = gql`
  query getAllEventsCustomer {
    getEvents {
      addonsList {
        addons {
          availability
          id
          name
          price
        }
        addonsId
        eventsId
        id
      }
      customer {
        address
        bookings
        contactNumber
        email
        firstName
        id
        isActive
        lastName
        userId
        verifyEmail
        verifyNumber
      }
      customerId
      customizations
      customizationsPrice
      eventAddress
      eventDate
      eventEnd
      eventStart
      eventStatus
      id
      isDone
      location
      minjeeVenue
      name
      pax {
        description
        eventPackageId
        eventPackages {
          id
          img
          name
        }
        id
        name
        price
      }
      paxId
      transactionDetails {
        date
        eventId
        id
        img
        isEvent
        isVerified
        orderId
        payment
        paymentStatus
      }
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query getAllOrders {
    getOrders {
      customer {
        address
        bookings
        contactNumber
        email
        firstName
        id
        isActive
        lastName
        userId
        verifyEmail
        verifyNumber
      }
      customerId
      deliveryPrice
      depositPrice
      id
      isShipped
      location
      name
      orderDate
      orderStatus
      orderTime
      orderTotal
      overdueDays
      rentalList {
        id
        orderId
        orderItemStatus
        rentalId
        rentalQuantity
        rentalTotal
        rentals {
          categoryId
          currentQuantity
          description
          id
          img
          name
          price
          totalQuantity
        }
      }
      returnDate
      servicesList {
        id
        orderId
        serviceItemsId
        serviceQuantity
        serviceTotal
        servicesItems {
          description
          id
          name
          price
          serviceId
          services {
            id
            img
            name
          }
        }
      }
      transactionDetails {
        date
        eventId
        id
        img
        isEvent
        isVerified
        orderId
        payment
        paymentStatus
      }
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query getAllOrders($id: UUID!) {
    getOrdersById(id: $id) {
      customer {
        address
        bookings
        contactNumber
        email
        firstName
        id
        isActive
        lastName
        userId
        verifyEmail
        verifyNumber
      }
      customerId
      deliveryPrice
      depositPrice
      id
      isShipped
      location
      name
      orderDate
      orderStatus
      orderTime
      orderTotal
      overdueDays
      rentalList {
        id
        orderId
        rentalQuantity
        orderItemStatus
        rentalId
        rentalTotal
        rentals {
          categoryId
          currentQuantity
          description
          id
          img
          price
          name
          totalQuantity
        }
      }
      returnDate
      servicesList {
        id
        orderId
        serviceItemsId
        serviceQuantity
        serviceTotal
        servicesItems {
          description
          id
          name
          price
          serviceId
          services {
            id
            img
            name
          }
        }
      }
      transactionDetails {
        date
        eventId
        id
        img
        isEvent
        isVerified
        orderId
        payment
        paymentStatus
      }
    }
  }
`;

export const GET_ALL_ORDERS_OWNER = gql`
  query getAllOrders {
    getOrders {
      customer {
        address
        bookings
        contactNumber
        email
        firstName
        id
        isActive
        lastName
        userId
        verifyEmail
        verifyNumber
      }
      customerId
      deliveryPrice
      depositPrice
      id
      isShipped
      location
      name
      orderDate
      orderStatus
      orderTime
      orderTotal
      overdueDays
      rentalList {
        id
        orderId
        orderItemStatus
        rentalId
        rentalQuantity
        rentalTotal
        rentals {
          categoryId
          currentQuantity
          description
          id
          name
          price
          img
          totalQuantity
        }
      }
      returnDate
      servicesList {
        id
        orderId
        serviceItemsId
        serviceQuantity
        serviceTotal
        servicesItems {
          description
          id
          name
          price
          serviceId
          services {
            id
            img
            name
          }
        }
      }
      transactionDetails {
        date
        eventId
        id
        img
        isEvent
        isVerified
        orderId
        payment
        paymentStatus
      }
    }
  }
`;

export const GET_ORDER_BY_ID_OWNER = gql`
  query getOrderById($id: UUID!) {
    getOrdersById(id: $id) {
      customer {
        address
        bookings
        contactNumber
        email
        firstName
        id
        isActive
        lastName
        userId
        verifyEmail
        verifyNumber
      }
      customerId
      deliveryPrice
      depositPrice
      id
      isShipped
      location
      name
      orderDate
      orderStatus
      orderTime
      orderTotal
      overdueDays
      rentalList {
        id
        orderId
        orderItemStatus
        rentalId
        rentalQuantity
        rentalTotal
        rentals {
          categoryId
          currentQuantity
          description
          id
          name
          price
          img
          totalQuantity
        }
      }
      returnDate
      servicesList {
        id
        orderId
        serviceItemsId
        serviceQuantity
        serviceTotal
        servicesItems {
          description
          id
          name
          price
          serviceId
          services {
            id
            img
            name
          }
        }
      }
      transactionDetails {
        date
        eventId
        id
        img
        isEvent
        isVerified
        orderId
        payment
        paymentStatus
      }
    }
  }
`;

export const GET_ALL_EVENTS_OWNER = gql`
  query getAllEvents {
    getEvents {
      addonsList {
        addons {
          availability
          id
          name
          price
        }
        addonsId
        eventsId
        id
      }
      customer {
        address
        bookings
        contactNumber
        email
        firstName
        id
        isActive
        lastName
        userId
        verifyEmail
        verifyNumber
      }
      customerId
      customizations
      customizationsPrice
      eventAddress
      eventDate
      eventEnd
      eventStart
      eventStatus
      id
      isDone
      location
      minjeeVenue
      name
      pax {
        description
        eventPackageId
        eventPackages {
          id
          img
          name
        }
        id
        name
        price
      }
      paxId
      transactionDetails {
        date
        eventId
        id
        img
        isEvent
        isVerified
        orderId
        payment
        paymentStatus
      }
    }
  }
`;

export const GET_EVENT_BY_ID_OWNER = gql`
  query getIndividualEventById($id: UUID!) {
    getEventsById(id: $id) {
      addonsList {
        addons {
          availability
          id
          name
          price
        }
        addonsId
        eventsId
        id
      }
      customer {
        address
        bookings
        contactNumber
        email
        firstName
        id
        isActive
        lastName
        userId
        verifyNumber
        verifyEmail
      }
      customerId
      customizations
      customizationsPrice
      eventAddress
      eventDate
      eventEnd
      eventStart
      eventStatus
      id
      isDone
      location
      minjeeVenue
      name
      pax {
        description
        eventPackageId
        eventPackages {
          id
          img
          name
        }
        id
        name
        price
      }
      paxId
      transactionDetails {
        date
        eventId
        id
        img
        isVerified
        isEvent
        orderId
        payment
        paymentStatus
      }
    }
  }
`;
export const GET_TRANSACTION_BY_ID = gql`
  query getIndividualTransactionById($id: UUID!) {
    getTransactionsById(id: $id) {
      date
      eventId
      id
      img
      isEvent
      isVerified
      orderId
      payment
      paymentStatus
    }
  }
`;
