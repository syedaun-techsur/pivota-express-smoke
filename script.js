(function () {
  // Restore persisted theme on load
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('dark') ? 'dark' : 'light'
    );
  });
}());
