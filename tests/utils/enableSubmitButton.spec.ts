/**
 * @jest-environment jsdom
 */

import { enableSubmitButton } from '../../src/utils/enableSubmitButton';

describe('Check the Enable Submit Button utility function', () => {
  let form: HTMLFormElement;
  let submitButton: HTMLButtonElement;
  let field1: HTMLInputElement;
  let field2: HTMLInputElement;

  beforeEach(() => {
    document.body.innerHTML = `
    <form id="myForm">
      <input type="text" id="field1" >
      <input type="text" id="field2" >
      <button id="submitButton">Submit</button>
    </form>`;

    form = document.getElementById('myForm') as HTMLFormElement;
    submitButton = document.getElementById('submitButton') as HTMLButtonElement;
    field1 = document.getElementById('field1') as HTMLInputElement;
    field2 = document.getElementById('field2') as HTMLInputElement;
  });

  test('should disable the Submit button when no input fields have values', async () => {
    enableSubmitButton({ formId: 'myForm', submitButtonId: 'submitButton' });

    expect(submitButton.disabled).toBe(true);
  });

  test('should enable the Submit button when at least one input fields has a value', async () => {
    enableSubmitButton({ formId: 'myForm', submitButtonId: 'submitButton' });

    field1.value = 'test value';
    field1.dispatchEvent(new Event('input'));

    await expect(submitButton.disabled).toBe(false);
  });

  test('should disable the Submit button when text is removed from all fields', async () => {
    enableSubmitButton({ formId: 'myForm', submitButtonId: 'submitButton' });

    field1.value = 'some value';
    field2.value = 'some value';
    field1.dispatchEvent(new Event('input'));
    field2.dispatchEvent(new Event('input'));

    expect(submitButton.disabled).toBe(false);

    field1.value = '';
    field2.value = '';
    field1.dispatchEvent(new Event('input'));
    field2.dispatchEvent(new Event('input'));

    expect(submitButton.disabled).toBe(true);
  });
});
