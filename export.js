// export.js

;(function() {
  // 0) Duplicate your chapters list here:
  const chapters = [
    { title: 'Chapter 1', file: 'pdfs/ch1.pdf' },
    { title: 'Chapter 2', file: 'pdfs/ch2.pdf' },
    { title: 'Chapter 3', file: 'pdfs/ch3.pdf' },
  ];

  document.addEventListener('DOMContentLoaded', () => {
    // 1) Grab the DOM nodes
    const makeBtn      = document.getElementById('make-book');
    const cancelBtn    = document.getElementById('cancel');
    const overlay      = document.getElementById('controls');
    const checklistUL  = document.getElementById('print-check');
    if (!makeBtn || !cancelBtn || !overlay || !checklistUL) {
      console.error('export.js: missing #make-book, #cancel, #controls or #print-check');
      return;
    }

    // 2) Toggle between “show checklist” and “compile”
    makeBtn.addEventListener('click', async () => {
      if (!overlay.classList.contains('show')) {
        // → Build the checklist from chapters[]
        checklistUL.innerHTML = chapters.map((chap, i) => `
          <li>
            <input 
              type="checkbox" 
              id="chap-${i}" 
              data-index="${i}" 
              checked
            >
            <label for="chap-${i}">${chap.title}</label>
          </li>
        `).join('') + `
          <li>—</li>
          <li>
            <input type="checkbox" id="select-all" checked>
            <label for="select-all">Select All</label>
          </li>
        `;

        // “Select All” behavior
        checklistUL
          .querySelector('#select-all')
          .addEventListener('change', function() {
            const checked = this.checked;
            checklistUL
              .querySelectorAll('input[type=checkbox]')
              .forEach(cb => cb.checked = checked);
          });

        // show overlay
        overlay.classList.add('show');
        makeBtn.classList.add('checklist');
        makeBtn.textContent = 'Compile Book';
      } else {
        // → User clicked “Compile Book”
        const selectedFiles = Array.from(
          checklistUL.querySelectorAll('input[type=checkbox]:not(#select-all):checked')
        ).map(cb => chapters[cb.dataset.index].file);

        if (selectedFiles.length === 0) {
          alert('Please select at least one chapter.');
          return;
        }

        try {
          // Merge via pdf-lib
          const mergedPdf = await PDFLib.PDFDocument.create();
          for (const url of selectedFiles) {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to load ${url}`);
            const arrayBuffer = await res.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const copied = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copied.forEach(page => mergedPdf.addPage(page));
          }
          const bytes = await mergedPdf.save();
          const blob  = new Blob([bytes], { type: 'application/pdf' });
          const link  = document.createElement('a');
          link.href   = URL.createObjectURL(blob);
          link.download = 'softer_computing_book.pdf';
          document.body.appendChild(link);
          link.click();
          link.remove();

        } catch (err) {
          console.error(err);
          alert('Error exporting PDF: ' + err.message);
        }

        // hide overlay and reset button
        overlay.classList.remove('show');
        makeBtn.classList.remove('checklist');
        makeBtn.textContent = 'Make Book';
      }
    });

    // 3) Cancel button just hides overlay
    cancelBtn.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.remove('show');
      makeBtn.classList.remove('checklist');
      makeBtn.textContent = 'Make Book';
    });
  });
})();
