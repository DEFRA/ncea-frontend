'use strict';

document.addEventListener('DOMContentLoaded', () => {
  function toggleContent(
    showMoreLinkElement,
    uniqueKey,
    showMoreText,
    showLessText,
  ) {
    const remainingContentElement = document.getElementById(
      `${uniqueKey}-content`,
    );

    if (remainingContentElement) {
      const currentDisplayState = remainingContentElement.style.display;
      remainingContentElement.style.display =
        currentDisplayState === 'none' ? 'inline' : 'none';
      showMoreLinkElement.innerText =
        currentDisplayState === 'none' ? showLessText : showMoreText;
    }
  }

  function changeTitle(title) {
    document.title = title;
  }

  window.toggleContent = toggleContent;
  window.changeTitle = changeTitle;
  function setThePageTitle() {
    const tabItems = document.querySelectorAll('.govuk-tabs__list-item');
    if (tabItems.length) {
      tabItems.forEach((tab) => {
        if (tab.classList.contains('govuk-tabs__list-item--selected')) {
          const anchorTag = tab.querySelector('.govuk-tabs__tab');
          if (anchorTag) {
            anchorTag.dispatchEvent(new Event('click'));
          }
        }
      });
    }
  }

  setThePageTitle();
});
