'use strict';

document.addEventListener('DOMContentLoaded', () => {
  console.log(JSON.stringify(window.coordinate));
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

  window.toggleContent = toggleContent;
});
