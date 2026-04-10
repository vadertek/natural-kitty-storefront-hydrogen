import {Image} from '@shopify/hydrogen';
import {useMemo, useRef, useState} from 'react';
import {Link} from 'react-router';

/**
 * @param {{
 *   collections: Array<{
 *     id: string;
 *     handle: string;
 *     title: string;
 *     description?: string | null;
 *     image?: {
 *       id: string;
 *       altText?: string | null;
 *       url: string;
 *       width?: number | null;
 *       height?: number | null;
 *     } | null;
 *     products?: {
 *       nodes?: Array<{
 *         id: string;
 *         featuredImage?: {
 *           id: string;
 *           altText?: string | null;
 *           url: string;
 *           width?: number | null;
 *           height?: number | null;
 *         } | null;
 *       }>;
 *     } | null;
 *   }>;
 * }} props
 */
export function HomeCollectionsSliderSection({collections}) {
  const slides = useMemo(
    () =>
      (collections || [])
        .filter((collection) => collection?.handle)
        .map((collection) => ({
          ...collection,
          slideImage:
            collection.image || collection.products?.nodes?.[0]?.featuredImage || null,
        })),
    [collections],
  );

  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  if (!slides.length) return null;

  const isFirst = index === 0;
  const isLast = index === slides.length - 1;
  const canGoPrev = index > 0;
  const canGoNext = index < slides.length - 1;

  /**
   * @param {React.TouchEvent<HTMLElement>} event
   */
  function handleTouchStart(event) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  /**
   * @param {React.TouchEvent<HTMLElement>} event
   */
  function handleTouchEnd(event) {
    if (touchStartX.current == null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    const threshold = 40;

    if (delta <= -threshold && canGoNext) {
      setIndex((value) => Math.min(slides.length - 1, value + 1));
    } else if (delta >= threshold && canGoPrev) {
      setIndex((value) => Math.max(0, value - 1));
    }

    touchStartX.current = null;
  }

  return (
    <section className="w-full py-16 bg-nk-zefir">
      <div className="max-w-[1440px] w-full mx-auto xl:px-16 md:px-10 px-4">
        <div className="relative">
          <button
            aria-label="Previous slide"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[#be233f] text-white items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-45 disabled:cursor-not-allowed"
            disabled={isFirst}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            type="button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            aria-label="Next slide"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[#be233f] text-white items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-45 disabled:cursor-not-allowed"
            disabled={isLast}
            onClick={() => setIndex((value) => Math.min(slides.length - 1, value + 1))}
            type="button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            className="overflow-hidden"
            onTouchEnd={handleTouchEnd}
            onTouchStart={handleTouchStart}
          >
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{transform: `translateX(-${index * 100}%)`}}
            >
              {slides.map((slide) => {
                const previewText = truncate(stripHtml(slide.description || ''), 220);

                return (
                  <div
                    className="w-full shrink-0 md:px-20 flex md:flex-row flex-col md:gap-20 gap-10"
                    key={slide.id}
                  >
                    <div className="md:w-1/2 w-full">
                      {slide.slideImage ? (
                        <Image
                          alt={slide.slideImage.altText || slide.title}
                          className="w-full h-auto object-cover"
                          data={slide.slideImage}
                          loading="lazy"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-white/70" />
                      )}
                    </div>

                    <div className="md:w-1/2 w-full flex flex-col gap-6">
                      <h3 className="text-[40px] leading-[110%] font-montserat-bold text-nk-purple">
                        {slide.title}
                      </h3>

                      <p className="text-sm">{previewText || 'Explore this collection.'}</p>

                      <div className="flex gap-3 flex-wrap">
                        <p className="text-xs w-max text-nk-purple py-1 px-4 rounded-full bg-white font-semibold">
                          Collection
                        </p>
                        <p className="text-xs w-max text-nk-purple py-1 px-4 rounded-full bg-white font-semibold">
                          Natural Kitty
                        </p>
                      </div>

                      <Link
                        className="bg-nk-purple rounded-full flex justify-center items-center h-14 md:w-60 w-full text-white border border-transparent transition-all duration-300 hover:scale-105 hover:bg-white hover:text-nk-purple hover:border-white/80"
                        to={`/collections/${slide.handle}`}
                      >
                        View collection
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * @param {string} value
 */
function stripHtml(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * @param {string} value
 * @param {number} maxChars
 */
function truncate(value, maxChars) {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars - 1).trim()}...`;
}
