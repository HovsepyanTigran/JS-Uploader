let input = document.querySelector(".uploader-container__input-button ");
let wrapper = document.querySelector(".uploader-container__file-wrapper");
let uploader = document.querySelector(".uploader-container__uploader-button");
let percent = document.querySelector(".progress-bar-percent");

let xxx
let photos = [];

wrapper.addEventListener('dragover', evt => {
	evt.preventDefault()
  document.querySelector(".text").innerHTML = "Drop files here"
  wrapper.style.backgroundColor = `${2}px`
  wrapper.style.backgroundColor = 'rgb(' + 175 + ',' + 175 + ',' + 172 + ')';
})

wrapper.addEventListener('dragleave', evt => {
	evt.preventDefault()
  document.querySelector(".text").innerHTML = "Files . . ."
  wrapper.style.backgroundColor = 'rgb(' + 199 + ',' + 199 + ',' + 195 + ')';
});

wrapper.addEventListener('drop', evt => {
	evt.preventDefault()

	let file = evt.dataTransfer.files;
	for (let i = 0; i < file.length; i++) {
    let fileUniqueIdentifier = 'file-' + Date.now() + Math.random(1, 1000);
    photos.push({
      file: file[i],
      id: fileUniqueIdentifier
    })
    let reader = new FileReader();
  reader.readAsDataURL(file[i]);  
  reader.onload = function () {
    var fileContent = document.createElement("div");
    fileContent.id = fileUniqueIdentifier;
    fileContent.classList = "file-content";
    wrapper.appendChild(fileContent);
    var file = document.createElement('img');
    file.classList = "file"
    fileContent.appendChild(file);
    file.src = reader.result;
    var progressContent = document.createElement('div');
      progressContent.classList = "progress-content";
      fileContent.appendChild(progressContent);
      var uploadProgress = document.createElement('div');
      uploadProgress.classList = "upload-progress";
      progressContent.appendChild(uploadProgress);
      var progressRow = document.createElement("span");
      progressRow.classList = "progress-row";
      uploadProgress.appendChild(progressRow);
      let uploadPercent = document.createElement("span");
      uploadPercent.classList = "upload-percent";
      progressContent.appendChild(uploadPercent);
      uploadPercent.innerHTML = `${0}%`;
      let fileDeleteButton = document.createElement('button');
      fileDeleteButton.classList = "file-delete-button";
      fileDeleteButton.innerHTML = 'x'
      fileContent.appendChild(fileDeleteButton);
      fileDeleteButton.onclick = () => {
        photos.splice(index, 1);
      }
      
  }
  document.querySelector(".text").style.display = "none";
	}
});



function download(input) {
  for (let i = 0; i < input.files.length; i++) {
    var file = input.files[i];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let fileUniqueIdentifier = 'file-' + Date.now() + Math.random(1, 1000);
    photos.push({
      file: file,
      id: fileUniqueIdentifier
    })
   
    reader.onload = function () {
      var fileContent = document.createElement("div");
      fileContent.id = fileUniqueIdentifier;
      fileContent.classList = "file-content";
      wrapper.appendChild(fileContent);
      var file = document.createElement('img');
      file.classList = "file"
      fileContent.appendChild(file);
      file.src = reader.result;
      var progressContent = document.createElement('div');
      progressContent.classList = "progress-content";
      fileContent.appendChild(progressContent);
      var uploadProgress = document.createElement('div');
      uploadProgress.classList = "upload-progress";
      progressContent.appendChild(uploadProgress);
      var progressRow = document.createElement("span");
      progressRow.classList = "progress-row";
      uploadProgress.appendChild(progressRow);
      let uploadPercent = document.createElement("span");
      uploadPercent.classList = "upload-percent";
      progressContent.appendChild(uploadPercent);
      uploadPercent.innerHTML = `${0}%`
      document.querySelector(".text").style.display = "none";
      console.log(photos);
      let fileDeleteButton = document.createElement('button');
      fileDeleteButton.classList = "file-delete-button";
      fileDeleteButton.innerHTML = 'x'
      fileContent.appendChild(fileDeleteButton);
      // photos = [];
      // imgContent.innerHTML = "";
      // document.querySelector(".text").style.display = "inline"
    }
  }
}
let x
console.log(x);
if(x === undefined) {
  uploader.onclick = () => {
    upload()
  }
}

console.log(photos);
function upload() {
  while (photos.length != 0) {
    return new Promise(function (resolve, reject) {
    newList = photos.slice(0, 3)
    for (let j = 0; j < newList.length; j++) {
      let formData = new FormData();
      let { file, id } = newList[j];
      formData.append("file", file);
      let xhr = new XMLHttpRequest();
      xhr.unique_id = id;
      document.querySelectorAll(".uploader-container__img-wrapper").forEach(item => item);
      xhr.upload.onprogress = function (evt) {
        if (evt.lengthComputable) {
          var percentComplete = parseInt((evt.loaded / evt.total) * 100);
          let percentBlock = document.getElementById(xhr.unique_id);
          let progressBlock = document.getElementById(xhr.unique_id);
          if (percentBlock && progressBlock) 
          {
            percentBlock.querySelector('.upload-percent').innerHTML = `${percentComplete}%`;
            progressBlock.querySelector('.progress-row').style.width = `${percentComplete}%`;
          }
        }
      }
      xhr.open("POST", "http://uploader/");
      xhr.send(formData);
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
            if(j===2) upload()
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText
            });
          }
        }
        xhr.onerror = function () {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        };
    }
    newList.splice(0, 3)
    photos.splice(0, 3)
  })
  }
  x=1
}


