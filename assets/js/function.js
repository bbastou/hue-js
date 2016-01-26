function get_ip(param) {
    ip_adresse = param;
    getLumieres();
};
    
    
function load_slider(){
    $('.slider-element').slider().on('slideStop', function(ev){
        var newVal = $(this).data('slider').getValue();
        changeBri($(this).attr('id').substring(6),newVal);
    });
}

function load_switch(id_switch, on){
var Switch = require('ios7-switch')
        , checkbox = document.querySelector('#switch'+id_switch)
        , mySwitch = new Switch(checkbox);
    if(on)
    mySwitch.toggle();
      mySwitch.el.addEventListener('click', function(e){
        e.preventDefault();
          changeState(id_switch, mySwitch);
        
      }, false);

}
    
function getLumieres()
{ 
    $.ajax({
        url: 'http://'+ip_adresse+'/api/'+id_user+'/lights',
        type: 'GET',
        success: function(arrayLum) {
            $("#lights").html("");
            jQuery.each(arrayLum, function(index, value) {
                
                percentage = ((value.state.bri/254)*100).toFixed(0);

                arrayColor = getRGBFromXYAndBrightness(value.state.xy[0], value.state.xy[1], value.state.bri);

                style = "background-color: rgb("+arrayColor[0]+", "+arrayColor[1]+", "+arrayColor[2]+");";
                      
                html_bouton = '<div class="slide-primary"><input type="checkbox" id="switch'+index+'" class="ios"  checked="checked" /></div>';
                
                html_slider = '<div class="slider sucess"><input id="slider'+index+'" type="text" class="slider-element" value="" data-slider-max="100" data-slider-step="1" data-slider-value="'+percentage+'" data-slider-orientation="horizontal" data-slider-selection="after" data-slider-tooltip="hide" /></div>';
                html_bright = '<div class="heading"><span class="animate-number" data-value="'+percentage+'" data-animation-duration="1200">0</span>%</div>';
                
                $("#lights").append('<div id="light'+index+'" class="span3 "><div style="'+style+'" class="tiles added-margin"><div class="tiles-body"><div class="controller">'+html_bouton+'</div><div class="tiles-title">'+value.name+'</div>	'+html_bright+html_slider+'</div></div></div>');
                load_switch(index, value.state.on);
            });
            load_slider();
        	$('.animate-number').each(function(){
        		 $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-animation-duration")));	
        	})
        }
    });
}  
    
function changeStates()
{ 
    $.ajax({
        url: 'http://'+ip_adresse+'/api/'+id_user+'/groups/0/action',
        type: 'PUT',
        data: '{"on": false}',
        success: function() {
            $(".ios-switch").removeClass("on");
        }
    });
} 
 

function changeState(id, mySwitch)
{   
    $.ajax({
        url: 'http://'+ip_adresse+'/api/'+id_user+'/lights/'+id+'/',
        type: 'GET',
        success: function(value) {  
            var bright = $("#light"+id+" .animate-number").attr("data-value");
            bright = (parseInt(bright)*254/100).toFixed(0);
            if(value.state.reachable)
                $.ajax({
                    url: 'http://'+ip_adresse+'/api/'+id_user+'/lights/'+id+'/state',
                    type: 'PUT',
                    data: '{"on": '+!value.state.on+', "bri" : '+bright+'}',
                    success: function() {
                        mySwitch.toggle();
                    }
                });
            else {
                $("#light"+id+" .handle").css('background-color', '#D7D7D7');
            }
                
        }
    });
}
    
function changeBri(id, bright)
{ 
    $.ajax({
        url: 'http://'+ip_adresse+'/api/'+id_user+'/lights/'+id+'/',
        type: 'GET',
        success: function(value) {            
            if(value.state.reachable)
                $.ajax({
                    url: 'http://'+ip_adresse+'/api/'+id_user+'/lights/'+id+'/state',
                    type: 'PUT',
                    data: '{"bri": '+(parseInt(bright)*254/100).toFixed(0)+'}', 
                    success: function() { 
                        var selector = $("#light"+id+" .animate-number");
                        selector.attr("data-value", bright);
                        selector.animateNumbers(selector.attr("data-value"), true, parseInt(selector.attr("data-animation-duration")));
        	       }  
                });
        }
    });
}