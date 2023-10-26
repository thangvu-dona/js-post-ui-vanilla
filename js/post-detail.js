import dayjs from "dayjs";
import postApi from "./api/postApi";
import { registerLightbox, setTextContent } from "./utils";

function renderPostDetail(post) {
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailTimeSpan', dayjs(post.updatedAt).format(' - HH:MM DD/MM/YYYY'));

  // render heroImage
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;

    heroImage.addEventListener('error', () => {
      console.log('load image error --> use default placeholder');
      heroImage.style.backgroundImage = 'url(https://via.placeholder.com/1368x400?text=thumbnail)';
    });
  }

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<i class="fas fa-edit"></i>Edit Post';
  }
}

(async () => {
  registerLightbox({
    modalId: 'lightboxModal',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });

  try {
    // get post id from URL
    // fetch post detail API
    // render post detail
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    if (!postId) {
      console.log('Post not found');
      return;
    }

    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log('Fail to fetch post detail', error);
  }
})();