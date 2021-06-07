(function ($) {
    $.extend({
        FormDataInit: function (jsonData) {
            for (var key in jsonData) {
                var _ctrl = key, _value = jsonData[key];
                if (_value == "0001-01-01 00:00:00")
                    _value = "";
                if ($('[name=' + _ctrl + ']').is('label')) {
                    $('[name=' + _ctrl + ']').html(_value);
                }
                if ($('[name=' + _ctrl + ']').is('span')) {
                    $('[name=' + _ctrl + ']').html(_value);
                }
                if ($('[name=' + _ctrl + ']').is('div')) {
                    $('[name=' + _ctrl + ']').html(_value);
                }
                if ($('[name=' + _ctrl + ']').is('input')) {
                    if ($('[name=' + _ctrl + ']').is(':text')) {
                        $('[name=' + _ctrl + ']').val(_value);
                    }
                    if ($('[name=' + _ctrl + ']').attr('type') == 'date') {
                        $('[name=' + _ctrl + ']').val(Fulu.FormatDate(_value));
                    }
                    if ($('[name=' + _ctrl + ']').attr('type') == 'number') {
                        $('[name=' + _ctrl + ']').val(_value);
                    }
                    if ($('[name=' + _ctrl + ']').is(':hidden')) {
                        $('[name=' + _ctrl + ']').val(_value);
                    }
                    if ($('[name=' + _ctrl + ']').is(':radio')) {
                        $('[name=' + _ctrl + '][value="' + _value + '"]').attr('checked', 'checked');
                    }
                    if ($('[name=' + _ctrl + ']').is(':checkbox')) {
                        var str = _value.split(',')
                        for (j = 0; j < str.length; j++) {
                            $('[name=' + _ctrl + '][value="' + str[j] + '"]').attr('checked', 'checked');
                        }
                    }
                }
                if ($('[name=' + _ctrl + ']').is('select')) {
                    var _t="";
                    if ($.trim(_value) != '') _t = _value;
                    $('[name=' + _ctrl + ']').children('option[value="' + _t + '"]').attr('selected', 'selected');
                }
                if ($('[name=' + _ctrl + ']').is('textarea')) {
                    $('[name=' + _ctrl + ']').val(_value);
                }
            }
        }
    })
})(jQuery);

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            //if (!o[this.name].push) {
            //    o[this.name] = [o[this.name]];
            //}
            //o[this.name].push(this.value || '');
            o[this.name] = o[this.name] + ',' + (this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
