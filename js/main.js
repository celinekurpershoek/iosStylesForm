/**
 * Formulier opzet, geschreven door celine
 * gebruik: kopieren uit deze map naar project.
 * vervolgens beslissen welke methodes je nodig hebt. boven in staan de methodes geschreven, in de validate functie - rules
 * kan je ze koppelen.
 *
 * koppelen: Gebruik de name van het input als selector(form_homenumber) en set de methode naam(onlyNumbers) op true
 * form_homenumber: {
			onlyNumbers: true
	}
 */
var settings = {
	form:'#formOne',
	errorClass:'errorLabel',
	validClass:'valid',
	requiredRadioValue:'yes'
};
jQuery.validator.messages.required = ""; // dont show error messages
jQuery.validator.addMethod("dutchZipcode", function (value, element) {
	var nonzipCode = /[~`'",.<>@#$%^&*()-+!]*$/g,
		zipcode = value.replace(nonzipCode, '').replace(/ /g, '');
	$('#' + element.id).val(zipcode);

	return /^\d{4} ?[a-zA-Z]{2}$/i.test(zipcode);
}, "");
jQuery.validator.addMethod("bankAccountCheck", function (value) {
	var bValid = false;
	var val = value;
	//length = 9 11-proof
	if ((val.length == 9 || val.length == 10) && !isNaN(val)) {
		var sum = 0;
		var status = 0;
		for (var i = 1; i <= val.length; i++) {
			sum += val.substr(-i, 1) * i;
		}
		//if $status == 1 then it is a correct bankaccount number
		status = (!(sum % 11)) ? 1 : 0;
		return status == 1;
	}
	else {
		return (val.length >= 4 && val.length <= 7) && !isNaN(val) && val.substr(0, 1) != "0";
	}
}, "");
jQuery.validator.addMethod("onlyNumbers", function (value, element) {
	var nonNumbers = /\D/g;
	var newValue = value.replace(nonNumbers, '');
	$('#' + element.id).val(newValue);

	return true;
}, "");
jQuery.validator.addMethod("phonenumber", function (value, element) {
	var nonNumbers = /\D/g;
	var newValue = value.replace(nonNumbers, '');
	$('#' + element.id).val(newValue);

	return newValue.length >= 10;
}, "");
jQuery.validator.addMethod("requiredRadioValue", function (value, element, params) {
	var selectedValue = $('input:radio[name=' + element.name + ']:checked').val();
	return (typeof(params) == 'array') ? (params.indexOf(selectedValue) != -1) : selectedValue == params;
}, "");
jQuery.validator.addMethod("checkDonationAmount", function (value, element, data) {
	//check if value of input is higher dan latest option with set value
	var nonNumbers = /[A-Za-z]/g;
	var newValue = value.replace(nonNumbers, '');
	newValue = value.replace(',', '.');
	$('#' + element.id).val(newValue);
	return value > parseInt($(element).attr('data-value'));
}, "");
jQuery.validator.addMethod("initialsChecker", function (value, element) {
	var sCInitials = value.replace(/\d/g, '').replace(/ /g, '.');
	if (value != undefined && value != '') {
		$(element).val(sCInitials);
		return value;
	} else {
		return false;
	}
}, "");
jQuery.validator.addMethod("birthdayCheck", function (value, element) {
	//2013-06-13
	var d = new Date();

	var month = d.getMonth()+1;
	var day = d.getDate();
	var year = d.getFullYear();

	var currentDate = year + '-' +
		(month<10 ? '0' : '') + month + '-' +
		(day<10 ? '0' : '') + day;
	var legalAge = (year-18) + '-' +
		(month<10 ? '0' : '') + month + '-' +
		(day<10 ? '0' : '') + day;

	return(Date.parse(value) <= Date.parse(legalAge))
}, "");

var validator = $(settings.form).validate({
	focusInvalid:false,
	rules:{
		//normal way of adding rules using the name of an input
		form_homenumber:{
			onlyNumbers:true
		},
		form_zipcode:{
			dutchZipcode:true
		},
		form_bankAccount:{
			required:true,
			bankAccountCheck:true
		},
		form_letters:{
			initialsChecker:true
		},
		form_birthday:{
			required:true,
			birthdayCheck:true,
			date: false
		}
	},
	// add and removal error class
	highlight:function (element, errorClass, validClass) {
		$(element).addClass(errorClass).removeClass(validClass);
		$(element).closest('li').find("> label").addClass(settings.errorClass);
	},
	unhighlight:function (element, errorClass, validClass) {
		$(element).removeClass(errorClass).addClass(validClass);
		$(element).closest('li').find("> label").removeClass(settings.errorClass);
	},
	errorPlacement:function (error, element) {
		//geen error messages of extra labels
	},
	invalidHandler:function () {
		//scroll to first invalid field
		var el = $(validator.invalidElements()[0]).parent();
		var parentOffset = el[0].offsetTop;
		$("html:not(:animated),body:not(:animated)")
			.animate({ scrollTop:parentOffset - 10}, 500);
	}
});
//add rules on classname:
$(".requiredRadioValue").each(function () {
	$(this).rules("add", {
		//set an value in de settings at the top and check if the checked radio has that value.
		required:true,
		requiredRadioValue:settings.requiredRadioValue
	});
});
$(".onlyNumbers").rules("add", {
	onlyNumbers:true
});
$(".dependingOn").rules("add", {
	required:{
		depends:function () {
			return $(".depend").val() == "";
		}
	},
	phonenumber:{
		depends:function () {
			return $(".depend").val() == "";
		}
	}
});
$(".depend").rules("add", {
	required:{
		depends:function () {
			return $(".dependingOn").val() == "";
		}
	},
	phonenumber:{
		depends:function () {
			return $(".dependingOn").val() == "";
		}
	}
});
$('.differentInput').rules("add", {
	checkDonationAmount:{
		depends:function () {
			return $('.differentInput').is(':visible');
		}
	}
});

/** niet validation rules **/
$('.donation input').bind('click', function (e) {
	if ($(this)[0].checked && $(this).hasClass('different')) {
		$(this).closest('li').find('.differentInput').removeClass('hidden');
	} else {
		$(this).closest('li').find('.differentInput').addClass('hidden');
	}

});
$('#reset').bind('click', function () {
	$('label').removeClass('errorLabel')
	$('form').data('validator').resetForm();
});