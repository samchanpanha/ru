$(document).ready(function() {

    if (getCookieCountry('remember_currency') !== null) {
        document.getElementById("exchangerate").querySelector(`option[value="${getCookieCountry('remember_currency')}"]`).selected = true;
    }

    function recentlyCheckedData($car_data, time) {
        if (!localStorage.getItem('10')) {
            localStorage.setItem('10', 1);
        }
        if (localStorage.length > 0) {
            localStorage.setItem(time, `<div class="checked-data">${$car_data}</div>`);
        }
    }

    $('.checked-data').on('click', function() {
        var today = new Date();
        var time = today.getTime();
        // console.log($(this).find('input').attr('data-id'));
        if (localStorage.length > 0) {
            let keys = Object.keys(localStorage);
            var removeKey = keys.map((k, v) => {
                // return localStorage.getItem(k);
                if (localStorage.getItem(k).search($(this).find('input').attr('data-id')) > 0) {
                    return localStorage.removeItem(k);
                } else {
                    return 0;
                }
            });
        }

        if (localStorage.length === 0) {
            localStorage.setItem('10', 1);
            recentlyCheckedData($(this).html(), time);
        } else {
            recentlyCheckedData($(this).html(), time);
        }
    });

    if (getCookieCountry('country_id') === null) {
        setCookieCountry('country_id', document.getElementById("country_list").value, 1);
    }

    /* close setCookieCountry  */
    function calculatePrice(_country_list_id = "") {
        const country_list_id = _country_list_id;
        let car_model_size = [];
        let car_data_cbm = [];
        let car_data_cbm_korea = [];
        let car_data_cbm_japan = [];
        let _data_cbm = [];
        let _model_size = 0;
        let car_model_names = "";
        let model_codess = "";
        var car_location = '';
        let lc = '';
        let discount = 0;
        let currency = "";
        let id = "";
        let boss_price = 0;
        let car_length=0;
        let car_height=0;
        let car_width=0;
        var result = 0;
        const base_url = $('#base_url').val();
        var total_sell_prices = 0;
        if (country_list_id !== '') {
            // execute simultaneous requests

            axios.all([
                    axios.get(base_url + 'api/Car_Datacbm/' + country_list_id)
                    // ,axios.get(base_url + 'api/Model_Size/index_get')
                ])
                .then(responseArr => {
                    //this will be executed only when all requests are complete
                    // console.log('Date created: ', responseArr[0].data);
                    // console.log('Date created: ', responseArr[1].data);
                    // car_model_size = responseArr[1].data;
                    car_data_cbm = responseArr[0].data;
                    car_data_cbm_korea = car_data_cbm.filter(c => c.from_stock === '114' ) === 0 ? [] : car_data_cbm.filter(c => c.from_stock === '114' );
                    car_data_cbm_japan = car_data_cbm.filter(c => c.from_stock === '108' ) === 0 ? [] : car_data_cbm.filter(c => c.from_stock === '108' );
                    if (country_list_id !== '' && car_data_cbm.length > 0 ) {
                        if ($('#exchangerate').val() === "USD") {
                        let car_models = $('input.car_model');
                           // console.log(cars);
                        $.map(car_models,(v,k) => {
                                result = 0;
                                lc = ($(v).attr('data-lc') === "South Korea") ? '114' : '108'; 
                                car_model_names = $(v).attr('data-model-name');
                                model_codess = $(v).attr('data-model-code');
                                discount = $(v).attr('data-discount');
                                var disc = ($(v).attr('data-dis') === '0' || $(v).attr('data-dis') === '' || $(v).attr('data-dis') === 0) ? 0 : parseInt($(v).attr('data-dis'));
                                boss_price = $(v).attr('data-boss_price');
                                currency = $(v).attr('data-currency');
                                car_location = $(v).attr('data-car-location');
                                car_length = $(v).attr('data-car_length');
                                car_width = $(v).attr('data-car_width');
                                car_height = $(v).attr('data-car_height');
                                // console.log(`${car_location}`);
                                id = $(v).attr('data-id');
                                $check_boss_price = $(v).attr('data-check-boss-price');
                                if(lc === '114'){
                                        _data_cbm = car_data_cbm_korea;
                                        _model_size = (car_length/100)*(car_width/100)*(car_height/100);//car_model_size.filter(szie => szie.car_model === car_model_names && szie.from_stock === '114' );
                                    }else{
                                        _data_cbm = car_data_cbm_japan;
                                        _model_size = (car_length/100)*(car_width/100)*(car_height/100);//car_model_size.filter(szie => szie.car_model === car_model_names && szie.car_model_code === model_codess && szie.from_stock === '108' );
                                    }
                                if( _data_cbm.length > 0  && _model_size > 0 )
                                {
                                if ($check_boss_price !== "ASK") {
                                    if (currency == _data_cbm[0].currency) {
                                        result = _model_size;
                                        if (result > 0) {
                                            currency = $('#exchangerate').val() === "USD" ? "$" : "¥";
                                            var total_freight = Number(_model_size) * Number(_data_cbm[0].cbm_price);
                                            var dis = discount === "" ? 0 : parseInt(Number(disc));
                                            var cbm_boss_price = parseInt(boss_price);
                                            var insurances = parseFloat(Number(_data_cbm[0].insurance));
                                            var inspection = parseFloat(Number(_data_cbm[0].inspection));
                                            var boss_price_type = 'CNF : ';

                                            if (insurances > 0 && inspection > 0) {
                                                total_sell_prices = parseFloat(Number(cbm_boss_price) + Number(total_freight) + Number(insurances) + Number(inspection) - Number(dis)).toFixed(0);
                                                boss_price_type = "CIF : ";
                                            } else if (insurances > 0 && inspection <= 0) {
                                                total_sell_prices = $currency + ' ' + parseFloat(Number(cbm_boss_price) + Number(total_freight) + Number(insurances) - Number(dis)).toFixed(0);
                                                boss_price_type = "CIF : ";
                                            } else if (inspection > 0 && insurances <= 0) {
                                                total_sell_prices = parseFloat(Number(cbm_boss_price) + Number(total_freight) + Number(inspection) - Number(dis)).toFixed(0);
                                                boss_price_type = "CNF : ";
                                            } else {
                                                total_sell_prices = parseFloat(Number(cbm_boss_price) + Number(total_freight) - Number(dis)).toFixed(0);
                                                boss_price_type = "CNF : ";
                                            }
                                            // console.log(`id= ${id} price-${cbm_boss_price}  total_freight-${total_freight}  insurances-${insurances}  inspection-${inspection} dis-${dis}`)
                                            $('.type' + id).text(`${boss_price_type}`);
                                            $('.c_nif_price' + id).text(`${currency}${ parseFloat(total_sell_prices).toFixed(0)}`);
                                            // console.log(`${boss_price_type}`);
                                            // console.log(`${total_sell_prices}`);
                                            $('.show-cnf').css('display', 'block');
                                        }
                                    } else {
                                        result = _model_size;
                                        if (result > 0) {

                                            currency = $('#exchangerate').val() === "USD" ? "$" : "¥";
                                            var jpy = parseFloat($('#xchange-rate-jpy').val());
                                            // alert(jpy)
                                            var total_freight = parseFloat(Number(_model_size) * Number(_data_cbm[0].cbm_price));
                                            var dis = discount === "" ? 0 : parseFloat(Number(disc) * Number(jpy)).toFixed(0);
                                            var cbm_boss_price = parseFloat(boss_price * jpy).toFixed(0);
                                            // console.log( 'id = '+id +' '+dis)
                                            var insurances = parseFloat(Number(car_data_cbm[0].insurance)).toFixed(2);
                                            var inspection = parseFloat(Number(car_data_cbm[0].inspection)).toFixed(2);
                                            var boss_price_type = 'CNF : ';
                                            if (insurances > 0 && inspection > 0) {
                                                total_sell_prices = Number(cbm_boss_price) + Number(total_freight) + Number(insurances) + Number(inspection) - Number(dis);
                                                boss_price_type = "CIF : ";
                                                // console.log(`id= ${id} bossprice-${boss_price} price-${cbm_boss_price}  total_freight-${total_freight}  insurances-${insurances}  inspection-${inspection} dis-${dis}`)
                                            } else if (insurances > 0 && inspection <= 0) {
                                                total_sell_prices = Number(cbm_boss_price) + Number(total_freight) + Number(insurances) - Number(dis);
                                                boss_price_type = "CIF : ";
                                            } else if (inspection > 0 && insurances <= 0) {
                                                total_sell_prices = Number(cbm_boss_price) + Number(total_freight) + Number(inspection) - Number(dis);
                                                boss_price_type = "CNF : ";
                                            } else {
                                                total_sell_prices = Number(cbm_boss_price) + Number(total_freight) - Number(dis);
                                                boss_price_type = "CNF : ";
                                            }

                                            $('.type' + id).html(`${boss_price_type}`);
                                            $('.c_nif_price' + id).html(`${currency}${ parseFloat(total_sell_prices).toFixed(0)}`);
                                            // console.log(`${boss_price_type}`);
                                            // console.log(`${total_sell_prices}`);
                                            $('.show-cnf').css('display', 'block');
                                        }
                                    }

                                }
                            }

                            });
                        } else {
                            $('.car_model').each((k, v) => {
                                id = $(v).attr('data-id');
                                $('.type' + id).text(`CNF`);
                                $('.c_nif_price' + id).text(`ASK`);
                                $('.show-cnf').css('display', 'block');
                            });
                        }

                        return true;
                    }

                }).catch(function(error) {
                    console.log(error)
                });
        }
        return false;
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
        var exchangerate_jpy = 0;
        var exchangerate_usd = 0;
        var discount_jpy = 0;
        var discount_usd = 0;
        $.ajax({
            url: url,
            method: "GET",
            data: {},
            dataType: "json",
            timeout: 10000,
            beforeSend: function() {
                if (loading) {
                    $('.loading').show();
                }
            },
            success: function(data) {
                // $('#result').html(data);
                if (data != "" && data.length > 0) {
                    try {
                        let jpy = data.filter(function(v) {
                            return v.from_currency === 'JPY' && v.to_currency === 'USD';
                        });
                        let usd = data.filter(function(v) {
                            return v.from_currency === 'USD' && v.to_currency === 'JPY';
                        });
                        // if(result.length > 0){
                        //   console.log('jpy-'+jpy[0].exchange_rate)
                        //   console.log('usd-'+usd[0].exchange_rate)
                        exchangerate_jpy = jpy.map((v) => v.exchange_rate); //0.009645
                        exchangerate_usd = usd.map((v) => v.exchange_rate); //103.678497
                        $('#xchange-rate-usd').val(exchangerate_usd);
                        $('#xchange-rate-jpy').val(exchangerate_jpy);
                        // console.log(jpy)
                        // alert(`jpy ${exchangerate_jpy}`);
                        // alert(`usd ${exchangerate_usd}`);
                        // alert(exchangerate);

                        if (currency_type === "USD") { // combobox = USD
                            $('.car_model').each((k, v) => {
                                $check_boss_price = $(v).attr('data-check-boss-price');
                                car_model_names = $(v).attr('data-model-name');
                                model_codess = $(v).attr('data-model-code');
                                discount = $(v).attr('data-discount');
                                dis = ($(v).attr('data-dis') === '0' || $(v).attr('data-dis') === '' || $(v).attr('data-dis') === 0) ? 0 : parseInt($(v).attr('data-dis'));
                                boss_price = $(v).attr('data-boss_price');
                                // currency = $(v).attr('data-currency');
                                id = $(v).attr('data-id');
                                if ($check_boss_price !== "ASK") {
                                    if ($(v).attr('data-currency') === "JPY") {
                                        currency = "$";
                                        totalUSD = parseFloat(boss_price * exchangerate_jpy).toFixed(0);
                                        discount_jpy = parseFloat(dis * exchangerate_jpy).toFixed(0);
                                        // $(v).attr('data-currency',"USD");
                                        $(v).attr('data-check-boss-price', currency + '' + totalUSD);
                                        if (discount !== "") {
                                            $('.boss_price' + id).html(`<del >${currency}${totalUSD}</del>`);
                                            $('.discount' + id).html(`${currency}${(totalUSD-discount_jpy)}`);
                                            // console.log(`id-${id} price-${totalUSD}  discount-${discount_jpy}  total-${totalJPY-discount_jpy}`)
                                            // console.log(convert_usd_to_jpy(dis,exchangerate))
                                            $('.discount' + id).css('font-size', '15px');
                                        } else {
                                            $('.boss_price' + id).html(`${currency}${totalUSD}`);
                                        }
                                    } else {
                                        currency = "$";
                                        if (discount !== "") {
                                            $('.boss_price' + id).html(`<del >${currency}${boss_price}</del>`);
                                            $('.discount' + id).html(`${currency}${(boss_price-dis)}`);
                                            $('.discount' + id).css('font-size', '15px');
                                        } else {
                                            $('.boss_price' + id).html(`${currency}${boss_price}`);
                                        }

                                    }
                                }
                            });
                        } else { // combobox = JPY

                            $('.car_model').each((k, v) => {
                                $check_boss_price = $(v).attr('data-check-boss-price');
                                car_model_names = $(v).attr('data-model-name');
                                model_codess = $(v).attr('data-model-code');
                                discount = $(v).attr('data-discount');
                                boss_price = $(v).attr('data-boss_price');
                                dis = ($(v).attr('data-dis') === '0' || $(v).attr('data-dis') === '' || $(v).attr('data-dis') === 0) ? 0 : parseInt($(v).attr('data-dis'));
                                // currency = $(v).attr('data-currency');
                                id = $(v).attr('data-id');
                                if ($check_boss_price !== "ASK") {

                                    if ($(v).attr('data-currency') === "USD") {
                                        currency = "¥";
                                        totalJPY = parseFloat(boss_price * exchangerate_usd).toFixed(0);
                                        discount_usd = parseFloat(dis * exchangerate_usd).toFixed(0);
                                        // $(v).attr('data-currency',"JPY");
                                        $(v).attr('data-check-boss-price', currency + '' + totalJPY);
                                        // $('.boss_price'+id).text(`${currency} ${totalJPY}`); 
                                        if (discount !== "") {
                                            $('.boss_price' + id).html(`<del >${currency}${totalJPY}</del>`);
                                            $('.discount' + id).html(`${currency}${(totalJPY-discount_usd)}`);
                                            // console.log(`id-${id} price-${totalJPY}  discount-${convert_usd_to_jpy(dis,exchangerate)}  total-${totalJPY-convert_usd_to_jpy(dis,exchangerate)}`)
                                            $('.discount' + id).css('font-size', '15px');
                                        } else {
                                            $('.boss_price' + id).html(`${currency}${boss_price}`);
                                        }
                                    } else {
                                        currency = "¥";
                                        // $('.boss_price'+id).text(`${currency} ${boss_price}`); 
                                        if (discount !== "") {
                                            $('.boss_price' + id).html(`<del >${currency}${boss_price}</del>`);
                                            $('.discount' + id).html(`${currency} ${(boss_price-dis)} `);
                                            // console.log(`id-${id} price-${boss_price}  discount-${dis} total-${boss_price-dis}`)
                                            $('.discount' + id).css('font-size', '15px');
                                        } else {
                                            $('.boss_price' + id).html(`${currency} ${boss_price}`);
                                        }
                                    }

                                }
                            });
                        }

                        // }
                        // if(currency_type === "USD"){
                        calculatePrice($('#selected-country').val());
                        // }
                        // $.map(result,(v,k)=>{
                        //     console.log(`from_currency = ${v.from_currency}  to_currency = ${v.to_currency}  exchange rate = ${v.exchange_rate}`)
                        // });
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
            },
            error: OnError
        });
    }

    function OnError(xhr, errorType, exception) {
        var responseText;
        // $("#dialog").html("");
        try {
            responseText = jQuery.parseJSON(xhr.responseText);
            console.log(responseText);
            $('.loading').fadeOut("slow");
            // $("#dialog").append("<div><b>" + errorType + " " + exception + "</b></div>");
            // $("#dialog").append("<div><u>Exception</u>:<br /><br />" + responseText.ExceptionType + "</div>");
            // $("#dialog").append("<div><u>StackTrace</u>:<br /><br />" + responseText.StackTrace + "</div>");
            // $("#dialog").append("<div><u>Message</u>:<br /><br />" + responseText.Message + "</div>");
        } catch (e) {
            responseText = xhr.responseText;
            console.log(responseText);
            // $("#dialog").html(responseText);
        }
        $('.loading').fadeOut("slow");
        // $("#dialog").dialog({
        //     title: "jQuery Exception Details",
        //     width: 700,
        //     buttons: {
        //         Close: function () {
        //             $(this).dialog('close');
        //         }
        //     }
        // });
    }

    $(document.body).on('change', "#exchangerate", function(e) {
        getExchangeRate($(this).val(), true);
        setCookieCountry('remember_currency', $(this).val(), 1);
    });

    function loadImageMain() {
        $('.thumb').each((k, v) => {
            let src = $(v).attr('data-src');
            // console.log(src);
            setTimeout(function() {
                $(v).attr('src', src);
            }, 1000)
        });
        // var $wrapper = $('.wrappers-item');
        //  $wrapper.find('.item').sort(function(a, b) {
        //          return +b.dataset.worth - a.dataset.worth;
        //      })
        //      .appendTo($wrapper);
    }
    // let images = document.querySelectorAll(".thumb");
    // new LazyLoad(images, {
    //     root: null,
    //     rootMargin: "0px",
    //     threshold: 0
    // });

    $('.btn-car-type').click(function (e) { 
        e.preventDefault();
        const a = this;
        const make = $(a).attr('data-make');
        const model = $(a).attr('data-model');
        const inputMake = $('input[name="car_make"]');
        const inputModel =$('input[name="car_model"]');
        inputMake.val(make);
        inputModel.val(model);
        $('#btn-submit').trigger('click');
    });

    function filterRecentlyCheckedData() {
        if (localStorage.length > 0) {
            if (localStorage.getItem('10')) {
                let keys = Object.keys(localStorage);
                let result = keys.sort((a, b) => b - a);
                var selected = 0;
                for (let key of result) {
                    // alert(`${key}: ${localStorage.getItem(key)}`);
                    if (key != "10" && key != "__paypal_storage__") {
                        if (selected < 8) {
                            $('#data-recently').append(`${localStorage.getItem(key)}`);
                            selected += 1;
                        }
                    }
                }
            }
        } else {
            const title_home = document.getElementsByClassName('title_home');
            title_home[0].style.display = "none";
        }
        if ($('#exchangerate').val() === "JPY") {
            getExchangeRate(getCookieCountry('remember_currency'));
        } else {
            getExchangeRate();
        }
        // console.log($('.car_model').length)
    }
    window.onload = filterRecentlyCheckedData();


});
// async function fetchData() {
//     // const responseLoad = await loadImageMain();
//     // const responseLoadData = await calculatePrice();
// }
// fetchData();
// // window.onload = fetchData();
//  window.onload = function() { // same as window.addEventListener('load', (event) => {
//     fetchData();
//  };

// if (document.readyState == 'loading') {
//   // still loading, wait for the event
//   document.addEventListener('DOMContentLoaded', fetchData);
// } else {
//   // DOM is ready!
//   fetchData();
// }

// });