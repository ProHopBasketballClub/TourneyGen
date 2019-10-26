let modal: any = document.getElementById('create-league-modal');
let createNewButton: any = document.getElementById('new-league');
let cancelButton: any = document.getElementById('cancel-create-league');
let submitButton: any = document.getElementById('submit-create-league');
let obscurer: any = document.getElementById('home-content-obscure');

let showModal = () => {
    modal.style.display = 'block';
    obscurer.style.display = 'block';

};

let hideModal = () => {
    modal.style.display = 'none';
    obscurer.style.display = 'none';
};

createNewButton.onclick = showModal;
obscurer.onclick = hideModal;
cancelButton.onclick = hideModal;
submitButton.onclick = hideModal;
