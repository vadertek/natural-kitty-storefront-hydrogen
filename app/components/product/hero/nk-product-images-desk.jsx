import {MediaNode} from './media-node';

/**
 * @param {{
 *   mediaList: ProductMediaNode[];
 *   hasBestseller: boolean;
 *   onMediaClick: (index: number) => void;
 * }}
 */
export function CherieProductImagesDesk({mediaList, hasBestseller, onMediaClick}) {
  if (!mediaList.length) return null;

  return (
    <div className="md:grid hidden grid-cols-2 gap-6">
      {mediaList.map((media, index) => (
        <button
          key={media.id || index}
          type="button"
          className="relative bg-white overflow-hidden aspect-[1/1] flex items-center justify-center cursor-pointer"
          onClick={() => onMediaClick(index)}
        >
          {index === 0 && hasBestseller ? (
            <span className="absolute top-0 left-0 text-xs tracking-wide px-3 py-1 uppercase z-10 badge-bestseller bg-[#891601] text-[#FFF194] rounded-full">
              Bestseller
            </span>
          ) : null}
          <MediaNode media={media} />
        </button>
      ))}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductFragment['media']['nodes'][number]} ProductMediaNode */
