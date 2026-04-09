import {Link} from 'react-router';
import {truncate} from './utils';

/**
 * @param {{
 *   product: ProductFragment;
 *   firstCollection: {handle: string; title: string} | null;
 * }}
 */
export function CherieProductBreadcrumb({product, firstCollection}) {
  return (
    <div className="flex items-center gap-3 md:text-base text-xs">
      <Link className="text-gray-400" to="/">
        Home
      </Link>
      <p className="text-gray-400">/</p>

      {firstCollection ? (
        <>
          <Link className="md:block hidden text-gray-400 hover:underline" to={`/collections/${firstCollection.handle}`}>
            {truncate(firstCollection.title, 25)}
          </Link>
          <Link className="md:hidden text-gray-400 hover:underline" to={`/collections/${firstCollection.handle}`}>
            ...
          </Link>
          <p className="text-gray-400">/</p>
        </>
      ) : null}

      <p className="md:block hidden">{truncate(product.title, 50)}</p>
      <p className="md:hidden">{truncate(product.title, 40)}</p>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
