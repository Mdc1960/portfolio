/* scripts.js
    Rends la page interactive :
    - Onglets "Technical Skills / Education / Experiences"
    - Affiche/masque le formulaire de contact
    - Navigation lisse et mise en avant du lien actif
    - Galerie vidéo (Next / Back)
*/

(() => {
  // --- Helpers ---
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // --- Tabs dans About Me ---
  window.show = function(targetId, evt) {
     try {
        const links = $$('.personal-info .info-link');
        const contents = $$('.personal-info .common');

        // gérer classes des onglets
        links.forEach(l => l.classList.remove('info-activated'));
        if (evt && evt.currentTarget) evt.currentTarget.classList.add('info-activated');
        else {
          // si on appelle sans event, tenter d'activer le lien correspondant
          const linkToActivate = links.find(l => l.id && targetId && l.id.startsWith(targetId.slice(0,3)));
          if (linkToActivate) linkToActivate.classList.add('info-activated');
        }

        // afficher le contenu ciblé
        contents.forEach(c => c.classList.remove('content-activated'));
        const target = document.getElementById(targetId);
        if (target) target.classList.add('content-activated');
     } catch (e) {
        // silent fail si structure HTML différente
        console.warn('show() error', e);
     }
  };

  // --- Afficher/Masquer le formulaire de contact ---
  window.showadd = function() {
     const call = $('#call');
     if (!call) return;
     const isShown = call.style.display === 'block' || call.classList.contains('call-active');
     if (isShown) {
        call.style.display = 'none';
        call.classList.remove('call-active');
     } else {
        call.style.display = 'block';
        call.classList.add('call-active');
        // focus sur le premier champ du formulaire si présent
        const first = call.querySelector('input, textarea, select, button');
        if (first) first.focus();
     }
  };

  // --- Navigation lisse pour les ancres ---
  function enableSmoothNav() {
     const anchors = $$('nav a[href^="#"]');
     anchors.forEach(a => {
        a.addEventListener('click', e => {
          const href = a.getAttribute('href');
          if (!href || !href.startsWith('#')) return;
          const target = document.querySelector(href);
          if (target) {
             e.preventDefault();
             target.scrollIntoView({ behavior: 'smooth', block: 'start' });
             history.replaceState(null, '', href); // mettre à jour l'URL sans recharger
          }
        });
     });
  }

  // --- Mettre en avant le lien de navigation actif selon le scroll ---
  function enableActiveNavOnScroll() {
     const sections = $$('main > div[id]');
     if (!sections.length) return;
     const navLinks = $$('nav a[href^="#"]');

     const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
          if (!link) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
             // ajouter indicateur visuel
             navLinks.forEach(a => a.classList.remove('nav-active'));
             link.classList.add('nav-active');
          }
        });
     }, { threshold: [0.45, 0.6] });

     sections.forEach(s => observer.observe(s));
  }

  // --- Galerie vidéo Projects (Next / Back) ---
  function enableProjectGallery() {
     const videoEl = document.querySelector('#project-contents video');
     const backBtn = $('#back');
     const nextBtn = $('#next');
     if (!videoEl || !backBtn || !nextBtn) return;

     // Liste de vidéos (modifier/ajouter vos sources réelles)
     const videos = [
        './JavaDemoVideo/ProjetJavaDemoVideo.mp4',
        './JavaDemoVideo/Projet2.mp4',
        './JavaDemoVideo/Projet3.mp4'
     ];

     let index = 0;

     function updateVideo() {
        const src = videos[index];
        // remplace la source du <video>
        const sourceEl = videoEl.querySelector('source');
        if (sourceEl) {
          sourceEl.src = src;
        } else {
          // si pas de <source>, créer-en un
          const s = document.createElement('source');
          s.src = src;
          s.type = 'video/mp4';
          videoEl.innerHTML = '';
          videoEl.appendChild(s);
        }
        try { videoEl.load(); } catch (e) {}
        // lecture automatique courte (optionnel)
        // videoEl.play().catch(()=>{});
        // mettre état des boutons
        backBtn.disabled = videos.length <= 1;
        nextBtn.disabled = videos.length <= 1;
     }

     backBtn.addEventListener('click', () => {
        index = (index - 1 + videos.length) % videos.length;
        updateVideo();
     });
     nextBtn.addEventListener('click', () => {
        index = (index + 1) % videos.length;
        updateVideo();
     });

     updateVideo();
  }

  // --- Initialisation au chargement ---
  document.addEventListener('DOMContentLoaded', () => {
     enableSmoothNav();
     enableActiveNavOnScroll();
     enableProjectGallery();

     // S'assurer que le bon onglet est affiché au départ
     // (si HTML a déjà initialisé, cela ne fera rien de mal)
     if (!document.querySelector('.personal-info .info-activated')) {
        const defaultTab = document.getElementById('skills') || document.querySelector('.personal-info .info-link');
        if (defaultTab) defaultTab.classList.add('info-activated');
     }
     if (!document.querySelector('.personal-info .content-activated')) {
        const defaultContent = document.getElementById('skill') || document.querySelector('.personal-info .common');
        if (defaultContent) defaultContent.classList.add('content-activated');
     }

     // masquer le formulaire de contact au démarrage si visible
     const call = $('#call');
     if (call && !call.classList.contains('call-active')) {
        call.style.display = 'none';
     }
  });
})();