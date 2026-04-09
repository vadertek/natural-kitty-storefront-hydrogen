import {MediaNode} from './media-node';

/**
 * @param {{
 *   mediaList: ProductMediaNode[];
 *   activeIndex: number;
 *   onClose: () => void;
 *   onChangeIndex: (index: number) => void;
 * }}
 */
export function CherieProductModal({mediaList, activeIndex, onClose, onChangeIndex}) {
  if (activeIndex < 0 || !mediaList[activeIndex]) return null;

  return (
    <div className="product-media-modal fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center" onClick={onClose}>
      <div
        className="relative w-[94vw] md:w-[min(92vw,1100px)] max-h-[94dvh] md:max-h-[92vh] flex flex-col items-center gap-3 md:gap-4 px-3 md:px-4 pt-4 md:pt-6 pb-3 md:pb-4"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-0 right-1 md:right-2 text-white md:text-7xl text-4xl leading-none px-2 hover:scale-110 transition-all duration-150 hover:text-red-500 z-10"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="w-full aspect-square md:aspect-auto h-auto md:h-[min(68vh,760px)] pt-6 md:pt-8 flex items-center justify-center bg-transparent">
          <MediaNode media={mediaList[activeIndex]} />
        </div>

        <div className="w-full max-w-[760px] overflow-x-auto flex items-center justify-start md:justify-center gap-2 md:gap-3 py-1">
          {mediaList.map((media, index) => (
            <button
              type="button"
              key={(media.id || index) + '-thumb'}
              className={`shrink-0 w-14 h-14 md:w-20 md:h-20 bg-white rounded overflow-hidden transition-all duration-150 border ${index === activeIndex ? 'border-gray-900 opacity-100' : 'border-gray-200 opacity-70'}`}
              onClick={() => onChangeIndex(index)}
            >
              <MediaThumb media={media} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MediaThumb({media}) {
  if (media.__typename === 'MediaImage' && media.image?.url) {
    return <img src={media.image.url} alt={media.image.altText || 'Media preview'} className="w-full h-full object-contain" loading="lazy" />;
  }

  if (media.__typename === 'Video' && media.previewImage?.url) {
    return <img src={media.previewImage.url} alt={media.alt || 'Media preview'} className="w-full h-full object-contain" loading="lazy" />;
  }

  if (media.__typename === 'ExternalVideo' && media.previewImage?.url) {
    return <img src={media.previewImage.url} alt={media.alt || 'Media preview'} className="w-full h-full object-contain" loading="lazy" />;
  }

  return <span className="w-full h-full flex items-center justify-center text-xs text-black/70 px-2">Media</span>;
}

/** @typedef {import('storefrontapi.generated').ProductFragment['media']['nodes'][number]} ProductMediaNode */
