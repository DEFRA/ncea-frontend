'use strict';

const toggleModalContainer = () => {
  const overlayContainer = document.getElementById('overlay');
  const modalContainer = document.getElementById('modal');
  overlayContainer.classList.toggle('active');
  modalContainer.classList.toggle('active');
};

document.addEventListener('DOMContentLoaded', () => {
  function openDataModal(resourceLocator) {
    toggleModalContainer();
    const resourceLocatorElement = document.getElementById('resource_locator');
    const resourceLocatorLink = document.getElementById(
      'resource-locator-link',
    );
    if (resourceLocatorElement) {
      resourceLocatorElement.innerHTML = resourceLocator;
    }
    if (resourceLocatorLink) {
      resourceLocatorLink.href = resourceLocator;
    }
  }

  function closeDataModal() {
    toggleModalContainer();
  }

  window.openDataModal = openDataModal;
  window.closeDataModal = closeDataModal;
});
