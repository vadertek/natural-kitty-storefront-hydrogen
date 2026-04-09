/**
 * @param {{title: string; reviewQuantity?: string}}
 */
export function CherieStarsTitle({title, reviewQuantity}) {
  return (
    <>
      <h1
        className="md:text-[32px] text-2xl leading-[100%] font-bold font-e-ukraine text-nk-darkblue"
        style={{marginTop: 0, marginBottom: '0.25rem', paddingTop: 0, paddingBottom: 0}}
      >
        {title}
      </h1>

      <div className="flex items-center gap-1 mt-0">
        {Array.from({length: 5}).map((_, index) => (
          <StarIcon key={index} />
        ))}
        {reviewQuantity ? <span className="text-black text-base ml-1 mt-1">{reviewQuantity}</span> : null}
      </div>
    </>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 16.92 6.2 19.87l1.11-6.47-4.7-4.58 6.49-.94L12 2z"
        fill="#FACC15"
        stroke="#D97706"
        strokeWidth="0.7"
      />
    </svg>
  );
}
