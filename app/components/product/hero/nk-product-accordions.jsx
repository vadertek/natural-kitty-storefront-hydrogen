import {NKAccordionItem} from './nk-accordion-item';

/**
 * @param {{product: ProductFragment}}
 */
export function NKProductAccordions({product}) {
  const items = [
    {
      title: 'Bundle filling',
      description: product.bundleFilling?.value,
    },
    {
      title: 'Advantages',
      description: product.advantages?.value,
      isDiv: true,
    },
    {
      title: 'Appointment',
      description: product.appointment?.value,
      isDiv: true,
    },
    {
      title: 'Sklad',
      description: product.sklad?.value,
    },
    {
      title: 'Analytic sklad',
      description: product.analiticSkald?.value,
    },
    {
      title: 'Tech sklad',
      description: product.techAddons?.value,
    },
    {
      title: 'Food sklad',
      description: product.foodAddons?.value,
    },
    {
      title: 'Energy sklad',
      description: product.energyValue?.value,
    },
    {
      title: 'Feed recomend',
      description: product.feedingRecomend?.value,
    },
  ];

  return (
    <div className="accordions flex flex-col gap-2">
      {items.map((item) => (
        <NKAccordionItem
          key={item.title}
          title={item.title}
          description={item.description}
          isDiv={item.isDiv}
        />
      ))}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
