import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';

/**
 * @param {{
 *   products: Array<{
 *     id: string;
 *     handle: string;
 *     title: string;
 *     featuredImage?: {
 *       id: string;
 *       altText?: string | null;
 *       url: string;
 *       width?: number | null;
 *       height?: number | null;
 *     } | null;
 *   }>;
 * }} props
 */
export function HomeSubheroSection({products}) {
  if (!products?.length) return null;

  return (
    <div className="w-full py-16 bg-nk-sky">
      <div className="max-w-[1440px] w-full mx-auto xl:px-16 md:px-10 px-4 flex flex-col md:gap-14 gap-5">
        <div className="grid md:grid-cols-5 grid-cols-6 gap-4">
          {products.map((product, index) => {
            const mobilePositionClass =
              index === 3 ? 'col-start-2' : index === 4 ? 'col-start-4' : '';

            return (
              <Link
                className={`col-span-2 md:col-span-1 md:col-start-auto ${mobilePositionClass} flex flex-col items-center gap-4`}
                key={product.id}
                to={`/products/${product.handle}`}
              >
                {product.featuredImage ? (
                  <Image
                    alt={product.featuredImage.altText || product.title}
                    className="w-full aspect-square"
                    data={product.featuredImage}
                    loading="lazy"
                    sizes="(min-width: 768px) 20vw, 33vw"
                  />
                ) : null}
                <p className="md:text-base text-xs font-semibold text-nk-blue text-center">
                  {product.title}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="w-full flex md:flex-row flex-col text-nk-blue justify-between">
          <div className="md:w-1/2 w-full flex flex-col gap-4 md:mt-0 mt-6">
            <h3 className="text-[48px] leading-[120%] font-semibold">
              Наші продуктові лінійки
            </h3>
            <p className="text-sm">
              Завдяки збалансованому складу продукти Chérie забезпечують котів усім
              необхідним для гарного самопочуття: від амінокислот і вітамінів до
              ферментів та антиоксидантів. Це харчування, яке зміцнює здоров&apos;я,
              підвищує активність і допомагає вашому улюбленцю сяяти щодня.
            </p>
          </div>
          <div className="md:w-1/2 w-full flex justify-end items-end md:mt-0 mt-6">
            <Link
              className="text-white bg-nk-blue rounded-full h-14 md:w-[280px] w-full flex justify-center items-center border border-transparent transition-all duration-300 hover:scale-105 hover:bg-white hover:text-nk-blue hover:border-white/80"
              to="/collections/natural-kitty-chunk-in-gravy"
            >
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
