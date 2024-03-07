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
  function openDataModal(publishedBy, resourceLocator) {
    toggleModalContainer();
    freezeScroll();
    const resourcePartyElement = document.getElementById('resource_party');
    const resourceLocatorLink = document.getElementById(
      'resource-locator-link',
    );
    if (resourcePartyElement) {
      resourcePartyElement.innerHTML = publishedBy;
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
