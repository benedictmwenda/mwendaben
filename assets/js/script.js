// Contact form -> Formspree (AJAX, falls back to normal POST if JS fails)
jQuery(function ($) {
  var $form = $('#contact_form');
  var $ok = $form.find('.returnmessage');
  var $empty = $form.find('.empty_notice');
  var $btn = $('#send_message');

  $form.on('submit', function (e) {
    e.preventDefault();
    $ok.hide().removeClass('is-error');
    $empty.hide();

    var name = $.trim($('#name').val());
    var email = $.trim($('#email').val());
    var phone = $.trim($('#phone').val());
    var message = $.trim($('#message').val());
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || !message) {
      $empty.stop(true, true).slideDown(300).delay(3000).slideUp(300);
      return;
    }

    $btn.prop('disabled', true);
    $.ajax({
      url: $form.attr('action'),
      method: 'POST',
      dataType: 'json',
      headers: { 'Accept': 'application/json' },
      data: { name: name, email: email, phone: phone, message: message, _gotcha: $form.find('[name=_gotcha]').val() }
    }).done(function () {
      $ok.text($ok.data('success')).slideDown(300).delay(5000).slideUp(300);
      $form[0].reset();
    }).fail(function () {
      $ok.text('Something went wrong. Please try again, or email me directly at beneditc64@gmail.com.')
         .slideDown(300).delay(6000).slideUp(300);
    }).always(function () {
      $btn.prop('disabled', false);
    });
  });
});
