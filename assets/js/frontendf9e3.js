// === FUNCTIONS ===
// const select = (e) => document.querySelector(e);

$(window).scroll(function () {
  var scroll = $(window).scrollTop();
  if (scroll >= 60) {
    $('header').addClass("header-fixed");
  } else {
    $('header').removeClass("header-fixed");
  }
});

$(".open-lightbox").on("click", function (e) {
  e.preventDefault(); // prevent the link default
  lity($(this).attr("href")); // open target href
});



function initBannerSlider() {
  var listArray = ["Welcome to Zhilon","Software development","Cloud & DevOps", "Data Management"];
  new Swiper('.banner-slider', {
    loop: true,
    autoplayDisableOnInteraction: false,
    slidesPerView: 1,
    speed: 1000,
    autoHeight: true,
    autoplay: { delay: 4000 },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'bullets',
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + '<em>' + listArray[index] + '</em>' + '<i></i>' + '<b></b>' + '</span>';
      },
    },
  });
}

function initBlogSlider() {
  new Swiper(".blog-slider", {
    grabCursor: true,
    speed: 1200,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
    navigation: {
      el: ".swiper-pagination2",
      nextEl: ".blog-swiper-button-next",
      prevEl: ".blog-swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1.2, spaceBetween: 30 },
      767: { slidesPerView: 1.5, spaceBetween: 30 },
      900: { slidesPerView: 2.2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 40 },
    },
  });
}

function splitText() {
  const quotes = document.querySelectorAll(".quote");
  function setupSplits() {
    // $(document).ready(function () {
    // 	$(".split-line").wrap('<div class="split-parent"></div>');
    // });
    quotes.forEach(quote => {
      var text = new SplitText(quote, {
        type: "words",
        // linesClass: "split-line"
      });
      ScrollTrigger.update()
      quote.anim = gsap.from(text.words, {
        stagger: 0.03,
        opacity: 0.2,
        scrollTrigger: {
          trigger: quote,
          start: "top 60%",
          end: "bottom 60%",
          toggleActions: "restart pause resume reverse",
          scrub: 1,
        },
        // duration: 0.6,
        // ease: "circ.out",
        // yPercent: 100,
        // stagger: 0.2,
      });
    });
  }
  // Run only if screen width > 1024px
  if (window.innerWidth > 1024) {
    setupSplits();
  }


}

function initLogoRail() {
  $('[data-marquee-target]').each(function () {

    let marquee = $(this);

    let marqueeItemsWidth = marquee.find(".marquee-content").width();
    let marqueeSpeed = marquee.attr('data-marquee-speed') * (marqueeItemsWidth / $(window).width());

    // Duplicate .marquee-content
    if (marquee.attr('data-marquee-duplicate')) {
      var marqueeDuplicateAmount = marquee.attr('data-marquee-duplicate');
      // Custom function to clone / append
      for (var i = 0; i < marqueeDuplicateAmount; i++) {
        var clonedMarqueeContent = marquee.find(".marquee-content").first().clone();
        marquee.find(".marquee-scroll").append(clonedMarqueeContent);
      }
    }

    marqueeSpeed = marqueeSpeed * 1.5;
    // Speed up Marquee on Tablet & Mobile
    if ($(window).width() <= 540) {
      marqueeSpeed = marqueeSpeed * 0.5;
    } else if ($(window).width() <= 1024) {
      marqueeSpeed = marqueeSpeed * 0.75;
    }

    let marqueeDirection;
    if (marquee.attr('data-marquee-direction') == 'right') {
      marqueeDirection = -1;
    } else {
      marqueeDirection = 1;
    }

    let marqueeContent = gsap.to(marquee.find('.marquee-content'), { xPercent: -100, repeat: -1, duration: marqueeSpeed, ease: "linear", paused: true }).totalProgress(0.5);

    gsap.set(marquee.find(".marquee-content"), { xPercent: 50 });

    ScrollTrigger.create({
      trigger: marquee,
      start: "top bottom",
      end: "bottom top",
      onUpdate(self) {
        if (self.direction !== marqueeDirection) {
          marqueeDirection *= -1;
          if (marquee.attr('data-marquee-direction') == 'right') {
            gsap.to([marqueeContent], { timeScale: (marqueeDirection * -1), overwrite: true });
          } else {
            gsap.to([marqueeContent], { timeScale: marqueeDirection, overwrite: true });
          }
        }
        self.direction === -1 ? marquee.attr('data-marquee-status', 'normal') : marquee.attr('data-marquee-status', 'inverted');
      },
      onEnter: () => marqueeContent.play(),
      onEnterBack: () => marqueeContent.play(),
      onLeave: () => marqueeContent.pause(),
      onLeaveBack: () => marqueeContent.pause()
    });

    // Extra speed on scroll
    marquee.each(function () {

      let triggerElement = $(this);
      let targetElement = $(this).find('.marquee-scroll');
      let marqueeScrollSpeed = $(this).attr('data-marquee-scroll-speed');

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          start: "0% 100%",
          end: "100% 0%",
          scrub: 0
        }
      });

      if (triggerElement.attr('data-marquee-direction') == 'left') {
        tl.fromTo(targetElement, {
          x: marqueeScrollSpeed + "vw",
        }, {
          x: marqueeScrollSpeed * -1 + "vw",
          ease: "none"
        });
      }

      if (triggerElement.attr('data-marquee-direction') == 'right') {
        tl.fromTo(targetElement, {
          x: marqueeScrollSpeed * -1 + "vw",
        }, {
          x: marqueeScrollSpeed + "vw",
          ease: "none"
        });
      }
    });
  });
}

function footerMarquee (){
  const $track = $('.marquee-footer-track');
  const $items = $track.children();

  // Clone items enough times to fill 2x width
  const clonesNeeded = 10; // number of times to repeat
  for (let i = 0; i < clonesNeeded; i++) {
      $items.clone(true).appendTo($track);
  }

  let currentX = 0;
  const speed = 1; // pixels per frame

  // Calculate total width of all original items
  const totalWidth = $items.toArray().reduce((sum, el) => sum + $(el).outerWidth(true), 0);

  function animateMarquee() {
      currentX -= speed;

      // Reset when we've scrolled one set of original items
      if (Math.abs(currentX) >= totalWidth) {
          currentX += totalWidth; // seamless transition
      }

      $track.css('transform', `translateX(${currentX}px)`);
      requestAnimationFrame(animateMarquee);
  }

  animateMarquee();
}

function initSec3Click() {
  $(".SDW-delivering-next .sec1 .front ul li").click(function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active"); // remove if already active
    } else {
      $(".SDW-delivering-next .sec1 .front ul li").removeClass("active");
      $(this).addClass("active"); // set only clicked one
    }
  });
}


// === GSAP SCROLL ANIMATIONS ===
function initGsapScroll() {

  const triggerEl = document.querySelector(".section-pin1");
  if (!triggerEl) return; // 👈 Exit if not found

  gsap.matchMedia().add("(min-width: 768px)", () => {
    const items = document.querySelectorAll(".SDS-technology-driven .img-wrap .cr1");
    if (!items.length) return; // safety check
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        scrub: true,
        start: "top 50%",
        end: "bottom bottom",
      }
    });
    items.forEach(item => {
      tl.to(item, { opacity: 1 });
    });
  });
}


$(window).on("scroll", function () {
  if ($(window).width() > 767) { // only trigger above 768px
    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();

    $(".SDS-map, .cloud-sec").each(function () {
      var sectionTop = $(this).offset().top;

      // Trigger when section top hits ~70% of viewport
      var triggerPoint = sectionTop - windowHeight / 1.4;

      if (scrollTop >= triggerPoint) {
        $(this).addClass("active");
      } else {
        $(this).removeClass("active");
      }
    });
  }
});

function initABSlider() {
  var listArray = ["Forbes Select 200", "Best Tech Brands 2025", "Great Place To Work", "Featured at Brands of Tomorrow."];
  new Swiper('.ab-slider1', {
    loop: false,
    autoplayDisableOnInteraction: false,
    slidesPerView: 1,
    speed: 1000,
    autoHeight: true,
    autoplay: { delay: 4000 },
    navigation: {
      el: ".swiper-pagination3",
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: '.swiper-pagination2',
      clickable: true,
      type: 'bullets',
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + '<em>' + listArray[index] + '</em>' + '</span>';
      },
    },
  });
}

function initCopyLink() {
  const copyLink = document.querySelector('.copy-link');
  if (!copyLink) return; // safety check

  copyLink.addEventListener('click', function () {
    const link = window.location.href;
    const tooltip = this.querySelector('.tooltip');
    navigator.clipboard.writeText(link).then(() => {
      tooltip.textContent = 'Link copied!';
      this.classList.add('show-tooltip');
      setTimeout(() => {
        this.classList.remove('show-tooltip');
        tooltip.textContent = 'Copy link';
      }, 1500);
    });
  });
}

function initLeadersSlider() {
  new Swiper(".leaders-slider", {
    // grabCursor: true,
    loop: true,
    direction: "vertical",
    slidesPerView: 1,
    // mousewheel: true, 
    speed: 800,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },

    // effect: "coverflow",
    // coverflowEffect: {
    //   rotate: 50,
    //   stretch: 0,
    //   depth: 200,
    //   modifier: 1,
    //   slideShadows: true,
    // },

    pagination: {
      el: ".leaders-swiper-pagination",
      type: "progressbar",
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 30, direction: "horizontal", effect: "slide", },
      1368: { slidesPerView: 1, direction: "vertical", effect: "coverflow", },
    },
  });
}


// === COUNTER ===
function initCounter() {
  const counters = document.querySelectorAll('.counter-value');
  const section = document.getElementById('counter');

  if (!section) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $('.counter-value').each(function () {
          let $this = $(this);
          let countTo = $this.attr('data-count');

          $({ countNum: 0 }).animate(
            { countNum: countTo },
            {
              duration: 2000,
              easing: 'linear',
              step: function () {
                $this.text(Math.floor(this.countNum));
              },
              complete: function () {
                $this.text(this.countNum);
              }
            }
          );
        });
      }
    });
  }, { threshold: 0.5 });

  observer.observe(section);
}

// === TabSection ===

function initTabSection() {
  const tabLinks = document.querySelectorAll(".tab-sec ul li a");

  if (!tabLinks.length) return;

  // === CLICK EVENT ===
  tabLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      // e.preventDefault();
      tabLinks.forEach(a => a.classList.remove("active-a"));
      link.classList.add("active-a");
    });
  });

  // === SCROLL EVENT ===
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    const triggerPoint = scrollPos + windowHeight / 2; // 👈 middle of viewport

    tabLinks.forEach(link => {
      const sectionId = link.getAttribute("href");
      const section = document.querySelector(sectionId);

      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (triggerPoint >= sectionTop && triggerPoint < sectionBottom) {
          tabLinks.forEach(a => a.classList.remove("active-a"));
          link.classList.add("active-a");
        }
      }
    });
  });
}

function initAwardsSlider() {
  new Swiper(".awards-slider", {
    grabCursor: true,
    spaceBetween: 50,
    speed: 1200,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },

    breakpoints: {
      320: { slidesPerView: 3 },
    },
  });
}


function initBlogSlider2() {
  new Swiper(".blog-slider2", {
    grabCursor: true,
    speed: 1200,
    slidesOffsetAfter: 200,
    // autoplay: {
    //   delay: 4500,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: ".number-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        let num = index + 1;
        let padded = num < 10 ? "0" + num : num; // add 0 before numbers < 10
        return '<span class="' + className + '">' + padded + "</span>";
      },
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        slidesOffsetAfter: 0,
      },
      // 640: {
      //   slidesPerView: 3,
      // },
      768: {
        slidesPerView: 1,
      },
      1024: {
        slidesPerView: 1.6,
      },
    },
  });
}


function initTabSection2() {
  const tabLinks = document.querySelectorAll(".SDS-green-operations .sec1 ul li a");
  const sections = document.querySelectorAll(".SDS-green-operations .row1");

  if (!tabLinks.length || !sections.length) return;

  // === CLICK EVENT ===
  tabLinks.forEach(link => {
    link.addEventListener("click", () => {
      tabLinks.forEach(a => a.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // === SCROLL EVENT ===
  window.addEventListener("scroll", () => {
    const midPoint = window.innerHeight / 2;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();

      // Check if section is crossing the middle of viewport
      if (rect.top <= midPoint && rect.bottom > midPoint) {
        tabLinks.forEach(a => a.classList.remove("active"));
        if (tabLinks[index]) {
          tabLinks[index].classList.add("active");
        }
      }
    });
  });
}


function initdigitalleapSlider() {
  new Swiper(".digital-leap-slider", {
    grabCursor: true,
    speed: 1200,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    navigation: {
      el: ".swiper-pagination4",
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1.1, spaceBetween: 10 },
      675: { slidesPerView: 1.6, spaceBetween: 10 },
      900: { slidesPerView: 2.6, spaceBetween: 0 },
      1024: { slidesPerView: 3.4 },
    },
  });
}


document.querySelectorAll(".SDS-edge path").forEach(path => {
  const length = path.getTotalLength();

  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".SDS-edge",
      start: "top 70%",
      end: "bottom 60%",
      scrub: true
    }
  });
});

document.querySelectorAll(".EVC-visual-communication path").forEach(path => {
  const length = path.getTotalLength();

  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".EVC-visual-communication",
      start: "top 70%",
      end: "bottom 60%",
      scrub: true
    }
  });
});

// === GSAP SCROLL ANIMATIONS ===
function initGsapScrollpeekinto() {
  document.querySelectorAll(".zhilon__webdesign--work--parallax .cont > div").forEach((row, i) => {
  const direction = i % 2 === 0 ? 1 : -1; // alternate direction

  // Duplicate children for seamless loop
  const children = Array.from(row.children);
  children.forEach(child => row.appendChild(child.cloneNode(true)));

  const rowWidth = row.scrollWidth / 2; // width of one set

  // Create timeline for infinite loop
  const tl = gsap.timeline({ repeat: -1, defaults: { ease: "linear" } });

  // animate from 0 to -rowWidth (or rowWidth for reverse)
  tl.to(row, {
    x: direction * -rowWidth,
    duration: rowWidth / 50 // speed proportional to width (adjust 50 for faster/slower)
  });
});


  let mm = gsap.matchMedia();

  mm.add("all", () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-section3",
        scrub: 1,
        pin: false,
        start: "top 30%",
        end: "bottom"
      }
    })
      .to(".SDS-peek-into .card", { x: "-100vw", ease: "power2.out" }, 0)
      .to(".SDS-peek-into .card2", { x: "100vw", ease: "power2.out" }, 0);
  });

  ScrollTrigger.refresh();

}

// === GSAP SCROLL ANIMATIONS ===
function initGsapScroll2() {
  gsap.matchMedia().add("(min-width: 768px)", () => {

    // gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    gsap.to("#circle1", {
      scrollTrigger: {
        trigger: "#mySvg",
        scrub: 4,
        pin: false,
        start: "top 60%",
        end: "bottom 60%"            // pin SVG during animation
      },
      duration: 1,
      ease: "none",
      motionPath: {
        path: "#path1",
        align: "#path1",
        alignOrigin: [0.5, 0.5]
      }
    });

    // Timeline with scrub for smoothness
    gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-section3",
        scrub: 1, // higher = smoother scrub
        pin: false,
        start: "top 60%",
        end: "bottom"
      }
    })
      .to(".SDS-peek-into .card", { x: "-100%", ease: "power2.out" }, 0)
      .to(".SDS-peek-into .card2", { x: "100%", ease: "power2.out" }, 0);


    // Timeline with scrub for smoothness
    gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-section3",
        scrub: 1, // higher = smoother scrub
        pin: false,
        start: "top 60%",
        end: "bottom 100%"
      }
    })
      .to(".SDS-peek-into .sec1 img.img2", { y: "0%", ease: "power2.out" }, 0);

    // Timeline with scrub for smoothness
    gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-section4",
        scrub: true, // higher = smoother scrub
        pin: false,
        start: "top 80%",
        end: "bottom 60%"
      }
    })
      // .to(".SDS-peek-into .card", { x: "-100%", ease: "power2.out" }, 0)
      // .to(".SDS-peek-into .card2", { x: "100%", ease: "power2.out" }, 0)
      .to(".SDS-crafting-brand .wrap .line", { height: "35.365vw", ease: "power2.out" }, 0);

    // Timeline with scrub for smoothness
    gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-section4",
        scrub: true, // higher = smoother scrub
        pin: false,
        start: "top 60%",
        end: "bottom 43%"
      }
    })
      .to(".SDS-crafting-brand .wrap .bg1", { "--start": "0%", ease: "power2.out" }, 0);

    // Timeline with scrub for smoothness
    gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-section4",
        scrub: true, // higher = smoother scrub
        pin: false,
        start: "top 80%",
        end: "bottom 60%"
      }
    })
      .to(".SDS-crafting-brand .wrap .count-wrap", { y: "-10%", ease: "power2.out" }, 0);

    document.querySelectorAll(".num-text").forEach(el => {
      let maxVal = parseInt(el.textContent);          // read number
      let reverse = el.dataset.reverse === "true";    // check if reverse

      let obj = { val: reverse ? maxVal : 0 };        // start value

      gsap.to(obj, {
        val: reverse ? 0 : maxVal,   // target: 0 if reverse, else max
        scrollTrigger: {
          trigger: el,
          start: "top 100%",          // adjust for scroll position
          end: "bottom 50%",
          scrub: true
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val) + " %";
        }
      });
    });


    // Timeline with scrub for smoothness
    gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-section5",
        scrub: true, // higher = smoother scrub
        pin: false,
        start: "top 80%",
        end: "bottom 60%"
      }
    })
      // .to(".SDS-peek-into .card", { x: "-100%", ease: "power2.out" }, 0)
      // .to(".SDS-peek-into .card2", { x: "100%", ease: "power2.out" }, 0)
      .to(".SDS-transform-ideas .img-wrap figure.img1", { marginTop: "-10vw", ease: "power2.out" }, 0)
      .to(".SDS-transform-ideas .img-wrap figure.img2", { marginTop: "-7vw", ease: "power2.out" }, 0);
    ScrollTrigger.refresh();
  });
}




$(function () {
  const storageKey = 'activeTabId';

  function activateTabById(tabId, save = true) {
    if (!tabId) return false;
    const $tab = $("header .sub-menu .tab[data-id='" + tabId + "']");
    const $tabA = $("header .sub-menu .tab-a[data-id='" + tabId + "']");

    if ($tab.length) {
      $("header .sub-menu .tab").removeClass("tab-active");
      $tab.addClass("tab-active");
    }
    if ($tabA.length) {
      $("header .sub-menu .tab-a").removeClass("active-a");
      $tabA.addClass("active-a");
    }

    if (($tab.length || $tabA.length) && save) {
      localStorage.setItem(storageKey, tabId);
    }

    return $tab.length || $tabA.length;
  }

  function getDefaultTabId() {
    return (
      $("header .sub-menu .tab").first().attr("data-id") ||
      $("header .sub-menu .tab-a").first().attr("data-id")
    );
  }

  // On load
  const saved = localStorage.getItem(storageKey);
  if (!activateTabById(saved)) {
    activateTabById(getDefaultTabId());
  }

  // Tab clicks
  $(document).on("click", "header .sub-menu .tab-a", function (e) {
    e.preventDefault();
    activateTabById($(this).attr("data-id"), true);
  });

  $(document).on("click", "header .sub-menu .tab", function () {
    activateTabById($(this).attr("data-id"), true);
  });

  // 👉 Outside click → reset storage + default tab
  $(document).on("click", function (e) {
    if (!$(e.target).closest("header .tab-submenu").length) {
      localStorage.removeItem(storageKey); // clear storage
      activateTabById(getDefaultTabId(), true); // reset & save first tab
    }
  });

});

function initSideNav() {
  const sideNavLinks = document.querySelectorAll(
    ".insight-details-page .side-nav ul li a"
  );
  const sections = [];

  // collect section elements from href targets
  sideNavLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) sections.push(target);

    // click event toggle
    link.addEventListener("click", function (e) {
      e.preventDefault();

      sideNavLinks.forEach((lnk) =>
        lnk.parentElement.classList.remove("active")
      );
      this.parentElement.classList.add("active");

      // smooth scroll
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // scroll event toggle
  window.addEventListener("scroll", function () {
    let scrollPos = window.scrollY || document.documentElement.scrollTop;

    sections.forEach((sec, i) => {
      if (sec.offsetTop - 230 <= scrollPos) {
        sideNavLinks.forEach((lnk) =>
          lnk.parentElement.classList.remove("active")
        );
        sideNavLinks[i].parentElement.classList.add("active");
      }
    });
  });
}

function initQuoteWrapper() {
  const quotes = gsap.utils.toArray(".quotes-wrapper p");
  let current = 0;
  let interval;

  // Set first visible
  gsap.set(quotes[current], { opacity: 1, y: 0 });

  function showNextQuote() {
    const prev = quotes[current];
    current = (current + 1) % quotes.length;
    const next = quotes[current];

    const tl = gsap.timeline();

    tl.to(prev, {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    })
    .fromTo(next,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );
  }

  function startRotation() {
    interval = setInterval(showNextQuote, 8000);
  }

  function stopRotation() {
    clearInterval(interval);
  }

  startRotation();

  const wrapper = document.querySelector(".quotes-wrapper");
  if (wrapper) {
    wrapper.addEventListener("mouseenter", stopRotation);
    wrapper.addEventListener("mouseleave", startRotation);
  }
}

function hoverOverlay() {
  if (window.matchMedia("(min-width: 768px)").matches) {
    $("header ul.menu").hover(
      function () {
        // mouse enter → add class
        $("body").addClass("menu-hover");
      },
      function () {
        // mouse leave → remove class
        $("body").removeClass("menu-hover");
      }
    );
  }
}

function initAccordion() {
  $("ul.accordion li").click(function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active"); // remove if already active
    } else {
      $("ul.accordion  li").removeClass("active");
      $(this).addClass("active"); // set only clicked one
    }
  });

  if ($(window).width() <= 767) {
    $(".ft-head").off("click.ftToggle").on("click.ftToggle", function () {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active"); // remove if already active
      } else {
        $(".ft-head").removeClass("active");
        $(this).addClass("active"); // set only clicked one
      }
    });
  } else {
    // remove events & classes on larger screens
    $(".ft-head").off("click.ftToggle").removeClass("active");
  }
}

/**
* Touch Device Check 
*/

function initCheckTouchDevice() {

  function isTouchScreendevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
  };

  if (isTouchScreendevice()) {
    $('html').addClass('touch');
    $('html').removeClass('no-touch');
  } else {
    $('html').removeClass('touch');
    $('html').addClass('no-touch');
  }
  $(window).resize(function () {
    if (isTouchScreendevice()) {
      $('html').addClass('touch');
      $('html').removeClass('no-touch');
    } else {
      $('html').removeClass('touch');
      $('html').addClass('no-touch');
    }
  });

}

function initJourneyLeadersSlider() {
  new Swiper(".journey-leaders-slider", {
    grabCursor: true,
    loop: true,
    speed: 1200,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
    spaceBetween: 150,
    slidesPerView: 1,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    effect: "coverflow",
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
    breakpoints: {
      767: { slidesPerView: 1 },
      900: { slidesPerView: 2 },
      1024: { slidesPerView: 1 },
    },
  });
}

function homeHoverAccordion() {
  $(function () {
    var bound = false;

    function bindHover() {
      if (bound) return;
      bound = true;
      $(document).on('mouseenter.notiphone', '.SDW-delivering-next .sec1', function () {
        $(this).find('.front ul>li:first-child').addClass('active');
      });
      $(document).on('mouseleave.notiphone', '.SDW-delivering-next .sec1', function () {
        $(this).find('.front ul>li:first-child').removeClass('active');
      });
    }

    function unbindHover() {
      if (!bound) return;
      bound = false;
      $(document).off('.notiphone'); // remove our namespaced handlers
    }

    // initial
    if ($('html').hasClass('no-touch')) bindHover();

    // watch for class changes on <body>
    var obs = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === 'class') {
          if ($('html').hasClass('no-touch')) bindHover();
          else unbindHover();
        }
      });
    });
    obs.observe(document.body, { attributes: true });
  });
}

function AccordionBox() {
  // ATTIRE ACCORDION
  var $boxes = $('.accordion-box .box');
  var getslide = $boxes.length;

  // Avoid division by zero
  var slidecal = getslide > 0 ? (30 / getslide) + '%' : '30%';

  // Set width for all boxes
  $boxes.css({ "width": slidecal });

  // Set default opacity
  $boxes.find('figure').css('opacity', '0.5');

  // Make the first box active initially
  $boxes.first().addClass('active').find('figure').css('opacity', '1');

  // Click handler
  $boxes.click(function () {
    $boxes.removeClass('active').find('figure').css('opacity', '0.5'); // reset all
    $(this).addClass('active').find('figure').css('opacity', '1'); // set clicked active
  });

  $(".open-click-modal").click(function () {
    $(".policy-modal").addClass("show-modal");
  });

  $(".policy-modal a.close-bnt").click(function () {
    $(".policy-modal").removeClass("show-modal");
  });
}


function VideoPlayOverlay() {
  const wrapper = document.getElementById("videoWrapper");
  const video = document.getElementById("video-thought");
  const overlay = document.getElementById("overlay");

    if (!wrapper || !video) return;

    let soundPlayed = false; // Track first click unmute

    wrapper.addEventListener("click", function () {
        if (!soundPlayed) {
            video.muted = false;  // unmute only on first click
            soundPlayed = true;
        }

        if (video.paused) {
            video.play().catch(err => console.log("Play failed:", err));
            overlay.style.display = "none"; // hide overlay when playing
        } else {
            video.pause();
            overlay.style.display = "flex"; // show overlay when paused
        }
    });

    video.addEventListener("ended", function () {
        overlay.style.display = "flex"; // show overlay again when video ends
    });

}

function initHamMenu() {
  $(".hamburger").on("click", function () {
    if ($(this).hasClass("is-active")) {
      // If already active → remove
      $(this).removeClass("is-active");
      $("body").removeClass("is-active");
      scroll.start();
    } else {
      // If not active → add
      $(this).addClass("is-active");
      $("body").addClass("is-active");
      scroll.stop();
    }
  });

  // Header menu link click
  $(".mobile-acc").on("click", function (e) {
    e.preventDefault(); // prevent jump if needed

    if ($(this).hasClass("mob-active")) {
      // If clicked link is already active → remove it
      $(this).removeClass("mob-active");
    } else {
      // Remove active from all and add to clicked
      $(".mobile-acc").removeClass("mob-active");
      $(this).addClass("mob-active");
    }
  });
}

function headerAccordion() {
  function initMobileAccordion() {
  if ($(window).width() < 767) {
    if (!$(".sub-service").data("mobile-bound")) {
      $(".sub-service").data("mobile-bound", true).on("click", function () {
        $(".sub-service").not(this).removeClass("acc-show").next().slideUp();
        $(this).toggleClass("acc-show");
        $(this).next().slideToggle();
      });
    }
  } else {
    // Remove click event on larger screens
    $(".sub-service").off("click").removeData("mobile-bound");
    $(".sub-service").removeClass("acc-show").next().removeAttr("style");
  }
}

$(document).ready(initMobileAccordion);
$(window).on("resize", initMobileAccordion);
}


function MovingCircleAnimation() {
  const movingCircle = document.getElementById("movingCircle");
  if (!movingCircle) return; // stop if SVG not on page

  movingCircle.setAttribute("opacity", "1"); // fade-in start

  const centerX = 200;
  const centerY = 210;
  const radius = 200;
  let angle = 0;

  const duration = 20; // seconds for full rotation
  const fps = 60; // assumed frames per second
  const deltaAngle = (2 * Math.PI) / (duration * fps);

  const points = [
    { dot: document.getElementById("dot-innovation"), text: document.getElementById("text-innovation") },
    { dot: document.getElementById("dot-speed"), text: document.getElementById("text-speed") },
    { dot: document.getElementById("dot-reliability"), text: document.getElementById("text-reliability") }
  ];

  function animate() {
    angle += deltaAngle;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    movingCircle.setAttribute("cx", x);
    movingCircle.setAttribute("cy", y);

    // Check proximity to fixed dots
    points.forEach(({ dot, text }) => {
      if (!dot || !text) return;
      const dx = x - dot.cx.baseVal.value;
      const dy = y - dot.cy.baseVal.value;
      const dist = Math.sqrt(dx * dx + dy * dy);

      text.setAttribute("fill", dist < 40 ? "#0035f5" : "black");
    });

    requestAnimationFrame(animate);
  }

  animate();
}

$(document).ready(function () {
  $('.tab-a').click(function () {
    $(".tab").removeClass('tab-active');
    $(".tab[data-id='" + $(this).attr('data-id') + "']").addClass("tab-active");
    $(".tab-a").removeClass('active-a');
    $(this).parent().find(".tab-a").addClass('active-a');
  });


  // $(".solutions-menu").each(function (index) {
  //   let $solutionsMenu = $(this);
  //   let storageKey = "activeSolutionsMenu_" + index;

  //   // On click
  //   $solutionsMenu.find(".menu-items li > a").on("click", function () {
  //     $solutionsMenu.find(".menu-items li").removeClass("active-page"); // remove inside this submenu only
  //     $(this).parent().addClass("active-page");

  //     // Save href in localStorage
  //     localStorage.setItem(storageKey, $(this).attr("href"));
  //   });

  //   // On page load: restore
  //   let activeHref = localStorage.getItem(storageKey);
  //   if (activeHref) {
  //     $solutionsMenu.find(".menu-items li > a").each(function () {
  //       if ($(this).attr("href") === activeHref) {
  //         $(this).parent().addClass("active-page");
  //       }
  //     });
  //   }
  // });
});

function statsCounter() {
  function animateCount(el, target) {
    let count = 0;
    const increment = Math.ceil(target / 100); // smooth animation
    const interval = setInterval(() => {
      count += increment;
      if (count >= target) {
        el.textContent = target + '+';
        clearInterval(interval);
      } else {
        el.textContent = count + '+';
      }
    }, 20);
  }

  const numbers = document.querySelectorAll('.number');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCount(el, target);
        observer.unobserve(el); // animate only once
      }
    });
  }, { threshold: 0.5 }); // trigger when 50% visible

  numbers.forEach(num => observer.observe(num));
}


function initContactForm() {

  let allFormField = document.querySelectorAll('.form-field');
  setTimeout(function () {
    for (let i = 0; i < allFormField.length; i++) {
      if (allFormField[i].value) {
        allFormField[i].parentNode.classList.add('has-value');
      }
    }
  }, 100);
  for (let i = 0; i < allFormField.length; i++) {

    allFormField[i].addEventListener('focus', function () {
      this.parentNode.classList.add('has-value');
    });
    allFormField[i].addEventListener('blur', function () {
      if (!this.value) {
        this.parentNode.classList.remove('has-value');
      }
    });
  }

}



function extraCode() {
  function formatCountry(country) {
    if (!country.id) return country.text; // default option
    const flagCode = country.element.dataset.flag;
    return $(` 
      <span style="display:flex;align-items:center;gap:8px;">
        <span class="fi fi-${flagCode}"></span>
        ${country.text}
      </span>
    `);
  }
  // Init Select2 with custom templates
  $('#country').select2({
    templateResult: formatCountry,
    templateSelection: formatCountry,
    minimumResultsForSearch: Infinity // hide search if not needed
  });

  $(document).on('select2:open', () => {
    document.querySelectorAll('.select2-results__options')
      .forEach(el => el.setAttribute('data-lenis-prevent', ''));
  });
}

function initallianceSlider() {
  new Swiper(".alliance-logo", {
    grabCursor: true,
    loop: true,
    speed: 1200,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    // spaceBetween: 100,
    slidesPerView: 1, // base value for <400px
    breakpoints: {
      320: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      // 640: {
      //   slidesPerView: 3,
      // },
      768: {
        slidesPerView: 4,
      },
      1024: {
        slidesPerView: 5,
      },
    },
  });
}

function initSVGAnimation() {
  // recruitment process-1 anim
  let p1svgTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".p1-svg-content--grid",
      start: "top 40%",
      // markers: true,
      // scrub: true,
      // pin: true
    }
  });

  gsap.set('#p1--candidates > *', {
    autoAlpha: 0,
  })

  gsap.set('#p1--shining-star', {
    scale: 0,
    transformOrigin: "center",
  });

  gsap.set('#p1--hand', {
    transformOrigin: "10% 41%",
    rotation: 15,
  });


  p1svgTL.to('#p1--01 path', {
    fill: "rgba(7, 52, 245, 1)",
    duration: "0.5",
    ease: "power1.inOut",
  })

  p1svgTL.to('#p1--candidates > *', {
    autoAlpha: 1,
    stagger: 0.2,
  }, "0")

  p1svgTL.set('#p1--magnifyglass', {
    css: {
      "-webkit-animation": "transformR 1s forwards",
      animation: "transformR 1s forwards"
    },
  });



  p1svgTL.to('#p1--hand', {
    rotation: 0,
    duration: 1,
  });

  p1svgTL.to('#p1--shining-star', {
    scale: 6.5,
  });

  p1svgTL.fromTo('#p1--shining-star', {
    rotation: 0,
  }, {
    rotation: 60,
    duration: 1,
    delay: 0.2
  });


  p1svgTL.to('#p1--shining-star', {
    autoAlpha: 0,
    scale: 0,
  });


  p1svgTL.to('#p1--selected-candidate', {
    scale: 1.5,
    transformOrigin: "center",
  }, "-=0.45");


  p1svgTL.to('#p1--candidates > *:not(#p1--selected-candidate)', {
    autoAlpha: 0,
    stagger: -0.1,
  }, "-=0.01");

  p1svgTL.to('#p1--selected-candidate', {
    transformOrigin: "32% 32%",
    scale: 4,
  });

  p1svgTL.to("#p1--plaine", {
    duration: 5,
    ease: "power1.inOut",
    motionPath: {
      path: "#p1--dotted-svg",
      align: "#p1--dotted-svg",
      alignOrigin: [0.5, 0.25],
      autoRotate: -90,
    },
  })


  //  ---------------------------------------------


  // recruitment process-2 anim
  let p2svgTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".p2-svg-content--grid",
      start: "top 50%",
      //markers: true,
      // scrub: true,
      // pin: true
    }
  });


  let p2svgnestedTL = gsap.timeline({
    paused: true,
  });

  p2svgnestedTL.to('#p2--02 path', {
    fill: "rgba(7, 52, 245, 1)",
    duration: "0.5",
    ease: "power1.inOut",
  })

  p2svgnestedTL.to('#p2--recruiter-talk3, #p2--recruiter-talk2, #p2--recruiter-talk1', {
    autoAlpha: 1,
    stagger: 0.1,
  }, "0")

  p2svgnestedTL.fromTo('#p2--recruiter-talk3, #p2--recruiter-talk2, #p2--recruiter-talk1', {
    autoAlpha: 1,
  }, {
    autoAlpha: 0.4,
    stagger: 0.1,
    duration: 0.1,
    repeat: -1,
    yoyo: true,
  });

  p2svgnestedTL.to('#p2--candidate-conversation', {
    scale: 1,
    rotation: "0",
  });


  p2svgnestedTL.to('#p2--candidate-talk3, #p2--candidate-talk2, #p2--candidate-talk1', {
    autoAlpha: 1,
    stagger: 0.1,
  });

  p2svgnestedTL.fromTo('#p2--candidate-talk3, #p2--candidate-talk2, #p2--candidate-talk1', {
    autoAlpha: 1,
  }, {
    autoAlpha: 0.4,
    stagger: 0.1,
    duration: 0.1,
    repeat: -1,
    yoyo: true,
  });

  gsap.set('#p2--candidate-hand', {
    transformOrigin: "top right",
  });

  gsap.set('#p2--recruiter-talk3, #p2--recruiter-talk2, #p2--recruiter-talk1', {
    autoAlpha: 0,
  });


  gsap.set('#p2--candidate-talk3, #p2--candidate-talk2, #p2--candidate-talk1', {
    autoAlpha: 0,
  });


  gsap.set('#p2--recruiter-conversation', {
    transformOrigin: "bottom left",
    scale: 0,
    rotation: "-10"
  });

  gsap.set('#p2--candidate-conversation', {
    transformOrigin: "bottom left",
    scale: 0,
    rotation: "-10",
  });


  gsap.set('#p2--recruiter-hand', {
    transformOrigin: "10% 41%",
  });

  gsap.fromTo('#p2--recruiter-hand', {
    rotation: "-1",
  }, {
    rotation: "1",
    repeat: -1,
    yoyo: true,
  });

  gsap.fromTo('#p2--candidate-hand', {
    rotation: "-1",
  }, {
    rotation: "1",
    repeat: -1,
    yoyo: true,
  });


  p2svgTL.to('#p2--recruiter-conversation', {
    scale: 1,
    rotation: "0",
  });


  p2svgTL.add(p2svgnestedTL.play())


  //  ---------------------------------------------


  // recruitment process-3 anim
  let p3svgTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".p3-svg-content--grid",
      start: "top 50%",
      //markers: true,
      // scrub: true,
      // pin: true
    }
  });


  gsap.set(' #p3--recruiter-speech > *, #p3--candidate-speech > *', {
    autoAlpha: 0,
  });


  gsap.set('#p3--candidate-right-hand', {
    transformOrigin: "top right",
  });

  gsap.set('#p3--candidate-left-hand', {
    transformOrigin: "top right",
  });



  gsap.set('#p3--recruiter-left-hand', {
    transformOrigin: "10% 41%",
    rotation: "1",
  });


  gsap.fromTo('#p3--recruiter-left-hand', {
    rotation: "1",
  }, {
    rotation: "-1",
    repeat: -1,
    yoyo: true,
  });

  gsap.fromTo('#p3--candidate-left-hand', {
    rotation: "-1",
  }, {
    rotation: "1",
    repeat: -1,
    yoyo: true,
  });



  gsap.set('#p3--candidate-conversation', {
    transformOrigin: "bottom left",
    scale: 0,
    rotation: "-10",
  });

  gsap.set('#p3--recruiter-conversation', {
    transformOrigin: "bottom right",
    scale: 0,
    rotation: "-10",
  });


  gsap.fromTo('#p3--recruiter-right-hand', {
    rotation: "-1",
  }, {
    rotation: "1",
    repeat: -1,
    yoyo: true,
  });

  gsap.fromTo('#p3--candidate-right-hand', {
    rotation: "1",
  }, {
    rotation: "-1",
    repeat: -1,
    yoyo: true,
  }, "0");




  p3svgTL.to('#p3--03 path', {
    fill: "rgba(7, 52, 245, 1)",
    duration: "0.5",
    ease: "power1.inOut",
  })

  p3svgTL.to('#p3--recruiter-conversation', {
    scale: 1.2,
    rotation: "0",
  });


  p3svgTL.to('#p3--recruiter-speech > *', {
    autoAlpha: 1,
    duration: 0.05,
    stagger: -0.05
  });

  p3svgTL.to('#p3--candidate-conversation', {
    scale: 1.2,
    rotation: "0",
  });

  p3svgTL.to('#p3--candidate-speech > *', {
    autoAlpha: 1,
    duration: 0.05,
    stagger: -0.05
  });

}

document.querySelectorAll(".marquee-wrap").forEach((wrap, i) => { 
  const track = wrap.querySelector(".track"); 
  const items = Array.from(track.children); 
  
  track.append(...items.map(el => el.cloneNode(true))); 
  const originalHeight = items.reduce((sum, el) => sum + el.offsetHeight, 0); 
  const speed = 40; 
  const duration = originalHeight / speed; 
  
  const direction = i % 2 === 0 ? -1 : 1; 
  const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } }); 
  
  tl.to(track, { 
    y: direction * originalHeight, 
    duration: duration, 
    modifiers: { 
      y: gsap.utils.unitize(y => parseFloat(y)) 
    } 
  }); 
  
  wrap.addEventListener("mouseenter", () => tl.pause()); 
  wrap.addEventListener("mouseleave", () => tl.play()); 
  wrap.addEventListener("touchstart", () => tl.pause(), { passive: true }); 
  wrap.addEventListener("touchend", () => tl.play(), { passive: true }); 
});

document.querySelectorAll("[data-target]").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(btn.getAttribute("data-target"));
    if (target) {
      target.classList.add("show-modal");

      // add class to <html>
      document.documentElement.classList.add("body-hide");
    }
  });
});

document.querySelectorAll("[data-dismiss]").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const dismissClass = btn.getAttribute("data-dismiss");
    const modal = btn.closest(".main-modal-popup");
    if (modal && dismissClass) {
      modal.classList.remove(dismissClass);

      // remove class from <html>
      document.documentElement.classList.remove("body-hide");
    }
  });
});

// $(".SDS-what-we-do ul li").click(function (e) {
//   e.preventDefault();
//   $("#contact-popup").addClass("show-modal");
//   $("html").addClass("body-hide");
// });


let scrollPos = 0;
let modalOpen = false;

$('.SDS-what-we-do ul li, .talkcta').click(function (e) {
  let form = $('#contactUsForm1');
  form[0].reset();
  $(form).find('.form-wrap').not(function () {
    return $(this).find('#looking_for_1').length > 0;
  }).removeClass('has-value');
  form.validate().resetForm();

  if (!modalOpen) {
    // Store scroll position
    scrollPos = $(window).scrollTop();

    // Disable scroll
    scroll.stop();

    modalOpen = true;
  }

  $('#contact-popup').addClass('show-modal');
});

// Close modal
$('#contact-popup .close-btn').click(function () {
  $('#contact-popup').removeClass('show-modal');

  // Enable scroll without jump
  scroll.start();

  // Restore scroll position instantly
  $(window).scrollTop(scrollPos);

  modalOpen = false;
});

document.addEventListener('keydown', function (event) {
  // Check if ESC key is pressed
  if (event.key === 'Escape' || event.key === 'Esc') {
    const modal = document.querySelector('.main-modal-popup');
    if (modal) {
      modal.classList.remove('show-modal'); // or your custom hide logic
      $('body').css({
        position: '',
        top: '',
        left: '',
        right: '',
        width: '',
      });
      $(window).scrollTop(scrollPos); // restore scroll

      modalOpen = false;
    }
  }
});



if (navigator.platform === 'iPhone') {
  // iPhone zooms in if input font-size < 16px
  // maximum-scale=1 prevents this,
  // but that also prevents zooming completely on Android,
  // so we only add it for iOS
  var metaViewport = document.querySelector('meta[name=viewport]');
  metaViewport.content += ', maximum-scale=1';
}



$(document).on(
  'change',
  '.file-border',
  function () {
    var filename = this.value.split('\\').pop();
    $(this).siblings('#upload-btn').html(filename);
  });



// === GSAP SCROLL ANIMATIONS ===
function initGsapScrollunique() {
  gsap.matchMedia().add("(min-width: 768px)", () => {

    // Timeline with scrub for smoothness
    gsap.timeline({
      scrollTrigger: {
        trigger: ".SDS-unique",
        scrub: 1, // higher = smoother scrub
        pin: false,
        start: "top 50%",
        end: "bottom 30%"
      }
    })
      .to(".SDS-unique .col2 svg", { rotation: 90, ease: "power2.out" }, 0)
    ScrollTrigger.refresh();
  });
}

function initGsapScrollsummit() {

  gsap.timeline({
    scrollTrigger: {
      trigger: ".SDS-web-summit",
      scrub: true,
      pin: false,
      start: "top 40%",
      end: "bottom"
    }
  })
    .to(".SDS-web-summit .img-sec1", { y: "-50%" }, 0)
    .to(".SDS-web-summit .img-sec2", { y: "50%" }, 0);

  ScrollTrigger.refresh();
}


function initopenPositionsSlider() {
  new Swiper(".open-positions-slider", {
    grabCursor: true,
    speed: 1200,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    navigation: {
      el: ".open-positions-pagination2",
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1, },
      767: { slidesPerView: 1, },
      900: { slidesPerView: 1, },
      1024: { slidesPerView: 1, },
    },
  });
}


function initExtraAnimations() {

  // When the country dropdown opens
  $(document).on('click', '.iti__selected-flag', function () {
    // Wait a tick because iti injects dropdown after click
    setTimeout(function () {
      document.querySelectorAll('.iti__country-list').forEach(el => {
        el.setAttribute('data-lenis-prevent', ''); // 🚫 Tell Lenis to ignore this element
      });
    }, 0);
  });

  // When a country is selected → dropdown closes
  $(document).on('click', '.iti__country-list li', function () {
    document.querySelectorAll('.iti__country-list').forEach(el => {
      el.removeAttribute('data-lenis-prevent');
    });
  });


  $("header ul.talk-btn-sec li.glob-btn").click(function (e) {
    e.stopPropagation(); // prevent the click from bubbling up to document
    $("ul.sub-itmes").toggleClass("show-items");
  });

  $(document).click(function (e) {
    // if the click is NOT inside talk-btn-sec OR sub-itmes
    if (!$(e.target).closest("header ul.talk-btn-sec, ul.sub-itmes").length) {
      $("ul.sub-itmes").removeClass("show-items");
    }
  });

  // Circle + connector animation
  const saptl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sap-banner",
      start: "top 80%",
      end: "bottom 60%",
      scrub: true
    }
  });

  saptl.from(".sap-circle", {
    scale: 0,
    opacity: 0,
    duration: 1,
    ease: "back.out(1.7)"
  });

  saptl.to(".ring-connector", {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.5");

  // Lines animation
  gsap.utils.toArray(".lines").forEach((r, t) => {
    gsap.from(r, {
      width: 0,
      opacity: 0,
      duration: 0.8,
      delay: 0.2 * t,
      ease: "power2.out",
      scrollTrigger: {
        trigger: r,
        start: "top bottom",
        toggleActions: "restart none none none"
      }
    });
  });

  gsap.utils.toArray(".line2").forEach((l, t) => {
    gsap.from(l, {
      width: 0,
      opacity: 0,
      duration: 0.8,
      delay: 0.7 * t,
      ease: "power2.out",
      scrollTrigger: {
        trigger: l,
        start: "80% bottom",
        toggleActions: "restart none none none"
      }
    });
  });


  // Banner image animation
  const bannerSap = gsap.timeline({
    scrollTrigger: {
      trigger: ".sap-banner",
      start: "top 50%",
      scrub: true
    }
  });

  bannerSap.from(".banner-sap img", {
    x: -150,
    opacity: 0,
    ease: "power2.out"
  });

  bannerSap.to(".banner-sap img", {
    opacity: 1,
    x: 0,
    duration: 0.1,
    ease: "power2.out"
  });
  gsap.utils.toArray(".logo-box").forEach(((r, t) => {
    gsap.from(r, {
      x: 100,
      opacity: 0,
      duration: 1,
      delay: .1 * t,
      ease: "power2.out",
      scrollTrigger: {
        trigger: r,
        start: "top 95%",
        toggleActions: "restart none none none"
      }
    })
  }));


  // ===== Tooltip Counter Animation =====
  const tooltipSpan = document.querySelector(".saptooltip span");

  if (tooltipSpan) {
    const finalValue = parseFloat(tooltipSpan.textContent.replace(/[^\d.-]/g, ""));

    // Counter animation (scrubbed with scroll)
    ScrollTrigger.create({
      trigger: ".chart-wrapper",
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
      onUpdate: (self) => {
        const value = finalValue * self.progress;
        tooltipSpan.textContent = `+${value.toFixed(1)}`;
      }
    });

    // Floating tooltip up animation
    gsap.to(".saptooltip", {
      y: -200,
      ease: "none",
      scrollTrigger: {
        trigger: ".chart-wrapper",
        start: "top 100%",
        end: "bottom top",
        scrub: true
      }
    });
  }
  gsap.to(".cls-2-dot", {
    scrollTrigger: {
      trigger: ".chart-cls-1",
      start: "top 100%",
      end: "+=2500",
      scrub: 1
    },
    motionPath: {
      path: "#path",
      align: "#path",
      alignOrigin: [.5, .5],
      autoRotate: !1
    },
    ease: "none"
  });
}

// 1️⃣ Stop all videos on page load
// $(document).ready(function () {
//   $('video').each(function () {
//     this.pause();
//     this.currentTime = 0;
//   });
// });

// 2️⃣ When a[data-lity] is clicked — play only that target video
$('a[data-lity]').on('click', function (e) {
  e.preventDefault();

  // Stop any other playing videos
  $('video').each(function () {
    this.pause();
    this.currentTime = 0;
  });

  const target = $(this).attr('href');
  const video = document.querySelector(`${target} video`);

  if (video) {
    // Reload to ensure autoplay starts fresh
    video.load();
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {
      video.muted = true;
      video.play();
      console.warn('Autoplay blocked — playing muted instead.');
    });
  }

  // Open Lity popup manually
  $.lity(target);
});

// 3️⃣ Stop video on Lity close
$(document).on('lity:close', function (event, instance) {
  const video = $(instance.element()).find('video').get(0);
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
});

// 4️⃣ Optional: Stop all videos when user navigates away or reloads
$(window).on('beforeunload pagehide', function () {
  $('video').each(function () {
    this.pause();
    this.currentTime = 0;
  });
});

function initStickySeamless() {
  const mm = gsap.matchMedia();

  // For screens >= 992px (desktop)
  mm.add("(min-width: 992px)", () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".sticky-seamless-bethos",
        scrub: true,
        pin: true, // pin on larger screens
        start: "top top",
        end: "+=4000"
      }
    })
      .to(".sticky-seamless-bethos .scroll-image", { x: "-74%" }, 0);
  });

  // For screens < 992px (mobile/tablet)
  mm.add("(max-width: 991px)", () => {
    // clear any inline transform if coming from a resize
    gsap.set(".sticky-seamless-bethos .scroll-image", { clearProps: "all" });

    const tl = gsap.timeline({
      repeat: -1,      // infinite loop
      defaults: { ease: "none" } // no easing for seamless motion
    });

    // animate left to -74%, then reset instantly
    tl.to(".sticky-seamless-bethos .scroll-image", {
      x: "-74%",
      duration: 20, // adjust speed (lower = faster)
    })
      .set(".sticky-seamless-bethos .scroll-image", { x: "0%" });
  });

}


function initStickySeamlessDCS() {
  // gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // For screens >= 992px (desktop)
  mm.add("(min-width: 992px)", () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".sticky-seamless-dcs",
        scrub: true,
        pin: true, // pin on larger screens
        start: "top top",
        end: "+=3500"
      }
    })
      .to(".sticky-seamless-dcs .scroll-image", { x: "-50%" }, 0);
  });

  // For screens < 992px (mobile/tablet)
  mm.add("(max-width: 991px)", () => {
    // clear any inline transform if coming from a resize
    gsap.set(".sticky-seamless-dcs .scroll-image", { clearProps: "all" });

    const tl = gsap.timeline({
      repeat: -1,      // infinite loop
      defaults: { ease: "none" } // no easing for seamless motion
    });

    // animate left to -33.5%, then reset instantly
    tl.to(".sticky-seamless-dcs .scroll-image", {
      x: "-50%",
      duration: 20, // adjust speed (lower = faster)
    })
      .set(".sticky-seamless-dcs .scroll-image", { x: "0%" });
  });
  
}

function initStickySeamlessCSD() {
  // gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // For screens >= 992px (desktop)
  mm.add("(min-width: 992px)", () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".sticky-seamless-csd",
        scrub: true,
        pin: true, // pin on larger screens
        start: "top top",
        end: "+=3500"
      }
    })
      .to(".sticky-seamless-csd .scroll-image", { x: "-70%" }, 0);
  });

  // For screens < 992px (mobile/tablet)
  mm.add("(max-width: 991px)", () => {
    // clear any inline transform if coming from a resize
    gsap.set(".sticky-seamless-csd .scroll-image", { clearProps: "all" });

    const tl = gsap.timeline({
      repeat: -1,      // infinite loop
      defaults: { ease: "none" } // no easing for seamless motion
    });

    // animate left to -33.5%, then reset instantly
    tl.to(".sticky-seamless-csd .scroll-image", {
      x: "-80%",
      duration: 20, // adjust speed (lower = faster)
    })
      .set(".sticky-seamless-csd .scroll-image", { x: "0%" });
  });
  
}

function initStickySeamlessEVC() {
  // gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // For screens >= 992px (desktop)
  mm.add("(min-width: 992px)", () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".sticky-seamless-evc",
        scrub: true,
        pin: true, // pin on larger screens
        start: "top top",
        end: "+=2500"
      }
    })
      .to(".sticky-seamless-evc .scroll-image", { x: "-40%" }, 0);
  });

  // For screens < 992px (mobile/tablet)
  mm.add("(max-width: 991px)", () => {
    // clear any inline transform if coming from a resize
    gsap.set(".sticky-seamless-evc .scroll-image", { clearProps: "all" });

    const tl = gsap.timeline({
      repeat: -1,      // infinite loop
      defaults: { ease: "none" } // no easing for seamless motion
    });

    // animate left to -33.5%, then reset instantly
    tl.to(".sticky-seamless-csd .scroll-image", {
      x: "-40%",
      duration: 3, // adjust speed (lower = faster)
    })
      .set(".sticky-seamless-evc .scroll-image", { x: "0%" });
  });
  
}


// === MAIN INIT ===
window.addEventListener("DOMContentLoaded", () => {

  gsap.config({
    autoSleep: 0,
    force3D: false,
    nullTargetWarn: false,
    trialWarn: false
  });

  function recursion(x) {

    // Base case
    if (x >= 5)
      return;
    recursion(x + 1); // The recursive call
  }

  function Geeks() {
    try {
      recursion(0);
      console.log("Too much "
        + "recursion error not occurred");
    } catch (e) {
      console.log("Too much "
        + "recursion error occurred");
    }
  }

  Geeks();
  
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    scroll = new Lenis({ lerp: .12 });
    scroll.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => scroll.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    
    $("[data-lenis-start]").on("click", function () {
      scroll.start();
    });
    $("[data-lenis-stop]").on("click", function () {
      scroll.stop();
    });

    // initLenis();
    initBannerSlider();
    initBlogSlider();
    initLogoRail();
    footerMarquee();
    initSec3Click();
    initGsapScroll();
    initABSlider();
    initLeadersSlider();
    initCopyLink();
    initCounter();
    initGsapScrollpeekinto();
    // homeHoverAccordion();
    initStickySeamless();
    initStickySeamlessDCS();
    initStickySeamlessCSD();
    initTabSection();
    initAwardsSlider();
    initBlogSlider();
    initBlogSlider2();
    splitText();
    initTabSection2();
    initdigitalleapSlider();
    initGsapScroll2();
    initSideNav();
    initAccordion();
    initCheckTouchDevice();
    hoverOverlay();
    initQuoteWrapper();
    initJourneyLeadersSlider();
    AccordionBox();
    statsCounter();
    VideoPlayOverlay();
    headerAccordion();
    MovingCircleAnimation();
    initHamMenu();
    initContactForm();
    extraCode();
    initallianceSlider();
    initSVGAnimation();
    initopenPositionsSlider();
    initGsapScrollunique();
    initGsapScrollsummit();
    initExtraAnimations();

});
