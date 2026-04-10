import {Image} from '@shopify/hydrogen';
import {useRef, useState} from 'react';
import {Link} from 'react-router';

/**
 * @param {{
 *   title?: string;
 *   items: Array<{
 *     id: string;
 *     title: string;
 *     text: string;
 *     handle: string;
 *     image?: {
 *       id: string;
 *       altText?: string | null;
 *       url: string;
 *       width?: number | null;
 *       height?: number | null;
 *     } | null;
 *   }>;
 * }} props
 */
export function HomeWhyNkSection({title = 'Why cats choose Natural Kitty?', items}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  if (!items?.length) return null;

  const safeIndex = Math.min(index, items.length - 1);
  const canGoPrev = safeIndex > 0;
  const canGoNext = safeIndex < items.length - 1;

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
      setIndex((value) => Math.min(items.length - 1, value + 1));
    } else if (delta >= threshold && canGoPrev) {
      setIndex((value) => Math.max(0, value - 1));
    }

    touchStartX.current = null;
  }

  return (
    <section className="w-full py-16 px-4 bg-nk-red">
      <div className="max-w-[1320px] mx-auto w-full bg-white rounded-[32px] p-10 flex flex-col">
        <h4 className="text-[32px] text-nk-red font-montserat-bold pb-10 leading-[120%]">
          {title}
        </h4>

        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {items.map((item) => (
            <WhyNkCard item={item} key={item.id} />
          ))}
        </div>

        <div
          className="md:hidden flex flex-col gap-5"
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{transform: `translateX(-${safeIndex * 100}%)`}}
            >
              {items.map((item) => (
                <div className="w-full shrink-0" key={item.id}>
                  <WhyNkCard item={item} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-1 flex justify-center items-center gap-2">
            {items.map((item, dotIndex) => (
              <button
                aria-label={`Go to slide ${dotIndex + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  dotIndex === safeIndex ? 'bg-nk-red scale-110' : 'bg-nk-gray/30'
                }`}
                key={item.id}
                onClick={() => setIndex(dotIndex)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * @param {{
 *   item: {
 *     title: string;
 *     text: string;
 *     handle: string;
 *     image?: {
 *       altText?: string | null;
 *       url: string;
 *       width?: number | null;
 *       height?: number | null;
 *     } | null;
 *   };
 * }} props
 */
function WhyNkCard({item}) {
  const description = truncate(stripHtml(item.text || ''), 180);

  return (
    <Link className="flex flex-col gap-4" to={`/collections/${item.handle}`}>
      {item.image ? (
        <Image
          alt={item.image.altText || item.title}
          className="md:max-w-[140px] w-10/12 md:ml-0 mx-auto aspect-square object-cover"
          data={item.image}
          loading="lazy"
          sizes="(min-width: 768px) 12vw, 75vw"
        />
      ) : (
        <div className="md:max-w-[140px] w-10/12 md:ml-0 mx-auto aspect-square bg-nk-zefir" />
      )}

      <div className="flex flex-col gap-2">
        <p>
          <b className="text-nk-red">{item.title}</b>
        </p>
        <p className="text-nk-gray text-xs">{description || 'Natural ingredients for daily care.'}</p>
      </div>
    </Link>
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
