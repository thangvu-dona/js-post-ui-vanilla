import { setBackgroundImage, setFieldValue } from "./common";

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="description"]', formValues?.description);
  setFieldValue(form, '[name="author"]', formValues?.author);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl); // set to hidden field
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  const formValues = {};

  // S1: query each input and add to formValues object
  // ['title', 'description', 'author', 'imageUrl'].forEach(name => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   if(field) formValues[name] = field.value;
  // });

  //S2: Using FormData - Web API
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

export function initPostForm({formId, defaultValues, onSubmit}) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  setFormValues(form, defaultValues);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('submit form!');

    // get form values
    const formValues = getFormValues(form);
    console.log(formValues);
    // validation form values
    // if valid --> trigger submit callback
    // otherwise, show validation errors
  });
}