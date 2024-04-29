'use strict';

let scrollPositionY = 0;

const toggleModalContainer = (modalClass) => {
  const overlayContainer = document.getElementById('overlay');
  const modalContainer = document.querySelector(`.${modalClass}`);
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
  function openDataModal(organisationName, resourceLocator) {
    toggleModalContainer('resource-modal');
    freezeScroll();
    const resourcePartyElement = document.getElementById('resource_party');
    const resourceLocatorLink = document.getElementById(
      'resource-locator-link',
    );
    if (resourcePartyElement) {
      resourcePartyElement.innerHTML = organisationName;
    }
    if (resourceLocatorLink) {
      resourceLocatorLink.href = resourceLocator;
    }
  }

  function closeDataModal() {
    toggleModalContainer('resource-modal');
    unfreezeScroll();
  }

  function openMapModal() {
    toggleModalContainer('map-modal');
    freezeScroll();
  }

  function closeMapModal() {
    toggleModalContainer('map-modal');
    unfreezeScroll();
  }

  window.openDataModal = openDataModal;
  window.closeDataModal = closeDataModal;
  window.openMapModal = openMapModal;
  window.closeMapModal = closeMapModal;
});
