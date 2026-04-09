/**
 * @param {{media: ProductMediaNode}}
 */
export function MediaNode({media}) {
  switch (media.__typename) {
    case 'MediaImage':
      return (
        <img
          src={media.image?.url}
          alt={media.image?.altText || 'Product media'}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      );
    case 'Video':
      return (
        <video className="w-full h-full object-cover" controls>
          {(media.sources || []).map((source) => (
            <source key={source.url} src={source.url} type={source.mimeType || undefined} />
          ))}
        </video>
      );
    case 'ExternalVideo':
      return (
        <iframe
          src={media.embedUrl}
          title={media.alt || 'External video'}
          className="w-full h-full object-cover"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    case 'Model3d':
      return <div className="text-sm text-gray-500 px-4 text-center">3D model preview</div>;
    default:
      return <div className="text-sm text-gray-500 px-4 text-center">Media preview</div>;
  }
}

/** @typedef {import('storefrontapi.generated').ProductFragment['media']['nodes'][number]} ProductMediaNode */
