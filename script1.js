 // grab your sliders & text element
 const wghtSlider = document.getElementById('wght');
 const wdthSlider = document.getElementById('wdth');
 const opszSlider = document.getElementById('opsz');
 const text = document.getElementById('text');

 function updateFont() {
   const wght = wghtSlider.value;
   const wdth = wdthSlider.value;
   const opsz = opszSlider.value;

   text.style.fontVariationSettings =
     `'wght' ${wght}, 'wdth' ${wdth}, 'opsz' ${opsz}`;
 }

 // wire them up
 wghtSlider.addEventListener('input', updateFont);
 wdthSlider.addEventListener('input', updateFont);
 opszSlider.addEventListener('input', updateFont);

 // init on load
 updateFont();

 // TYPEWRITER
document.addEventListener('DOMContentLoaded', () => {
    const el    = document.getElementById('text');
    const str   = 'This is a softer tool';
    const speed = 80;       // ms per character
    let   i     = 0;
  
    function type() {
      if (i < str.length) {
        el.textContent += str[i++];
        setTimeout(type, speed);
      } else {
        // Remove the cursor once we're done typing
        // el.style.borderRight = 'none';
        // If you want it to become contentEditable afterwards:
        el.setAttribute('contenteditable','true');
      }
    }
  
    // Kick it off
    type();
  });
  