<?php
$f='text.json'; $t=404;
if(!file_exists($f)||filesize($f)>6*1024*1024||time()-filemtime($f)>$t) file_put_contents($f,'[]');
echo json_encode(json_decode(file_get_contents($f),true)?:[]);
?>