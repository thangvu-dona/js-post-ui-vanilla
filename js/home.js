import postApi from "./api/postApi";
import { initPagination, initSearch, renderPostList, renderPagination, toast } from "./utils";

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    if (filterName) url.searchParams.set(filterName, filterValue);

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

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      console.log('remove post click', event.detail);
      // call API for remove post by id
      const post = event.detail;
      const message = `Are you sure to remove post "${post.title}"?`;
      if (window.confirm(message)) {
        await postApi.remove(post.id);
        // refetch data
        await handleFilterChange(); // no-parameters

        toast.success('Remove post successfully!');
      }
    } catch (error) {
      console.log('Fail to remove post', error);
      toast.error(error.message);
    }
  });
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

    registerPostDeleteEvent();
    // render post list base on URL params
    // const {data, pagination} = await postApi.getAll(queryParams);
    // renderPostList('postList', data);
    // renderPagination('postsPagination', pagination);
    handleFilterChange(); // this statement can replace 3 code lines above
  } catch (error) {
    console.log('Error for each request ' , error);
    // show modal, toast errors
  }
})();