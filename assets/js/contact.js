/*
*
* Contact JS — sends the cake-order form straight to WhatsApp, no backend.
* @ThemeEaster / Gelateria Bell'Italia
*/
$(function () {
    const WHATSAPP_NUMBER = '355692079202';

    const $form = $('#ajax_contact');
    if (!$form.length) return;

    const $orderDate = $('#orderdate');
    const $orderTime = $('#ordertime');

    // Stop customers picking a pickup date in the past.
    if ($orderDate.length) {
        $orderDate.attr('min', new Date().toISOString().split('T')[0]);
    }

    function formatDate(isoValue) {
        const [year, month, day] = isoValue.split('-');
        return day && month && year ? `${day}/${month}/${year}` : isoValue;
    }

    function buildMessage(fields) {
        const lines = [
            "Përshëndetje! Dëshiroj të porosis një tortë.",
            `Emri: ${fields.fullname}`,
            `Shija e Tortës: ${fields.flavor}`,
            `Numri i Porcioneve: ${fields.portions}`,
            `Data: ${formatDate(fields.orderdate)}`,
            `Ora: ${fields.ordertime}`
        ];
        if (fields.message) lines.push(`Specifikime: ${fields.message}`);
        return lines.join('\n');
    }

    $form.on('submit', function (event) {
        event.preventDefault();

        const fields = {
            fullname: $('#fullname').val().trim(),
            flavor: $('#flavor').val().trim(),
            portions: $('#portions').val().trim(),
            orderdate: $orderDate.val(),
            ordertime: $orderTime.val(),
            message: $('#message').val().trim()
        };

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(fields))}`;
        window.open(url, '_blank', 'noopener');
        $form[0].reset();
    });
});
