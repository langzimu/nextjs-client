import App from 'next/app';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
  Context,
} from '@apollo/client';

function createApolloClient(initialState: any, ctx: Context) {
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      uri: process.env.API_URL,
      credentials: 'same-origin',
      fetch,
    }),
    cache: new InMemoryCache().restore(initialState),
  });
}

let globalApolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export const initOnContext = (ctx: Context) => {
  const inAppContext = Boolean(ctx.ctx);

  if (process.env.NODE_ENV === 'development') {
    if (inAppContext) {
      console.warn(
        'Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in `pages/_app`.\n' +
          'Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n',
      );
    }
  }

  const apolloClient =
    ctx.apolloClient ||
    initApolloClient(ctx.apolloState || {}, inAppContext ? ctx.ctx : ctx);

  apolloClient.toJSON = () => null;

  ctx.apolloClient = apolloClient;
  if (inAppContext) {
    ctx.ctx.apolloClient = apolloClient;
  }

  return ctx;
};

const initApolloClient = (initialState: any, ctx: any) => {
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, ctx);
  }

  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, ctx);
  }

  return globalApolloClient;
};

export const withApollo = (PageComponent: any, { ssr = false } = {}) => {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }: any) => {
    let client;
    if (apolloClient) {
      client = apolloClient;
    } else {
      client = initApolloClient(apolloState, undefined);
    }

    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component';
    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (ctx: any) => {
      const inAppContext = Boolean(ctx.ctx);
      const { apolloClient } = initOnContext(ctx);

      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      } else if (inAppContext) {
        pageProps = await App.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        const { AppTree } = ctx;

        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        // Only if dataFromTree is enabled
        if (ssr && AppTree) {
          try {
            const { getDataFromTree } = await import('@apollo/react-ssr');
            let props;
            if (inAppContext) {
              props = { ...pageProps, apolloClient };
            } else {
              props = { pageProps: { ...pageProps, apolloClient } };
            }

            await getDataFromTree(<AppTree {...props} />);
          } catch (error) {
            console.error('Error while running `getDataFromTree`', error);
          }

          Head.rewind();
        }
      }

      return {
        ...pageProps,
        apolloState: apolloClient.cache.extract(),
        apolloClient: ctx.apolloClient,
      };
    };
  }

  return WithApollo;
};
