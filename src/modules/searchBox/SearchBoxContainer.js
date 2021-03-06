import React from 'react';
import PropTypes from 'prop-types';

import { conditionalRenderer } from '../../common/utils';
import SearchBoxWrapper from './SearchBoxWrapper';
import { trackSearch } from '../analytics';

/**
 * Component to manage the search query.
 */
class SearchBoxContainer extends React.PureComponent {
    constructor(props) {
        super(props);

        this.onSearchBoxChange = this.onSearchBoxChange.bind(this);
        this.onSearchBoxClear = this.onSearchBoxClear.bind(this);
        this.onSearchBoxSubmit = this.onSearchBoxSubmit.bind(this);
        this.setSearchBoxQuery = this.setSearchBoxQuery.bind(this);

        this.state = { query: '' };
    }

    componentDidMount() {
        const {
            helpers: { setSearchBoxConfiguration },
        } = this.props;
        const { defaultSearch = '' } = this.props;
        if (typeof defaultSearch === 'string' && defaultSearch.length) {
            setSearchBoxConfiguration({ query: defaultSearch });
        }
    }

    onSearchBoxChange(event) {
        const query = event.target.value;
        this.setState({ query });
    }

    setSearchBoxQuery(query) {
        this.setState({ query });
    }

    onSearchBoxClear() {
        const { query } = this.state;
        const { onClear } = this.props;

        if (onClear) {
            onClear(query) && this.setState({ query: '' });
        } else {
            this.setState({ query: '' });
        }
    }

    onSearchBoxSubmit(event) {
        event.preventDefault();

        const { query } = this.state;
        const { onSubmit, unbxdCore } = this.props;
        const {
            helpers: { setSearchBoxConfiguration },
        } = this.props;
        const queryString = encodeURIComponent(query);
        if (onSubmit) {
            if (onSubmit(query) && query.length) {
                if (unbxdCore.state.responseObj !== null) {
                    unbxdCore.state.selectedSort = '';
                }
                unbxdCore.state.selectedFacets = {};
                unbxdCore.state.rangeFacet = {};
                unbxdCore.state.categoryFilter = {};
                unbxdCore.state.breadcrumbs = {};
                //unbxdCore.state.didYouMean = null;
                //unbxdCore.state.startPageNo = 0;
                //unbxdCore.state.selectedSort = '';
                //unbxdCore.state.responseObj = null;
                setSearchBoxConfiguration({ query: queryString });
                //track for search hit here
                trackSearch(query);
            }
        } else {
            if (query.length) {
                setSearchBoxConfiguration({ query: queryString });
                //track for search hit here
                trackSearch(query);
            }
        }
    }

    getSearchBoxProps() {
        const {
            unbxdCore,
            unbxdCoreStatus,
            productType,
            autoFocus,
            clearable,
            showLoader,
            InputComponent,
            SubmitComponent,
            ClearComponent,
            placeholder,
        } = this.props;

        const lastSearchedQuery = unbxdCore.getSearchQuery() || '';

        const data = {
            unbxdCoreStatus,
            autoFocus,
            clearable,
            showLoader,
            lastSearchedQuery,
            placeholder,
            productType,
            ...this.state,
        };

        const helpers = {
            onSearchBoxChange: this.onSearchBoxChange,
            onSearchBoxSubmit: this.onSearchBoxSubmit,
            onSearchBoxClear: this.onSearchBoxClear,
            setSearchBoxQuery: this.setSearchBoxQuery,
            InputComponent,
            SubmitComponent,
            ClearComponent,
        };

        return { ...data, ...helpers };
    }

    render() {
        const DefaultRender = SearchBoxWrapper;

        return conditionalRenderer(
            this.props.children,
            this.getSearchBoxProps(),
            DefaultRender
        );
    }
}

SearchBoxContainer.propTypes = {
    unbxdCore: PropTypes.object.isRequired,
    unbxdCoreStatus: PropTypes.string.isRequired,
    helpers: PropTypes.object.isRequired,
    autoFocus: PropTypes.bool,
    clearable: PropTypes.bool,
    onSubmit: PropTypes.func,
    onClear: PropTypes.func,
    showLoader: PropTypes.bool,
    InputComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    SubmitComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    ClearComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    defaultSearch: PropTypes.string,
    placeholder: PropTypes.string,
    productType: PropTypes.string,
};

export default SearchBoxContainer;
