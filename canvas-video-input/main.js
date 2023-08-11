const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cameraSelect = document.getElementById('cameraSelect');

// Enumerate cameras and populate the dropdown
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    devices.forEach(device => {
      if (device.kind === 'videoinput') {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${cameraSelect.length + 1}`;
        cameraSelect.appendChild(option);
      }
    });
  })
  .catch(error => {
    console.error('Error enumerating devices:', error);
  });

async function startSelectedCamera() {
  const selectedCameraId = cameraSelect.value;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { deviceId: selectedCameraId }
    });
    video.srcObject = stream;

    video.onplaying = () => {
      renderToCanvas();
    };
  } catch (err) {
    console.error('Error accessing the selected camera:', err);
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

