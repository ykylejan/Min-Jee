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
