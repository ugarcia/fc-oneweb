<?php
	$actionId = intval($_POST['actionId']);
	$data = $_POST['data'];
	$file = $_POST['file'];
	
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
			if (!$handle = fopen($file, 'wb')) {
				echo "Cannot open target file ($file)";
				exit(1);
			}
			$tmpFileName = $_FILES['fileData']['tmp_name'];
			if (!$tmpHandle = fopen($tmpFileName, 'rb')) {
				echo "Cannot open source data ($tmpFileName)";
				exit(2);
			}
			if (!fwrite($handle, fread($tmpHandle, filesize($tmpFileName)))) {
				echo "Cannot write image bytes to file ($file)";
				exit(3);
			}
			echo "Success, wrote image bytes to file ($file)";
			fclose($handle);
			fclose($tmpHandle);
			break;
		}

	}
?> 