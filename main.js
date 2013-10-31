var addCouponDiv = "";
var jsTreeConfig = "";

function newBigcommerceUI( $ ){

	if( $("#coupons-index").length ){
		$("<li><a style='color: #444' href='index.php?ToDo=CreateCoupon&inBulk=true' class='btn btn-secondary'>Bulk Create Coupon Codes</a></li>")
			.insertAfter( $("#IndexDeleteButton").parents("li:first") );

		chrome.extension.sendMessage( {msg: "hasCode"}, function(resp){
			if( resp.hasCodes == true ){
				window.location = "/admin/index.php?ToDo=createCoupon&withCodes=true";
			}
		});
	}

	if( window.location.href.indexOf("createCoupon") > -1
			&& window.location.href.indexOf("withCodes=true") > -1 ){

		chrome.extension.sendMessage( {msg: "getCode"}, function(resp){

			if( !resp.isStarted ){
				return false;
			}

			if( resp.left == 0 && !resp.code ){
				$("#coupon-form > h1").html( "No codes to import!");
				return false;
			}


			$("#coupon-form > h1").html( resp.left );

			if( resp.withCats ){
				$("[name='catids[]']").remove();
			}

			$.each( resp.configuredForm, function(i, val){

				if( val.name == "catids[]" ){
					$("<input type='text' name='catids[]' value='" + val.value + "' />").appendTo("#usedforcatdiv");
				}else{
					$("input[name='" + val.name + "']").val( val.value );
				}

				if( val.name == "couponexpires" ){
					$("#dc1").val( val.value );
				}

			});

			$("#couponcode").val( resp.code );
			$("#couponname").val( "IMPORTED: " + resp.code );

			$("[name='SaveButton1']").click();
	  });

	}

	if( window.location.href.indexOf("CreateCoupon") > -1
			&& window.location.href.indexOf("inBulk=true") > -1 ){

		$('<div class="field">' +
			'<label for="">Insert How Many?<span class="hide-visually">(Required)</span></label>' +
			'<div class="field-group"><input type="text" id="couponHowMany" class="field-small" value="" aria-required="true"></div>' +
		'</div>').insertAfter( $("#expiry-date").parents(".field:first") );

		$('<div class="field">' +
			'<label for="">Already have codes? Enter a list here' +
			'<div class="field-group"><textarea style="height: 150px" id="couponList"></textarea></div>' +
		'</div>').insertAfter( $("#couponHowMany").parents(".field:first") );

		$("#coupon-form").submit(function(){

			if( $("#couponHowMany").val().length == 0 && $("#couponList").val().length == 0 ){
				alert("Sorry! Either specify a number of codes or enter a list.");
				return false;
			}

			var codes = [];
			var code;

			if( $("#couponHowMany").val().length ){
				for(var i=0; i < parseInt($("#couponHowMany").val()); i++){

					code = "";
					for(var j=0; j < 15; j++){
						if( Math.random() > .3 ){
							code += String.fromCharCode( Math.floor( ( Math.random() * 26 ) + 65) );
						}else{
							code += Math.floor( (Math.random() * 9) + 1 );
						}
					}

					codes.push( code );
				}

				$("#couponList").val( codes.join("\n") );
			}

			var form = $(this).serializeArray();
			var withCats = $("[name='catids[]']").length ? true : false;

			if( $("#ProductSelect select").length ){
				var ids = [];
				$("#ProductSelect select").each(function(){
					ids.push( $(this).val() );
				});
				form.prodids = ids.join(",");
			}

			chrome.extension.sendMessage({ msg: "setCodes", codes: $("#couponList").val(), withCats: withCats, form: form });

			return true;
		});

	}

}

$(document).ready( function( $ ){
	newBigcommerceUI( $ );
});
