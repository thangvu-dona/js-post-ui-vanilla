import debounce from "lodash.debounce";
import postApi from "./api/postApi";
import {getUlPaginationElement, setTextContent, truncateText} from "./utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// to use function fromNow()
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;

  try {
    // find and clone template
    const templateElement = document.getElementById('postItemTemplate')
    if (!templateElement) return;
    const liElement = templateElement.content.firstElementChild.cloneNode(true);
    if (!liElement) return;
    
    // update title, description, author, thumbnail, timeSpan
    // const titleElement = liElement.querySelector('[data-id="title"]');
    // if (titleElement) titleElement.textContent = post.title;
    setTextContent(liElement, '[data-id="title"]', post.title);
    setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
    setTextContent(liElement, '[data-id="author"]', post.author);

    // const descriptionElement = liElement.querySelector('[data-id="description"]');
    // if (descriptionElement) descriptionElement.textContent = post.description;

    // const authorElement = liElement.querySelector('[data-id="author"]');
    // if (authorElement) authorElement.textContent = post.author;

    // calculate timespan
    const timeSpan = dayjs(post.updatedAt).fromNow();
    setTextContent(liElement, '[data-id="timeSpan"]', ` - ${timeSpan}`);

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if (thumbnailElement) {
      thumbnailElement.src = post.imageUrl;

      thumbnailElement.addEventListener('error', () => {
        console.log('load image error --> use default placeholder');
        thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
      });
    }
    
    
    // attach events

    return liElement;
  } catch (error) {
    console.log('Failed to create post item' , error);
  }
}

function renderPostList(postList) {
  console.log(postList);
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  // clear current list
  ulElement.textContent = '';

  postList.forEach(post => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

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
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

function handlePrevClick(e) {
  e.preventDefault();
  console.log('prev click');

  const ulPaginationElement = getUlPaginationElement();
  if (!ulPaginationElement) return;

  const page = Number.parseInt(ulPaginationElement.dataset.page) || 1;
  if (page <= 1) return;
  
  handleFilterChange('_page', page - 1);
}

function handleNextClick(e) {
  e.preventDefault();
  console.log('next click');

  const ulPaginationElement = getUlPaginationElement();
  if (!ulPaginationElement) return;

  const page = Number.parseInt(ulPaginationElement.dataset.page) || 1;
  const totalPages = ulPaginationElement.dataset.totalPages;
  if (page >= totalPages) return;
  
  handleFilterChange('_page', page + 1);
}

function initPagination() {
  // bind click event for prev/next links
  const ulPaginationElement = getUlPaginationElement();
  if (!ulPaginationElement) return;

  // prev click event
  const prevElement = ulPaginationElement.firstElementChild?.firstElementChild;
  if (prevElement) prevElement.addEventListener('click', handlePrevClick);

  // next click event
  const nextElement = ulPaginationElement.lastElementChild?.lastElementChild;
  if (nextElement) nextElement.addEventListener('click', handleNextClick);
}

function renderPagination(pagination) {
  const ulPagination = getUlPaginationElement();
  if (!ulPagination || !pagination) return

  // calculate totalPages
  const {_page, _limit, _totalRows} = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  //check if enable/disable prev link
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');
  //check if enable/disable next link
  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

const debounceSearch = debounce((event) => handleFilterChange('title_like', event.target.value), 500);

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // set default search value
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like'); 
  }

  // attach event
  searchInput.addEventListener('input', debounceSearch);
}

(async () => {
  try {
    const url = new URL(window.location);

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    initPagination(queryParams);
    initSearch(queryParams);

    // render post list base on URL params
    const {data, pagination} = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('Error for each request ' , error);
    // show modal, toast errors
  }
})();