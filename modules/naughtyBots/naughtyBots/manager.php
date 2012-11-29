<?php
	if (isset($HTTP_RAW_POST_DATA)) {
		$actionId = 3;
	} else {
		$actionId = intval($_POST['actionId']);
		$data = $_POST['data'];
		$file = $_POST['file'];
	}
	
	switch($actionId) {
		case 0: {
			$aData = explode(";", $data);
			$bNew = ($aData[0] == "0");
			if (!file_exists($file)) {
				$aData[0] = 1;
				$data = trim(join(";", $aData), ';')."\n";
				$fh = fopen($file, 'w') or die("can't open file");
				fwrite($fh, $data) or die("can't write data");
			} else {
				$fh = fopen($file, 'r+') or die("can't open file");
				$entries = explode("\n", trim(file_get_contents($file), "\n"));
				for ($i=0; $i<count($entries); $i++) {
					$aEntry = explode(";", $entries[$i]);
					if ($bNew && $aEntry[0] > $aData[0])
						$aData[0] = $aEntry[0];
					else if ($aEntry[0] == $aData[0])
						$entries[$i] = $data;
				}
				if ($bNew) {
					$aData[0]++;
					$entries[count($entries)] = trim(join(";", $aData), ';');
				}
				$data = join("\n", $entries)."\n";
				fwrite($fh, $data) or die("can't write data");
			}
			echo 'success%'.$aData[0];
			break;
		}
		case 1: {
			$fh = fopen($file, 'w') or die("can't open file");
			fwrite($fh, $data) or die("can't write data");
			echo 'success';
			break;
		}
		case 2: {
			$response = join("#", explode("\n", trim(file_get_contents($file), "\n")));
			if ($response)
				echo 'success%'.$response;
			else
				echo 'fail';
			break;
		}
		case 3: {
			$fh = fopen( $_SERVER['HTTP_FILE_PATH'], 'w') or die("can't open image file");
			fwrite($fh, $HTTP_RAW_POST_DATA) or die("can't write image data");
			break;	
		}
	}
?> 