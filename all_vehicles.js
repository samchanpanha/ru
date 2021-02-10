var check_f = {
    status:false
}
try {
    $("#pagination > a").each(function () {
        var g = window.location.href.slice(window.location.href.indexOf('?'));
        var href = $(this).attr('href');
        $(this).attr('href', href + g);
        // console.log($(this).attr('href'));
    });

    $("#frmcalc").submit(function (e) {
        e.preventDefault();
    });
} catch (err) {
    alert(err.message);
}


// loding img if not complate for show.
function getModel(car_make) {
    if (car_make != '') {
        $.ajax({
            url: $('#base_url').val() + 'home/get_model_front_end/' + car_make,
            type: "GET",
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            dataType: "json",
            success: function (data) {
                $('#car_model').html('<option value="">SELECT MODEL</option>');
                $.each(data, function (key, value) {
                    $('#car_model').append('<option value="' + value.car_model_id + '">' +
                        value.car_model_name +
                        '</option>');
                });
            }
        });
    } else {
        $('#car_model').empty();
        $('#car_model').html('<option value="">SELECT MODEL</option>');
    }

}
$('#sort_by').on('change', function () {
     $('.loading').show();
     $('input[name="sort_by"]').val($('#sort_by').val());
    $('#search_submit').trigger('click');
});
// $('#sort_by').change(
//     function(){
//          // $(this).closest('form').trigger('submit');
//           // or:
//          $('#submit').trigger('submit');
//          //    or:
//          // $('#formElementId').submit();
         
//     });
$('#country_list').on('change', function () {
    var country_list = $('#country_list').val();
    $.ajax({
        url: $('#base_url').val() + 'home/get_port_list/',
        type: "POST",
        cache: false,
        global: false,
        async: false,
        data: { 'country_list': country_list },
        dataType: "json",
        timeout: 10000,
        beforeSend: function () {
            $('.loading').show();
        },
        success: function (data) {
            //console.log(data['port_list']);
            $('#port_list').empty();
            $('#port_list').html('<option>PORT</option>');
            $.each(data['port_list'], function (key, value) {
                $('#port_list').append('<option value="' + value['port_name'] + '">' +
                    value['port_name'] +
                    '</option>');
            });
            $('.loading').fadeOut("slow");
        },
        error: OnError
    });

});

function calculate_all_vehicle(loading = false) {
    //$('#Calculate').on('click', function() {
    var country_list = $('#country_list').val();
    var port_name = $('#port_list').val();
    var chkstockid = [];
    let car_model_all_vehicles = Array.from(document.querySelectorAll('.car_model'));
    $(".chk_stockid").each(function () {
        chkstockid.push($(this).val());
    });
    var chk_chassis = [];
    $(".chk_chassis").each(function () {
        chk_chassis.push($(this).val());
    });
    if ($('#insurance_price').is(':checked') && $('#inspection_price').is(':checked')) {
        condition = 'yes';
    } else if ($('#insurance_price').is(':checked')) {
        condition = 'insurance';
    } else if ($('#inspection_price').is(':checked')) {
        condition = 'inspection';
    } else {
        condition = 'no';
    }
    if (country_list != "" && port_name !== "" && chk_chassis.length > 0 ) {
        setTimeout(() => {
            $.ajax({
                url: $('#base_url').val()+'api/get_total_sell_price_all_vehicles',
                type: "POST",
                dataType: "json",
                data: {
                    'country_list': country_list,
                    'port_name': port_name,
                    'car_stock': chkstockid,
                    'car_chassis': chk_chassis,
                    'condition': condition
                },
                beforeSend: function () {
                    if (loading) {
                        $('.loading').show();
                    }
                },
                success: function (data) {
                    if (typeof data['get_car_info'][0] == 'undefined' || data['get_car_info'][0] == '' || data['get_car_info'][0].length == 0 || data['get_car_info'] == null) {
                        $('.loading').fadeOut("slow");
                        return !1;
                    }
                   // console.log(result);
                $('.card-title b ').html('<span> ASK</span>');
                 console.log(data.get_car_info.length);
                $.map(data['get_car_info'], function (value,key ) {
                    var car_location_en = value.car_location_en;
                    var local = (car_location_en === "South Korea") ? '_korea' : '_japan'; 
                    // console.log(`${key} `)
                    // if (typeof data['cbm_price_info'+local][0] == 'undefined' || data['cbm_price_info'+local][0] == '' || data['cbm_price_info'+local][0].length == 0 || data['cbm_price_info'+local][0].size == 0 || data['cbm_price_info'+local][0] == null) {
                    //     $('.loading').fadeOut("slow");
                    //     return !1;
                    // }
                   
                    const model_size = (value.car_length/100)*(value.car_width/100)*(value.car_height/100);
                    // console.log(model_size)
                    if (model_size.length === 0) {
                        $('.loading').fadeOut("slow");
                        return !1;
                    }
                  
                    var discounts = 0;
                    var cbm_price_info = data['cbm_price_info'+local][0];
                    var total_freight = 0;
                    var boss_price = 0;//parseInt(value.boss_price)
                    var insurances = 0;
                    var inspection = 0;
                    var total_sell_price = 0;
                    var total_sell_prices = 0;
                    var check_insurece = 0;
                    var check_inspection = 0;
                    var vehicle_price = 0;
                    var vehicle_price_check_inspection = 0;
                    var vehicle_price_check_insurece = 0;
                    var status_usd_only = false;

                    let usd_currency = "";

                        // console.log(`${value.stock_id} = ${Number(data.model_size[value.stock_id])}`);
                    if(Number(model_size) > 0){
                            // console.log(`${key}`)
                        // console.log(`${Number(data.model_size[value.stock_id])}`)
                        total_freight = Number(model_size) * Number(cbm_price_info['cbm_price']);
                        // console.log(total_freight)
                        status_usd_only = $('.boss_price' + value.car_stock_id).text().toString().includes("$");
                        // console.table(data.model_size[value.stock_id]);
                        // console.log(`BOSS PRICE = ${$(car_model_all_vehicles[key]).attr('data-check-boss-price')}`)
                        if ($('#exchangerate').val() == "USD") { // combobox selected USD

                            if (value.currency == "USD")
                                boss_price = Number(value.boss_price);//parseInt(value.boss_price)
                            else
                                boss_price = parseFloat(Number(value.boss_price) * Number(value.jpy_to_usd)).toFixed(0);
                            // console.log(`for jpy id = ${value.car_stock_id}  boss_price = ${boss_price}`);
                            if (value.car_discount == null || value.car_discount == '') {
                                discounts = 0;
                            } else {
                                if (value.currency == "USD")
                                    discounts = Number(value.car_discount);
                                else
                                    discounts = parseFloat(Number(value.car_discount) * Number(value.jpy_to_usd)).toFixed(0);
                            }
                        }

                        insurances = Number(cbm_price_info['insurance']);
                        inspection = Number(cbm_price_info['inspection']);
                        total_sell_price = parseFloat(Number(boss_price) + Number(total_freight) - Number(discounts)).toFixed(0);
                        total_sell_prices = parseFloat(Number(boss_price) + Number(total_freight) + Number(insurances) + Number(inspection) - Number(discounts)).toFixed(0);

                        check_insurece = parseFloat(Number(boss_price) + Number(total_freight) + Number(insurances) - Number(discounts)).toFixed(0);
                        check_inspection = parseFloat(Number(boss_price) + Number(total_freight) + Number(inspection) - Number(discounts)).toFixed(0);
                        //check_insurece = parseFloat(total_sell_price + insurances).toFixed(0);
                        //check_inspection = parseFloat(total_sell_price + inspection).toFixed(0);
                        vehicle_price = parseFloat(Number(boss_price) + Number(insurances) + Number(inspection)).toFixed(0);
                        vehicle_price_check_inspection = parseFloat(Number(boss_price) + Number(inspection)).toFixed(0);
                        vehicle_price_check_insurece = parseFloat(Number(boss_price) + Number(insurances)).toFixed(0);
                        // console.log(`id = ${value.stock_id}  ${boss_price +" - "+ total_freight +" - "+ insurances +" - "+ inspection +" - "+ discounts}`)
                        boss_price_type = value.boss_price_type == '' ? 'FOB' : value.boss_price_type;
                        usd_currency = value.currency === "USD" ? "$" : "¥";

                        // console.log(`id = ${value.car_stock_id}  ${$('.boss_price'+value.car_stock_id).text().toString().includes("$") }`)
                        // console.log($('#vehicle_price' + value.car_stock_id).text());
                        if (status_usd_only) {
                            if ($('#vehicle_price' + value.car_stock_id).text() != "ASK" &&
                                $('#vehicle_price' + value.car_stock_id).text() != "" && status_usd_only) {
                                if ($('#insurance_price').is(':checked') && $('#inspection_price').is(':checked') && value.currency == cbm_price_info['currency']) {
                                    $('.total_price' + value.car_stock_id).text(usd_currency + total_sell_prices);
                                    //$('#vehicle_price'+value.car_stock_id).text(vehicle_price);

                                } else if ($('#inspection_price').is(':checked') && value.currency == cbm_price_info['currency']) {
                                    $('.total_price' + value.car_stock_id).text(usd_currency + check_inspection);
                                    //$('#vehicle_price'+value.car_stock_id).text(vehicle_price_check_inspection);

                                } else if ($('#insurance_price').is(':checked') && value.currency == cbm_price_info['currency']) {
                                    $('.total_price' + value.car_stock_id).text(usd_currency + check_insurece);
                                    //$('#vehicle_price'+value.car_stock_id).text(vehicle_price_check_insurece);
                                } else if (value.currency == cbm_price_info['currency']) {
                                    $('.total_price' + value.car_stock_id).text(usd_currency + total_sell_price);
                                    //$('#vehicle_price'+value.car_stock_id).text(boss_price);
                                } else if (value.currency != cbm_price_info['currency']) {
                                    if (status_usd_only) {
                                        usd_currency = "$";
                                        if ($('#insurance_price').is(':checked') && $('#inspection_price').is(':checked') && value.currency == "JPY") {
                                            $('.total_price' + value.car_stock_id).text(usd_currency + total_sell_prices);
                                            //$('#vehicle_price'+value.car_stock_id).text(vehicle_price);

                                        } else if ($('#inspection_price').is(':checked') && value.currency == "JPY") {
                                            $('.total_price' + value.car_stock_id).text(usd_currency + check_inspection);
                                            //$('#vehicle_price'+value.car_stock_id).text(vehicle_price_check_inspection);

                                        } else if ($('#insurance_price').is(':checked') && value.currency == "JPY") {
                                            $('.total_price' + value.car_stock_id).text(usd_currency + check_insurece);
                                            //$('#vehicle_price'+value.car_stock_id).text(vehicle_price_check_insurece);
                                        } else if (value.currency == "JPY") {
                                            $('.total_price' + value.car_stock_id).text(usd_currency + total_sell_price);
                                            //$('#vehicle_price'+value.car_stock_id).text(boss_price);
                                        }
                                    } else {
                                        $('.total_price' + value.car_stock_id).html('<span> ASK</span>');
                                    }

                                } else {
                                    $('.total_price' + value.car_stock_id).html('<span> ASK</span>');
                                    //$('.total_price'+value.car_stock_id).text(boss_price+' '+value.currency);
                                }
                            }
                        } else {
                            $('.total_price' + value.car_stock_id).html('<span> ASK</span>');
                            
                        }
                    }else{
                        $('.total_price' + value.car_stock_id).html('<span> ASK</span>');
                    }
            
                    });
                  $('.loading').fadeOut("slow");
                   
                },
                error: OnError
            });
        }, 1000);


    }

}

function convert_usd_to_jpy(boss_price, exchangerate) {
    return parseFloat(boss_price * exchangerate).toFixed(0);
}

function convert_jpy_to_usd(boss_price, exchangerate) {
    return parseFloat(boss_price * exchangerate).toFixed(0);
}

function getExchangeRate(currency_type = "USD", loading = false) {
    var url = $('#base_url').val() + 'api/exchangerate';
    var from_currency = currency_type === "USD" ? "JPY" : "USD";
    var to_currency = currency_type === "USD" ? "USD" : "JPY";
    var $check_boss_price = "";
    var car_model_names = "";
    var model_codess = "";
    var discount = "";
    var boss_price = "";
    var currency = "";
    var id = "";
    var totalJPY = 0;
    var totalUSD = 0;
    var exchangerate = 0;
    var dis = 0;
    var exchangerate_jpy = 0;
    var exchangerate_usd = 0;
    var discount_jpy = 0;
    var discount_usd = 0;
    if (loading) {
        $('.loading').show();
    }
    axios.all([
      axios.get(url),
    ])
    .then(dataeArr => {
      var  data = dataeArr[0].data;
    if (data.length > 0) {
        // console.log(data)
                try {
                    let jpy = data.filter(function (v) {
                        return v.from_currency === 'JPY' && v.to_currency === 'USD';
                    });
                    let usd = data.filter(function (v) {
                        return v.from_currency === 'USD' && v.to_currency === 'JPY';
                    });
                    exchangerate_jpy = jpy.map((v) => v.exchange_rate);//0.009645
                    exchangerate_usd = usd.map((v) => v.exchange_rate);//103.678497
                    $('#xchange-rate-usd').val(exchangerate_usd);
                    $('#xchange-rate-jpy').val(exchangerate_jpy);
                    if (currency_type === "USD") {
                        $('.car_model').each((k, v) => {
                            $check_boss_price = $(v).attr('data-check-boss-price');
                            car_model_names = $(v).attr('data-model-name');
                            model_codess = $(v).attr('data-model-code');
                            discount = $(v).attr('data-discount');
                            boss_price = $(v).attr('data-boss_price');
                            dis = $(v).attr('data-dis');
                            // currency = $(v).attr('data-currency');
                            id = $(v).attr('data-id');
                            if ($check_boss_price !== "ASK") {
                                if ($(v).attr('data-currency') === "JPY") {
                                    currency = "$";
                                    totalUSD = parseFloat(boss_price * exchangerate_jpy).toFixed(0);
                                    discount_jpy = parseFloat(dis * exchangerate_jpy).toFixed(0);
                                    // $(v).attr('data-currency',"USD");
                                    $(v).attr('data-check-boss-price', currency + ' ' + totalUSD);
                                    if (discount !== "") {
                                        $('.boss_price' + id).html(`<del >${currency}${totalUSD}</del> <span style="color: red;font-size: 16px;">${currency}${(totalUSD - discount_jpy)}</span>`);
                                        $('.discount' + id).html(`${currency}${(discount_jpy)}`);
                                        // console.log(`id-${id} price-${totalUSD}  discount-${discount_jpy}  total-${totalJPY-discount_jpy}`)
                                        // console.log(convert_usd_to_jpy(dis,exchangerate))
                                        $('.discount' + id).css('font-size', '15px');
                                    } else {
                                        $('.boss_price' + id).html(`${currency} ${totalUSD}`);
                                    }
                                } else {
                                    currency = "$";
                                    if (discount !== "") {
                                        $('.boss_price' + id).html(`<del >${currency}${boss_price}</del> <span style="color: red;font-size: 16px;">${currency}${(boss_price - dis)}</span>`);
                                        $('.discount' + id).html(`${currency}${(dis)}`);
                                        $('.discount' + id).css('font-size', '15px');
                                    } else {
                                        $('.boss_price' + id).html(`${currency}${boss_price}`);
                                    }

                                }
                            }
                        });
                    } else {
                        $('.car_model').map((v,k) => {
                            $check_boss_price = $(v).attr('data-check-boss-price');
                            car_model_names = $(v).attr('data-model-name');
                            model_codess = $(v).attr('data-model-code');
                            discount = $(v).attr('data-discount');
                            boss_price = $(v).attr('data-boss_price');
                            dis = $(v).attr('data-dis');
                            // currency = $(v).attr('data-currency');
                            id = $(v).attr('data-id');
                            if ($check_boss_price !== "ASK") {
                                if ($(v).attr('data-currency') === "USD") {
                                    currency = "¥";
                                    totalJPY = parseFloat(boss_price * exchangerate_usd).toFixed(0);
                                    discount_usd = parseFloat(dis * exchangerate_usd).toFixed(0);
                                    // $(v).attr('data-currency',"JPY");
                                    $(v).attr('data-check-boss-price', currency + ' ' + totalJPY);
                                    // $('.boss_price'+id).text(`${currency} ${totalJPY}`);
                                    if (discount !== "") {
                                        $('.boss_price' + id).html(`<del >${currency}${totalJPY}</del> <span style="color: red;font-size: 16px;">${currency}${(totalJPY - discount_usd)}</span>`);
                                        $('.discount' + id).html(`${currency}${(discount_usd)}`);
                                        // console.log(`id-${id} price-${totalJPY}  discount-${convert_usd_to_jpy(dis,exchangerate)}  total-${totalJPY-convert_usd_to_jpy(dis,exchangerate)}`)
                                        $('.discount' + id).css('font-size', '15px');
                                    } else {
                                        $('.boss_price' + id).html(`${currency}${boss_price}`);
                                    }
                                } else {
                                    currency = "¥";
                                    // $('.boss_price'+id).text(`${currency} ${boss_price}`);
                                    if (discount !== "") {
                                        $('.boss_price' + id).html(`<del >${currency}${boss_price}</del> <span style="color: red;font-size: 16px;">${currency}${(boss_price - dis)}</span>`);
                                        $('.discount' + id).html(`${currency} ${(dis)} `);
                                        // console.log(`id-${id} price-${boss_price}  discount-${dis} total-${boss_price-dis}`)
                                        $('.discount' + id).css('font-size', '15px');
                                    } else {
                                        $('.boss_price' + id).html(`${currency}${boss_price}`);
                                    }
                                }

                            }
                        });
                    }
                    if(!check_f.status){
                        calculatePrice($('#country_list').val());
                        check_f.status = true;
                    }
                    
                    if (loading) {
                        $('.loading').fadeOut("slow");
                    }

                } catch (error) {
                    if (loading) {
                        $('.loading').fadeOut("slow");
                    }
                    console.error(error);
                }

            } else {
                if (loading) {
                    $('.loading').fadeOut("slow");
                }
            }
    
    }).catch(function (error) {
        console.log(error.message)
    });  
    // $.ajax({
    //     url: url,
    //     method: "POST",
    //     data:{},
    //     dataType: "json",
    //     timeout: 1000,
    //     beforeSend: function () {
    //         if (loading) {
    //             $('.loading').show();
    //         }
    //     },
    //     success: function (data) {
    //         // $('#result').html(data);
            
    //     },
    //     error: OnError
    // });

}

function OnError(xhr, errorType, exception) {
    var dataeText;
    try {
        dataeText = jQuery.parseJSON(xhr.dataeText);
        console.log(dataeText);
        $('.loading').fadeOut("slow");
    } catch (e) {
        dataeText = xhr.dataeText;
        console.log(e.message);
    }
    $('.loading').fadeOut("slow");
}

// $('.lozad').each((k, v) => {
//     let src = $(v).attr('data-src');

//     // console.log(src);
//     setTimeout(function () {
//         $(v).attr('src', src);
//     }, 2000)
// });
// var co = 0 ;
// let images = document.querySelectorAll(".lozad");
// new LazyLoad(images, {
//      root: null,
//      rootMargin: "0px",
//      threshold: 0
// });

function calculatePrice(_country_list_id=""){
  const country_list_id = _country_list_id;
  let car_model_size = [];
  let car_data_cbm = [];
  let car_data_cbm_korea = [];
  let car_data_cbm_japan = [];
  let _data_cbm = [];
  let _model_size = 0;
  let car_model_names = "";
  let model_codess = "";
  let lc = '';
  let discount = 0;
  let currency ="";
  let id ="";
  let boss_price = 0;
  let car_length=0;
  let car_height=0;
  let car_width=0;
  var result = 0;
  const base_url = $('#base_url').val();
  var total_sell_prices = 0;
  if(country_list_id !== ''){
     // execute simultaneous requests

    axios.all([
      axios.get(base_url+'api/Car_Datacbm/'+country_list_id)
      //,axios.get(base_url+'api/Model_Size/index_get')
    ])
    .then(dataeArr => {
      //this will be executed only when all requests are complete
      // console.log('Date created: ', dataeArr[0].data);
      // console.log('Date created: ', dataeArr[1].data);
        // car_model_size = dataeArr[1].data;
        car_data_cbm = dataeArr[0].data;
        car_data_cbm_korea = car_data_cbm.filter(c => c.from_stock === '114' ) === 0 ? [] : car_data_cbm.filter(c => c.from_stock === '114' );
        car_data_cbm_japan = car_data_cbm.filter(c => c.from_stock === '108' ) === 0 ? [] : car_data_cbm.filter(c => c.from_stock === '108' );
        // console.log(`car_data_cbm_korea = ${car_data_cbm_korea.length}`)
        // console.log(`car_data_cbm_japan = ${car_data_cbm_japan.length}`)
       if( country_list_id !== '' && car_data_cbm.length > 0 ){// && car_model_size.length > 0
        if($('#exchangerate').val() === "USD"){
            let car_models = $('input.car_model');
        $.map(car_models,(v,k)=>{
            result = [];
            lc = ($(v).attr('data-lc') === "South Korea") ? '114' : '108'; 
            car_model_names = $(v).attr('data-model-name');
            model_codess = $(v).attr('data-model-code');
            discount = $(v).attr('data-discount');
            var disc = ($(v).attr('data-dis') === '0' || $(v).attr('data-dis') === '' || $(v).attr('data-dis') === 0 ) ? 0 : parseInt($(v).attr('data-dis'));
            boss_price = $(v).attr('data-boss_price');
            currency = $(v).attr('data-currency');
            car_length = $(v).attr('data-car_length');
            car_width = $(v).attr('data-car_width');
            car_height = $(v).attr('data-car_height');

            id = $(v).attr('data-id');
            $check_boss_price = $(v).attr('data-check-boss-price');
            if(lc === '114'){
                _data_cbm = car_data_cbm_korea;
                _model_size = (car_length/100)*(car_width/100)*(car_height/100);//car_model_size.filter(szie => szie.car_model === car_model_names && szie.from_stock === '114' );
            }else{
                _data_cbm = car_data_cbm_japan;
                _model_size = (car_length/100)*(car_width/100)*(car_height/100);//car_model_size.filter(szie => szie.car_model === car_model_names && szie.car_model_code === model_codess && szie.from_stock === '108' );
            }
                // console.log(`${id} ${_data_cbm}`);
                // console.log(`${id} ${_model_size}`);
            if( _data_cbm.length > 0  && _model_size > 0 )
            {
                    if($check_boss_price !== "ASK"){

                          if(currency == _data_cbm[0].currency){
                            result = _model_size;
                            if(result > 0){
                                 currency = $('#exchangerate').val() === "USD" ? "$" : "¥";
                                var total_freight = parseFloat(Number(result) * Number(_data_cbm[0].cbm_price));
                                var dis = discount === "" ? 0 : parseInt(Number(disc));
                                var cbm_boss_price = parseInt(boss_price);
                                var insurances = parseFloat(Number(_data_cbm[0].insurance));
                                var inspection = parseFloat(Number(_data_cbm[0].inspection));
                                var boss_price_type = 'CNF : ';

                                if(insurances > 0 && inspection > 0 ){
                                    total_sell_prices =  parseFloat(Number(cbm_boss_price) + Number(total_freight) + Number(insurances) + Number(inspection) - Number(dis)).toFixed(0);
                                    // boss_price_type = "CIF : ";
                                }else if (insurances > 0 && inspection <= 0) {
                                    total_sell_prices =$currency+' '+  parseFloat(Number(cbm_boss_price) + Number(total_freight) + Number(insurances)- Number(dis)).toFixed(0);
                                    // boss_price_type = "CIF : ";
                                }else if (inspection > 0 && insurances <= 0) {
                                    total_sell_prices = parseFloat(Number(cbm_boss_price) + Number(total_freight) + Number(inspection) - Number(dis)).toFixed(0);
                                    // boss_price_type = "CNF : ";
                                }else{
                                    total_sell_prices = parseFloat(Number(cbm_boss_price) + Number(total_freight) - Number(dis)).toFixed(0) ;
                                    // boss_price_type = "CNF : ";
                                }
                                // console.log(`usd = ${total_sell_prices}`)
                                // console.log(`id= ${id} price-${cbm_boss_price}  total_freight-${total_freight}  insurances-${insurances}  inspection-${inspection} dis-${dis}`)
                                // $('.type'+id).text(`${boss_price_type}`);
                                $('.total_price'+id).text(`${currency}${ parseFloat(total_sell_prices).toFixed(0)}`);
                                // console.log(`${boss_price_type}`);
                                // console.log(`${total_sell_prices}`);
                                // $('.show-cnf').css('display','block');
                             }
                         }else{
                          result = _model_size;
                                   if(result > 0){

                                currency = $('#exchangerate').val() === "USD" ? "$" : "¥";
                                var jpy = parseFloat($('#xchange-rate-jpy').val());
                                // alert(jpy)
                                var total_freight = parseFloat(Number(result)  * Number(_data_cbm[0].cbm_price));
                                var dis = discount === "" ? 0 : parseFloat(Number(disc) * Number(jpy)).toFixed(0);
                                var cbm_boss_price = parseFloat(boss_price * jpy).toFixed(0) ;
                                // console.log( 'id = '+id +' '+dis)
                                var insurances = parseFloat(Number(_data_cbm[0].insurance)).toFixed(2);
                                var inspection = parseFloat(Number(_data_cbm[0].inspection)).toFixed(2);
                                var boss_price_type = 'CNF : ';
                                if(insurances > 0 && inspection > 0 ){
                                    total_sell_prices = Number(cbm_boss_price)+Number(total_freight)+ Number(insurances)+Number(inspection)-Number(dis);
                                    // console.log(`jusd1 = ${total_sell_prices}`)
                                    // boss_price_type = "CIF : ";
                                    // console.log(`id= ${id} bossprice-${boss_price} price-${cbm_boss_price}  total_freight-${total_freight}  insurances-${insurances}  inspection-${inspection} dis-${dis}`)
                                }else if (insurances > 0 && inspection <= 0) {
                                    total_sell_prices =  Number(cbm_boss_price)+Number(total_freight)+ Number(insurances)-Number(dis);
                                    // console.log(`jusd2 = ${total_sell_prices}`)
                                    // boss_price_type = "CIF : ";
                                }else if (inspection > 0 && insurances <= 0) {
                                    total_sell_prices = Number(cbm_boss_price)+Number(total_freight)+Number(inspection)-Number(dis);
                                    // console.log(`jusd3 = ${total_sell_prices}`)
                                    // boss_price_type = "CNF : ";
                                }else{
                                    total_sell_prices = Number(cbm_boss_price)+Number(total_freight)-Number(dis);
                                    // console.log(`jus4 = ${total_sell_prices}`)
                                    // boss_price_type = "CNF : ";
                                }
                                // console.log(`jusd = ${total_sell_prices}`)
                                // $('.type'+id).html(`${boss_price_type}`);
                                $('.total_price'+id).html(`${currency}${ parseFloat(total_sell_prices).toFixed(0)}`);
                                // console.log(`${boss_price_type}`);
                                // console.log(`${total_sell_prices}`);
                                // $('.show-cnf').css('display','block');
                             }
                         }
                }
            }
  
      
            }); 
          }else{
            $('.car_model').each((k,v)=>{
                id = $(v).attr('data-id');
                // $('.type'+id).text(`CNF`);
                $('.total_price'+id).text(`ASK`);
                // $('.show-cnf').css('display','block');
            }); 
          }
          
           return true;
      }  

    }).catch(function (error) {
        console.log(error)
    });  
  }
  return false;
}
function loadImageAllVehicles() {

    // sortFunction();
    var $wrapper = $('.wrappers-item');
    $wrapper.find('.item').sort(function (a, b) {
        return +b.dataset.worth - a.dataset.worth;
    })
        .appendTo($wrapper);
}
window.onload = loadImageAllVehicles();

$(document).ready(function () {

    if (typeof jQuery !== 'undefined') {
    if (getCookieCountry('remember_currency') !== null) {
        document.getElementById("exchangerate").querySelector(`option[value="${getCookieCountry('remember_currency')}"]`).selected = true;
    }
    try {
    if($('#exchangerate').val() === "JPY"){
      getExchangeRate(getCookieCountry('remember_currency'));
    }else{
      getExchangeRate();
    }
        $(document).on('click', '#ck-inspection', function (event) {
            if ($('#inspection_price').is(':checked')) {
                $('input[name=inspection_price]').attr('checked', false);
                return;
            }
            $('#inspection_price').prop('checked', true);

        });
        $(document).on('click', '#ck-insurance', function (event) {
            if ($('#insurance_price').is(':checked')) {
                $('input[name=insurance_price]').attr('checked', false);
                return;
            }
            $('#insurance_price').prop('checked', true);
        });


    } catch (err) {
        console.log(err.message);
    }

    $(document).on('click', '#calculate', function (event) {
        calculate_all_vehicle(true);
    });


    $(document.body).on('change', "#exchangerate", function (e) {
        getExchangeRate($(this).val(), true);
        if ($(this).val() === "JPY") {
            $('.car_model').each((k, v) => {
                id = $(v).attr('data-id');
                $('.total_price' + id).html('<span> ASK</span>');
            });
        } else {
            if ($('#country_list').val() != "" && $('#port_list').val() != "") {
                $('#calculate').trigger('click');
            }
        }
        setCookieCountry('remember_currency', $(this).val(), 1);
    });
    }
});