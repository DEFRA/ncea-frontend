const toggleSubmitButton = (form) => {
  const submitButton = form.querySelector("button[data-to-disable]");
  if (submitButton) {
    submitButton.disabled = true;

    const fields = Array.from(
      form.querySelectorAll('input[type="text"], input[type="number"]'),
    );

    const hasValue = fields.some((field) => field?.value.trim() !== "");
    submitButton.disabled = !hasValue;
  }
};

const toggleFormSubmitButton = async () => {
  const forms = document.querySelectorAll("[data-toggle-submit-button]");
  if (forms.length > 0) {
    forms.forEach((form) => {
      if (form instanceof HTMLFormElement) {
        form.querySelectorAll("input").forEach((element) => {
          element.addEventListener("input", () => {
            toggleSubmitButton(form);
          });
        });
      }
    });
  }
};

export { toggleFormSubmitButton, toggleSubmitButton };
