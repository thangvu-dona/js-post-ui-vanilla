import { setBackgroundImage, setFieldValue } from "./common";

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="description"]', formValues?.description);
  setFieldValue(form, '[name="author"]', formValues?.author);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl); // set to hidden field
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

export function initPostForm({formId, defaultValues, onSubmit}) {
  const formElement = document.getElementById(formId);
  if (!formElement) return;
  
  setFormValues(formElement, defaultValues);
}