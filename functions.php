<?php
function getDataSource(){
    $dataSources=array(
        array("id"=>1,"name"=>"MSSQL")
    );
    return json_encode($dataSources);
}
?>
