<?php

	$reqKeys = array('checksession' => 0, 
					 'login' => 1, 
                     'register' => 2, 
					 'logout' => 3 );
	session_start();
	$mysqlConn = @mysql_connect('localhost','root','')
					or die('No se pudo conectar a mySQL');
	$mysqlDB = @mysql_select_db('one_db')
					or die('No se pudo recuperar la BD');
	
	if (isSet($_POST['request'])) {
		switch ($reqKeys[$_POST['request']]) {
			
			// SESSION CHECK REQUEST
			case 0: {
				if (!isSet($_SESSION['user']) || 
					!isSet($_SESSION['userid']) || 
					!isSet($_SESSION['status'])) {
					echo "fail@no session started";
				} else {
					echo "success@${_SESSION['user']}#${_SESSION['status']}";
				}
				break;
			}
			
			// LOGIN REQUEST
			case 1: {
				$query = " select * from users 
							where user='{$_POST['user']}' 
							&& password='{$_POST['password']}' ";
				$result =@mysql_query($query);
				if (!($entry=@mysql_fetch_array($result))) {
					echo 'fail@invalid user or password';
				} else if ($entry['status']=='requested') {
					echo 'fail@requested but not approved yet';
				} else {
					$_SESSION['user']=$_POST['user'];
					$_SESSION['userid']=$entry['userid'];
					$_SESSION['status']=$entry['status'];
					echo "success@${entry['status']}";	
				}
				break;
			}
			
			// REGISTER REQUEST
			case 2: {	
				$user = $_POST['user'];
				$password = $_POST['password'];
				$email = $_POST['email'];
				$query = " select * from users where user='$user'";
				$result =@mysql_query($query);
				if (@mysql_num_rows($result)) {
					echo 'fail@user already exists';
					break;	
				}
				$query = "  insert into users (user, password, email, status, requestdate) 
				            values ('$user','$password','$email', 'requested', NOW()) ";
				if ($result =@mysql_query($query))
					echo 'success@register request submitted succesfully, will receive 
					       a confirmation email when approved';
				else
					echo 'fail@error submitting request, try again later';
				break;
			}
			
			// LOGOUT REQUEST
			case 3: {	
				unset($_SESSION['user']);
				unset($_SESSION['userid']);
				unset($_SESSION['status']);
				break;
			}
			
			// MODIFY REGISTRY DATA REQUEST
			case 4: {						
				$query = "update users set ";
				foreach ($_POST as $key=>$value)
					if ($key!='request')
						$query .= "${key}='${value}',";
				$query = rtrim($query,",");		
				$query .= " where userid={$_SESSION['userid']}";
				if ($result =@mysql_query($query))
					echo "success@registry data changed succesfully";
				else
					echo 'fail@error while changing data';
				break;
			}
		}

	} else {
		echo 'fail@error in request code';	
	}

	@mysql_free_result($result);
	@mysql_close($mysqlConn);
	
?>