import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import nkBlackLogo from '~/assets/nk-black-logo.webp';

const FOOTER_CONTENT = {
  description: "Корисна і поживна їжа - основа здоров'я вашого вихованця!",
  email: 'cherie@vetbio.pro',
  rightsReserved: '©2025 Усі права захищено',
  instagram: '',
  facebook: '',
};

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="py-16 bg-nk-blue text-white">
            <div className="max-1440 md:px-16 px-4">
              <div className="w-full flex md:flex-row flex-col bg-white md:p-10 p-5 rounded-3xl">
                <div className="md:w-3/12 w-full flex flex-col md:gap-[300px] gap-10">
                  <NavLink prefetch="intent" to="/">
                    <img
                      alt={header?.shop?.name || 'Natural Kitty'}
                      className="max-w-[160px]"
                      style={{
                        filter:
                          'invert(30%) sepia(97%) saturate(1949%) hue-rotate(201deg) brightness(96%) contrast(101%)',
                      }}
                      src={nkBlackLogo}
                    />
                  </NavLink>
                  <p className="md:block hidden max-w-[240px] text-sm text-nk-blue">
                    {FOOTER_CONTENT.description}
                  </p>
                </div>

                <div className="md:w-9/12 w-full flex md:flex-row flex-col justify-between md:gap-0 gap-5 text-[#3684DA] text-sm">
                  <FooterLinksColumn
                    items={footer?.menu?.items || []}
                    primaryDomainUrl={header?.shop?.primaryDomain?.url || ''}
                    publicStoreDomain={publicStoreDomain}
                    title="Категорії"
                  />

                  <FooterLinksColumn
                    items={footer?.footerRightMenu?.items || []}
                    primaryDomainUrl={header?.shop?.primaryDomain?.url || ''}
                    publicStoreDomain={publicStoreDomain}
                    title="Навігація"
                  />

                  <div className="font-e-ukraine">
                    {FOOTER_CONTENT.email ? (
                      <>
                        <h3 className="font-semibold md:mt-0 mt-8 md:mb-8 mb-4 uppercase">
                          Інформація
                        </h3>
                        <a
                          className="hover:text-gray-300 transition block mb-6"
                          href={`mailto:${FOOTER_CONTENT.email}`}
                        >
                          {FOOTER_CONTENT.email}
                        </a>
                      </>
                    ) : null}

                    {FOOTER_CONTENT.instagram || FOOTER_CONTENT.facebook ? (
                      <h3 className="font-semibold mb-8 uppercase">Слідкуйте за нами</h3>
                    ) : null}
                    <div className="flex space-x-4">
                      {FOOTER_CONTENT.instagram ? (
                        <a
                          className="hover:opacity-75 transition"
                          href={FOOTER_CONTENT.instagram}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <InstagramIcon />
                        </a>
                      ) : null}
                      {FOOTER_CONTENT.facebook ? (
                        <a
                          className="hover:opacity-75 transition"
                          href={FOOTER_CONTENT.facebook}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <FacebookIcon />
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <p className="md:hidden max-w-[240px] text-sm text-nk-blue">
                    {FOOTER_CONTENT.description}
                  </p>
                </div>
              </div>

              <div className="text-center text-sm text-white mt-8">
                <p>{FOOTER_CONTENT.rightsReserved}</p>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}


/**
 * @param {{
 *   title: string;
 *   items: FooterQuery['menu']['items'];
 *   primaryDomainUrl: string;
 *   publicStoreDomain: string;
 * }}
 */
function FooterLinksColumn({title, items, primaryDomainUrl, publicStoreDomain}) {
  return (
    <div className="font-e-ukraine">
      <h3 className="font-semibold md:mt-0 mt-8 md:mb-8 mb-4 uppercase">{title}</h3>
      <ul className="flex flex-col gap-3 !list-none">
        {items.map((item) => {
          if (!item?.url) return null;
          const url = normalizeUrl(item.url, publicStoreDomain, primaryDomainUrl);
          const isExternal = !url.startsWith('/');

          return (
            <li key={item.id}>
              {isExternal ? (
                <a
                  className="hover:text-gray-400 hover:underline"
                  href={url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.title}
                </a>
              ) : (
                <NavLink
                  className="hover:text-gray-400 hover:underline"
                  end
                  prefetch="intent"
                  to={url}
                >
                  {item.title}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function normalizeUrl(url, publicStoreDomain, primaryDomainUrl) {
  if (
    url.includes('myshopify.com') ||
    url.includes(publicStoreDomain) ||
    url.includes(primaryDomainUrl)
  ) {
    return new URL(url).pathname;
  }

  return url;
}

function InstagramIcon() {
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 border border-[#3684DA] rounded-full text-[#3684DA]">
      <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
        <rect
          height="14"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.6"
          width="14"
          x="5"
          y="5"
        />
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.5" cy="7.5" fill="currentColor" r="1" />
      </svg>
    </span>
  );
}

function FacebookIcon() {
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 border border-[#3684DA] rounded-full text-[#3684DA]">
      <svg aria-hidden="true" fill="currentColor" height="18" viewBox="0 0 24 24" width="18">
        <path d="M13.4 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3V10H7.4v3h2.7v8h3.3z" />
      </svg>
    </span>
  );
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
