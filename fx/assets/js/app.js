(function($) {
    var rates = null;

    function converter(currency, target, value, rates) {
        return ((value / rates[currency]) * rates[target]).toFixed(2);
    }

    function calculate(e) {
        var fields = $('.js-currency'),
            target = typeof e === 'string' ? $('[name='+e+']') : $(e.target),
            value = target.val(),
            name = target.attr('name');

        for (var i = 0; i < fields.length; i++) {
            var field = $(fields[i]),
                fieldName = field.attr('name');
            if (name !== fieldName) {
                field.val(converter(name, field.attr('name'), value, rates));
            }
        }
    }

    $(document).ready(function() {
        $.get('http://api.fixer.io/latest', function(data) {
            rates = data.rates;
            rates.EUR = 1.0000;
            calculate('EUR');
        });
        $('.js-currency').change(calculate);
        $('.js-currency').keyup(calculate);

    });

})(jQuery);
