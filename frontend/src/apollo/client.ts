import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// HTTP Link
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql/',
  credentials: 'omit', // Add this for debugging
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Context link for adding headers if needed
const authLink = setContext((_, { headers }) => {
  // You can add authentication headers here if needed
  return {
    headers: {
      ...headers,
      // 'Authorization': `Bearer ${getToken()}`,
    }
  };
});

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        organizations: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        tasks: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

// Create Apollo Client
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;

