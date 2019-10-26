document.addEventListener("DOMContentLoaded", function(event) { 
    let admin_panel: any = document.getElementById('admin-panel');
    admin_panel.onmouseover = function(e) {
        admin_panel.classList.add("admin-panel-expanded");
        admin_panel.classList.remove("admin-panel-collapsed");
    }
    admin_panel.onmouseout = function(e) {
        admin_panel.classList.add('admin-panel-collapsed');
        admin_panel.classList.remove('admin-panel-expanded');
    }
});