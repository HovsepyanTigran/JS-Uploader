let input = document.querySelector(".uploader-container__input-button ");
let wrapper = document.querySelector(".uploader-container__file-wrapper");
let uploader = document.querySelector(".uploader-container__uploader-button");

let fileDeleteButtonsArray = []
let filesContentArray = []
let photos = [];
let newList;
let xhrsArray = [];

function domConstructor(files) 
{
  for(let i = 0; i < files.length; i++) 
  {
    let fileUniqueIdentifier = `file-${Date.now() + Math.random(1, 1000)}`

    let reader = new FileReader();
    reader.readAsDataURL(files[i]);
    reader.onload = function () 
    {
      photos.push({
        file: files[i],
        id: fileUniqueIdentifier
      })

      let fileContent = document.createElement("div");
      fileContent.id = fileUniqueIdentifier;
      fileContent.classList = "file-content";
      wrapper.appendChild(fileContent);
    
      let file = document.createElement('img');
      file.classList = "file";
      fileContent.appendChild(file);
      file.src = reader.result;

      
      let progressContent = document.createElement('div');
      progressContent.classList = "progress-content";
      fileContent.appendChild(progressContent);

      let uploadProgress = document.createElement('div');
      uploadProgress.classList = "upload-progress";
      progressContent.appendChild(uploadProgress);

      let progressRow = document.createElement("span");
      progressRow.classList = "progress-row";
      uploadProgress.appendChild(progressRow);

      let uploadPercent = document.createElement("span");
      uploadPercent.classList = "upload-percent";
      progressContent.appendChild(uploadPercent);
      uploadPercent.innerHTML = `${0}%`;

      let doneIcon = document.createElement('img');
      doneIcon.classList = 'done-icon';
      progressContent.appendChild(doneIcon);
      doneIcon.style.visibility = 'hidden';

      let fileDeleteButton = document.createElement('button');
      fileDeleteButton.classList = "file-delete-button";
      fileDeleteButton.innerHTML = 'x';
      fileDeleteButton.id = fileUniqueIdentifier;
      fileContent.appendChild(fileDeleteButton);
      fileDeleteButtonsArray.push(fileDeleteButton);
      document.querySelectorAll('.file-content').forEach(item => filesContentArray.push(item));
      fileDeleteButtonsArray.forEach(function(item) 
        {
          item.onclick = () => 
          {
            let deletedContent = filesContentArray.find(elem => elem.id === item.id);
            wrapper.removeChild(deletedContent);
            photos.splice(photos.findIndex(elem => elem.id === item.id),1);
            
            if(document.querySelectorAll('.file-content').length === 0) 
            {
              document.querySelector(".text").style.display = "block";
              document.querySelector(".text").innerHTML = "Files . . .";
            }
          }
        })
      document.querySelector(".text").style.display = "none";
    }
  }

  uploader.disable = false;
}

function download(input) 
{
  domConstructor(input.files)
}

function dragDrop() {
  wrapper.addEventListener('dragover', evt => 
  {
    evt.preventDefault();
    document.querySelector(".text").innerHTML = "Drop files here";
    wrapper.style.backgroundColor = `${2}px`;
    wrapper.style.backgroundColor = 'rgb(' + 175 + ',' + 175 + ',' + 172 + ')';
  })

  wrapper.addEventListener('dragleave', evt => 
  {
    evt.preventDefault();
    document.querySelector(".text").innerHTML = "Files . . ."
    wrapper.style.backgroundColor = 'rgb(' + 199 + ',' + 199 + ',' + 195 + ')';
  });

  wrapper.addEventListener('drop', evt => 
  {
    evt.preventDefault();
    domConstructor(evt.dataTransfer.files);
    wrapper.style.backgroundColor = 'rgb(' + 199 + ',' + 199 + ',' + 195 + ')';
  });
}

dragDrop()


uploader.onclick = () => 
{
  if(uploader.disable === false) 
  {
    upload()
  }
}


function upload() 
{
  uploader.disable = true
  while (photos.length != 0) 
  {
    return new Promise(function (resolve, reject) 
    {  
      newList = photos.slice(0, 3);
      for (let j = 0; j < newList.length; j++) 
      {
        if(!newList[j]) continue;
        let formData = new FormData();
        let { file, id } = newList[j];
        formData.append("file", file);
        
        let xhr = new XMLHttpRequest();
        xhr.unique_id = id;
        xhrsArray.push(xhr);

        xhr.upload.onprogress = function(evt) 
          {
            if (evt.lengthComputable) 
            {
              let percentComplete = parseInt((evt.loaded / evt.total) * 100);
              let percentBlock = document.getElementById(xhr.unique_id);
              let progressBlock = document.getElementById(xhr.unique_id);
              let doneIconBlock = document.getElementById(xhr.unique_id)
              if (percentBlock && progressBlock) 
              {
                percentBlock.querySelector('.upload-percent').innerHTML = `${percentComplete}%`;
                progressBlock.querySelector('.progress-row').style.width = `${percentComplete}%`;
                if(percentComplete === 100) 
                {
                  let ind1 = photos.findIndex(elem => elem?.id === xhr.unique_id);
                  let ind2 = newList.findIndex(elem => elem?.id === xhr.unique_id);
                  console.log(ind1);
                  photos[ind1] = null;
                  newList[ind2] = null;
                  let chekValue = newList.every(val => val === null)
                  if(chekValue) {
                    newList.splice(0,3);
                    photos.splice(0,3);
                  }
                  doneIconBlock.querySelector('.done-icon').src = '/pictures/done-icon.png';
                  doneIconBlock.querySelector('.done-icon').style.visibility = 'visible';
                  console.log(photos);
                  console.log(newList);
                }
                
              }
            }

          }

        xhr.open("POST", "http://uploader/");
        xhr.send(formData);
        xhr.onload = function () 
        {
          if (xhr.status >= 200 && xhr.status < 300) 
          {
            resolve(xhr.response);
            if(j===2) upload();
          } else 
          {
            reject({
            status: xhr.status,
            statusText: xhr.statusText
            });
          }
        }

        xhr.onerror = function () 
        {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        };
        document.querySelectorAll('.file-content').forEach(item => filesContentArray.push(item))
          fileDeleteButtonsArray.forEach(function(item) 
          {
            item.onclick = () => 
            {
              let deletedXhr = xhrsArray.find(elem => elem.unique_id === item.id);
              if(deletedXhr) deletedXhr.abort();
              let deletedContent = filesContentArray.find(elem => elem?.id === item.id);
              let ind1 = photos.findIndex(elem => elem?.id === item.id);
              let ind2 = newList.findIndex(elem => elem?.id === item.id);
              photos[ind1] = null;
              newList[ind2] = null;
              console.log(photos);
              console.log(newList);
              let chekValue = newList.every(val => val === null);
              if(chekValue) {
                newList.splice(0,3)
                for(let i = 0; i < photos.length; i++) {
                  if(photos[i] === null) {
                  photos.splice(i,1)
                  }
                }
                if(photos.length != 0) upload()
              }
               
              wrapper.removeChild(deletedContent);
              if(document.querySelectorAll('.file-content').length === 0) 
              {
              document.querySelector(".text").style.display = "block";
              document.querySelector(".text").innerHTML = "Files . . .";
              }
            }
          })
      }
    })
    
  }
}