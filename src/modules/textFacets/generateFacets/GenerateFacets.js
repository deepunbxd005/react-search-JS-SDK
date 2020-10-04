import React from 'react';
import PropTypes from 'prop-types';

import { isFacetSelected } from '../utils';
import { List, Input } from '../../../components';
import FacetItem from './FacetItem';
import { searchStatus } from './../../../config';

class GenerateFacets extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textFacets: [] };
  }
  componentDidUpdate(prevProps) {
    const {
      textFacets,
      selectedFacets,
      lastSelectedFacets,
      setSelectedFacets,
      enableApplyFilters,
      unbxdCoreStatus,
      sortTextFacets
    } = this.props;
    if (
      prevProps.unbxdCoreStatus !== unbxdCoreStatus &&
      unbxdCoreStatus === searchStatus.READY &&
      selectedFacets !== lastSelectedFacets
    ) {
      const formattedTextFacets = textFacets.map((textFacet) => {
        const matchTextFacet = this.state.textFacets.find(
          (facetObj) => facetObj.facetName === textFacet.facetName
        );
        return {
          ...textFacet,
          isOpen: matchTextFacet ? matchTextFacet.isOpen : true,
          filter: matchTextFacet ? matchTextFacet.filter : ''
        };
      });

      if(sortTextFacets && typeof(sortTextFacets) === 'function'){
        sortTextFacets.call(formattedTextFacets);
      }

      this.setState(() => {
        return { textFacets: formattedTextFacets };
      });

      setSelectedFacets(
        enableApplyFilters ? selectedFacets : lastSelectedFacets
      );
    }
  }

  handleCollapseToggle = (event) => {
    const facetId = event.target.dataset['unx_name'];
    this.setState((currentState) => {
      const updatedTextFacets = currentState.textFacets.map((textFacet) => {
        if (facetId === textFacet.facetName) {
          return { ...textFacet, isOpen: !textFacet.isOpen };
        }
        return { ...textFacet };
      });

      return { ...currentState, textFacets: updatedTextFacets };
    });
  };

  handleFilterChange = (event) => {
    const facetId = event.target.name;
    const value = event.target.value;
    this.setState((currentState) => {
      const updatedTextFacets = currentState.textFacets.map((textFacet) => {
        if (facetId === textFacet.facetName) {
          return { ...textFacet, filter: value.toLowerCase() };
        }
        return { ...textFacet };
      });

      return { ...currentState, textFacets: updatedTextFacets };
    });
  };

  render() {
    const {
      selectedFacets,
      onFacetClick,
      onFacetObjectReset,
      FacetItemComponent,
      label,
      collapsible,
      searchable
    } = this.props;

    const { textFacets } = this.state;

    if (textFacets.length === 0) {
      return null;
    }

    return (
      <div className="UNX-textFacet__container">
        {label ? label : null}
        {textFacets.map(
          ({ displayName, facetName, values, isOpen, filter }) => {
            //decide whether to show clear or not
            const hasActiveFacets = selectedFacets[facetName] ? true : false;
            let filteredValues = values;
            if (filter.length > 0) {
              filteredValues = values.filter((value) => {
                return value.name.toLowerCase().includes(filter);
              });
            }

            return (
              <div
                className={`UNX-facet__element ${isOpen ? 'open' : ''}`}
                key={facetName}
              >
                <div className="UNX-facet__header" data-unx_name={facetName}>
                  {displayName}
                  {collapsible && (
                    <span
                      className="-collapse-icon"
                      data-unx_name={facetName}
                      onClick={this.handleCollapseToggle}
                    />
                  )}
                </div>
                {searchable && isOpen && (
                  <div className="UNX-facetFilter__container">
                    <Input
                      className="-input"
                      value={filter}
                      name={facetName}
                      onChange={this.handleFilterChange}
                    />
                  </div>
                )}
                <List
                  items={filteredValues}
                  idAttribute={'dataId'}
                  ListItem={FacetItemComponent || FacetItem}
                  onClick={onFacetClick}
                  facetName={facetName}
                  className={'UNX-facet__list'}
                  isFacetSelected={isFacetSelected}
                  selectedFacets={selectedFacets}
                />
                {hasActiveFacets && (
                  <div
                    className="-clear"
                    data-unx_name={facetName}
                    onClick={onFacetObjectReset}
                  >
                    Clear
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    );
  }
}

GenerateFacets.propTypes = {
  textFacets: PropTypes.arrayOf(PropTypes.object),
  selectedFacets: PropTypes.object,
  lastSelectedFacets: PropTypes.object,
  onFacetClick: PropTypes.func.isRequired,
  onFacetObjectReset: PropTypes.func.isRequired,
  setSelectedFacets: PropTypes.func.isRequired,
  enableApplyFilters: PropTypes.bool.isRequired,
  unbxdCoreStatus: PropTypes.string.isRequired,
  FacetItemComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  label: PropTypes.node,
  collapsible: PropTypes.bool.isRequired,
  searchable: PropTypes.bool.isRequired
};

export default GenerateFacets;
