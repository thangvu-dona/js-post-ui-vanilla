import postApi from "./api/postApi";
import {setTextContent, truncateText} from "./utils";
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
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  postList.forEach(post => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url);

  // fetch API
  // re-render post list
}

function handlePrevClick(e) {
  e.preventDefault();
  console.log('prev click');
}

function handleNextClick(e) {
  e.preventDefault();
  console.log('next click');
}

function initPagination() {
  // bind click event for prev/next links
  const ulPaginationElement = document.getElementById('postsPagination');
  if (!ulPaginationElement) return;

  // prev click event
  const prevElement = ulPaginationElement.firstElementChild?.firstElementChild;
  if (prevElement) prevElement.addEventListener('click', handlePrevClick);

  // next click event
  const nextElement = ulPaginationElement.lastElementChild?.lastElementChild;
  if (nextElement) nextElement.addEventListener('click', handleNextClick);
}

function initUrl() {
  const url = new URL(window.location);

  // update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  history.pushState({}, '', url);
}

(async () => {
  try {
    initPagination();
    initUrl();

    const queryParams = new URLSearchParams(window.location.search);

    // const queryParams = {
    //   _page: 1,
    //   _limit: 6,
    // }
    const {data, pagination} = await postApi.getAll(queryParams);
    renderPostList(data);
  } catch (error) {
    console.log('Error for each request ' , error);
    // show modal, toast errors
  }
})();