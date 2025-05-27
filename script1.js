// slider-ttf.js
document.addEventListener('DOMContentLoaded', () => {
  // 1) grab DOM elements
  const wghtSlider       = document.getElementById('wght');
  const wdthSlider       = document.getElementById('wdth');
  const opszSlider       = document.getElementById('opsz');
  const textEl           = document.getElementById('text');
  const downloadFileBtn  = document.getElementById('downloadFontFile');
  const pubLink          = document.querySelector('.project-parts a[href*="index.html"]');
  const typLink          = document.querySelector('.project-parts a[href*="index1.html"]');

  // 2) slider → live font
  function updateFont() {
    const w = parseFloat(wghtSlider.value).toFixed(1);
    const d = parseFloat(wdthSlider.value).toFixed(1);
    const o = parseFloat(opszSlider.value).toFixed(1);
    textEl.style.fontVariationSettings = 
      `'wght' ${w}, 'wdth' ${d}, 'opsz' ${o}`;
  }
  [wghtSlider, wdthSlider, opszSlider].forEach(s => 
    s.addEventListener('input', updateFont)
  );
  updateFont();


  downloadFileBtn.addEventListener('click', () => {
    // path to your variable-font file
    const fontUrl = '/fonts/latest_versionVF.ttf';
  
    // create a temporary <a> to trigger a download
    const a = document.createElement('a');
    a.href = fontUrl;
    a.download = 'latest_versionVF.ttf';  // the filename users get
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });


  // 4) Typewriter
  const str   = 'This is a softer tool';
  const speed = 81;
  let   i     = 0;
  textEl.textContent = '';  
  (function typeChar(){
    if (i < str.length) {
      textEl.textContent += str[i++];
      setTimeout(typeChar, speed);
    } else {
      textEl.setAttribute('contenteditable','true');
    }
  })();

  // 5) Hover highlights
  pubLink.addEventListener('mouseover', () =>
    document.querySelectorAll('[data-tag="publication"]')
      .forEach(el => el.classList.add('highlight'))
  );
  pubLink.addEventListener('mouseout', () =>
    document.querySelectorAll('[data-tag="publication"]')
      .forEach(el => el.classList.remove('highlight'))
  );

  typLink.addEventListener('mouseover', () =>
    document.querySelectorAll('[data-tag="type"]')
      .forEach(el => el.classList.add('highlight'))
  );
  typLink.addEventListener('mouseout', () =>
    document.querySelectorAll('[data-tag="type"]')
      .forEach(el => el.classList.remove('highlight'))
  );
});
(function() {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini/i
                   .test(navigator.userAgent);
  if (isMobile) {
    // add a class to <body> so our CSS kicks in
    document.body.classList.add('mobile-only');
  }
})();
