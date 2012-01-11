<?php

$filename = "globals.json";
$content = $_POST['values'];

// Let's make sure the file exists and is writable first.
if (is_writable($filename))
{
    if (!$handle = fopen($filename, 'w'))
    {
         echo "Cannot open file ($filename)";
         exit;
    }

    // Write $somecontent to our opened file.
    if (fwrite($handle, $content) === FALSE)
    {
        echo "Cannot write to file ($filename)";
        exit;
    }

    echo "success";

    fclose($handle);

}
else
{
    echo "error";
}

?>