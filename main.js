if ("serviceWorker" in navigator) {
  // register service worker
  navigator.serviceWorker.register("service-worker.js");
}


const addBtn = document.querySelector('.js-add');
const noteField = document.querySelector('.js-note');
const descField = document.querySelector('.js-desc');

const list = document.querySelector('.js-list');

let smallDesc = '';

function uniqId() {
  let id = Math.random() * 10000;
  return ~~id;
}


addBtn.addEventListener('click', function () {

  function checkUId() {
    let noteName = document.getElementsByClassName('js-note-name');

    let id = uniqId();
    let ifNotUniq = [];

    for (let i = 0; i < noteName.length; i += 1) {

      if (`note-${id}` === noteName[i].dataset.uid) {
        ifNotUniq.push('true');
      }
    }

    if (ifNotUniq.includes('true')) {
      checkUId();
    } else {
      return id;
    }
  }

  if (!noteField.value.trim().length) {
    noteField.value = '';
    noteField.placeholder = 'This field must be filled';
    noteField.classList += ' error';
  } else {

    let tagId = checkUId();

    let isDescInclude = descField.value.trim().length;
    if (isDescInclude) {
      smallDesc = `<small class="js-note-desc" data-uid="desc-${tagId}"> ${descField.value} </small>`;
    }

    let newData = `
      <label class="js-item">
        <input type="checkbox" />
        <span class="js-note-name" data-uid="note-${tagId}">${noteField.value}</span> 
        ${smallDesc}
        <button class="btn btn-more js-more">...</button>
        <div class="hidden-actions">
          <button class="btn btn-edit">Edit</button>
          <button class="btn btn-del">Del</button>
        </div>
      </label>
    `;

    list.insertAdjacentHTML('afterbegin', newData);

    // Set to Local Storage
    localStorage.setItem(`note-${tagId}`, noteField.value);
    if (isDescInclude) localStorage.setItem(`desc-${tagId}`, descField.value);

    noteField.value = '';
    descField.value = '';
    smallDesc = '';

  }
})

noteField.addEventListener('focus', function () {
  this.classList.remove('error');
})

noteField.addEventListener('blur', function () {
  this.placeholder = 'Add your note...';
})

list.addEventListener('click', function (e) {
  let btnClassList = e.target.classList;

  if (~btnClassList.value.indexOf('btn-more')) {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'block';
  }

  //remove item
  if (~btnClassList.value.indexOf('btn-del') || ~e.target.parentElement.classList.value.indexOf('btn-del')) {
    e.target.closest('.js-item').remove();

    //remove from local storage
    let dataNote = e.target.closest('.js-item').querySelector('.js-note-name').dataset.uid;
    let dataDesc = e.target.closest('.js-item').querySelector('.js-note-desc');
    let dataToRemove = [dataNote];

    if (dataDesc !== null) {
      dataDesc = dataDesc.dataset.uid;
      dataToRemove.push(dataDesc);
    }

    dataToRemove.forEach(k => localStorage.removeItem(k));

  }

})

/**
 * Get from Local Storage
 */

let itemsArr = [];
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  itemsArr.push(parseInt(key.match(/\d+/)));
}
let uniqItem = new Set(itemsArr);

for (const iterator of uniqItem) {
  let storageSmallDesc = '';
  let storageDesc = localStorage.getItem('desc-' + iterator);
  if (storageDesc !== null) {
    storageSmallDesc = `<small class="js-note-desc" data-uid="desc-${iterator}"> ${storageDesc} </small>`;
  }
  let storageData = `
      <label class="js-item">
        <input type="checkbox" />
        <span class="js-note-name" data-uid="note-${iterator}">${localStorage.getItem('note-' + iterator)}</span> 
        ${storageSmallDesc}
        <button class="btn btn-more js-more">...</button>
        <div class="hidden-actions">
          <button class="btn btn-edit">Edit</button>
          <button class="btn btn-del">Del</button>
        </div>
      </label>
    `;

  list.insertAdjacentHTML('afterbegin', storageData);
}


// Code to handle install prompt on desktop

let deferredPrompt;
const installBtn = document.querySelector('.install-button');
installBtn.style.display = 'none';

// setTimeout(function () {
//   installBtn.classList += ' show';
// }, 3000);

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    // hide our user interface that shows our A2HS button
    installBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});
