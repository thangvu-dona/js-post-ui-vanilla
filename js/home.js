import postApi from "./api/postApi";
import {setTextContent} from "./utils";

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
    setTextContent(liElement, '[data-id="description"]', post.description);
    setTextContent(liElement, '[data-id="author"]', post.author);

    // const descriptionElement = liElement.querySelector('[data-id="description"]');
    // if (descriptionElement) descriptionElement.textContent = post.description;

    // const authorElement = liElement.querySelector('[data-id="author"]');
    // if (authorElement) authorElement.textContent = post.author;

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if (thumbnailElement) thumbnailElement.src = post.imageUrl;
    
    
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

(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    }
    const {data, pagination} = await postApi.getAll(queryParams);
    renderPostList(data);
  } catch (error) {
    console.log('Error for each request ' , error);
    // show modal, toast errors
  }
})();