// /utils/apolloClient.ts
import { ApolloClient, createHttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { store } from '@/redux/store';
import { refreshAccessToken, logout } from '@/redux/slices/authSlice';
import axios from 'axios';
import 'dotenv/config';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URL || 'http://localhost:8000/api/v1/graphql',
  credentials: 'include', // Important for httpOnly cookies
});

// Auth link to add token to headers
const authLink = setContext((_, { headers }) => {
  const state = store.getState();
  const token = state.auth.accessToken;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Error handling for token refresh
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        const originalRequest = operation.getContext();

        if (!originalRequest._retry) {
          originalRequest._retry = true;

          return new Promise((resolve, reject) => {
            axios.post(
              `${process.env.API_URL}/auth/refresh`,
              {},
              { withCredentials: true }
            )
              .then(res => {
                const newAccessToken = res.data.accessToken;
                store.dispatch(refreshAccessToken(newAccessToken));

                // Update the authorization header
                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    authorization: `Bearer ${newAccessToken}`,
                  }
                }));

                // Retry the request
                resolve(forward(operation));
              })
              .catch(error => {
                store.dispatch(logout());
                reject(error);
              });
          });
        }
      }
    }
  }
});

// Create the Apollo Client
const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
    mutate: {
      fetchPolicy: 'network-only',
    },
  },
});

export default apolloClient;