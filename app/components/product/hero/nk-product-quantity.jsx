/**
 * @param {{
 *   quantity: number;
 *   onChange: (value: number) => void;
 *   quantityDiscounts: Array<{quantity: string | number; percent: string | number}>;
 * }}
 */
export function CherieProductQuantity({quantity, onChange, quantityDiscounts}) {
  function setQty(value) {
    const parsed = Number.parseInt(String(value), 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      onChange(1);
      return;
    }
    onChange(parsed);
  }

  return (
    <>
      <div className="pb-1 pt-4 text-gray-600 font-e-ukraine">Quantity:</div>
      <div className="flex items-stretch gap-2" id="cherie-qty-block">
        <div className="flex items-center justify-between py-2 md:px-5 px-2 border-2 border-transparent md:min-w-[120px] min-h-[64px] bg-[#EBF2F9] rounded-xl">
          <button
            type="button"
            className="text-xl leading-none select-none"
            onClick={() => setQty(quantity - 1)}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQty(event.target.value)}
            className="w-10 text-center text-xl bg-transparent outline-none"
          />
          <button
            type="button"
            className="text-xl leading-none select-none"
            onClick={() => setQty(quantity + 1)}
          >
            +
          </button>
        </div>

        {quantityDiscounts.length ? (
          <div className="flex items-center text-sm md:text-base flex-1 border border-nk-blue rounded-xl">
            <div className="py-1 px-3 font-medium text-black whitespace-nowrap leading-[110%] h-full flex flex-col justify-center md:text-[10px] text-[8px] bg-[#EBF2F9] rounded-xl font-e-ukraine">
              Buy more
              <br />
              Save more
            </div>

            <div className="flex items-center justify-around flex-1 md:px-2 px-1 md:gap-2 gap-1 text-[#F94A1A]">
              {quantityDiscounts.slice(0, 3).map((discount, index) => (
                <div className="flex flex-col items-center" key={`${discount.quantity}-${index}`}>
                  <span className="text-[#4D4D4D] uppercase md:text-xs text-[9px] md:py-0.5">
                    {discount.quantity}
                  </span>
                  <span className="font-bold text-xl leading-none mt-1">{discount.percent}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
