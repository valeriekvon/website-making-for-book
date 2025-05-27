// script.js

// 1) PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.7.107/pdf.worker.min.js';

// 2) Your chapters (change file paths as needed)
const chapters = [
  { title: 'Cover', file: 'pdfs/ch1.pdf' },
  { title: 'Introduction', file: 'pdfs/ch2.pdf' },
  { title: 'Chapter 1', file: 'pdfs/ch3.pdf' },
  { title: 'Chapter 2', file: 'pdfs/ch4.pdf' },
  { title: 'Chapter 3', file: 'pdfs/ch5.pdf' },
  { title: 'Chapter 4', file: 'pdfs/ch6.pdf' },
  { title: 'Afterword', file: 'pdfs/ch7.pdf' },

];

// 3) Grab the container
const viewer = document.getElementById('viewer');

async function renderChapters() {
  for (const chapter of chapters) {
    // Load the PDF
    const pdf = await pdfjsLib.getDocument(chapter.file).promise;
    if (pdf.numPages === 0) continue;

    // --- 1) Measure “natural” page size on page 1 ---
    const firstPage = await pdf.getPage(1);
    const unscaled  = firstPage.getViewport({ scale: 1 });
    // scale to fit height
    const heightScale = window.innerHeight / unscaled.height;
    // scale to fit two pages side-by-side in the viewport width
    const widthScale  = window.innerWidth / (2 * unscaled.width);
    // pick the smaller so both pages fit fully
    const displayScale = Math.min(heightScale, widthScale);
    // for crisp rendering buffer, double that
    const renderScale  = displayScale * 2;

    // compute the on-screen size of one page
    const displayWidth  = Math.floor(unscaled.width  * displayScale);
    const displayHeight = Math.floor(unscaled.height * displayScale);

    // --- 2) Create the viewport wrapper, exactly 2 pages wide ---
    const wrapper = document.createElement('div');
    wrapper.className = 'chapter-viewport';
    wrapper.style.width  = `${displayWidth * 2}px`;
    wrapper.style.height = `${displayHeight}px`;
    viewer.appendChild(wrapper);

    // --- 3) Inside that, the scrollable “chapter” flexbox ---
    const chapterEl = document.createElement('div');
    chapterEl.className = 'chapter';
    wrapper.appendChild(chapterEl);

    // --- 4) Render pages, grouping into spreads of two ---
    let spreadEl = document.createElement('div');
    spreadEl.className = 'spread';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const vp   = page.getViewport({ scale: renderScale });

      const canvas = document.createElement('canvas');
      canvas.className = 'page';
      canvas.width  = vp.width;
      canvas.height = vp.height;
      // but display it at our “displayScale” size
      canvas.style.width  = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: vp
      }).promise;

      spreadEl.appendChild(canvas);

      // once we have two pages, finalize that spread
      if (spreadEl.children.length === 2) {
        chapterEl.appendChild(spreadEl);
        spreadEl = document.createElement('div');
        spreadEl.className = 'spread';
      }
    }
    // if an odd page remains, append it too
    if (spreadEl.children.length > 0) {
      chapterEl.appendChild(spreadEl);
    }
  }
}

renderChapters().catch(console.error);


document.querySelector('.project-parts a[href*="index.html"]').addEventListener('mouseover', () => {
  document.querySelectorAll('[data-tag="publication"]').forEach(el => el.classList.add('highlight'));
});
document.querySelector('.project-parts a[href*="index.html"]').addEventListener('mouseout', () => {
  document.querySelectorAll('[data-tag="publication"]').forEach(el => el.classList.remove('highlight'));
});

document.querySelector('.project-parts a[href*="index1.html"]').addEventListener('mouseover', () => {
  document.querySelectorAll('[data-tag="type"]').forEach(el => el.classList.add('highlight'));
});
document.querySelector('.project-parts a[href*="index1.html"]').addEventListener('mouseout', () => {
  document.querySelectorAll('[data-tag="type"]').forEach(el => el.classList.remove('highlight'));
});
