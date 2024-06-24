<?php
	session_start();

	$response = array();
	if(isset($_SESSION['userLoggedIn']) && $_SESSION['user_id'] === 1) {
		$response['message'] = '
		<div class="sidebar col-2">
		    <!-- Sidebar -->
		    <div class="sidebar-item active">
		        <a href="#" class="sidebar-link"><i class="fa fa-tachometer"></i> Dashboard</a>
		    </div>
		    <div class="sidebar-item">
		        <a href="orders.html" class="sidebar-link"><i class="fa fa-shopping-cart"></i> Orders</a>
		    </div>
		    <div class="sidebar-item">
		        <a href="uploads.html" class="sidebar-link"><i class="fa fa-upload"></i> Upload Shirt/Color</a>
		    </div>
		    <div class="sidebar-item">
		        <a href="history.html" class="sidebar-link"><i class="fa fa-history"></i> History</a>
		    </div>
		    <div class="sidebar-item">
		        <a href="statistics.html" class="sidebar-link"><i class="fa fa-bar-chart"></i> Statistics</a>
		    </div>
		</div>
		<div class="col-10">
			<div class="row">
				<div class="col-6">
					<div class="card">
			            <i class="fa fa-user"></i>
			            <hr>
			            <canvas id="statisticsChart"></canvas>
			            <div>Page Views: <span id="pageViews"></span></div>
				        <div>Unique Users: <span id="uniqueUsers"></span></div>
				        <div>Registered Users: <span id="registeredUsers"></span></div>
		        	</div>
				</div>

				<div class="col-6">
					<div class="card">
			            <i class="fa fa-shopping-cart"></i>
			            <hr>
			            <canvas id="statisticsOrdersChart"></canvas>
			            <div>Total Orders: <span id="totalOrders"></span></div>
				        <div>Total Amount: <span id="totalAmount"></span></div>
		        	</div>
				</div>
			</div>
		</div>';

		$response['message2'] = '';
		$response['status'] = 'success';
		$response['isAdmin'] = true;
	} else {
		$response['message'] = "Unauthorized access!";
		$response['status'] = 'error';
		$response['isAdmin'] = false;
	}

	echo json_encode($response);
?>