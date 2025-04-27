document.addEventListener('DOMContentLoaded', function() {

  // Mobile Menu Toggle
  const menuIcon = document.querySelector('.menu_icon');
  const navbar = document.querySelector('.navbar');
  const header = document.querySelector('.header-area');
  const body = document.body;

  menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuIcon.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    // Toggle menu icon
    const icon = menuIcon.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuIcon.contains(e.target) && 
        !navbar.contains(e.target) && 
        navbar.classList.contains('active')) {
      navbar.classList.remove('active');
      menuIcon.classList.remove('active');
      body.classList.remove('menu-open');
      
      const icon = menuIcon.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    }
  });

  // Close menu when clicking on a link
  navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
      menuIcon.classList.remove('active');
      body.classList.remove('menu-open');
      
      const icon = menuIcon.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    });
  });

  // Theme Switching with Enhanced Dark Mode
  const themeBtns = document.querySelectorAll('.theme-btn');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial theme based on system preference
  if (prefersDarkScheme.matches) {
    document.body.setAttribute('data-theme', 'dark');
    updateActiveThemeButton('dark');
  }

  // Theme button click handlers
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.body.setAttribute('data-theme', theme);
      updateActiveThemeButton(theme);
      
      // Save theme preference
      localStorage.setItem('preferred-theme', theme);
    });
  });

  // Update active theme button
  function updateActiveThemeButton(theme) {
    themeBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      }
    });
  }

  // Load saved theme preference
  const savedTheme = localStorage.getItem('preferred-theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    updateActiveThemeButton(savedTheme);
  }

  // Enhanced Sticky Header with Hide/Show on Scroll
  const headerHeight = header.offsetHeight;
  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove sticky class
    if (currentScroll > headerHeight) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    // Hide/show header on scroll
    if (!navbar.classList.contains('active')) { // Don't hide header when menu is open
      if (currentScroll > lastScroll && currentScroll > headerHeight + scrollThreshold) {
        header.style.transform = `translateY(-${headerHeight}px)`;
      } else {
        header.style.transform = 'translateY(0)';
      }
    }

    lastScroll = currentScroll;
  });

  // Enhanced Active Navigation Link
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar a');

  function updateActiveLink() {
    const currentScroll = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Special case for top of page
    if (currentScroll < 100) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // Enhanced Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const targetPosition = target.offsetTop - headerHeight + 1;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Form Handling with Enhanced Feedback
  const form = document.forms['submitToGoogleSheet'];
  const msg = document.getElementById('msg');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.submit');
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      try {
        // Replace with your form submission logic
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create and show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <h3>Thank You!</h3>
          <p>Your message has been sent successfully.</p>
        `;
        document.body.appendChild(successDiv);
        
        // Reset form
        form.reset();
        
        // Remove success message after animation
        setTimeout(() => {
          successDiv.style.animation = 'fadeOut 0.5s ease forwards';
          setTimeout(() => {
            document.body.removeChild(successDiv);
          }, 500);
        }, 3000);
      } catch (error) {
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-success error';
        errorDiv.innerHTML = `
          <i class="fas fa-exclamation-circle"></i>
          <h3>Oops!</h3>
          <p>Something went wrong. Please try again.</p>
        `;
        document.body.appendChild(errorDiv);
        
        // Remove error message
        setTimeout(() => {
          errorDiv.style.animation = 'fadeOut 0.5s ease forwards';
          setTimeout(() => {
            document.body.removeChild(errorDiv);
          }, 500);
        }, 3000);
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Add CSS animation for fadeOut
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;
  document.head.appendChild(style);

  // Enhanced Hero Section Animations
  const heroSection = document.querySelector('.FirstElement');
  if (heroSection) {
    // Add parallax effect
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.35;
      
      if (window.innerWidth > 768) { // Only apply on desktop
        heroSection.style.backgroundPositionY = `${rate}px`;
      }
    });

    // Add smooth reveal for profile photo
    const profilePhoto = heroSection.querySelector('.profile-photo');
    if (profilePhoto) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInRotate 1s ease forwards';
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(profilePhoto);
    }
  }

  // Add CSS animation for profile photo
  style.textContent += `
    @keyframes fadeInRotate {
      from {
        opacity: 0;
        transform: translateY(30px) rotate(-10deg);
      }
      to {
        opacity: 1;
        transform: translateY(0) rotate(0);
      }
    }
  `;

  // Update footer message
  const footerMessage = document.querySelector('.footer .message');
  if (footerMessage) {
    const text = footerMessage.textContent;
    const words = text.split(' ');
    const highlightWords = ['connect', 'create', 'opportunities'];
    
    const newText = words.map(word => {
      if (highlightWords.includes(word.toLowerCase())) {
        return `<span class="highlight">${word}</span>`;
      }
      return word;
    }).join(' ');
    
    footerMessage.innerHTML = newText;
  }

  // Initialize AOS with Enhanced Settings
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    disable: 'mobile' // Disable animations on mobile for better performance
  });
});

function updateActiveSection() {
  var scrollPosition = $(window).scrollTop();

  // Checking if scroll position is at the top of the page
  if (scrollPosition === 0) {
    $(".header ul li a").removeClass("active");
    $(".header ul li a[href='#home']").addClass("active");
    return;
  }

  // Iterate through each section and update the active class in the header
  $("section").each(function() {
    var target = $(this).attr("id");
    var offset = $(this).offset().top;
    var height = $(this).outerHeight();

    if (
      scrollPosition >= offset - 40 &&
      scrollPosition < offset + height - 40
    ) {
      $(".header ul li a").removeClass("active");
      $(".header ul li a[href='#" + target + "']").addClass("active");
    }
  });
}

 