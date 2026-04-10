const HOME_WHY_NK_QUERY = `#graphql
  fragment HomeWhyNkImage on Image {
    id
    altText
    url
    width
    height
  }

  fragment HomeWhyNkCollection on Collection {
    id
    handle
    title
    description
    image {
      ...HomeWhyNkImage
    }
    products(first: 1) {
      nodes {
        id
        featuredImage {
          ...HomeWhyNkImage
        }
      }
    }
  }

  query HomeWhyNk(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: 4, sortKey: TITLE) {
      nodes {
        ...HomeWhyNkCollection
      }
    }
  }
`;

/**
 * @param {{storefront: import('@shopify/hydrogen').HydrogenContext['storefront']}} context
 */
export async function loadHomeWhyNkItems({storefront}) {
  const {collections} = await storefront.query(HOME_WHY_NK_QUERY);

  return (collections?.nodes || [])
    .filter((collection) => collection?.handle)
    .map((collection) => ({
      id: collection.id,
      title: collection.title,
      text: collection.description || '',
      image: collection.image || collection.products?.nodes?.[0]?.featuredImage || null,
      handle: collection.handle,
    }));
}
