import {Link, useNavigate} from 'react-router';

/**
 * @param {{productOptions: MappedProductOptions[]}}
 */
export function CherieProductVariants({productOptions}) {
  const navigate = useNavigate();

  return (
    <div className="mt-2">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="mb-3" key={option.name}>
            <h5 className="text-sm mb-2">{option.name}</h5>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                } = value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      className={`px-3 py-2 text-sm border rounded-lg ${selected ? 'border-black' : 'border-gray-300'} ${available ? 'opacity-100' : 'opacity-40'}`}
                    >
                      {name}
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    key={option.name + name}
                    className={`px-3 py-2 text-sm border rounded-lg ${selected ? 'border-black' : 'border-gray-300'} ${available ? 'opacity-100' : 'opacity-40'}`}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
