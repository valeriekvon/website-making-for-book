// hand-control.js
// — TF.js MediaPipeHands, two-hand pinch → wdth (left) & opsz (right)

document.addEventListener('DOMContentLoaded', () => {
  const video      = document.getElementById('video');
  const textEl     = document.getElementById('text');
  const wghtSlider = document.getElementById('wght');
  const btnMouse   = document.getElementById('mouseControl');
  const btnHand    = document.getElementById('handControl');

  let detector      = null;
  let isHandActive  = false;
  let lastWdth      = 0;
  let lastOpsz      = 50.1;

  // tweak these to match your camera/framerate
  const PINCH_MIN   = 20;   // px: any d < this → pct=0
  const MAX_PINCH   = 150;  // px: any d > this → pct=1

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  async function setupCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Camera API not supported.');
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.playsInline = true;
      video.muted      = true;
      await new Promise(res => video.onloadedmetadata = res);
      video.play();
      video.style.transform = 'scaleX(-1)';
      console.log('✅ Camera ready:', video.videoWidth, '×', video.videoHeight);
      return true;
    } catch (err) {
      console.error('❌ Camera error:', err);
      return false;
    }
  }

  function applySettings() {
    const wght = clamp(parseFloat(wghtSlider.value), 0, 100);
    const settings = [
      `"wght" ${wght.toFixed(1)}`,
      `"wdth" ${lastWdth.toFixed(1)}`,
      `"opsz" ${lastOpsz.toFixed(1)}`
    ].join(', ');
    textEl.style.fontVariationSettings = settings;
    console.log('🔤 Applied:', settings);
  }

  // remap raw pinch distance d to [0,1] with a dead-zone at PINCH_MIN
  function pinchPctFromDistance(d) {
    // shift down by PINCH_MIN, clamp to [0, MAX_PINCH - PINCH_MIN], then normalize
    const adj = clamp(d - PINCH_MIN, 0, MAX_PINCH - PINCH_MIN);
    return adj / (MAX_PINCH - PINCH_MIN);
  }

  function processHands(predictions) {
    if (predictions.length >= 2) {
      // two‐handed pinch
      predictions.sort((a, b) => a.keypoints[0].x - b.keypoints[0].x);
      const [left, right] = predictions;

      const getPinch = hand => {
        const t = hand.keypoints[4];  // thumb tip
        const i = hand.keypoints[8];  // index tip
        const d = Math.hypot(t.x - i.x, t.y - i.y);
        return pinchPctFromDistance(d);
      };

      lastWdth = getPinch(left) * 100;
      lastOpsz = 50.1 + getPinch(right) * (100 - 50.1);

    } else if (predictions.length === 1) {
      // single‐hand pinch
      const hand = predictions[0];
      const t    = hand.keypoints[4];
      const i    = hand.keypoints[8];
      const d    = Math.hypot(t.x - i.x, t.y - i.y);
      const pct  = pinchPctFromDistance(d);

      // choose axis by which half of the frame it is in
      if (i.x < video.videoWidth / 2) {
        lastWdth = pct * 100;
      } else {
        lastOpsz = 50.1 + pct * (100 - 50.1);
      }
    }

    applySettings();
  }

  async function predictLoop() {
    if (!isHandActive) return;
    const preds = await detector.estimateHands(video, { flipHorizontal: false });
    processHands(preds);
    requestAnimationFrame(predictLoop);
  }

  async function enableHandControl() {
    if (isHandActive) return;
    console.log('▶️ Enabling Hand Control');
    btnHand.classList.add('active');
    btnMouse.classList.remove('active');
    video.style.display = 'block';

    if (!video.srcObject && !await setupCamera()) return;

    if (!detector) {
      console.log('⏳ Loading MediaPipeHands detector…');
      detector = await handPoseDetection.createDetector(
        handPoseDetection.SupportedModels.MediaPipeHands,
        {
          runtime:      'mediapipe',  // or 'tfjs'
          modelType:    'full',       // 'lite' for speed
          maxHands:     2,
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
        }
      );
      console.log('✅ Detector ready');
    }

    isHandActive = true;
    predictLoop();
  }

  function disableHandControl() {
    if (!isHandActive) return;
    console.log('▶️ Disabling Hand Control');
    btnHand.classList.remove('active');
    video.style.display = 'none';
    isHandActive = false;
  }

  function enableMouseControl() {
    console.log('▶️ Enabling Mouse Control');
    btnMouse.classList.add('active');
    btnHand.classList.remove('active');
    disableHandControl();
    // your mouse-percentage.js still drives wght & wdth
  }
  window.enableHandControl  = enableHandControl;
window.disableHandControl = disableHandControl;


  btnHand.addEventListener('click',  enableHandControl);
  btnMouse.addEventListener('click', enableMouseControl);

  // kick off in mouse mode
  enableMouseControl();

});

