import {useLoaderData} from 'react-router';
import {HomeCollectionsSliderSection} from '~/components/home/HomeCollectionsSliderSection';
import {HomeHeroSection} from '~/components/home/HomeHeroSection';
import {loadHomeCollectionsSliderData} from '~/components/home/HomeCollectionsSliderSection.server';
import {HomeSubheroSection} from '~/components/home/HomeSubheroSection';
import {loadHomeSubheroProducts} from '~/components/home/HomeSubheroSection.server';
import {HomeWhyNkSection} from '~/components/home/HomeWhyNkSection';
import {loadHomeWhyNkItems} from '~/components/home/HomeWhyNkSection.server';
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
  const [subheroProducts, collectionSlides, whyNkItems] = await Promise.all([
    loadHomeSubheroProducts(context),
    loadHomeCollectionsSliderData(context),
    loadHomeWhyNkItems(context),
  ]);

  return {
    subheroProducts,
    collectionSlides,
    whyNkItems,
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
      <HomeCollectionsSliderSection collections={data.collectionSlides} />
      <HomeWhyNkSection items={data.whyNkItems} />
    </div>
  );
}

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
