import {useOptimisticCart} from '@shopify/hydrogen';
import {Suspense, useEffect, useMemo, useRef, useState} from 'react';
import {
  Await,
  Link,
  NavLink,
  useAsyncValue,
  useFetcher,
  useLocation,
} from 'react-router';
import nkBlackLogo from '~/assets/nk-black-logo.webp';

const EMPTY_MENU = [];
const MEGA_CTA_LABEL = 'Want to be a partner';
const MEGA_CTA_URL = '#';

/**
 * @param {HeaderProps}
 */
export function Header({header, cart, publicStoreDomain}) {
  const location = useLocation();
  const predictiveFetcher = useFetcher();
  const isHome = location.pathname === '/';
  const headerRef = useRef(/** @type {HTMLElement | null} */ (null));
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [preview, setPreview] = useState('');
  const [megaTopOffset, setMegaTopOffset] = useState(96);

  const logoUrl = nkBlackLogo;
  const mainMenu = header?.menu?.items || FALLBACK_MAIN_MENU;
  const rightMenu = header?.headerRightMenu?.items || EMPTY_MENU;
  const mainPagesMenu = header?.mainPagesMenu?.items || EMPTY_MENU;
  const megaTopMenu = header?.megaMenuTop?.items || EMPTY_MENU;
  const megaBottomMenu = header?.megaMenuBottom?.items || EMPTY_MENU;
  const storeLink =
    mainMenu.find((item) => item?.title?.toLowerCase().includes('магаз')) ||
    mainMenu[0] ||
    null;

  const megaItems = useMemo(
    () => [...megaTopMenu, ...megaBottomMenu],
    [megaTopMenu, megaBottomMenu],
  );
  const defaultPreview = useMemo(
    () => megaItems.map(getMenuItemImage).find(Boolean) || logoUrl || '',
    [logoUrl, megaItems],
  );

  useEffect(() => {
    setPreview(defaultPreview);
  }, [defaultPreview]);

  useEffect(() => {
    setIsMegaOpen(false);
    setIsMobileOpen(false);
    setIsSearchOpen(false);
    setSearchTerm('');
  }, [location.pathname]);

  useEffect(() => {
    const shouldLock = isMobileOpen || isMegaOpen || isSearchOpen;
    if (shouldLock) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      return;
    }

    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, [isMobileOpen, isMegaOpen, isSearchOpen]);

  useEffect(() => {
    const onKeydown = (event) => {
      if (event.key !== 'Escape') return;
      setIsMegaOpen(false);
      setIsMobileOpen(false);
      setIsSearchOpen(false);
    };

    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, []);

  useEffect(() => {
    if (!isSearchOpen || searchTerm.trim().length < 2) {
      return;
    }

    const query = searchTerm.trim();

    const timeout = setTimeout(() => {
      predictiveFetcher.load(
        `/search?predictive=true&q=${encodeURIComponent(query)}&limit=10`,
      );
    }, 180);

    return () => clearTimeout(timeout);
  }, [isSearchOpen, predictiveFetcher, searchTerm]);

  const searchResults =
    isSearchOpen && searchTerm.trim().length >= 2
      ? predictiveFetcher?.data?.result?.items?.products || []
      : [];

  useEffect(() => {
    const updateMegaTopOffset = () => {
      const headerElement = headerRef.current;
      if (!headerElement) return;
      const rect = headerElement.getBoundingClientRect();
      setMegaTopOffset(Math.max(0, Math.round(rect.bottom)));
    };

    updateMegaTopOffset();
    window.addEventListener('resize', updateMegaTopOffset);
    return () => window.removeEventListener('resize', updateMegaTopOffset);
  }, [location.pathname]);

  return (
    <>
      <header
        ref={headerRef}
        className={`top-0 w-full flex justify-center py-6 transition-all duration-100 z-30 ${
          isHome ? 'md:absolute' : 'relative bg-white border-b border-black/10'
        }`}
      >
        <div
          className={`z-20 flex justify-between max-w-[1440px] w-full md:items-end items-center links-hover md:px-[28px] px-4 ${
            isHome
              ? 'text-white [&_a]:text-white'
              : 'text-black [&_a]:text-black'
          }`}
        >
          <div className="xl:w-1/3 md:flex hidden gap-6">
            {storeLink ? (
              <MenuLink
                className={isHome ? 'text-white' : 'text-black'}
                header={header}
                item={storeLink}
                publicStoreDomain={publicStoreDomain}
              />
            ) : null}
          </div>

          <div className="xl:w-1/3 md:max-w-[160px] max-w-[70px]">
            <NavLink prefetch="intent" to="/" end>
              <img
                className={`w-full ${isHome ? 'brightness-0 invert' : ''}`}
                src={logoUrl}
                alt={header?.shop?.name || 'Logotype'}
              />
            </NavLink>
          </div>

          <div className="xl:w-1/3 md:flex justify-end hidden gap-6 items-center">
            <button
              className={isHome ? 'text-white' : 'text-black'}
              onClick={() => setIsMegaOpen(true)}
              onFocus={() => setIsMegaOpen(true)}
              onMouseEnter={() => setIsMegaOpen(true)}
              type="button"
            >
              Categories
            </button>
            {rightMenu.map((item) => (
              <MenuLink
                className={isHome ? 'text-white' : 'text-black'}
                header={header}
                item={item}
                key={item.id}
                publicStoreDomain={publicStoreDomain}
              />
            ))}
            <button
              aria-label="Search"
              className={`relative flex items-center justify-center w-6 h-6 ${
                isHome ? 'text-white' : 'text-black'
              }`}
              onClick={() => setIsSearchOpen(true)}
              type="button"
            >
              <SearchIcon />
            </button>
            <CartToggle cart={cart} isHome={isHome} />
          </div>

          <div className="md:hidden flex items-center gap-7">
            <CartToggle cart={cart} isHome={isHome} />
            <button
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
              className="relative w-8 h-8 shrink-0 z-20"
              onClick={() => setIsMobileOpen((value) => !value)}
              type="button"
            >
              <span
                className={`absolute left-1/2 top-1/2 block h-[2px] w-7 -translate-x-1/2 bg-nk-blue transition-all duration-300 ${
                  isHome ? 'bg-white' : 'bg-black'
                } ${
                  isMobileOpen ? 'translate-y-0 rotate-45' : '-translate-y-[6px]'
                }`}
              />
              <span
                className={`absolute left-1/2 top-1/2 block h-[2px] transition-all duration-300 ${
                  isHome ? 'bg-white' : 'bg-black'
                } ${
                  isMobileOpen
                    ? '-translate-x-1/2 translate-y-0 -rotate-45 w-7'
                    : 'w-5 -translate-x-1/3 translate-y-[6px]'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <nav
        className={`fixed inset-0 z-50 transform transition-transform duration-300 md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full w-full flex flex-col justify-center items-center space-y-8 text-2xl">
          <div className="w-full flex flex-col md:gap-10 gap-2 bg-white px-5 h-screen">
            <div className="z-20 pt-10 flex justify-between max-w-[1440px] w-full md:items-end items-center links-hover">
              <div className="xl:w-1/3 max-w-[120px] bg-white z-50">
                <NavLink onClick={() => setIsMobileOpen(false)} prefetch="intent" to="/" end>
                  <img
                    className="w-full"
                    src={logoUrl}
                    alt={header?.shop?.name || 'Logotype'}
                  />
                </NavLink>
              </div>
              <button
                className="text-nk-blue text-2xl leading-none"
                onClick={() => setIsMobileOpen(false)}
                type="button"
              >
                X
              </button>
            </div>

            <Link
              className="mb-4 text-2xl tracking-widest text-nk-blue/60 uppercase md:pt-0 pt-10"
              onClick={() => setIsMobileOpen(false)}
              to="/"
            >
              Home
            </Link>
            <MenuGroup
              header={header}
              onNavigate={() => setIsMobileOpen(false)}
              publicStoreDomain={publicStoreDomain}
              title="Pages"
              items={mainPagesMenu}
            />
            <MenuGroup
              header={header}
              onNavigate={() => setIsMobileOpen(false)}
              publicStoreDomain={publicStoreDomain}
              title="Cans"
              items={megaTopMenu}
            />
            <MenuGroup
              header={header}
              onNavigate={() => setIsMobileOpen(false)}
              publicStoreDomain={publicStoreDomain}
              title="Other"
              items={megaBottomMenu}
            />
            <Link
              className="w-max inline-block mt-6 px-10 text-sm py-4 leading-none bg-nk-red text-white"
              onClick={() => setIsMobileOpen(false)}
              to={MEGA_CTA_URL}
            >
              {MEGA_CTA_LABEL}
            </Link>
          </div>
        </div>
      </nav>

      <div
        className={`fixed left-0 right-0 transition-all duration-100 bg-white text-black z-[120] border-t border-black/10 shadow-2xl ${
          isMegaOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{top: `${megaTopOffset}px`}}
        onMouseLeave={() => {
          setIsMegaOpen(false);
          setPreview(defaultPreview);
        }}
      >
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 grid-cols-1 md:px-[40px] xl:px-[64px] px-4 py-8">
          <div className="w-full flex flex-col justify-between">
            <ul className="space-y-2 text-sm !list-none">
              <MegaGroup
                header={header}
                publicStoreDomain={publicStoreDomain}
                title="Cans"
                items={megaTopMenu}
                onPreview={setPreview}
              />
              <MegaGroup
                header={header}
                publicStoreDomain={publicStoreDomain}
                title="Other"
                items={megaBottomMenu}
                onPreview={setPreview}
              />
            </ul>
            <Link
              className="w-max inline-block mt-6 border border-nk-blue text-nk-blue px-4 py-2 leading-none hover:bg-nk-blue hover:text-white"
              to={MEGA_CTA_URL}
            >
              {MEGA_CTA_LABEL}
            </Link>
          </div>

          <div className="hidden md:block">
            {preview ? (
              <img
                className="w-full h-full object-cover transition-opacity duration-150 max-h-[350px]"
                src={preview}
                alt="Category preview"
              />
            ) : (
              <div className="w-full h-[350px] bg-gray-100" />
            )}
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchTerm('');
        }}
        results={searchResults}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </>
  );
}

/**
 * @param {{
 *   title: string;
 *   items: HeaderQuery['menu']['items'];
 *   header: HeaderQuery;
 *   publicStoreDomain: string;
 *   onNavigate: () => void;
 * }}
 */
function MenuGroup({title, items, header, publicStoreDomain, onNavigate}) {
  if (!items.length) return null;

  return (
    <>
      <div className="mt-6 mb-4 text-2xl tracking-widest text-nk-blue/60 uppercase">
        {title}
      </div>
      <div className="space-y-2 text-sm text-nk-blue">
        {items.map((item) => (
          <ul key={item.id}>
            <MenuLink
              className="hover:opacity-60 hover:underline text-nk-blue"
              header={header}
              item={item}
              onClick={onNavigate}
              publicStoreDomain={publicStoreDomain}
            />
          </ul>
        ))}
      </div>
    </>
  );
}

/**
 * @param {{
 *   title: string;
 *   items: HeaderQuery['menu']['items'];
 *   header: HeaderQuery;
 *   publicStoreDomain: string;
 *   onPreview: (value: string) => void;
 * }}
 */
function MegaGroup({title, items, header, publicStoreDomain, onPreview}) {
  if (!items.length) return null;

  return (
    <>
      <div className="mt-6 mb-2 text-xs tracking-widest text-black/60 uppercase">
        {title}
      </div>
      {items.map((item) => (
        <li key={item.id}>
          <MenuLink
            className="hover:opacity-60 hover:underline"
            header={header}
            item={item}
            onFocus={() => {
              const image = getMenuItemImage(item);
              if (image) onPreview(image);
            }}
            onMouseEnter={() => {
              const image = getMenuItemImage(item);
              if (image) onPreview(image);
            }}
            publicStoreDomain={publicStoreDomain}
          />
        </li>
      ))}
    </>
  );
}

/**
 * @param {{
 *   className?: string;
 *   header: HeaderQuery;
 *   item: HeaderQuery['menu']['items'][number];
 *   onClick?: () => void;
 *   onFocus?: () => void;
 *   onMouseEnter?: () => void;
 *   publicStoreDomain: string;
 * }}
 */
function MenuLink({
  item,
  header,
  publicStoreDomain,
  className,
  onClick,
  onFocus,
  onMouseEnter,
}) {
  if (!item.url) return null;

  return (
    <NavLink
      className={className}
      onClick={onClick}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      prefetch="intent"
      to={normalizeMenuUrl(
        item.url,
        publicStoreDomain,
        header.shop.primaryDomain.url,
      )}
    >
      {item.title}
    </NavLink>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart, isHome}) {
  return (
    <Suspense fallback={<CartBadge count={null} isHome={isHome} />}>
      <Await resolve={cart}>
        <CartBanner isHome={isHome} />
      </Await>
    </Suspense>
  );
}

/**
 * @param {{count: number | null; isHome: boolean}}
 */
function CartBadge({count, isHome}) {
  return (
    <Link
      className="relative inline-flex items-center justify-center w-8 h-8"
      id="cherie-header-cart"
      prefetch="intent"
      to="/cart"
    >
      <CartIcon isHome={isHome} />
      <span
        className={`absolute -top-1 -right-2 md:bg-black bg-white md:text-white text-black text-[10px] leading-none px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
          count && count > 0 ? '' : 'hidden'
        }`}
        id="cherie-cart-count"
      >
        {count ?? 0}
      </span>
    </Link>
  );
}

function CartBanner({isHome}) {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} isHome={isHome} />;
}

function getMenuItemImage(item) {
  return item?.resource?.image?.url || item?.resource?.featuredImage?.url || '';
}

function normalizeMenuUrl(url, publicStoreDomain, primaryDomainUrl) {
  if (
    url.includes('myshopify.com') ||
    url.includes(publicStoreDomain) ||
    url.includes(primaryDomainUrl)
  ) {
    return new URL(url).pathname;
  }

  return url;
}

const FALLBACK_MAIN_MENU = [
  {id: 'fallback-collections', title: 'Collections', url: '/collections'},
  {id: 'fallback-blog', title: 'Blog', url: '/blogs'},
  {id: 'fallback-policies', title: 'Policies', url: '/policies'},
];

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M21 21l-4.35-4.35M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CartIcon({isHome}) {
  return (
    <svg
      aria-hidden="true"
      className={`w-6 h-6 ${isHome ? 'text-white' : 'text-black'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M3.75 5.25h1.5l1.5 12h10.5l1.5-9H6.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="19" r="1" />
      <circle cx="16" cy="19" r="1" />
    </svg>
  );
}

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   results: Array<{
 *     id: string;
 *     title: string;
 *     handle: string;
 *     selectedOrFirstAvailableVariant?: {
 *       image?: {url?: string};
 *       price?: {amount?: string};
 *     };
 *   }>;
 *   searchTerm: string;
 *   setSearchTerm: (value: string) => void;
 * }}
 */
function SearchModal({isOpen, onClose, results, searchTerm, setSearchTerm}) {
  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm items-start justify-center z-50 p-4 md:p-10 text-black ${
        isOpen ? 'flex' : 'hidden'
      }`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
          onClose();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="bg-white w-full max-w-[720px] rounded-2xl shadow-xl mx-auto flex flex-col max-h-[80vh] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-nk-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-4.35-4.35M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
          <form
            action="/search"
            className="flex-1"
            method="get"
            onSubmit={() => onClose()}
          >
            <input
              className="w-full text-base focus:outline-none text-nk-blue/60 py-1"
              name="q"
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              placeholder="Search"
              type="search"
              value={searchTerm}
            />
          </form>
          <button
            className="ml-3 text-nk-blue hover:text-black text-xl leading-none"
            onClick={onClose}
            type="button"
          >
            &times;
          </button>
        </div>

        <div
          className={`p-5 overflow-y-auto ${
            searchTerm.trim().length >= 2 ? 'block' : 'hidden'
          }`}
          id="cherie-search-results"
        >
          <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-3">
            Recommendations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.length ? (
              results.map((product) => (
                <a
                  className="block group border border-[#3684DA] hover:border-blue-800/70 rounded-lg overflow-hidden transition bg-white"
                  href={`/products/${product.handle}`}
                  key={product.id}
                  onClick={onClose}
                >
                  <div className="w-full bg-[#f8f8f8] aspect-[4/3] overflow-hidden">
                    {product?.selectedOrFirstAvailableVariant?.image?.url ? (
                      <img
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-[1.02] transition"
                        loading="lazy"
                        src={product.selectedOrFirstAvailableVariant.image.url}
                      />
                    ) : null}
                  </div>
                  <div className="p-3">
                    <p className="text-sm leading-tight mb-1 line-clamp-2 text-[#3684DA]">
                      {product.title}
                    </p>
                    {Number(product?.selectedOrFirstAvailableVariant?.price?.amount) > 0 ? (
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        {product.selectedOrFirstAvailableVariant.price.amount}
                      </p>
                    ) : null}
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-gray-400 col-span-3">Nothing found...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
