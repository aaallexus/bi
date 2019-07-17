<?php
include 'functions.php';
if(isset($_POST['action']))
{
    switch($_POST['action'])
    {
        case 'getDataSource': echo getDataSource();break;
    }
}
?>
