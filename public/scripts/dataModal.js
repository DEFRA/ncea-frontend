'use strict';

let scrollPositionY = 0;

const toggleModalContainer = () => {
  const overlayContainer = document.getElementById('overlay');
  const modalContainer = document.getElementById('modal');
  overlayContainer.classList.toggle('active');
  modalContainer.classList.toggle('active');
};

const freezeScroll = () => {
  scrollPositionY = window.scrollY;

  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
};

const unfreezeScroll = () => {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';

  window.scrollTo(0, scrollPositionY);
};

document.addEventListener('DOMContentLoaded', () => {
  function openDataModal(resourceLocator) {
    toggleModalContainer();
    freezeScroll();
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
    unfreezeScroll();
  }

  window.openDataModal = openDataModal;
  window.closeDataModal = closeDataModal;
});
