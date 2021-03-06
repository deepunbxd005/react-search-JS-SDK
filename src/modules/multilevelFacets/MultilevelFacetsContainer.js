import React from 'react';
import PropTypes from 'prop-types';

import { conditionalRenderer, scrollTop } from '../../common/utils';
import { getFacetCoreMethods } from './utils';
import MultilevelFacetsWrapper from './MultilevelFacetsWrapper';

class MultilevelFacetsContainer extends React.PureComponent {
  componentDidMount() {
    const {
      categoryDisplayName = '',
      categoryField = '',
      defaultCategoryFilter,
      facetDepth,
      facetLimit,
      helpers: { setMultilevelFacetsConfiguration }
    } = this.props;

    setMultilevelFacetsConfiguration({
      categoryDisplayName,
      categoryField,
      defaultCategoryFilter,
      facetDepth,
      facetLimit
    });
  }

  getMultilevelFacetsProps() {
    const {
      unbxdCore,
      FacetItemComponent,
      label,
      collapsible,
      searchable
    } = this.props;

    const {
      getBucketedFacets,
      getSelectedBucketedFacet,
      getBreadCrumbsList,
      setCategoryFilter,
      getResults
    } = getFacetCoreMethods(unbxdCore);

    const bucketedFacets = getBucketedFacets();
    const selectedBucketedFacet = getSelectedBucketedFacet();
    const breadCrumbsList = getBreadCrumbsList();

    const addCategoryFilter = (event) => {
      const {
        unx_categoryname: name,
        unx_level: level,
        unx_multilevelfield: parent
      } = event.target.dataset;
      const addCategoryObject = { parent, level, name };
      setCategoryFilter(addCategoryObject);
      getResults();
      scrollTop();
    };

    return {
      bucketedFacets,
      addCategoryFilter,
      selectedBucketedFacet,
      breadCrumbsList,
      FacetItemComponent,
      label,
      collapsible,
      searchable
    };
  }

  render() {
    const DefaultRender = MultilevelFacetsWrapper;

    return conditionalRenderer(
      this.props.children,
      this.getMultilevelFacetsProps(),
      DefaultRender
    );
  }
}

MultilevelFacetsContainer.propTypes = {
  unbxdCore: PropTypes.object.isRequired,
  unbxdCoreStatus: PropTypes.string.isRequired,
  helpers: PropTypes.object.isRequired,
  categoryDisplayName: PropTypes.string.isRequired,
  categoryField: PropTypes.string.isRequired,
  facetDepth: PropTypes.number,
  facetLimit: PropTypes.number,
  defaultCategoryFilter: PropTypes.string,
  FacetItemComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  label: PropTypes.node,
  collapsible: PropTypes.bool,
  searchable: PropTypes.bool
};

export default MultilevelFacetsContainer;
