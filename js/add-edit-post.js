import postApi from "./api/postApi";
import { initPostForm, toast } from "./utils";

function removeUnusedField(formValues) {
  const payload = {...formValues};
  // imageSource = 'picsum' --> remove image
  // imageSource = 'upload' --> remove imageUrl
  if (payload.imageSource === 'upload') {
    delete payload.imageUrl;
  } else {
    delete payload.image;
  }

  // finally remove imageSource
  delete payload.imageSource;

  return payload;
}

async function handlePostFormSubmit(formValues) {
  const payload = removeUnusedField(formValues);
  console.log('submit from parent', {formValues, payload});
  return;

  try {
    // throw new Error('Error from testing');

    // check add/edit mode
    // S1: based on search params(check id)
    // S2: check id in formValues
    // call API
    const savedPost = formValues.id ? await postApi.update(formValues) : await postApi.add(formValues);

    // show success message
    toast.success('Save post successfully!')

    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error: ${error.message}`);
  }
}

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

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log('Failed to fetch post from id', error);
  }
})();