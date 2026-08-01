/*
*
* Contact JS — sends the order form straight to WhatsApp instead of a mail backend.
* @ThemeEaster / Gelateria Bell'Italia
*/
$(function() {
    var WHATSAPP_NUMBER = "355692079202";

    var form = $('#ajax_contact');
    if (!form.length) return;

    var dateInput = $('#orderdate');
    if (dateInput.length) {
        var today = new Date().toISOString().split('T')[0];
        dateInput.attr('min', today);
    }

    function formatDate(value) {
        if (!value) return '';
        var parts = value.split('-'); // yyyy-mm-dd
        if (parts.length !== 3) return value;
        return parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    form.on('submit', function(event) {
        event.preventDefault();

        var fullname = $('#fullname').val().trim();
        var flavor = $('#flavor').val().trim();
        var portions = $('#portions').val().trim();
        var orderdate = formatDate($('#orderdate').val());
        var ordertime = $('#ordertime').val();
        var message = $('#message').val().trim();

        var lines = [
            'Përshëndetje! Dëshiroj të porosis një tortë.',
            'Emri: ' + fullname,
            'Shija e Tortës: ' + flavor,
            'Numri i Porcioneve: ' + portions,
            'Data: ' + orderdate,
            'Ora: ' + ordertime
        ];
        if (message) {
            lines.push('Specifikime: ' + message);
        }

        var text = encodeURIComponent(lines.join('\n'));
        var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;

        window.open(url, '_blank', 'noopener');
    });
});
