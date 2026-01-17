function handleMenuClick(page) {
  const isLoggedIn = localStorage.getItem("loggedIn");

  if (!isLoggedIn) {
    alert("Please login first to view dishes.");
    window.location.href = "login.html";
  } else {
    window.location.href = `pages/${page}.html`;
  }
}
