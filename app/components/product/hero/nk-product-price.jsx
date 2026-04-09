import {formatMoneyNoDecimals, toCents} from './utils';

/**
 * @param {{selectedVariant: ProductVariantFragment | null; quantity: number}}
 */
export function CherieProductPrice({selectedVariant, quantity}) {
  const currentPriceCents = toCents(selectedVariant?.price?.amount);
  const comparePriceCents = toCents(selectedVariant?.compareAtPrice?.amount);
  const currencyCode = selectedVariant?.price?.currencyCode || 'USD';

  const totalPrice = currentPriceCents * quantity;
  const totalComparePrice = comparePriceCents * quantity;
  const hasCompare = comparePriceCents > currentPriceCents;
  const percentageOff = hasCompare
    ? Math.round(((comparePriceCents - currentPriceCents) * 100) / comparePriceCents)
    : 0;

  return (
    <div className="flex items-baseline gap-3" id="cherie-price">
      {currentPriceCents > 0 ? (
        <span className="md:text-[32px] text-2xl text-[#FF0000] font-helvetica-heavy" id="cherie-price-current">
          {formatMoneyNoDecimals(totalPrice, currencyCode)}
        </span>
      ) : null}

      {hasCompare ? (
        <>
          <span className="md:text-2xl text-lg line-through text-black font-helvetica-heavy" id="cherie-price-compare">
            {formatMoneyNoDecimals(totalComparePrice, currencyCode)}
          </span>
          <p className="px-2 font-helvetica-light text-white bg-nk-red">-{percentageOff}%</p>
        </>
      ) : null}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
