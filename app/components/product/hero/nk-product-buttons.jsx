import {AddToCartButton} from '~/components/product/AddToCartButton';

/**
 * @param {{
 *   selectedVariant: ProductVariantFragment | null;
 *   quantity: number;
 *   onAddToCart: () => void;
 * }}
 */
export function CherieProductButtons({selectedVariant, quantity, onAddToCart}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-3 relative pb-5">
      {selectedVariant?.availableForSale ? (
        <AddToCartButton
          disabled={!selectedVariant}
          onClick={onAddToCart}
          className="add-to-cart flex-1 flex items-center justify-center duration-150 transition-all md:static fixed bottom-4 left-4 right-4 z-10 rounded-2xl bg-[#EBF2F9] text-[#3684DA] border-2 border-[#3684DA] hover:bg-white hover:text-[#3684DA] h-[55px]"
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          Add to cart
        </AddToCartButton>
      ) : (
        <button
          type="button"
          className="flex-1 flex items-center justify-center cursor-not-allowed duration-150 transition-all md:static fixed bottom-4 left-4 right-4 z-10 rounded-2xl bg-[#EBF2F9] border-[#EBF2F9] text-[#3684DA] border-2 h-[55px]"
          disabled
        >
          Недоступно
        </button>
      )}

      <a
        href="/pages/where-to-buy"
        className="md:flex-1 flex items-center justify-center transition md:w-auto mt-2 md:mt-0 rounded-2xl bg-nk-red text-white border-2 border-nk-red hover:bg-white hover:text-nk-red h-[55px]"
      >
        Where to buy
      </a>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
