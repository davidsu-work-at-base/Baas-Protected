export function currentPath() {
  const raw = window.location.pathname.replace(/\/+$/, "");
  return raw || "/";
}

export function navigateTo(path) {
  if (currentPath() === path) return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("app:navigate"));
}