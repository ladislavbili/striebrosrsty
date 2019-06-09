export const timestampToString = (timestamp) => {
  let date = (new Date(timestamp));
  return date.getHours()+":"+(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()+" "+date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
}

const fitToSize = (width,height,res) => {
  let result={...res};
  let ratio=result.width/result.height;
  while(width<result.width||height<result.height){
    result.width-=ratio;
    result.height-=1;
  }
  return result;
}

export const resizeImage = (file,width,height) =>{
  let reader = new FileReader();
  let image = new Image();
  //converts it to file ready className= "input-label" htmlFor upload
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }


  let resize = function() {
    let canvas = document.createElement('canvas');
    let res = fitToSize(width,height,{width:image.width,height:image.height});
    canvas.width = res.width;
    canvas.height = res.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, res.width, res.height);
    let imageURL = canvas.toDataURL('image/png');
    return {image:dataURLtoFile(imageURL, file.name),dataURL:imageURL};
  };
  return new Promise(function (ok, no) {
    reader.onload = function (readerEvent) {
        image.onload = function () { return ok(resize()); };
        image.src = readerEvent.target.result;
    };
    return reader.readAsDataURL(file);
  });
}
