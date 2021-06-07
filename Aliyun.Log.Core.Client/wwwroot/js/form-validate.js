$.validator.setDefaults({
    highlight: function (e) {
        $(e).closest("div").removeClass("has-success").addClass("has-error")
    },
    success: function (e) {
        e.closest("div").removeClass("has-error").addClass("has-success")
    },
    errorElement: "span",
    errorPlacement: function (e, r) {
        e.appendTo(r.is(":radio") || r.is(":checkbox") ? r.parent().parent().parent() : r.parent())
    },
    submitHandler: function () {
        if (formSubmit)
            formSubmit();
    },
    errorClass: "help-block m-b-none",
    validClass: "help-block m-b-none"
}), $().ready(function () {
    $('form').validate();
});