/* eslint-env browser */
const verifyInputs = () => {
  const titleInput = document.querySelector('#title');
  const contentInput = document.querySelector('#content');
  const submitButton = document.querySelector('#submitButton');

  const hasEmptyInput = titleInput.value === '' || contentInput.value === '';
  if (hasEmptyInput) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
};
