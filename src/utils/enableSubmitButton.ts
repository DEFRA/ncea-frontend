import { IFormValidatorOptions } from '../interfaces/guidedSearch.interface';

const enableSubmitButton = async (formValidatorOptions: IFormValidatorOptions) => {
  const form = document.getElementById(formValidatorOptions.formId) as HTMLFormElement;
  const submitButton = document.getElementById(formValidatorOptions.submitButtonId) as HTMLButtonElement;
  const fields = Array.from(form.querySelectorAll('input[type="text"]')) as HTMLInputElement[];

  const checkFields = (): void => {
    const hasValue = fields.some((field) => field.value.trim() !== '');
    submitButton.disabled = !hasValue;
  };

  fields.forEach((field) => {
    field.addEventListener('input', checkFields);
  });

  checkFields();
};

export { enableSubmitButton };
