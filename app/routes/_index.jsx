import {useLoaderData} from 'react-router';
import {HomeHeroSection} from '~/components/home/HomeHeroSection';
import {HomeSubheroSection} from '~/components/home/HomeSubheroSection';
import mainCatVideo from '~/assets/main-cat.mp4';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Natural Kitty | Home'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const [{subheroCollection}] = await Promise.all([
    context.storefront.query(HOMEPAGE_QUERY),
  ]);

  return {
    subheroProducts: pickRandomItems(subheroCollection?.products?.nodes || [], 5),
  };
}

/**
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  return (
    <div className="home-page">
      <HomeHeroSection videoSrc={mainCatVideo} />
      <HomeSubheroSection products={data.subheroProducts} />
    </div>
  );
}

function pickRandomItems(items, count) {
  if (!items.length) return [];
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

const HOMEPAGE_QUERY = `#graphql
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

  query Homepage(
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

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
