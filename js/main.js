function validate(data)
{
	var check = true;
	//email
	var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
    if(!pattern.test(data.get("email")))
    {
    	check = false;
    }
	//description
	if(data.get("description").length>1000)
	{
		check = false;
	}
	return check;
}
$(document).ready(function(){
	//get enquiry types from server
	$.ajax({
		url:"http://504080.com/api/v1/directories/enquiry-types",
		type:"GET",
	}).done(function( data ) {
    	if(data)
    	{
    		var types=$.makeArray(data.data);
    		$("#enquiry_type").html("");
	    	$.map(types,function(val,i){
	    		$("#enquiry_type").append("<option value='"+val.name+"'>"+val.name+"</option>");
	    	});
    	}
	});

	//select other inquiry type
	$("#enquiry_type").change(function(){
		if($(this).val().toLowerCase().trim() == 'other')
			$("#other_type").show();
		else
			$("#other_type").hide();
	});

	//file upload
	$("#file_upload").click(function(){
		$("#file").click();
	});
	var _URL=window.URL;
	$("#file").change(function(){
		var MaxFileSize=5*1024*1024;
		var file, img, ImageWidth, ImageHeight, obj=$(this);
	    if ((file = this.files[0])) {
	    	var extension = file.name.replace(/^.*\./, '');
	    	img = new Image();
	        img.onload = function () {
	            ImageWidth = this.width;
	            ImageHeight = this.height;
	            if(ImageWidth<300 || ImageHeight<300)
	            {
	            	alert("Your image size is too small");
	            	obj.val("");
	            }
	        };
	        if(file.size>MaxFileSize)
			{
				alert("Your image filesize is too big");
				obj.val("");
			}
			else if(extension!="jpeg"&&extension!="jpg"&&extension!="png")
			{
				alert("Your file is not an image");
				obj.val("");
			}
	        else
	        {
	          	$("#file_upload").html("<span class='add-image-title'>"+file.name+"</span>");
	            	img.src = _URL.createObjectURL(file);
	        }
	    }
	});

	//description char counter
	$("#description").keyup(function(){
		var cnt = $(this).val().length;
		$("#descr_cnt").text(cnt);
	});

	//send form
	$("#form").submit(function(e){
		e.preventDefault();
		var formData = new FormData($(this)[0]);
		if(formData.get('enquiry_type').toLowerCase().trim()=="other")
		{
			formData.set('enquiry_type', formData.get('other_type'));
		}
		formData.delete("other_type");
		if(validate(formData))
		{
			$.ajax({
				url:"http://504080.com/api/v1/support",
				data:formData,
				type:"POST",
				processData: false,
	    		contentType: false,
			    success:function(data, textStatus, jqXHR){
			        alert("Success");
			    },
			    error: function(jqXHR, textStatus, errorThrown){
			        alert("Fail "+jqXHR.status);  
			    }
	  		});
  		}
  		else
  		{
  			alert("You don't fill in the required fields");
  		}
	});
});