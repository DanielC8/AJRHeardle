// Fix for mounting the Svelte app to the correct target
document.addEventListener('DOMContentLoaded', function() {
  // Find the app container
  const appContainer = document.getElementById('app');
  if (appContainer && typeof app !== 'undefined') {
    // Clear the body and move the app content to the proper container
    const bodyContent = document.body.innerHTML;
    document.body.innerHTML = '';
    document.body.appendChild(document.getElementById('app'));
    appContainer.innerHTML = bodyContent;
  }
});
