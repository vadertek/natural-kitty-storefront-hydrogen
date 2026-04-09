import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection> encapsulates previous/next pagination behavior.
 * @param {Class<Pagination<NodesType>>['connection']>}
 */
export function PaginatedResourceSection({
  connection,
  children,
  resourcesClassName,
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className="pagination-section">
            <div className="pagination-controls pagination-controls-top">
              <PreviousLink className="pagination-link pagination-link-prev">
                {isLoading ? 'Loading...' : <span>Load previous</span>}
              </PreviousLink>
            </div>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <div className="pagination-controls pagination-controls-bottom">
              <NextLink className="pagination-link pagination-link-next">
                {isLoading ? 'Loading...' : <span>Load more</span>}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
