const hide_delay = 3000;

document.addEventListener('DOMContentLoaded', function(event) {
    const errors = document.getElementsByClassName('error-banner');
    Array.prototype.forEach.call(errors, function(error) {
        setTimeout(function() {
            error.className += ' hidden';
          }, hide_delay);

    });
});
