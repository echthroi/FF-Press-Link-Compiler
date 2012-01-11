var $data = getRules();
var globals = getGlobals();
$(document).ready(function(){
	
	$("#output-tabs,#input-tabs").tabs();
	$("#check-all-control").button();
	
	var params, lastIndex;
	
	var $inputList = getLinks(params).find("post");

	$("#check-all-control").click(function(){
		if ($(this).text() == "Select None")
		{
			$(".input-link").removeClass("selected").find(":checked").prop("checked",false);
			$("#check-all-control span").html("Select All");
		}
		else
		{
			$(".input-link").addClass("selected").find(":checkbox").prop("checked",true);
			$("#check-all-control span").html("Select None");
		}
		updateOutput();
		formatOutput();
	});
	
	// Refresh output list every time a bookmark is checked/unchecked
	$(".input-link").live("click",function(event){
		if (event.shiftKey)
		{
			var index = $(this).index() + 1;
			if (lastIndex > index)
			{
				var t = lastIndex;
				lastIndex = index - 2;
				index = t;
			}
			$("#bookmark-list").children().slice(lastIndex+1,index).each(function(){
				if ($(this).find(":checkbox")[0].checked)
				{
					$(this).removeClass("selected").find(":checkbox").prop("checked",false);
				}
				else
				{
					$(this).addClass("selected").find(":checkbox").prop("checked",true);
				}
			});
		}
		else
		{
			if ($(this).find(":checkbox")[0].checked)
			{
				$(this).removeClass("selected").find(":checkbox").prop("checked",false);
			}
			else
			{
				$(this).addClass("selected").find(":checkbox").prop("checked",true);
			}
		}
		
		lastIndex = $(this).index();
		
		updateOutput();
		formatOutput();
	});
	
	// Format and insert each bookmark
	$inputList.each(function (){
		var insertText =	"<div class=\"input-link unselectable\" data-url=\"" + $(this).attr("href") + "\" data-tags=\"" + $(this).attr("tag") + "\" data-note=\"" + $(this).attr("extended") + "\">\
								<div class=\"input-checkbox unselectable\">\
									<input type=\"checkbox\" />\
								</div>\
								<div class=\"input-description unselectable\">";
		insertText +=				$(this).attr("description"); 
		insertText +=			"</div>\
								<div class=\"buffer\"></div>\
							</div>";
		
		$("#bookmark-list").append(insertText);
	});

});

function updateOutput()
{
	// Clear previous output
	$("#output-final").empty();
	
	// Only perform checks on selected bookmarks
	var $bookmarks = $("#bookmark-list").children().filter(function(){
		return $(this).find("input").is(":checked");
	});
	
	var rules = $data.rules;
	var errors = $data.errors;
	var categories = $data.categories;


	for (var cat in categories)
	{
		var category = $bookmarks.filter('[data-tags~="' + categories[cat].tag + '"]');
		$("#output-final").append('<div class="category"><h2>' + categories[cat].title + '</h2></div>')
		
		if (category.length > 0)
		{
			if (categories[cat].subcanons == true)
			{	
				// Go through each rule, trying to match all bookmarks in this category
				for (var i in rules)
				{
					var selector = '';
					// The canon under which any matching results will be placed
					var canon = rules[i].category[rules[i].category.length-1];
					
					// Build a selector which will match bookmarks that have all of the required
					// tags for this rule
					for (var j in rules[i].has_tags)
						selector += '[data-tags~="' + rules[i].has_tags[j] + '"]';
			
					// Apply the selector
					var $fandom_results = category.filter(selector);
					
					if ($fandom_results.length > 0)
					{
						var categoryString = "";
						var $placeholder = $("#output-final").children(":last");
						
						// Build the canon tree in the DOM
						for (var k in rules[i].category)
						{
							categoryString = convertToId(rules[i].category[k]);	// Make the category safe to use as an id
							var nestLevel = "level" + k;						// each level of nesting should indent deeper
			
							if ($("#" + categoryString).length == 0)
							{
								$placeholder.append('<div id="' + categoryString + '" class="' + nestLevel + '"><h3>' + rules[i].category[k] + '</h3></div>');
								$placeholder = jQuery("#" + categoryString);
							}
							
						}
						
						// Put the matching bookmarks into the category/canon
						$fandom_results.each(function(){
							$("#" + categoryString).append(outputString($(this)));
						});
					}		
				}
			}
			else
			{
				category.each(function(){
					$("#output-final").children(":last").append(outputString($(this)));
				});
			}
		}
		else
		{
			$("#output-final").children(":last").remove();
		}
	}
}


function formatOutput()
{
	for (var i in globals)
	{
		$('.output-span[data-url*="' + globals[i].url + '"]').each(function(){
			// The first part of the description is the author(s)/artist(s)...pull it out
			var descriptionComponents = $(this).text().split(":");
			var names = descriptionComponents[0].split(/\b\sand\s\b|\b\s&\s\b/);
			var description = descriptionComponents.slice(1).join();
			var id = $(this).attr("data-note");
			for (var j in names)
			{
				// For each author name, format account links and icons according to the global settings
				if (names[j] != " ")
				{
					var imgurl;
					if ($(this).filter('[data-tags~="' + globals[i].altImageTag + '"]').length > 0)
						imgurl = globals[i].altImage;
					else
						imgurl = globals[i].image;
						
					names[j] = globals[i].output.replace(/\[name\]/g,names[j]).replace(/\[imgurl\]/g,imgurl).replace(/\[id\]/g,id);
				}
			}
				
			var formattedNames = names.join("<strong> and </strong>");
			$(this).replaceWith(formattedNames + ": " + "<a href=\"" + $(this).attr("data-url") + "\">" + description + "</a>")
		});
	}

	var t = $("#output-final").html().replace(/</g, '&lt;').replace(/>/g, '&gt;');
	$("#output-final-code").html("<pre>" + t + "</pre");
}

function outputString(inputLink)
{
	return "<span class=\"output-span\" data-tags=\"" + inputLink.attr("data-tags") + "\" data-url=\"" + inputLink.attr("data-url") + "\" data-note=\"" + inputLink.attr("data-note") + "\">" + inputLink.children(".input-description").text() + "</span><br />";
}

function convertToId(category)
{
	return category.replace(/\s/g,"-")
				   .replace("(","_")
				   .replace(")","_")
				   .replace("&","AMPERSAND");
}

function getRules()
{
	var data = new Object();

 	// Get the placement rules
	$.ajax({
		type: "GET",
		url: "rules.json",
		dataType: "json",
		async: false,
		success: function(json) {
            data.rules = json.rules;
			data.errors = json.errors;
			data.categories = json.categories;
		},
        error: function(a,b,c){ alert(a + "\n" + b + "\n" + c); }
	});

	return data;
}

function getLinks(params)
{
	var data = new Object();
	
	// Fetch the bookmarks
	$.ajax({
		type: "GET",
		url: "test.php",
		dataType: "xml",
		async: false,
		success: function(xml) {
			data = $(xml);
		},
		error: function() {
			alert("Failed to fetch bookmarks.")
		}
	});
	return data;
}

function getGlobals()
{
	var data = new Object();

	// Fetch the rules and syntax for formatting links
	$.ajax({
		type: "GET",
		url: "globals.json",
		dataType: "json",
		async: false,
		success: function(json) {
			data = json;
		},
		error: function() {
			alert("Failed to fetch bookmarks.")
		}
	});
	return data;
}

