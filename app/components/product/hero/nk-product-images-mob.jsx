import {useEffect, useRef} from 'react';
import {MediaNode} from './media-node';

/**
 * @param {{
 *   mediaList: ProductMediaNode[];
 *   hasBestseller: boolean;
 *   activeIndex: number;
 *   onChangeIndex: (index: number) => void;
 *   onMediaClick: (index: number) => void;
 * }}
 */
export function CherieProductImagesMob({
  mediaList,
  hasBestseller,
  activeIndex,
  onChangeIndex,
  onMediaClick,
}) {
  const scrollerRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const next = scroller.children.item(activeIndex);
    if (!(next instanceof HTMLElement)) return;

    scroller.scrollTo({
      left: next.offsetLeft,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  function handleScroll(event) {
    const target = event.currentTarget;
    const width = target.clientWidth || 1;
    const index = Math.round(target.scrollLeft / width);
    if (index !== activeIndex) {
      onChangeIndex(index);
    }
  }

  if (!mediaList.length) return null;

  return (
    <div className="md:hidden">
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
      >
        {mediaList.map((media, index) => (
          <button
            key={media.id || index}
            type="button"
            className="snap-start shrink-0 w-full relative bg-white overflow-hidden aspect-[1/1] flex items-center justify-center cursor-pointer"
            onClick={() => onMediaClick(index)}
          >
            {index === 0 && hasBestseller ? (
              <span className="absolute top-0 left-0 bg-black text-white text-xs tracking-wide px-3 py-1 uppercase z-10 badge-bestseller">
                Bestseller
              </span>
            ) : null}
            <MediaNode media={media} />
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {mediaList.map((media, index) => (
          <button
            key={(media.id || index) + '-dot'}
            type="button"
            className={`h-1 w-[23px] ${activeIndex === index ? 'bg-black' : 'bg-[#E3E3E3]'}`}
            onClick={() => onChangeIndex(index)}
            aria-label={`Go to media ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductFragment['media']['nodes'][number]} ProductMediaNode */
