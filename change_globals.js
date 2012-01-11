$(document).ready(function(){

	var data = new Object();

	// Fetch the saved rules
	$.ajax({
		type: "GET",
		url: "globals.json",
		dataType: "json",
		async: false,
		success: function(data) {
            for (var i in data)
            {
                var template =  "<div class=\"source-url\">" + data[i].url + "</div>";
                template += "<div class=\"default-image\">" + data[i].image + "</div>";
                template += "<div><span class=\"alt-image\">" + data[i].altImage + "</span> (<span class=\"alt-image-tag\">" + data[i].altImageTag+ "</span>)</div>";
                template += "<div class=\"formatted-source\">" + data[i].output.replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</div>";
                
                
                $("#source-wrapper").append("<h3><a href=\"#\">" + data[i].url + "</a></h3>")
                $("#source-wrapper").append("<div>" + template + "</div>");
             }
		},
		error: function() {
			alert("Failed to open saved file.")
		},
        complete: function()
        {
            $("#source-wrapper").accordion({ collapsible: true,
                                             active: false  });
        }
	});
    

    $("input,textarea").live("focus",function(){
        if ($(this).val() == $(this)[0].defaultValue)
        {
            $(this).val("");
            $(this).css("color","black");
        }
    })
    
    $("input,textarea").live("blur",function(){
        if ($(this).val() == "")
        {
            $(this).val($(this)[0].defaultValue);
            $(this).css("color","gray");
        }
    })

    $("#new-source").click(function(){
        $("#source-template")
            .clone()
            .attr("id","new-source-data")
            .dialog({
                width:420
            });
    });
    
    $("#save").click(function(){
        // Gather the data to save
        var data = new Array();
        var i = 0;
        
        $("#source-wrapper").children("div").each(function(){
            data[i] = new Object();
            data[i].url = $(this).find(".source-url")[0].innerHTML.replace(/&lt;/g,"<").replace(/&gt;/g,">");
            data[i].image = $(this).find(".default-image")[0].innerHTML.replace(/&lt;/g,"<").replace(/&gt;/g,">");
            data[i].altImage = $(this).find(".alt-image")[0].innerHTML.replace(/&lt;/g,"<").replace(/&gt;/g,">");
            data[i].altImageTag = $(this).find(".alt-image-tag")[0].innerHTML.replace(/&lt;/g,"<").replace(/&gt;/g,">");
            data[i].output = $(this).find(".formatted-source")[0].innerHTML.replace(/&lt;/g,"<").replace(/&gt;/g,">");
            i += 1;
        });
        
        var sendData = new Object;
        sendData.values = JSON.stringify(data);
        
        // Send the data
        $.ajax({
            type: "POST",
            url: "change_globals.php",
            data: sendData,
            async: false,
            complete: function(message)
            {
                alert(message.responseText);
            }
        });
    });
    
    $("#new-source-data button").live("click",function(){
        var index = $("#source-wrapper").children().length;
        var addFlag = true;
        
        $("#new-source-data").children().each(function(){
            if ($(this).val() == $(this)[0].defaultValue || $(this).val() == "")
            {
                if ($(this).hasClass("source-url"))
                {
                    alert("Source url requires a value.");
                    addFlag = false;
                }
                else
                {
                    $(this).val(null);
                }
            }
        });
        
        if (addFlag)
        {
            var template =  "<div class=\"source-url\">" + $("#new-source-data .source-url").val() + "</div>";
            template += "<div class=\"default-image\">" + $("#new-source-data .default-image").val() + "</div>";
            template += "<div><span class=\"alt-image\">" + $("#new-source-data .alt-image").val() + "</span> (<span class=\"alt-image-tag\">" + $("#new-source-data .alt-image-tag").val() + "</span>)</div>";
            template += "<div class=\"formatted-source\">" + $("#new-source-data .formatted-source").val().replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</div>";
            
            
            $("#source-wrapper").append("<h3><a href=\"#\">" + $("#new-source-data .source-url").val() + "</a></h3>")
            $("#source-wrapper").append("<div>" + template + "</div>");
            $("#source-wrapper").accordion("destroy");
            $("#source-wrapper").accordion({ collapsible: true,
                                             active: false  });
                
            $("#new-source-data").dialog("close");
        }
    });


});


function checkSourceData()
{
    
    return true;
}