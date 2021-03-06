import React from 'react';
import PropTypes from 'prop-types';

import { PageSizeDropdown, PageSizeList } from './displayTypes';
import { displayTypes } from '../../config';

const PageSizeWrapper = (props) => {
  const {
    onPageSizeClick,
    displayType,
    noOfPages,
    size,
    sizeOptions,
    PageSizeItemComponent,
    label
  } = props;

  if (noOfPages === 0) {
    return null;
  }

  return (
    <div className="UNX-pageSize__container">
      {label ? label : null}
      {displayType === displayTypes.DROPDOWN && (
        <PageSizeDropdown
          size={size}
          sizeOptions={sizeOptions}
          onPageSizeClick={onPageSizeClick}
        />
      )}

      {displayType === displayTypes.LIST && (
        <PageSizeList
          size={size}
          sizeOptions={sizeOptions}
          onPageSizeClick={onPageSizeClick}
          PageSizeItemComponent={PageSizeItemComponent}
        />
      )}
    </div>
  );
};

PageSizeWrapper.propTypes = {
  size: PropTypes.number,
  sizeOptions: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number, value: PropTypes.string })
  ).isRequired,
  onPageSizeClick: PropTypes.func.isRequired,
  noOfPages: PropTypes.number.isRequired,
  displayType: PropTypes.string,
  PageSizeItemComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func
  ]),
  label: PropTypes.node
};

export default PageSizeWrapper;
