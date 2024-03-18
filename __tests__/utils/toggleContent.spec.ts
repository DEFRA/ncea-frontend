/**
 * @jest-environment jsdom
 */

'use strict';

import { showLessText, showMoreText } from '../../src/utils/constants';
import { toggleContent } from '../../src/utils/toggleContent';

declare global {
  interface Window {
    toggleContent: (
      element: HTMLElement,
      uniqueKey: string,
      showMoreText: string,
      showLessText: string,
    ) => void;
  }
}

describe('Toggle Content', () => {
  let originalToggleContent: any;

  beforeAll(() => {
    originalToggleContent = window.toggleContent;
  });

  afterEach(() => {
    window.toggleContent = originalToggleContent;
  });

  it('should return empty string if content is empty', () => {
    expect(toggleContent('', 'uniqueKey')).toBe('');
    expect(toggleContent('', 'uniqueKey')).toBe('');
  });

  it('should return original content if content length is less than or equal to maxWords', () => {
    const content = 'This is a test content';
    expect(toggleContent(content, 'uniqueKey')).toBe(content);
  });

  it('should truncate content and add toggle link if content length exceeds maxWords', () => {
    const content =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse auctor enim sit amet diam pharetra, sit amet ultrices elit convallis. Phasellus varius mattis mi, at consequat dolor congue quis. Fusce a odio id nunc viverra sagittis sit amet eget dui. Integer sed aliquet metus. Maecenas a eros vel orci iaculis gravida eget in mi. In non libero eleifend, aliquet ligula a, maximus nisi. Quisque a mauris quis ante faucibus semper vitae in diam. Cras nec ipsum sit amet diam tincidunt malesuada at nec metus.<br>Ut mattis felis sapien, suscipit feugiat quam cursus sit amet. Nam suscipit dapibus pellentesque. Nam sed quam non ipsum ultrices sollicitudin. Aliquam eu porta arcu, id.';
    const truncatedContent =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse auctor enim sit amet diam pharetra, sit amet ultrices elit convallis. Phasellus varius mattis mi, at consequat dolor congue quis. Fusce a odio id nunc viverra sagittis sit amet eget dui. Integer sed aliquet metus. Maecenas a eros vel orci iaculis gravida eget in mi. In non libero eleifend, aliquet ligula a, maximus nisi. Quisque a mauris quis ante faucibus semper vitae in diam. Cras nec ipsum sit amet diam tincidunt malesuada at nec metus.<br>Ut mattis felis sapien, suscipit feugiat quam cursus sit amet. Nam suscipit dapibus pellentesque. Nam sed quam';
    const expected = `${truncatedContent}<span id='uniqueKey-content' style='display: none;'> non ipsum ultrices sollicitudin. Aliquam eu porta arcu, id.</span> <a href='javascript:;' class='govuk-link toggle-content__link' onclick="toggleContent(this, 'uniqueKey', '${showMoreText}', '${showLessText}')">${showMoreText}</a>`;
    expect(toggleContent(content, 'uniqueKey')).toBe(expected);
  });

  it('should correctly toggle content when link is clicked', () => {
    const content =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse auctor enim sit amet diam pharetra, sit amet ultrices elit convallis. Phasellus varius mattis mi, at consequat dolor congue quis. Fusce a odio id nunc viverra sagittis sit amet eget dui. Integer sed aliquet metus. Maecenas a eros vel orci iaculis gravida eget in mi. In non libero eleifend, aliquet ligula a, maximus nisi. Quisque a mauris quis ante faucibus semper vitae in diam. Cras nec ipsum sit amet diam tincidunt malesuada at nec metus.<br>Ut mattis felis sapien, suscipit feugiat quam cursus sit amet. Nam suscipit dapibus pellentesque. Nam sed quam non ipsum ultrices sollicitudin. Aliquam eu porta arcu, id.';
    const truncatedContent =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse auctor enim sit amet diam pharetra, sit amet ultrices elit convallis. Phasellus varius mattis mi, at consequat dolor congue quis. Fusce a odio id nunc viverra sagittis sit amet eget dui. Integer sed aliquet metus. Maecenas a eros vel orci iaculis gravida eget in mi. In non libero eleifend, aliquet ligula a, maximus nisi. Quisque a mauris quis ante faucibus semper vitae in diam. Cras nec ipsum sit amet diam tincidunt malesuada at nec metus.<br>Ut mattis felis sapien, suscipit feugiat quam cursus sit amet. Nam suscipit dapibus pellentesque. Nam sed quam';
    const toggledContent = toggleContent(content, 'uniqueKey');
    document.body.innerHTML = toggledContent;

    window.toggleContent = jest.fn();

    const link = document.querySelector('.toggle-content__link');

    link?.dispatchEvent(new Event('click'));

    expect(window.toggleContent).toHaveBeenCalledWith(
      expect.anything(),
      'uniqueKey',
      showMoreText,
      showLessText,
    );
  });
});
