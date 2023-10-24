import debounce from "lodash.debounce";

// Pure function - dump function
export function initSearch({elementId, defaultParams, onChange}) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;

  // set default search value
  if (defaultParams && defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like'); 
  }

  const debounceSearch = debounce(
    (event) => onChange?.(event.target.value),
    500
  );
  // attach event
  searchInput.addEventListener('input', debounceSearch);
}