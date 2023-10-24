export function initPagination({elementId, defaultParams, onChange}) {
  // bind click event for prev/next links
  const ulPaginationElement = document.getElementById(elementId);
  if (!ulPaginationElement) return;

  // set current active page
  // TODO: use defaultParams

  // prev click event
  const prevElement = ulPaginationElement.firstElementChild?.firstElementChild;
  if (prevElement) prevElement.addEventListener('click', (e) => {
    e.preventDefault();

    const page = Number.parseInt(ulPaginationElement.dataset.page) || 1;
    if (page >=2 ) onChange?.(page - 1);
  });

  // next click event
  const nextElement = ulPaginationElement.lastElementChild?.lastElementChild;
  if (nextElement) nextElement.addEventListener('click', (e) => {
    e.preventDefault();

    const page = Number.parseInt(ulPaginationElement.dataset.page) || 1;
    const totalPages = ulPaginationElement.dataset.totalPages;
    if (page <  totalPages) onChange?.(page + 1);
  });
}

export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
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