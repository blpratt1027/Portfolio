<table>
<tr>
<th colspan="2">Unique visitors</th>
</tr>
<tr>
<td><b>Today</b></td>
<td>
<?php
$file_count = fopen('counter/count.db', 'rb');
	$data = '';
	while (!feof($file_count)) $data .= fread($file_count, 4096);
	fclose($file_count);
	list($today, $yesterday, $total, $date, $days) = split("%", $data);
	echo $today;
?>
</td>
</tr>
<tr>
<td><b>Yesterday</b></td>
<td>
<?php
	echo $yesterday;
?>
</td>
</tr>
<tr>
<td><b>Total</b></td>
<td>
<?php
	echo $total;
?>
</td>
</tr>
<tr>
<td><b>Daily average</b></td>
<td>
<?php
	echo ceil($total/$days);
?>
</td>
</tr>
</table>