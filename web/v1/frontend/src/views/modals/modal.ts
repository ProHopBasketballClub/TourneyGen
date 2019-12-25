// TODO: This is redefined on pages with multiple
//       modals. Find a way to supress that warning.
let register_modal = (modal, openers, closers) => {
    /* Registers the id `modal` as a modal on the webpage.

        params:
            modal: The id of the elements to be treated as a modal
            openers: A list of ids of the elements which should open
                    the modal when clicked.
            closers: A list of ids of the elements which should close
                    the modal when clicked.
    */
    const renderedModal: any = document.getElementById(modal);
    const renderedObscurer: any = document.getElementById(modal + '-obscurer');

    const showModal = () => {
        renderedModal.style.display = 'flex';
        renderedObscurer.style.display = 'block';
    };

    const hideModal = () => {
        renderedModal.style.display = 'none';
        renderedObscurer.style.display = 'none';
    };

    openers.forEach((opener) => {
        document.getElementById(opener).onclick = showModal;
    });

    closers.forEach((closer) => {
        document.getElementById(closer).onclick = hideModal;
    });
};
