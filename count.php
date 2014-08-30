<!DOCTYPE html > 
<head > 
	<title>My website</title> 
</head> 
<body bgcolor = "#99CC99"> 
<?php 
$handle = fopen("counter.txt", "r"); 
if(!$handle){ 
	echo "could not open the file" ; 
} else { 
	$counter = ( int ) fread ($handle,20) ; 
	fclose ($handle) ; 
	$counter++ ; 
	echo" <strong> you are visitor no ". $counter . " < /strong > " ; 
	$handle = fopen("counter.txt", "w" ) ; 
	fwrite($handle,$counter) ; fclose ($handle) ; 
} 
?> 
<h1>this is my website</h1> 
</body> 
</html >
