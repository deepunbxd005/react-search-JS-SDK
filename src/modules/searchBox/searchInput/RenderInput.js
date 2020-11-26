import React from 'react';
import PropTypes from 'prop-types';

import { Input } from '../../../components';
import { productTypes } from '../../../config';

class RenderInput extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      query,
      lastSearchedQuery,
      productType,
      setSearchBoxQuery
    } = this.props;
    if (
      (prevProps.lastSearchedQuery !== lastSearchedQuery &&
      query !== lastSearchedQuery) ||
      productType !== prevProps.productType
    ) {
      if (productType === productTypes.CATEGORY) {
        setSearchBoxQuery('');
      } else {
        setSearchBoxQuery(lastSearchedQuery);
      }
    }
  }

  render() {
    const {
      query,
      placeholder,
      onSearchBoxChange,
      autoFocus,
      clearable,
      onSearchBoxClear,
      clearComponent
    } = this.props;

    return (
      <Input
        value={query}
        onChange={onSearchBoxChange}
        className="UNX-searchbox__input"
        autoFocus={autoFocus}
        clearable={clearable}
        onClear={onSearchBoxClear}
        clearComponent={clearComponent}
        placeholder={placeholder}
      />
    );
  }
}

RenderInput.propTypes = {
  query: PropTypes.string.isRequired,
  lastSearchedQuery: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  productType: PropTypes.string.isRequired,
  onSearchBoxChange: PropTypes.func.isRequired,
  setSearchBoxQuery: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  clearable: PropTypes.bool,
  onSearchBoxClear: PropTypes.func.isRequired,
  clearComponent: PropTypes.element
};

export default RenderInput;
