const hide_delay = 3000;

document.addEventListener('DOMContentLoaded', function(event) {
    const errors = document.getElementsByClassName('error-banner');
    console.log(errors);
    Array.prototype.forEach.call(errors, function(error) {
        console.log('asdiaof');
        setTimeout(function() {
            error.className += ' hidden';
          }, hide_delay);

    });
});
