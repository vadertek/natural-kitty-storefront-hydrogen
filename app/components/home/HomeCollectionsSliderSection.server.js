const HOME_COLLECTIONS_SLIDER_QUERY = `#graphql
  fragment HomeCollectionSliderImage on Image {
    id
    altText
    url
    width
    height
  }

  fragment HomeCollectionSliderCollection on Collection {
    id
    handle
    title
    description
    image {
      ...HomeCollectionSliderImage
    }
    products(first: 1) {
      nodes {
        id
        featuredImage {
          ...HomeCollectionSliderImage
        }
      }
    }
  }

  query HomeCollectionsSlider(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: 250, sortKey: TITLE) {
      nodes {
        ...HomeCollectionSliderCollection
      }
    }
  }
`;

/**
 * @param {{storefront: import('@shopify/hydrogen').HydrogenContext['storefront']}} context
 */
export async function loadHomeCollectionsSliderData({storefront}) {
  const {collections} = await storefront.query(HOME_COLLECTIONS_SLIDER_QUERY);

  return (collections?.nodes || []).filter((collection) => collection?.handle);
}
