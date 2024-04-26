'use strict';

import { maxWords, showLessText, showMoreText } from './constants';

const toggleContent = (content: string, uniqueKey: string): string => {
  if (content) {
    const words = content.split(/\s+/);
    if (words.length > maxWords) {
      const truncatedContent: string = words.slice(0, maxWords).join(' ');
      const remainingContent: string = words.slice(maxWords).join(' ');

      const fullContent: string = `${truncatedContent}<span id='${uniqueKey}-content' style='display: none;'> ${remainingContent}</span> <a href='javascript:void(0);' class='govuk-link toggle-content__link' onclick="toggleContent(this, '${uniqueKey}', '${showMoreText}', '${showLessText}')">${showMoreText}</a>`;
      return fullContent;
    } else {
      return content;
    }
  }
  return '';
};

export { toggleContent };
