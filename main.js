let input = document.querySelector(".uploader-container__input-button ");
let wrapper = document.querySelector(".uploader-container__img-wrapper");
let uploader = document.querySelector(".uploader-container__uploader-button");
let imgContent = document.querySelector(".img-content");

var photos = []
function download(input) {
    for(let i = 0; i < input.files.length; i++){
    var file = input.files[i];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    photos.push(file)
    reader.onload = function () {
        let img = document.createElement('img');
        img.classList = "img"
        imgContent.appendChild(img);
        img.src = reader.result;
        document.querySelector(".text").style.display = "none"
    }
  }
  uploader.onclick = () => 
  {
    for(let j = 0; j < photos.length; j++) {
      let formData = new FormData();
      formData.append("file", photos[j])
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "http://192.168.0.110/");
      xhr.send(formData)
      xhr.onload = () => alert(xhr.response);
    }
    photos = [];
    imgContent.innerHTML = ""
    document.querySelector(".text").style.display = "inline"
  }
}