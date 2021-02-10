
// è»Šä¸¡ç”»åƒä¸€è¦§ãƒ¬ã‚¤ã‚¢ã‚¦ãƒˆç”¨
$(window).load(function() {
    var oneimage_max_width = 70;
    var oneimage_max_height = 52.5;

    $('.gallery li').each(function(){
        var image = $(this).find("a").find("img");
        // æœ€åˆã« æ¨ªå¹…ãŒåŸºæº–ã‚ˆã‚Šå¤§ãã„ãªã‚‰èª¿æ•´
        if(image.width() > oneimage_max_width){
            image.width(oneimage_max_width);
            image.height('auto');
        }
        // æ¬¡ã«ç¸¦å¹…ãŒåŸºæº–ã‚ˆã‚Šå¤§ãã„ãªã‚‰èª¿æ•´
        if(image.height() > oneimage_max_height){
            image.height(oneimage_max_height);
            image.width('auto');
            image.css("text-align","center");
            var side_margin_size = (oneimage_max_width - image.width()) / 2 - 0.5;
            image.css("margin-left", side_margin_size);
            image.css("margin-right",side_margin_size);
        }
    });
    // è¡¨ç¤º
    $('.gallery li').css('visibility','visible');
});

$(document).ready(function(){

    cur_select = $("#exchangerate").val();
    baseurl = $("#baseurl").val();
    base_cur = cur_select;
    if (cur_select === "JPY") {

        url = baseurl+'home/get_ex_jpy_to_usd';
        $.ajax({
            url:url,
            method:"GET",
            data:{},
            dataType: "json",
            timeout: 10000,
            beforeSend: function () {
              // if(loading){
              //   $('.loading').show();
              // }
            },
            success:function(data){
                cur_boss_ori = $("#cur_boss_ori").val();
                boss_amount_ori = $("#boss_amount_ori").val();
                boss_not_min_dis = $("#boss_not_min_dis").val();
                amount_save = $("#amount_save").val();
                $("#cur_boss").val(base_cur);
                cur = "$";
                if(base_cur == "JPY" ){
                    cur = "¥";
                }
                
                if(base_cur != cur_boss_ori && boss_amount_ori > 0){
                    $.each(data, function( index, value ) {
                        exAmountNotMinus = parseFloat(value.exchange_rate) * parseFloat(boss_not_min_dis);
                        exAmount = parseFloat(value.exchange_rate) * parseFloat(boss_amount_ori);
                        exAmountSave = parseFloat(value.exchange_rate) * parseFloat(amount_save);
                        $("#boss_amount").val(exAmount.toFixed(0));
                        $('.current_boss').text(cur+exAmount.toFixed(0));
                        $('.ori_boss').text(cur+exAmountNotMinus.toFixed(0)); 
                        $('.dis_save').text(cur+exAmountSave.toFixed(0)); 
                        
                    });
                    
                    
                }else{
                    $("#boss_amount").val(boss_amount_ori);
                    $('.current_boss').text((boss_amount_ori > 0 ) ? cur+boss_amount_ori : 'ASK');
                    $('.ori_boss').text(cur+boss_not_min_dis); 
                    $('.dis_save').text(cur+amount_save); 
                }
                calc_total_price();
            }
          });
    }else{
        url = baseurl+'home/get_ex_usd_to_jpy';
        $.ajax({
            url:url,
            method:"GET",
            data:{},
            dataType: "json",
            timeout: 10000,
            beforeSend: function () {
              // if(loading){
              //   $('.loading').show();
              // }
            },
            success:function(data){
                cur_boss_ori = $("#cur_boss_ori").val();
                boss_amount_ori = $("#boss_amount_ori").val();
                boss_not_min_dis = $("#boss_not_min_dis").val();
                amount_save = $("#amount_save").val();
                $("#cur_boss").val(base_cur);
                cur = "$";
                if(base_cur == "JPY" ){
                    cur = "¥";
                }
                if(base_cur != cur_boss_ori && boss_amount_ori > 0){

                    $.each(data, function( index, value ) {
                        exAmountNotMinus = parseFloat(value.exchange_rate) * parseFloat(boss_not_min_dis);
                        exAmount = parseFloat(value.exchange_rate) * parseFloat(boss_amount_ori);
                        exAmountSave = parseFloat(value.exchange_rate) * parseFloat(amount_save);
                        amount = parseInt(exAmountNotMinus.toFixed(0)) - parseInt(exAmountSave.toFixed(0));
                        $("#boss_amount").val(amount);
                        $('.current_boss').text(cur+amount);
                        $('.ori_boss').text(cur+exAmountNotMinus.toFixed(0)); 
                        $('.dis_save').text(cur+exAmountSave.toFixed(0)); 
                        
                    });
                    
                    
                }else{
                    $("#boss_amount").val(boss_amount_ori);
                    $('.current_boss').text((boss_amount_ori > 0 ) ? cur+boss_amount_ori : 'ASK');
                    $('.ori_boss').text(cur+boss_not_min_dis); 
                    $('.dis_save').text(cur+amount_save); 
                }
                calc_total_price();
                
            }
          });
    }


    $('.form-login').hide();
    var country_list = $('#country_list').val();
    var model_names = $('#model_names').val();
    var car_price = $('#car_fob_price').val();
    $("#county_des").val(country_list);
    $.ajax({
        url: $('#base_url').val() + 'home/get_port_list/',
        type: "POST",

        data: { 'country_list': country_list, 'car_model_name': model_names },
        dataType: "json",
        success: function(data) {
            //console.log(data['car_model_size']);
            $('#port_list').empty();
            $.each(data['port_list'], function(key, value) {
                $('#port_list').append('<option value="' + value['port_name'] + '">' +
                    value['port_name'] +
                    '</option>');
            });
            calc_total_price();
        }
    });

    //inspection click
    // $('#inspection_price_check').on('click', function() {
    //     alert($(this).val());
    // });
    // $('#insurance_price_check').on('click', function() {
    //     alert($(this).val());
    // });
    //insurance click
});
function changeIframeUrl (amount){
    var insu = $('#insurance_price_check').is(":checked") ? Number($('#car_insu').val()) : 0 ;
    var insp = $('#inspection_price_check').is(":checked") ? Number($('#car_insp').val()) : 0 ;
    var discount =Number($('#car_total_discount').val()) > 0 ? Number($('#car_total_discount').val()) : 0 ;
    var freight = parseFloat($('#car_total_freight').val()).toFixed(2) > 0 ? parseFloat($('#car_total_freight').val()).toFixed(2) : 0 ;
    var url = $('#base_url').val().includes("https:") ? $('#base_url').val().replace('https:','') : $('#base_url').val().replace('http:','');
    return url+"paypal/index.php?stockid="+$('#car_stock_id').val()+"&insu="+insu+"&insp="+insp+"&amount="+amount+"&freight="+freight+"&discount="+discount;
};
$("#roro").prop("checked", true);
var mainImage = $("#mainImage");
$(".img-container img").hover(function() {
    var src = $(this).attr("data-img-big");
    $("#mainImage").attr("src", src);
});
$('.by_country').on('change', function() {
    var country_list = $('.by_country').val();
    var model_names = $('#model_names').val();
    var car_price = $('#car_fob_price').val();

    $.ajax({
        url: $('#base_url').val() + 'home/get_port_list/',
        type: "POST",

        data: { 'country_list': country_list, 'car_model_name': model_names },
        dataType: "json",
        success: function(data) {
            //console.log(data['car_model_size']);
            $('.get_port_list').empty();
            $('.get_port_list').html('<option>PORT</option>');
            $.each(data['port_list'], function(key, value) {
                $('.get_port_list').append('<option value="' + value['port_name'] + '">' +
                    value['port_name'] +
                    '</option>');
            });
        }
    });

});

$('.get_port_list').on('change', function() {
    var country_list = $('.by_country').val();
    var model_names = $('#model_names').val();
    var model_year = $('#model_year').val();
    var car_price = $('#car_fob_price').val();
    var port_name = $('.get_port_list').val();
    var car_stock = $('#car_stock_id').val();
     var car_location_en = $('#car_location_en').val();
    $.ajax({
        url: $('#base_url').val() + 'home/get_total_sell_price/',
        type: "POST",

        data: { 'country_list': country_list, 'car_model_name': model_names, 'port_name': port_name, 'car_stock': car_stock, 'model_year': model_year,'car_location_en':car_location_en },
        dataType: "json",
        success: function(data) {

            total_sell_price = parseFloat(data['total_sell_price']).toFixed(0);
            $('.freight_price').text(parseFloat(data['total_freight']).toFixed(0) + ' ' + data['currency_type']);
            if (data['inspection'] == "ASK") {
                inspection = "ASK";
                $('.inspection_price').html('<span>ASK</span>');
            } else {
                if (data['inspection'] > 0) {
                    inspection = parseFloat(data['inspection']).toFixed(0);;
                    $('.inspection_price').html('<input type="checkbox" value=' + inspection + ' id="inspection_price_check" checked="checked" onchange="un_check_inspection()">' + inspection + ' ' + data['currency_type']);
                } else {
                    inspection = "ASK";
                    $('.inspection_price').html('<span>ASK</span>')
                }
            }
            if (data['insurance'] == "ASK") {
                insurance = "ASK";
                $('.insurance_price').html('<span>ASK</span>');
            } else {
                if (data['insurance'] > 0) {
                    insurance = parseFloat(data['insurance']).toFixed(0);
                    $('.insurance_price').html('<input type="checkbox" value=' + insurance + ' id="insurance_price_check" checked="checked" onchange="un_check_insurance()">' + insurance + ' ' + data['currency_type']);
                } else {
                    insurance = "ASK";
                    $('.insurance_price').html('<span>ASK</span>')
                }
            }

            $('.discount_price').html('<input type="hidden" class="" value=' + parseFloat(data['car_discount']).toFixed(0) + '>' + parseFloat(data['car_discount']).toFixed(0) + ' ' + data['currency_type']);
            $('.total_price').html('<input type="hidden" class="total" value=' + total_sell_price + '>' + total_sell_price + ' ' + data['currency_type']);
        }
    });
});

$(document.body).on('change', "#exchangerate", function(e) {
    // getExchangeRate($(this).val(),true);
    cur_select = $("#exchangerate").val();
    baseurl = $("#baseurl").val();
    base_cur = $(this).val();
    if (cur_select === "JPY") {
        url = baseurl+'home/get_ex_jpy_to_usd';
        $.ajax({
            url:url,
            method:"GET",
            data:{},
            dataType: "json",
            timeout: 10000,
            beforeSend: function () {
              // if(loading){
              //   $('.loading').show();
              // }
            },
            success:function(data){
                cur_boss_ori = $("#cur_boss_ori").val();
                boss_amount_ori = $("#boss_amount_ori").val();
                boss_not_min_dis = $("#boss_not_min_dis").val();
                amount_save = $("#amount_save").val();
                $("#cur_boss").val(base_cur);
                cur = "$";
                if(base_cur == "JPY" ){
                    cur = "¥";
                }
                
                if(base_cur != cur_boss_ori){
                    $.each(data, function( index, value ) {
                        exAmountNotMinus = parseFloat(value.exchange_rate) * parseFloat(boss_not_min_dis);
                        exAmount = parseFloat(value.exchange_rate) * parseFloat(boss_amount_ori);
                        exAmountSave = parseFloat(value.exchange_rate) * parseFloat(amount_save);
                        $("#boss_amount").val(exAmount.toFixed(0));
                        $('.current_boss').text(cur+exAmount.toFixed(0));
                        $('.ori_boss').text(cur+exAmountNotMinus.toFixed(0)); 
                        $('.dis_save').text(cur+exAmountSave.toFixed(0)); 
                        
                    });
                    
                    
                }else{
                    $("#boss_amount").val(boss_amount_ori);
                    $('.current_boss').text(cur+boss_amount_ori);
                    $('.ori_boss').text(cur+boss_not_min_dis); 
                    $('.dis_save').text(cur+amount_save); 
                }
                calc_total_price();
            }
          });
    }else{
        url = baseurl+'home/get_ex_usd_to_jpy';
        $.ajax({
            url:url,
            method:"GET",
            data:{},
            dataType: "json",
            timeout: 10000,
            beforeSend: function () {
              // if(loading){
              //   $('.loading').show();
              // }
            },
            success:function(data){
                cur_boss_ori = $("#cur_boss_ori").val();
                boss_amount_ori = $("#boss_amount_ori").val();
                boss_not_min_dis = $("#boss_not_min_dis").val();
                amount_save = $("#amount_save").val();
                $("#cur_boss").val(base_cur);
                cur = "$";
                if(base_cur == "JPY" ){
                    cur = "¥";
                }
                if(base_cur != cur_boss_ori){
                    $.each(data, function( index, value ) {
                        exAmountNotMinus = parseFloat(value.exchange_rate) * parseFloat(boss_not_min_dis);
                        exAmount = parseFloat(value.exchange_rate) * parseFloat(boss_amount_ori);
                        exAmountSave = parseFloat(value.exchange_rate) * parseFloat(amount_save);
                        amount = parseInt(exAmountNotMinus.toFixed(0)) - parseInt(exAmountSave.toFixed(0));
                        $("#boss_amount").val(amount);
                        $('.current_boss').text(cur+amount.toFixed(0));
                        $('.ori_boss').text(cur+exAmountNotMinus.toFixed(0)); 
                        $('.dis_save').text(cur+exAmountSave.toFixed(0)); 
                        
                    });
                    
                    
                }else{
                    $("#boss_amount").val(boss_amount_ori);
                    $('.current_boss').text(cur+boss_amount_ori);
                    $('.ori_boss').text(cur+boss_not_min_dis); 
                    $('.dis_save').text(cur+amount_save); 
                }
                calc_total_price();
                
            }
          });
    }
});

$('#country_list').on('change', function() {
    var country_list = $('#country_list').val();
    var model_names = $('#model_names').val();
    var car_price = $('#car_fob_price').val();
    $('#county_des').val(country_list);

    $.ajax({
        url: $('#base_url').val() + 'home/get_port_list/',
        type: "POST",

        data: { 'country_list': country_list, 'car_model_name': model_names },
        dataType: "json",
        success: function(data) {
            //console.log(data['car_model_size']);
            $('#port_list').empty();
            // $('#port_list').html('<option>PORT</option>');
            $.each(data['port_list'], function(key, value) {
                $('#port_list').append('<option value="' + value['port_name'] + '">' +
                    value['port_name'] +
                    '</option>');
            });
            calc_total_price();
        }
    });

});

function show_cif() {
    var price_type = $("input[name='values[shipment]']:checked").val();
    if (price_type == 'container') {
        $(".total_prices").css('display', 'block');
        $(".total_price").css('display', 'none');
    } else {
        $(".total_prices").css('display', 'none');
        $(".total_price").css('display', 'block');
    }
}

function un_check_insurance() {
    var insurances = $("#insurance_price_check").val();
    var total = $('.total').val();
    var vehicle_price = $('.total_vehicle_price').val();

    
    if ($('#insurance_price_check').is(':checked')) {
        // CIF
        total_price = Number(total) + Number(insurances);
        $('.total_price').html('<input type="hidden" class="total" value=' + total_price + '> ' +check_inspection_and_insurance_show_total(total_price.toFixed(0), '$') );

        vehicle_price_total = Number(vehicle_price) + Number(insurances);
        //$('#vehicle_price').html('<input type="hidden" class="total_vehicle_price" value='+vehicle_price_total+'>'+vehicle_price_total);

    } else {
        total_price = Number(total) - Number(insurances);
        $('.total_price').html('<input type="hidden" class="total" value=' + total_price + '> ' + check_inspection_and_insurance_show_total(total_price.toFixed(0), '$'));

        vehicle_price_total = Number(vehicle_price) - Number(insurances);
        //$('#vehicle_price').html('<input type="hidden" class="total_vehicle_price" value='+vehicle_price_total+'>'+vehicle_price_total);

    }
}

function un_check_inspection() {
    var inspection = $("#inspection_price_check").val();
    var total = $('.total').val();
    var vehicle_price = $('.total_vehicle_price').val();
    //console.log(total);
    if ($('#inspection_price_check').is(':checked')) {

        total_prices = Number(total) + Number(inspection);
        $('.total_price').html('<input type="hidden" class="total" value=' + total_prices + '>' + check_inspection_and_insurance_show_total(total_prices.toFixed(0), '$'));

        vehicle_price_total = Number(vehicle_price) + Number(inspection);
        //$('#vehicle_price').html('<input type="hidden" class="total_vehicle_price" value='+vehicle_price_total+'>'+vehicle_price_total);

    } else {
        total_prices = Number(total) - Number(inspection);
        //console.log(total_prices);
        $('.total_price').html('<input type="hidden" class="total" value=' + total_prices + '>' + check_inspection_and_insurance_show_total(total_prices.toFixed(0), '$'));

        vehicle_price_total = Number(vehicle_price) - Number(inspection);
        //$('#vehicle_price').html('<input type="hidden" class="total_vehicle_price" value='+vehicle_price_total+'>'+vehicle_price_total);
    }
}

function check_inspection_and_insurance_show_total(price, currency) {
    let prices = '';
    // console.log(changeIframeUrl(price))
    if(typeof $('#paypal').attr('src') != "undefined"){
        $('#paypal').attr('src',changeIframeUrl(price));
    }
    if ($('#insurance_price_check').is(':checked') === true ||
        $('#inspection_price_check').is(':checked') === true) {
        if ($('#insurance_price_check').is(':checked') === true &&
            $('#inspection_price_check').is(':checked') === true) {
            prices =  '<span style="color:red;font-size:18px;font-weight:blod;">'+'<span style="margin:auto;color:#2296d2 !important;" > CIF </span>' +currency +price +'</span>';

            $("#total_prices_cal").val(price);
            $("#total_prices_cal_cur").val(currency);
            $("#total_prices_cal_type").val('CIF');
            return prices;
        } else {
            if ($('#insurance_price_check').is(':checked') === true && $('#inspection_price_check').is(':checked') === false) {
                prices =  '<span style="color:red;font-size:18px;font-weight:blod;">'+'<span style="margin:auto;color:#2296d2 !important;" > CIF </span>' +currency +price +'</span>' ;

                $("#total_prices_cal").val(price);
                $("#total_prices_cal_cur").val(currency);
                $("#total_prices_cal_type").val('CIF');
                return prices;
            } else {
                prices = '<span style="color:red;font-size:18px;font-weight:blod;">'+'<span style="margin:auto;color:#2296d2 !important;" > CNF </span>' +currency +price +'</span>' ;
                $("#total_prices_cal").val(price);
                $("#total_prices_cal_cur").val(currency);
                $("#total_prices_cal_type").val('CNF');
                return prices;
            }
        }
    } else {
        prices = '<span style="color:red;font-size:18px;font-weight:blod;">'+'<span style="margin:auto;color:#2296d2 !important;" > CNF </span>' +currency +price +'</span>' ;
        
        $("#total_prices_cal").val(price);
        $("#total_prices_cal_cur").val(currency);
        $("#total_prices_cal_type").val('CNF');
        return prices;
    }
    // return $('#insurance_price_check').is(':checked') == true ||
    //     $('#inspection_price_check').is(':checked') == true ? price + ' ' + currency : 'FOB ' + price + ' ' + currency;
}

function calc_total_price() {
    var country_list = $('#country_list').val();
    var model_names = $('#model_names').val();
    var car_chassis = $('#car_chassis').val();
    var car_price = $('#car_fob_price').val();
    var port_name = $('#port_list').val();
    var car_stock = $('#car_stock_id').val();
    var cur_boss = $('#cur_boss').val();
    var boss_amount = $('#boss_amount').val();
    var type_boss = $('#type_boss').val();
    var cur_boss_ori = $('#cur_boss_ori').val();
    var boss_amount_ori = $('#boss_amount_ori').val();
    var exchangerate = $('#exchangerate').val();
    var port_boss = $('#port_boss').val();
    var car_location_en = $('#car_location_en').val();
    $('#port_name').val(port_name);

    if ($('#vechicle-price').text().toLocaleLowerCase().indexOf("ask") != -1) {
        return;
    }
    if(type_boss == "CIF"){
        if(exchangerate == "USD"){
            $('.total_price').html('<span style="" >PORT : ' +port_boss +'</span><input type="hidden" class="total" value=' + boss_amount + '><span style="color:red;font-size:18px;font-weight:blod;">'+'<span style="margin:auto;color:#2296d2 !important;" > CIF </span>$' +boss_amount +'</span>');
            $("#total_prices_cal").val(boss_amount);
            $("#total_prices_cal_cur").val('USD');
        }else{
            $('.total_price').html('<span style="" >PORT : ' +port_boss +'</span><input type="hidden" class="total" value=' + boss_amount + '><span style="color:red;font-size:18px;font-weight:blod;">'+'<span style="margin:auto;color:#2296d2 !important;" > CIF </span>¥' +boss_amount +'</span>');
            $("#total_prices_cal").val(boss_amount);
            $("#total_prices_cal_cur").val('JPY');
        }
        
    }else{
        $.ajax({
            url: $('#base_url').val() + 'home/get_total_sell_price/',
            type: "POST",
            data: { 'country_list': country_list, 'car_model_name': model_names, 'port_name': port_name, 'car_stock': car_stock, 'car_chassis': car_chassis,'car_location_en':car_location_en },
            dataType: "json",
            success: function(data) {
                $('.total_price').html('<span>ASK</span>');
                // console.log(data['get_car_info'][0].car_location_en);
                var car_location_en = data['get_car_info'][0].car_location_en;
                var local = (car_location_en === "South Korea") ? '_korea' : '_japan'; 
                // console.log(data['cbm_price_info'+local][0] );
                if (typeof data['cbm_price_info'+local][0] == 'undefined' || data['cbm_price_info'+local][0] == '' || data['cbm_price_info'+local][0].length == 0) {
                    return;
                }
                if (typeof data['get_car_info'][0] == 'undefined' || data['get_car_info'][0] == '' || data['get_car_info'][0].length == 0) {
                    return;
                }
                // if (typeof data['model_size'][0] == 'undefined' || data['model_size'][0] == '' || data['model_size'][0].length == 0) {
                //     return;
                // }
                
                discounts = 0;
                cbm_price_info = data['cbm_price_info'+local][0];
                $.map(data.get_car_info, function(value,key) {
                    const model_size = (value.car_length/100)*(value.car_width/100)*(value.car_height/100);//Array.from(Object.keys(data['model_size'+local]), k => [`${k}`, data['model_size'+local][k]]);
                    if (model_size === 0) {
                        $('#inspection_price_check').attr({
                            onchange: ''
                        });
                        $('#insurance_price_check').attr({
                            onchange: ''
                        });
                        if ($('#inspection_price_check').is(':checked')) {
                            $('#inspection_price_check').prop('checked', false);
                        }
                        if ($('#insurance_price_check').is(':checked')) {
                            $('#insurance_price_check').prop('checked', false);
                        }
                        $('.total_price').html('<span>ASK</span>');
                        return !1;
                    }
                    total_freight = Number(model_size) * Number(cbm_price_info['cbm_price']);
  
                    if (cur_boss == cbm_price_info['currency']) {
                        $('.freight_price').text(parseFloat(total_freight).toFixed(0) + ' ' + value.currency);
                    } else { 
                        $('.freight_price').text('ASK');
                    }

                    if (value.car_discount == null || value.car_discount == '' || cur_boss != cbm_price_info['currency']) {
                        $('.discount_price').text('N/A');
                    } else {
                        discounts = parseInt(value.car_discount);
                        $('.discount_price').html('<input type="hidden" class="" value=' + parseFloat(value.car_discount).toFixed(0) + '>' + parseFloat(value.car_discount).toFixed(0) + ' ' + cur_boss);
                    }
                    // boss_price = parseInt(value.boss_price);
                    boss_price = parseFloat(boss_amount);
                    insurances = parseInt(cbm_price_info['insurance']);
                    inspection = parseInt(cbm_price_info['inspection']);
                    total_sell_price = parseFloat(boss_price + total_freight).toFixed(0);
                    total_sell_prices = parseFloat(boss_price + total_freight + insurances + inspection).toFixed(0);
                    check_insurece = Number(total_sell_price) + Number(insurances);
                    //check_inspection = total_sell_price + inspection;
                    check_inspection = Number(total_sell_price) + Number(inspection);
                    $('#car_total_freight').val(total_freight);
                    $('#car_total_discount').val(discounts);
                    $('#car_insu').val(insurances);
                    $('#car_insp').val(inspection);
                    var _currency = cur_boss == "USD" ? '$' : '¥';
                    if(inspection > 0){
                        $('#inspection_price_check').prop('checked', true);
                    }
                    if(insurances > 0){
                        $('#insurance_price_check').prop('checked', true);
                    }
                    // vehicle_price = parseFloat(boss_price + insurances + inspection).toFixed(0);

                    // vehicle_price_insurance_check = parseFloat(boss_price + insurances).toFixed(0);
                    // vehicle_price_inspection_check = parseFloat(boss_price + inspection).toFixed(0);

                    // let boss_price_type = value.boss_price_type == '' ? 'FOB' : value.boss_price_type;

                    if ($('#insurance_price_check').is(':checked') && $('#inspection_price_check').is(':checked')  && cur_boss == cbm_price_info['currency']) {
                        $('.total_price').html('<input type="hidden" class="total" value=' + total_sell_prices + '>' + check_inspection_and_insurance_show_total(total_sell_prices, _currency));
                        //$('#vehicle_price').text(vehicle_price);
                        //$('#vehicle_price').html('<input type="hidden" class="total_vehicle_price" value='+vehicle_price+'>'+vehicle_price);
                        
                        $('.inspection_price').html('<input type="checkbox" value=' + inspection + ' id="inspection_price_check" checked="checked" onchange="un_check_inspection()" data-inspection="'+inspection + ' ' + cur_boss+'">inspection');

                        $('.insurance_price').html('<input type="checkbox" value=' + insurances + ' id="insurance_price_check" checked="checked" onchange="un_check_insurance()" data-insurances="'+insurances + ' ' + cur_boss+'" >insurances');

                    } else if ($('#inspection_price_check').is(':checked')  && cur_boss == cbm_price_info['currency']) {
                        $('.total_price').html('<input type="hidden" class="total" value=' + check_inspection + '>' + check_inspection_and_insurance_show_total(check_inspection, _currency));
                        
                        // $('.inspection_price').html('<input type="checkbox" value=' + inspection + ' id="inspection_price_check" checked="checked" onchange="un_check_inspection()">' + inspection + ' ' + value.currency);

                        $('.insurance_price').html('<input type="checkbox" value=' + insurances + ' id="insurance_price_check" onchange="un_check_insurance()" data-insurances="'+insurances + ' ' + cur_boss+'" >insurances');

                        $('#vehicle_price').html('<input type="hidden" class="total_vehicle_price" value='+vehicle_price_inspection_check+'>'+vehicle_price_inspection_check);

                    } else if ($('#insurance_price_check').is(':checked')  && cur_boss == cbm_price_info['currency']) {
                        // $('.insurance_price').html('<input type="checkbox" value=' + insurances + ' id="insurance_price_check" checked="checked" onchange="un_check_insurance()">' + insurances + ' ' + value.currency);
                        
                        // $('.inspection_price').html('<input type="checkbox" value=' + inspection + ' id="inspection_price_check" onchange="un_check_inspection()">' + inspection + ' ' + value.currency);

                        $('.total_price').html('<input type="hidden" class="total" value=' + check_insurece + '>' + check_inspection_and_insurance_show_total(check_insurece, _currency));
                        //$('#vehicle_price').html('<input type="hidden" class="total_vehicle_price" value='+vehicle_price_insurance_check+'>'+vehicle_price_insurance_check);

                    } else if ( cur_boss == cbm_price_info['currency']) {
                        $('.inspection_price').html('<input type="checkbox" value=' + inspection + ' id="inspection_price_check" onchange="un_check_inspection()" data-inspection="'+inspection + ' ' + cur_boss+'" >inspection' );

                        $('.insurance_price').html('<input type="checkbox" value=' + insurances + ' id="insurance_price_check" onchange="un_check_insurance()" data-insurances="'+insurances + ' ' + cur_boss+'" >insurances' );

                        $('.total_price').html('<input type="hidden" class="total" value=' + total_sell_price + '>' + check_inspection_and_insurance_show_total(total_sell_price, _currency));
                        
                        //$('#vehicle_price').html('<input type="hidden" class="total_vehicle_price" value='+boss_price+'>'+boss_price);

                    } else if (cur_boss != cbm_price_info['currency']) {
                        // $('.inspection_price').html('<span>N/A</span>');
                        // $('.insurance_price').html('<span>N/A</span>');
                        $('.total_price').html('<span>ASK</span>');
                    } else {
                        
                        $('.total_price').text(check_inspection_and_insurance_show_total(boss_price,_currency ));
                    }
                });
            },
            error: function() {
                console.log('An error was encountered.');
            }
        });
    }

    
}

//block function phone
$('#country_list_phone').on('change', function() {
    var country_list = $('#country_list_phone').val();
    var model_names = $('#model_names_phone').val();

    $.ajax({
        url: $('#base_url').val() + 'home/get_port_list/',
        type: "POST",

        data: { 'country_list': country_list, 'car_model_name': model_names },
        dataType: "json",
        success: function(data) {

            $('#port_list_phone').empty();
            $('#port_list_phone').html('<option>PORT</option>');
            $.each(data['port_list'], function(key, value) {
                $('#port_list_phone').append('<option value="' + value['port_name'] + '">' +
                    value['port_name'] +
                    '</option>');
            });
        }
    });

});
//block function phone
$('#get_quot_big_screen').on('click', function() {
    country = $('#inquiry-country').val();
    phone = $('#phone').val();
    email = $('#email').val();
    cname = $('#cname').val();
    if(cname == ""){
        alert("please input your name for send Quot!");
        return false;
    }
    if(phone == ""){
        alert("please input your phone for send Quot!");
        return false;
    }
    if(email == ""){
        alert("please input your email for send Quot!");
        return false;
    }
    if(country == ""){
        alert("please choose country for send Quot!");
        return false;
    }

});
$('#free_quot_small').on('click', function() {
    countrys = $('#inquiry-countrys').val();
    phones = $('#phones').val();
    emails = $('#emails').val();
    cnames = $('#cnames').val();
    if(cnames == ""){
        alert("please input your name for send Quot!");
        return false;
    }
    if(phones == ""){
        alert("please input your phone for send Quot!");
        return false;
    }
    if(emails == ""){
        alert("please input your email for send Quot!");
        return false;
    }
    if(countrys == ""){
        alert("please choose country for send Quot!");
        return false;
    }

});
$('#loginbig').on('click', function() {
    login_id = $('#login_id').val();
    passsword = $('#passsword').val();
    if(login_id == ""){
        alert("please input ID OR Email to Log in!");
        return false;
    }
    if(passsword == ""){
        alert("please input password to Log in!");
        return false;
    }

});
$('#loginsmal').on('click', function() {
    login_ids = $('#login_ids').val();
    passswords = $('#passswords').val();
    if(login_ids == ""){
        alert("please input ID OR Email to Log in!");
        return false;
    }
    if(passswords == ""){
        alert("please input password to Log in!");
        return false;
    }

});

function show_cif_phone() {
    var price_type = $("input[name='values[shipment_phone]']:checked").val();
    if (price_type == 'container') {
        $(".total_prices_phone").css('display', 'block');
        $(".total_price_phone").css('display', 'none');
    } else {
        $(".total_prices_phone").css('display', 'none');
        $(".total_price_phone").css('display', 'block');
    }
}

function un_check_insurance_phone() {
    var insurances = $("#insurance_price_check_phone").val();
    var total = $('.total_phone').val();
    var vehicle_price = $('.total_vehicle_price_phone').val();
    //console.log(total);
    if ($('#insurance_price_check_phone').is(':checked')) {
        total_price = Number(total) + Number(insurances);
        $('.total_price_phone').html('<input type="hidden" class="total_phone" value=' + total_price + '>' + total_price + ' ' + '$');

        vehicle_price_total = Number(vehicle_price) + Number(insurances);
        //$('#vehicle_price_phone').html('<input type="hidden" class="total_vehicle_price_phone" value='+vehicle_price_total+'>'+vehicle_price_total);

    } else {
        total_price = Number(total) - Number(insurances);
        $('.total_price_phone').html('<input type="hidden" class="total_phone" value=' + total_price + '>C&F ' + total_price + ' ' + '$');

        vehicle_price_total = Number(vehicle_price) - Number(insurances);
        //$('#vehicle_price_phone').html('<input type="hidden" class="total_vehicle_price_phone" value='+vehicle_price_total+'>'+vehicle_price_total);
    }
}

function un_check_inspection_phone() {

    var inspection = $("#inspection_price_check_phone").val();
    var total = $('.total_phone').val();
    var vehicle_price = $('.total_vehicle_price_phone').val();
    //console.log(total);
    if ($('#inspection_price_check_phone').is(':checked')) {
        total_prices = Number(total) + Number(inspection);
        $('.total_price_phone').html('<input type="hidden" class="total_phone" value=' + total_prices + '>' + total_prices + ' ' + '$');

        vehicle_price_total = Number(vehicle_price) + Number(inspection);
        //$('#vehicle_price_phone').html('<input type="hidden" class="total_vehicle_price_phone" value='+vehicle_price_total+'>'+vehicle_price_total);

    } else {
        total_prices = Number(total) - Number(inspection);
        //console.log(total_prices);
        $('.total_price_phone').html('<input type="hidden" class="total_phone" value=' + total_prices + '>' + total_prices + ' ' + '$');

        vehicle_price_total = Number(vehicle_price) - Number(inspection);
        //$('#vehicle_price_phone').html('<input type="hidden" class="total_vehicle_price_phone" value='+vehicle_price_total+'>'+vehicle_price_total);
    }
}

function download_photo(stockId) {
    $.post("<?php echo base_url('home/download_all_photo');?>", {
            stock_id: stockId
        },
        function(data, status) {
            //alert(status);
        });
}


function calc_total_price_phone() {
    var country_list = $('#country_list_phone').val();
    var model_names = $('#model_names_phone').val();
    var car_chassis = $('#car_chassis_phone').val();
    var port_name = $('#port_list_phone').val();
    var car_stock = $('#car_stock_id_phone').val();

    $.ajax({
        url: $('#base_url').val() + 'home/get_total_sell_price/',
        type: "POST",

        data: { 'country_list': country_list, 'car_model_name': model_names, 'port_name': port_name, 'car_stock': car_stock, 'car_chassis': car_chassis },
        dataType: "json",
        success: function(data) {
            discounts = 0;
            cbm_price_info = data['cbm_price_info'][0];
            $.each(data.get_car_info, function(key, value) {
                total_freight = data.model_size * cbm_price_info['cbm_price'];

                if (value.currency == cbm_price_info['currency']) {
                    $('.freight_price_phone').text(parseFloat(total_freight).toFixed(0) + ' ' + value.currency);
                } else {
                    $('.freight_price_phone').text('ASK');
                }

                if (value.car_discount == null || value.car_discount == '' || value.currency != cbm_price_info['currency']) {
                    $('.discount_price_phone').text('N/A');
                } else {
                    discounts = parseInt(value.car_discount);
                    $('.discount_price_phone').html('<input type="hidden" class="" value=' + parseFloat(value.car_discount).toFixed(0) + '>' + parseFloat(value.car_discount).toFixed(0) + ' ' + value.currency);
                }
                boss_price = parseInt(value.boss_price);
                insurances = parseInt(cbm_price_info['insurance']);
                inspection = parseInt(cbm_price_info['inspection']);
                total_sell_price = parseFloat(boss_price + total_freight - discounts).toFixed(2);
                total_sell_prices = parseFloat(boss_price + total_freight + insurances + inspection - discounts).toFixed(2);
                check_insurece = Number(total_sell_price) + Number(insurances);
                //check_inspection = total_sell_price + inspection;
                check_inspection = Number(total_sell_price) + Number(inspection);

                vehicle_price = parseFloat(boss_price + insurances + inspection).toFixed(0);
                vehicle_price_insurance_check = parseFloat(boss_price + insurances).toFixed(0);
                vehicle_price_inspection_check = parseFloat(boss_price + inspection).toFixed(0);

                if ($('#insurance_price_check_phone').is(':checked') && $('#inspection_price_check_phone').is(':checked') && value.boss_price_type == 'FOB' && value.currency == cbm_price_info['currency']) {

                    $('.total_price_phone').html('<input type="hidden" class="total_phone" value=' + total_sell_prices + '>' + total_sell_prices + ' ' + value.currency);

                    //$('#vehicle_price_phone').html('<input type="hidden" class="total_vehicle_price_phone" value='+vehicle_price+'>'+vehicle_price);

                    $('.inspection_price_phone').html('<input type="checkbox" value=' + inspection + ' id="inspection_price_check_phone" checked="checked" onchange="un_check_inspection_phone()">' + inspection + ' ' + value.currency);

                    $('.insurance_price_phone').html('<input type="checkbox" value=' + insurances + ' id="insurance_price_check_phone" checked="checked" onchange="un_check_insurance_phone()">' + insurances + ' ' + value.currency);

                } else if ($('#inspection_price_check_phone').is(':checked') && value.boss_price_type == 'FOB' && value.currency == cbm_price_info['currency']) {

                    $('.total_price_phone').html('<input type="hidden" class="total_phone" value=' + check_inspection + '>' + check_inspection + ' ' + value.currency);

                    //$('#vehicle_price_phone').html('<input type="hidden" class="total_vehicle_price_phone" value='+vehicle_price_inspection_check+'>'+vehicle_price_inspection_check);

                    $('.inspection_price_phone').html('<input type="checkbox" value=' + inspection + ' id="inspection_price_check_phone" checked="checked" onchange="un_check_inspection_phone()">' + inspection + ' ' + value.currency);

                    $('.insurance_price_phone').html('<input type="checkbox" value=' + insurances + ' id="insurance_price_check_phone" onchange="un_check_insurance_phone()">' + insurances + ' ' + value.currency);

                } else if ($('#insurance_price_check_phone').is(':checked') && value.boss_price_type == 'FOB' && value.currency == cbm_price_info['currency']) {
                    $('.insurance_price_phone').html('<input type="checkbox" value=' + insurances + ' id="insurance_price_check_phone" checked="checked" onchange="un_check_insurance_phone()">' + insurances + ' ' + value.currency);

                    $('.inspection_price_phone').html('<input type="checkbox" value=' + inspection + ' id="inspection_price_check_phone" onchange="un_check_inspection_phone()">' + inspection + ' ' + value.currency);

                    $('.total_price_phone').html('<input type="hidden" class="total_phone" value=' + check_insurece + '>' + check_insurece + ' ' + value.currency);

                    //$('#vehicle_price_phone').html('<input type="hidden" class="total_vehicle_price_phone" value='+vehicle_price_insurance_check+'>'+vehicle_price_insurance_check);

                } else if (value.boss_price_type == 'FOB' && value.currency == cbm_price_info['currency']) {
                    $('.inspection_price_phone').html('<input type="checkbox" value=' + inspection + ' id="inspection_price_check_phone" onchange="un_check_inspection_phone()">' + inspection + ' ' + value.currency);

                    $('.insurance_price_phone').html('<input type="checkbox" value=' + insurances + ' id="insurance_price_check_phone" onchange="un_check_insurance_phone()">' + insurances + ' ' + value.currency);

                    $('.total_price_phone').html('<input type="hidden" class="total_phone" value=' + total_sell_price + '>' + total_sell_price + ' ' + value.currency);

                    //$('#vehicle_price_phone').html('<input type="hidden" class="total_vehicle_price_phone" value='+boss_price+'>'+boss_price);

                } else if (value.currency != cbm_price_info['currency']) {
                    $('.inspection_price_phone').html('<span>N/A</span>');
                    $('.insurance_price_phone').html('<span>N/A</span>');
                    $('.total_price_phone').html('<span>ASK</span>');
                } else {

                    $('.total_price_phone').text(boss_price + ' ' + value.currency);
                }
            });
        }
    });
}

// version phone
$('#car_make_v_phone').on('change', function() {
    var car_make = $('#car_make_v_phone').val();
    //alert(car_make);
    $.ajax({
        url: $('#base_url').val() + 'home/get_model_front_end/' + car_make,
        type: "GET",

        dataType: "json",
        success: function(data) {
            $('#car_model_v_phone').html('<option value="">SELECT MODEL</option>');
            $.each(data, function(key, value) {
                $('#car_model_v_phone').append('<option value="' + value.car_model_id + '">' +
                    value.car_model_name +
                    '</option>');
            });
        }
    });
});
// version big phone
$('#car_make_big_phone').on('change', function() {
    var car_make = $('#car_make_big_phone').val();
    //alert(car_make);
    $.ajax({
        url: $('#base_url').val() + 'home/get_model_front_end/' + car_make,
        type: "GET",
        dataType: "json",
        success: function(data) {
            $('#car_model_big_phone').html('<option value="">SELECT MODEL</option>');
            $.each(data, function(key, value) {
                $('#car_model_big_phone').append('<option value="' + value.car_model_id + '">' +
                    value.car_model_name +
                    '</option>');
            });
        }
    });
});
//capitalize all words of a string.
// function capitalizeWords(string) {
//     return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
// };
var newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search
var res = newURL.split("/");
document.getElementById('stock_id_no').value = res[6];

function replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}
var title = replaceAll(res[6], ".html", "");
var titles = title.split('-');
// $('#web-title').text(capitalizeWords(titles[0]) + ' ' + capitalizeWords(titles[1]) + ' ' + titles[2] + ' ' + ' Ru Japan | Worldwide Car Exporters.');

function clearInput() {
    $('#email').val("");
    $('#phone').val("");
    // $('#message').val("");
    // $('#captcha').val("");
    $('#error-captcha').html('');
    $('#error-name').html('');
    $('#error-email').html('');
    $('#error-phone').html('');
    $('#error-message').html('');
    $('#cname').val("");
    jQuery.get($('#base_url').val() + 'home/refresh', function(data) {
        jQuery('p#captcha-img').html(data);
    });
}

$("#cname").keyup(function() {
    var dInput = $('#cname').val() == '' ? 'Please field textbox !' : '';
    $('#error-name').html(dInput);
});
$("#email").keyup(function() {
    var dInput = $('#email').val() == '' ? 'Please field textbox !' : !$('#email').val().includes('@') ? 'Please enter a correct email.' : '';
    $('#error-email').html(dInput);
});
$("#phone").keyup(function() {
    var dInput = $('#phone').val() == '' ? 'Please field textbox !' : '';
    $('#error-phone').html(dInput);
});
$("#message").keyup(function() {
    var dInput = $('#message').val() == '' ? 'Please field textbox !' : '';
    $('#error-message').html(dInput);
});
$("#captcha").keyup(function() {
    var dInput = $('#captcha').val() == '' ? 'Please input Captcha word !' :
        check_captcha($('#captcha').val()) == '1' ? '<strong>Failed!</strong> Captcha does not match, please try again.' : '';
    $('#error-captcha').html(dInput);
});

$("#send").click(function(evt) {
    var stock_no = $('#stock_id_no').val();
    var customer_name = $('#cname').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var car_title = $('#car_title').val();
    // var customer_message = $('#message').val();
    var captcha = $('#captcha').val();
    var check_captchas = check_captcha(captcha);
    var url = $('#base_url').val() + 'home/insert_comment/'; //Please field textbox !
    data_arr = {
        'error-name': customer_name,
        'error-email': email,
        'error-phone': phone,
        'error-message': customer_message,
    };

    Object.keys(data_arr)
        .forEach(function eachKey(key) {
            if (data_arr[key] == '') {
                $('#' + key).html('Please field textbox !');
            }
            //console.log(key); // alerts key
            //console.log(data_arr[key]); // alerts value
        });
    const isEmpty = !Object.values(data_arr).every(x => (x !== null && x !== ''));
    if (isEmpty) {
        return;
    }
    // var sale_memo      = $('#').val();
    // var sale_no        = $('#').val();
    // home/insert_comment
    if (customer_name != "" && email != "" && phone != "" ) {
        $.ajax({
            url: url,
            type: "POST",

            data: {
                stock_id_no: stock_no,
                cname: customer_name,
                email: email,
                phone: phone,
                // message: customer_message,
                captcha: captcha,
                car_title:car_title
            },
            success: function(data) {
                $.confirm({
                    title: 'Successfully !',
                    content: 'Thank you for giving us the opportunity to serve you.One of our Sale Agent will get back to you shortly.',
                    type: 'success',
                    typeAnimated: true,
                    buttons: {
                        tryAgain: {
                            text: 'Thank You!',
                            btnClass: 'btn btn-blue',
                            action: function() {
                                clearInput();
                            }
                        },
                        close: function() {
                            clearInput();
                        }
                    }
                });
            }
        });
    }
});


jQuery('a.refresh-captcha').on('click', function() {
    jQuery.get($('#base_url').val() + 'home/refresh', function(data) {
        jQuery('p#captcha-img').html(data);
    });
});


function check_captcha(_captcha) {
    var jqXHR = $.ajax({
        url: $('#base_url').val() + 'home/check_captcha/',
        type: "POST",

        data: {
            captcha: _captcha
        },
        dataType: "json",
        async: false
    });
    return $.parseJSON(jqXHR.responseText).msg;
}

jQuery('a#tab-inquiry').on('click', function(e) {
    showTab($(this).attr('id'));
    $(this).addClass('active');
    $('a#tab-login').removeClass('active');
});
jQuery('a#tab-login').on('click', function(e) {
    showTab($(this).attr('id'));
    $(this).addClass('active');
    $('a#tab-inquiry').removeClass('active');
});
function goto(url)
{
     /* Act on the event */
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
          // document.write("mobile");
          console.log("mobile")
          $('html, body').animate({
                scrollTop: $(url).offset().top + 1200
            }, 'slow');
        }else{
          // document.write("not mobile");
            window.location=url;
        }
}
function showTab(clicked) { 
    if(clicked === 'tab-inquiry'){
            $('.car_detail_from').show();
            $('.form-login').hide();
    }else if(clicked === 'tab-login'){
            $('.car_detail_from').hide();
            $('.form-login').show();
    }
}
    
 // $(document.body).on('click', ".amazingslider-thumbnail-elem", function(e) {
 //      // alert($(this).attr('src'))
 //      var src = $(this).attr('data-slider');
 //      $('.amazingslider-img-elem-2').attr('src',src);
 //    });
// $(function(){
    function loadImageBigCarDetails() {

    }
    function loadImageSmallCarDetails() {
      
      $('.lozad').each((k,v)=>{
            let src = $(v).attr('data-src');
            // console.log(src);
            setTimeout(function() {
                $(v).attr('src',src);
            }, 2000)
        });
        $('.thumb').each((k,v)=>{
            let src = $(v).attr('data-src');
            // console.log(src);
            setTimeout(function() {
                $(v).css({'background-image':'url('+src+')'});
            }, 2000)
        });
    }

    function executeFunction(){
      // loadImageBigCarDetails();
      loadImageSmallCarDetails();
      // sortFunction();
    }
window.onload = executeFunction();

// // });


// });


//      (function(d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) return;
//     js = d.createElement(s); js.id = id;
//     js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2';
//     fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));
