const imageUpload = document.getElementById('imageUpload')
let details = {};
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
]).then(start)

async function start() {
  document.body.append('Models loaded');
  document.querySelector('.preloader').style.display = 'none';
  imageUpload.addEventListener('change', async () => {
    // imageUpload.files[0] = 'https://sa1s3optim.patientpop.com/assets/images/provider/photos/1888657.jpg';
    const image = await faceapi.bufferToImage(imageUpload.files[0]);
    // document.body.append(image);
    const canvas = document.createElement('canvas');
    document.body.append(canvas);
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks();
    console.log(detections[0].landmarks.positions);
    let value = detections[0].landmarks.positions;
    ctx.drawImage(image, 0, 0);
    for(let j=0;j <detections.length;j++){
      for(let i=0;i<=35;i++){
        ctx.beginPath()
        ctx.strokeStyle = "#FFFF00";
        ctx.rect(detections[j].landmarks.positions[i].x, detections[j].landmarks.positions[i].y, 1,1);
        ctx.stroke() ;
      }
    }
    document.body.append(detections.length)
    details['totalFaces'] = detections.length;
    console.log(details)
  });
}

