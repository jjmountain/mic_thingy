const decideNavbarColor = () => {
  console.log(window.location.pathname === '/')
  if (window.location.pathname === '/') {
    initUpdateNavbarOnScroll();
  } else {
    console.log(navbar)
    const navbar = document.querySelector('.navbar');
    navbar.classList.remove('navbar-transparent');
    navbar.classList.add('navbar-dark-bg');
  }
}


const initUpdateNavbarOnScroll = () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= (window.innerHeight / 100 * 45 )) {
        navbar.classList.add('navbar-dark-bg');
      } else {
        navbar.classList.remove('navbar-dark-bg');
      }
    });
  }
}

export { initUpdateNavbarOnScroll, decideNavbarColor };