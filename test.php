<?php

// API path, inits
$ch = curl_init();
$path = "https://api.pinboard.in/v1/posts/all?results=50";
$data = $_POST;
// Curl options
curl_setopt($ch, CURLOPT_URL, $path);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_USERPWD, 'ff_press:Nej3kacrab!$Wa');
curl_setopt($ch, CURLOPT_USERAGENT, 'FFPress Link Reader v2'); 
//curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// Fetch data
curl_exec($ch);

if (curl_errno($ch) != 0)
{
    print_r(curl_getinfo($ch));
    echo "\n\ncURL error number:" .curl_errno($ch);
    echo "\n\ncURL error:" . curl_error($ch);
}
curl_close($ch);

// Parse and present data
//header("Content-Type:text/xml");
//echo $response;
//print_r($response);

?>
