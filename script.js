const imageUpload = document.getElementById('imageUpload')
let type = ""
let imageMask = ""
getData();
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
    const image = await faceapi.bufferToImage(imageUpload.files[0]);
    // document.body.append(image);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks();
    ctx.drawImage(image, 0, 0);
    console.log(detections)
    // type='detector';
    if(type === "detector"){
      drawDetector(detections,ctx);
    }
   else if(type === "nose-filter")
    {
      drawJokerNose(detections[0].landmarks.positions,imageMask,ctx) 
    }
    else if(type==="mask")
    {
      drawMask(detections,imageMask,ctx)
    }
    document.body.append(detections.length)
    details['totalFaces'] = detections.length;
    document.body.append(canvas);
  });
}
function drawMask(boundaries,imageMask,ctx){
  console.log(boundaries[0].alignedRect.box);
  let height = boundaries[0].alignedRect.box.height + 30;
  let width = boundaries[0].alignedRect.box.width;
  positionX = boundaries[0].alignedRect.box.x;
  positionY = boundaries[0].alignedRect.box.y - 30;
  let mask = new Image();
  mask.src = imageMask;
  mask.onload =function(){ctx.drawImage(mask, positionX, positionY, width, height)};
  
}
async function drawJokerNose(value,imageMask,ctx,canvas){
  let diff1 = value[31].x - value[35].x;
  let diff2 = value[31].y - value[35].y;
  let diff3 = value[27].x - value[33].x;
  let diff4 = value[27].y - value[33].y;
  let width = Math.sqrt(diff1 * diff1 + diff2 * diff2)*6;
  let height = Math.sqrt(diff3 * diff3 + diff4 * diff4)*3;

  let mask = new Image();
  mask.src = imageMask;
  mask.onload = function()
  { 
   ctx.drawImage(mask, (value[31].x -width/2) + 10, value[31].y-height/2, width , height)
  }
}

async function drawDetector(detections,ctx){
  for(let j=0;j <detections.length;j++){
    for(let i=0;i<=35;i++){
      ctx.beginPath()
      ctx.strokeStyle = "#FFFF00";
      ctx.fillStyle = "#FFFF00"
      ctx.fillRect(detections[j].landmarks.positions[i].x, detections[j].landmarks.positions[i].y, 5,5);
      ctx.stroke() ;
    }
  }
}

function getData(){
  const url = 'https://imagetransferapi.herokuapp.com/input';
  axios({
    method: 'get',
    url: url
  }).then(data=> {
      type =  data.data[0].type;
      console.log(type)
      if(data.data[0].image_url != null)
      imageMask =  data.data[0].image_url;
    });
}


// function postData(outputImage){
//   var formData = new FormData();
//   formData.append('file', outputImage);
//   formData.append('upload_preset', 'dopt09z8');
//   formData.append('api_key', '674816578322183');
//   const xhr = new XMLHttpRequest();

//   // xhr.open('POST', 'https://api.cloudinary.com/v1_1/dykqf3wgp/upload', false);
//   // xhr.send(formData);
//   // const imageResponse = JSON.parse(xhr.responseText);
//   // // console.log(imageResponse.url);


//   // const url = 'https://imagetransferapi.herokuapp.com/result/';
//   // axios({
//   //   method: 'post',
//   //   url : url,
//   //   data:{
//   //     "image_url": imageResponse.url
//   //   }    
//   // }).then(res => console.log(res)).catch(err)
  
// }
