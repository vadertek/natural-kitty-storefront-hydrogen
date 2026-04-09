import {useEffect, useMemo, useState} from 'react';
import {useAside} from '~/components/layout/Aside';
import {CherieProductBreadcrumb} from './nk-product-breadcrumb';
import {CherieStarsTitle} from './nk-stars-title';
import {CherieProductImagesDesk} from './nk-product-images-desk';
import {CherieProductImagesMob} from './nk-product-images-mob';
import {CherieProductPrice} from './nk-product-price';
import {CherieProductQuantity} from './nk-product-quantity';
import {CherieProductButtons} from './nk-product-buttons';
import {CherieProductVariants} from './nk-product-variants';
import {CherieProductModal} from './nk-product-modal';
import {NKProductAccordions} from './nk-product-accordions';
import {parseQuantityDiscounts} from './utils';

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductVariantFragment | null;
 *   productOptions: MappedProductOptions[];
 *   reviewQuantity?: string;
 * }}
 */
export function NKProductHero({
  product,
  selectedVariant,
  productOptions,
  reviewQuantity = '160',
}) {
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);
  const [mobileMediaIndex, setMobileMediaIndex] = useState(0);
  const [activeModalIndex, setActiveModalIndex] = useState(-1);

  const mediaList = useMemo(
    () => (product.media?.nodes ?? []).slice(0, 4),
    [product.media?.nodes],
  );
  const hasBestseller = useMemo(
    () =>
      (product.tags ?? []).some(
        (tag) => String(tag).toLowerCase() === 'bestseller',
      ),
    [product.tags],
  );
  const firstCollection = product.collections?.nodes?.[0] ?? null;
  const quantityDiscounts = parseQuantityDiscounts(product.metafield?.value);

  useEffect(() => {
    if (activeModalIndex < 0) return;

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setActiveModalIndex(-1);
      }
    }

    document.body.classList.add('overflow-hidden');
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.classList.remove('overflow-hidden');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeModalIndex]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?.id]);

  return (
    <div className="max-w-[1440px] mx-auto md:px-[28px] px-5 md:pt-[28px] pt-5 pb-10">
      <CherieProductBreadcrumb product={product} firstCollection={firstCollection} />

      <div className="flex md:flex-row flex-col gap-5 md:mt-5 mt-2">
        <div className="2xl:w-3/5 md:w-2/3 w-full">
          <div className="md:hidden flex flex-col-reverse gap-2 pb-5">
            <CherieStarsTitle title={product.title} reviewQuantity={reviewQuantity} />
          </div>

          <CherieProductImagesDesk
            mediaList={mediaList}
            hasBestseller={hasBestseller}
            onMediaClick={setActiveModalIndex}
          />
          <CherieProductImagesMob
            mediaList={mediaList}
            hasBestseller={hasBestseller}
            activeIndex={mobileMediaIndex}
            onChangeIndex={setMobileMediaIndex}
            onMediaClick={setActiveModalIndex}
          />
        </div>

        <div className="2xl:w-2/5 md:w-1/3 w-full flex flex-col gap-2">
          <div className="md:flex hidden flex-col gap-2">
            <CherieStarsTitle title={product.title} reviewQuantity={reviewQuantity} />
          </div>

          <div className="font-helvetica-medium text-sm">{product.description}</div>

          <CherieProductPrice selectedVariant={selectedVariant} quantity={quantity} />

          <CherieProductQuantity
            quantity={quantity}
            onChange={setQuantity}
            quantityDiscounts={quantityDiscounts}
          />

          <CherieProductVariants productOptions={productOptions} />

          <CherieProductButtons
            selectedVariant={selectedVariant}
            quantity={quantity}
            onAddToCart={() => open('cart')}
          />
          <NKProductAccordions product={product} />
        </div>
      </div>

      <CherieProductModal
        mediaList={mediaList}
        activeIndex={activeModalIndex}
        onClose={() => setActiveModalIndex(-1)}
        onChangeIndex={setActiveModalIndex}
      />
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
