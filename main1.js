let input = document.querySelector(".uploader-container__input-button ");
let wrapper = document.querySelector(".uploader-container__file-wrapper");
let uploaderButton = document.querySelector(".uploader-container__uploader-button");

let fileDeleteButtonsArray = [];
let filesContentArray = [];
let photos = [];
let newList;
let xhrsArray = [];


function initUploader() {
  input.addEventListener('change', function(){
    changeHandler(this)
  });

  dragDrop();

  uploaderButton.onclick = () => {
    if (uploaderButton.disable === false) {
      upload();
    }
  };

}

initUploader();

function domConstructor(files) {
  for (let i = 0; i < files.length; i++) {
    let fileUniqueIdentifier = `file-${Date.now() + Math.random(1, 1000)}`;

      photos.push({
        file: files[i],
        id: fileUniqueIdentifier,
      });

      let fileContent = document.createElement("div");
      fileContent.id = fileUniqueIdentifier;
      fileContent.classList = "file-content";
      wrapper.appendChild(fileContent);

      let reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = function () {
        file.src = reader.result;
      }

      let file = document.createElement("img");
      file.classList = "file";
      fileContent.appendChild(file);
      
      let progressContent = document.createElement("div");
      progressContent.classList = "file__progress-content";
      fileContent.appendChild(progressContent);

      let uploadProgress = document.createElement("div");
      uploadProgress.classList = "progress-content__upload-progress";
      progressContent.appendChild(uploadProgress);

      let progressRow = document.createElement("span");
      progressRow.classList = "upload-progress__progress-row ";
      uploadProgress.appendChild(progressRow);

      let uploadPercent = document.createElement("span");
      uploadPercent.classList = "progress-content__upload-percent";
      progressContent.appendChild(uploadPercent);
      uploadPercent.innerHTML = `${0}%`;

      let doneIcon = document.createElement("img");
      doneIcon.classList = "progress-content__done-icon";
      progressContent.appendChild(doneIcon);

      let fileDeleteButton = document.createElement("button");
      fileDeleteButton.classList = "file-content__file-delete-button";
      fileDeleteButton.innerHTML = "x";
      fileDeleteButton.id = fileUniqueIdentifier;
      fileContent.appendChild(fileDeleteButton);
      fileDeleteButtonsArray.push(fileDeleteButton);

      document.querySelectorAll(".file-content").forEach((item) => filesContentArray.push(item));

        fileDeleteButton.onclick = function() {
          let item = this;
          let deletedContent = filesContentArray.find((elem) => elem.id === item.id);
          wrapper.removeChild(deletedContent);
          photos.splice(photos.findIndex((elem) => elem.id === item.id),1);

          if (document.querySelectorAll(".file-content").length === 0) {
            document.querySelector(".uploader-container__text").classList.remove("uploader-container__text__invisible")
            document.querySelector(".uploader-container__text").innerHTML = "Files . . .";
          }
        };
      document.querySelector(".uploader-container__text").classList.add('uploader-container__text__invisible');

  uploaderButton.disable = false;
  }
}

function changeHandler(input) {
  domConstructor(input.files);
  input.value = '';
}

function dragDrop() {
  wrapper.addEventListener("dragover", (evt) => {
    evt.preventDefault();
    document.querySelector(".uploader-container__text").innerHTML = "Drop files here";
    wrapper.classList.add("uploader-container__file-wrapper__drag-over");
    wrapper.classList.remove("uploader-container__file-wrapper__drag-leave");
  });

  wrapper.addEventListener("dragleave", (evt) => {
    evt.preventDefault();
    document.querySelector(".uploader-container__text").innerHTML = "Files . . .";
    wrapper.classList.add("uploader-container__file-wrapper__drag-leave");
    wrapper.classList.remove("uploader-container__file-wrapper__drag-over");
  });

  wrapper.addEventListener("drop", (evt) => {
    evt.preventDefault();
    domConstructor(evt.dataTransfer.files);
    wrapper.classList.add("uploader-container__file-wrapper__drag-drop");
    wrapper.classList.remove("uploader-container__file-wrapper__drag-drop");
    wrapper.classList.remove("uploader-container__file-wrapper__drag-over");
    wrapper.classList.remove("uploader-container__file-wrapper__drag-leave");
  });
}



function upload() { 
  uploaderButton.disable = true;
    for (let i = 0; i < photos.length; i++) {
      if (photos[i] === null) {
        photos.splice(i, 1);
      }
    }

  newList = photos.slice(0, 3);

  for (let j = 0; j < newList.length; j++) {
    if (!newList[j]) continue;
    let formData = new FormData();
    let { file, id } = newList[j];
    formData.append("file", file);

    let xhr = new XMLHttpRequest();
    xhr.unique_id = id;
    xhrsArray.push(xhr);

    xhr.upload.onprogress = function (evt) {
      if (evt.lengthComputable) {
        let percentComplete = parseInt((evt.loaded / evt.total) * 100);
        let percentBlock = document.getElementById(xhr.unique_id);
        let progressBlock = document.getElementById(xhr.unique_id);
        let doneIconBlock = document.getElementById(xhr.unique_id);
        
        if (percentBlock && progressBlock) {
          percentBlock.querySelector(".progress-content__upload-percent").innerHTML = `${percentComplete}%`;
          progressBlock.querySelector(".upload-progress__progress-row").style.width = `${percentComplete}%`;

          if (percentComplete === 100) {

            doneIconBlock.querySelector(".progress-content__done-icon").classList.add("progress-content__done-icon__complete");
            doneIconBlock.querySelector(".progress-content__done-icon__complete").src = "/pictures/done-icon.png";
            let photosNullInd = photos.findIndex((elem) => elem?.id === xhr.unique_id);
            let newListNullInd = newList.findIndex((elem) => elem?.id === xhr.unique_id);

            photos[photosNullInd] = null;
            newList[newListNullInd] = null;

            let chekValue = newList.every((val) => val === null);
            if (chekValue) {

              for (let i = 0; i < photos.length; i++) {
                if (photos[i] === null) {
                  photos.splice(i, 1);
                }
              }

              if (photos.length != 0) upload();
            }

            
          }
          
        }
      }
    };

    xhr.open("POST", "http://uploader/");
    xhr.send(formData);

    document.querySelectorAll(".file-content").forEach((item) => filesContentArray.push(item));
    document.querySelectorAll(".file-content__file-delete-button").forEach(function (item) {
      item.onclick = () => {
        let deletedXhr = xhrsArray.find((elem) => elem.unique_id === item.id);

        if (deletedXhr) deletedXhr.abort();
        let deletedContent = filesContentArray.find((elem) => elem.id === item.id);

        let photosNullInd = photos.findIndex((elem) => elem?.id === item.id);
        let newListNullInd = newList.findIndex((elem) => elem?.id === item.id);

        if (photosNullInd >= 0 && newListNullInd >= 0) {
           photos[photosNullInd] = null;
           newList[newListNullInd] = null;
        }

        let chekValue = newList.every((val) => val === null);
        if (chekValue && photos.length != 0) upload();

        wrapper.removeChild(deletedContent);
        
        if (document.querySelectorAll(".file-content").length === 0) {
          document.querySelector(".uploader-container__text").classList.remove("uploader-container__text__invisible");
          document.querySelector(".uploader-container__text").classList.add(".uploader-container__text__show");
          document.querySelector(".uploader-container__text").innerHTML = "Files . . .";
        }
      
      };
    });
  }
}
