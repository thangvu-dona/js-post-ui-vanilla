import postApi from "./api/postApi";
import { initPagination, initSearch, renderPostList, renderPagination } from "./utils";

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    // reset page when param has 'title_like'
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    // fetch API
    const queryParams = new URLSearchParams(window.location.search);
    const {data, pagination} = await postApi.getAll(queryParams);

    // re-render post list
    renderPostList('postList', data);
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

(async () => {
  try {
    const url = new URL(window.location);

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    initPagination({
      elementId: 'postsPagination',
      defaultParams: queryParams,
      onChange: page => handleFilterChange('_page', page)
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: value => handleFilterChange('title_like', value)
    });

    // render post list base on URL params
    const {data, pagination} = await postApi.getAll(queryParams);
    renderPostList('postList', data);
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('Error for each request ' , error);
    // show modal, toast errors
  }
})();