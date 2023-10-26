import postApi from "./api/postApi";

// MAIN
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
        title: '',
        description: '',
        author: '',
        imageUrl: '',
      };
  } catch (error) {
    console.log('Failed to fetch post from id', error);
  }
})();