<!DOCTYPE html>
<html lang="fr">
<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
<head>
<meta charset="utf-8" />
<title>Phillips Hue Light</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta content="" name="description" />
<meta content="" name="author" />

<link href="assets/plugins/boostrap-slider/css/slider.css" rel="stylesheet" type="text/css" />
<link href="assets/plugins/ios-switch/ios7-switch.css" rel="stylesheet" type="text/css" media="screen" charset="utf-8" />
<link href="assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="assets/plugins/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet" type="text/css" />
<link href="assets/plugins/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" />
<link href="assets/css/style.css" rel="stylesheet" type="text/css" />
<link href="assets/plugins/boostrap-slider/css/slider.css" rel="stylesheet" type="text/css" />
</head>
<body class="">

<div class="page-container row-fluid"> 
    <div class="page-content"> 
        <div class="content">  
            <div class="page-title">	
                <div id="titre">
                    <div style="display: inline-block; cursor: pointer; margin-left: 10px;" onClick="getLumieres();">
                        <i class="icon-repeat"></i>
                    </div>
                    <div style="display: inline-block; cursor: pointer; margin-left: 10px;" onClick="changeStates();">
                        <i class="icon-off"></i>
                    </div>
                </div>		
            </div>
            <div id="container">
                <div id="lights" class="row-fluid spacing-bottom 2col">	

                </div>
            </div> 
        </div>
    </div> 
</div>
<script src="assets/plugins/jquery-1.8.3.min.js" type="text/javascript"></script> 
<script src="assets/plugins/jquery-numberAnimate/jquery.animateNumbers.js" type="text/javascript"></script> 
<script src="assets/plugins/modernizr.js" type="text/javascript"></script>
<script src="assets/plugins/boostrap-slider/js/bootstrap-slider.js" type="text/javascript"></script>
<script src="assets/plugins/ios-switch/ios7-switch.js" type="text/javascript"></script>
<script src="assets/js/colors.js" type="text/javascript"></script>
<script src="assets/js/function.js" type="text/javascript"></script>
<script type="text/javascript">

var id_user = 'YOUR_USER_ID';

$.get("https://www.meethue.com/api/nupnp", '', function(data) {
    if(data.length == 0)
        console.log(data);
    else
        get_ip(data[0].internalipaddress);
});

</script>

</body>
</html>
