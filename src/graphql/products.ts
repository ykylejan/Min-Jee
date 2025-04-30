import { gql } from "@apollo/client";

export const GET_ALL_RENTALS = gql`
  query getAllRentals {
    getRentals {
      id
      categoryId
      img
      name
      price
      totalQuantity
      currentQuantity
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query getAllCategories {
    getCategories {
      name
      id
      type
    }
  }
`;

export const GET_RENTAL_BY_ID = gql`
  query getIndividualRental($id: UUID!) {
    getRentalsById(id: $id) {
      categoryId
      description
      id
      img
      name
      price
      quantity
    }
  }
`;
