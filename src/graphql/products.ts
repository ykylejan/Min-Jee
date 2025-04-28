import { gql } from "@apollo/client";

export const GET_ALL_RENTALS = gql`
  query getAllRentals {
    getRentals {
      id
      categoryId
      img
      name
      price
      quantity
    }
  }
`;
