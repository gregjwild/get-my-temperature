$(() => {
    const $h1 = $("h1"),
          $zip = $('input[name="zip"]');
    
    $("form").on("submit", e => {
        e.preventDefault();
        const zipCode = $.trim($zip.val());
        $h1.text("Loading...");

        const request = $.ajax({
            url: `/${zipCode}`,
            dataType: "json"
        });

        request.done(data => $h1.html(`It is ${data.temperature} &#176; in zipCode.`));
        request.fail(() => $h1.text("Error"));
    });
});