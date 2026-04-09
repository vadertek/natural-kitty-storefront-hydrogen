import {useState} from 'react';

/**
 * @param {{
 *   title: string;
 *   description?: string | null;
 *   isDiv?: boolean;
 * }}
 */
export function NKAccordionItem({title, description, isDiv = false}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!description || !String(description).trim()) return null;

  return (
    <div className="acc-item border-2 border-nk-blue px-3 rounded-xl">
      <button
        type="button"
        className="w-full flex justify-between items-center py-3 text-left acc-head"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="font-medium text-xs font-e-ukraine">{title}:</span>

        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`acc-icon shrink-0 transition-transform duration-500 ease-in-out w-3 h-3 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={`acc-wrap grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div
          className={`acc-body overflow-hidden text-sm transition-opacity duration-200 whitespace-pre-line ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
          {isDiv ? (
            <div className="py-4">{description}</div>
          ) : (
            <p className="py-4">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
