const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // When the video is playing, we draw its frames on the canvas
    video.onplaying = () => {
      renderToCanvas();
    };
  } catch (err) {
    console.error('Error accessing the webcam:', err);
  }
}

function renderToCanvas() {
  // Draw the current video frame on the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Now, let's apply a basic effect, for instance, an invert colors effect:
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];       // red
    data[i + 1] = 255 - data[i + 1]; // green
    data[i + 2] = 255 - data[i + 2]; // blue
  }

  ctx.putImageData(imageData, 0, 0);

  // Request the next frame
  requestAnimationFrame(renderToCanvas);
}

