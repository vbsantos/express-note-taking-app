/* eslint-env browser */
const verifyInputs = (inputsIds = [], buttonId = '') => {
  const button = document.querySelector(`#${buttonId}`);

  let setDisable = false;
  inputsIds.forEach((inputId) => {
    const input = document.querySelector(`#${inputId}`);
    const isInputEmpty = input.value === '';
    setDisable ||= isInputEmpty;
  });

  button.disabled = setDisable;
};
