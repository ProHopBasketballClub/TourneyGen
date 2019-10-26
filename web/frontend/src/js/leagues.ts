// TODO: Refactor: extract modal into its own
// seperate element for pug.
let leagues_modal: any = document.getElementById('edit-league-modal');
let leagues_editButton: any = document.getElementById('edit-league');
let leagues_cancelButton: any = document.getElementById('cancel-edit-league');
let leagues_submitButton: any = document.getElementById('submit-edit-league');
let leagues_obscurer: any = document.getElementById('leagues-content-obscure');

let leages_showModal = () => {
    leagues_modal.style.display = 'block';
    leagues_obscurer.style.display = 'block';
};

let leagues_hideModal = () => {
    leagues_modal.style.display = 'none';
    leagues_obscurer.style.display = 'none';
};

leagues_editButton.onclick = leages_showModal;

leagues_obscurer.onclick = leagues_hideModal;
leagues_cancelButton.onclick = leagues_hideModal;
leagues_submitButton.onclick = leagues_hideModal;
