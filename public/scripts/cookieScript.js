const cookieAcceptanceLabel = 'ncea-cookie-acceptance-level';
const defaultCookieAcceptanceData = 'false';
const cookiePolicyDisplayLabel = 'ncea-cookie-banner-dismissed';
const defaultCookieDisplayData = 'true';
const expiryDays = 365;
const cookieBanner = document.getElementById('cookie_banner');
const cookieBlock = document.getElementById('cookie_block');
const acceptBlock = document.getElementById('accept_block');
const acceptButton = document.getElementById('accept_button');
const rejectBlock = document.getElementById('reject_block');
const rejectButton = document.getElementById('reject_button');
const hideButtons = document.querySelectorAll('.hide_button');

const setCookie = (name, value, days) => {
  if (value) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  }
};

const getCookie = (name) => {
  const nameEx = `${name}=`;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.indexOf(nameEx) === 0) {
      const cookieValue = trimmedCookie.substring(
        nameEx.length,
        trimmedCookie.length,
      );
      const expiration = trimmedCookie
        .split(';')
        .find((item) => item.trim().startsWith('expires='));
      if (!expiration || new Date(expiration.split('=')[1]) > new Date()) {
        return cookieValue;
      } else {
        document.cookie =
          name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        return null;
      }
    }
  }
  return null;
};

const hideCookieHandler = () => {
  if (cookieBanner) {
    cookieBanner.setAttribute('hidden', '');
  }
  if (cookieBlock) {
    cookieBlock.setAttribute('hidden', '');
  }
  if (acceptBlock) {
    acceptBlock.setAttribute('hidden', '');
  }
  if (rejectBlock) {
    rejectBlock.setAttribute('hidden', '');
  }
};

const showCookieSection = () => {
  setCookie(cookieAcceptanceLabel, defaultCookieAcceptanceData, expiryDays);
  if (cookieBanner) {
    cookieBanner.removeAttribute('hidden');
  }
  if (cookieBlock) {
    cookieBlock.removeAttribute('hidden');
  }
};

const checkCookieAcceptance = () => {
  const isCookieAlreadySaved = getCookie(cookiePolicyDisplayLabel);
  if (isCookieAlreadySaved === 'true') {
    hideCookieHandler();
  } else {
    showCookieSection();
  }
};

const acceptCookieHandler = (formSubmission = true) => {
  setCookie(cookiePolicyDisplayLabel, defaultCookieDisplayData, expiryDays);
  setCookie(cookieAcceptanceLabel, true, expiryDays);
  if (formSubmission) {
    if (cookieBlock) {
      cookieBlock.setAttribute('hidden', '');
    }
    if (acceptBlock) {
      acceptBlock.removeAttribute('hidden');
    }
    if (rejectBlock) {
      rejectBlock.setAttribute('hidden', '');
    }
  }
};

const rejectCookieHandler = (formSubmission = true) => {
  setCookie(cookiePolicyDisplayLabel, defaultCookieDisplayData, expiryDays);
  setCookie(cookieAcceptanceLabel, false, expiryDays);
  if (formSubmission) {
    if (cookieBlock) {
      cookieBlock.setAttribute('hidden', '');
    }
    if (acceptBlock) {
      acceptBlock.setAttribute('hidden', '');
    }
    if (rejectBlock) {
      rejectBlock.removeAttribute('hidden');
    }
  }
};

const attachAcceptCookieListener = () => {
  if (acceptButton) {
    acceptButton.addEventListener('click', acceptCookieHandler);
  }
};

const attachHideCookieListener = () => {
  if (hideButtons.length) {
    hideButtons.forEach((hideButton) => {
      hideButton.addEventListener('click', hideCookieHandler);
    });
  }
};

const attachRejectCookieListener = () => {
  if (rejectButton) {
    rejectButton.addEventListener('click', rejectCookieHandler);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  checkCookieAcceptance();
  attachAcceptCookieListener();
  attachHideCookieListener();
  attachRejectCookieListener();
});
