const HOMEPAGE_SUBHERO_QUERY = `#graphql
  fragment HomeSubheroProduct on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
  }

  query HomepageSubheroProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    subheroCollection: collection(handle: "natural-kitty-chunk-in-gravy") {
      id
      products(first: 20) {
        nodes {
          ...HomeSubheroProduct
        }
      }
    }
  }
`;

/**
 * @param {{storefront: import('@shopify/hydrogen').HydrogenContext['storefront']}} context
 */
export async function loadHomeSubheroProducts({storefront}) {
  const {subheroCollection} = await storefront.query(HOMEPAGE_SUBHERO_QUERY);
  return pickRandomItems(subheroCollection?.products?.nodes || [], 5);
}

/**
 * @template T
 * @param {T[]} items
 * @param {number} count
 * @returns {T[]}
 */
function pickRandomItems(items, count) {
  if (!items.length) return [];
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}
