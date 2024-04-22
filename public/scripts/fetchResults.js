const toggleOverlay = (showOverlay) => {
  const overlayContainer = document.getElementById('overlay');
  if (showOverlay && overlayContainer) {
    overlayContainer.classList.toggle('active');
  }
};

const invokeAjaxCall = async (
  path,
  payload,
  showOverlay = false,
  method = 'POST',
) => {
  try {
    const isPostWithPayload = method === 'POST' && Object.keys(payload).length;
    toggleOverlay(showOverlay);
    const response = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(isPostWithPayload && { body: JSON.stringify(payload) }),
    });
    if (response.ok && !response.redirected) {
      toggleOverlay(showOverlay);
      return response;
    } else if (response.ok && response.redirected) {
      window.location.href = response.url;
    } else {
      console.error(`Failed to fetch the results: ${response.status}`);
      return null;
    }
  } catch (error) {
    toggleOverlay(showOverlay);
    console.error(`Error fetching results: ${error.message}`);
    return null;
  }
  return null;
};

export { invokeAjaxCall };
