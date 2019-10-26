// TODO: Refactor: extract modal into its own
// seperate element for pug.
let edit_modal: any = document.getElementById('edit-league-modal');
let edit_editButton: any = document.getElementById('edit-league');
let edit_cancelButton: any = document.getElementById('cancel-edit-league');
let edit_submitButton: any = document.getElementById('submit-edit-league');
let edit_obscurer: any = document.getElementById('leagues-content-obscure');

let edit_showModal = () => {
    edit_modal.style.display = 'block';
    edit_obscurer.style.display = 'block';
};

let edit_hideModal = () => {
    edit_modal.style.display = 'none';
    edit_obscurer.style.display = 'none';
};

edit_editButton.onclick = edit_showModal;

edit_obscurer.onclick = edit_hideModal;
edit_cancelButton.onclick = edit_hideModal;
edit_submitButton.onclick = edit_hideModal;
