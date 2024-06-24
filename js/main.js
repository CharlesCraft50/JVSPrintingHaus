var path = window.location.pathname;
var htmlPage = path.split("/").pop();
const urlParams = new URLSearchParams(window.location.search);

// Function to check login status
function checkLoginStatus() {
    $.ajax({
        type: "GET",
        url: "php-api/checkLoginStatus.php",
        dataType: "json",  // Specify that the response should be treated as JSON
        success: function (response) {
            if (response.status === "loggedIn") {
                // If logged in, show logout button and hide Register/Login link
                $(".userProfile").css('display', 'inline-block');
                $('.navHid').show();
                $("#loginLink").hide();
                $('.notification-count').hide();
        
                if($('.userProfile').css('display') != 'none') {
                    // Load notifications when the page is loaded
                    loadNotifications($('#notificationsList'));
                    // Reload notifications every 30 seconds
                    setInterval(function(){loadNotifications($('#notificationsList'))}, 30000);
                }

                // Check if the user is an admin
                if (response.isAdmin === true) {
                    // Special handling for admin users
                    $(".topnav-right").append("<a href='dashboard.html' class='dashboard'><i class='fa fa-dashboard'></i> Dashboard</a>");
                    $('.navHid').show();
                }

                if(htmlPage == "login.html") {
                    $('body').html('');
                    window.location.href = "profile.html";
                } else if(htmlPage == "register.html") {
                    $('body').html('');
                    window.location.href = "profile.html";
                }
            } else {
                // If not logged in, show Register/Login link and hide logout button
                $("#loginLink").show();
                $(".userProfile").hide();
            }
        },
        error: function (error) {
            console.log("Error:", error);
        }
    });
}

function getRemarksProfile(order, orderUserId) {
    $.ajax({
        type: "GET",
        url: "php-api/GetRemarks.php",
        dataType: "json",
        data: { orderId: order.OrderId }, // Pass the order ID to fetch remarks for that specific order
        success: function(response) {
            if (response.status === "Success") {
                // Iterate through each remark
                response.remarks.forEach(function(remark) {
                    // Create a div for the remark
                    var remarksDiv = $('<div>').addClass('remarks-item');

                    // Add remark text if available
                    if (remark.RemarkText.length > 0) {
                        var textSection = $('<pre>').text(remark.RemarkText);
                        remarksDiv.append(textSection);
                    }

                    // Add images if available
                    if (remark.Images.length > 0) {
                        remark.Images.forEach(function(imagePath) {
                            console.log(imagePath);
                            var imgElement = $('<img>').attr('src', imagePath);
                            remarksDiv.append(imgElement);
                        });
                    }

                    // Display the RemarkDate
                    var remarkDate = $('<p>').addClass('remarkDate').text(remark.RemarkDate);
                    remarksDiv.append(remarkDate);


                    var replyLink = $('<span>').addClass('reply-link').text('Reply').css({'margin-left': '10px'});

                    remarksDiv.append(replyLink);

                    remarksDiv.data('remarkId', remark.RemarkId);

                    // Add replies if available
                    if (remark.Replies.length > 0) {
                        var fragment = document.createDocumentFragment();
                        remark.Replies.forEach(function (reply) {
                            GetUserDetailsById(reply.UserId, function(fullName) {
                                var replyUser = $('<p>').addClass('remarkDate').text(fullName);
                                var replyText = $('<pre>').text(reply.ReplyText);
                                var replyDate = $('<p>').addClass('remarkDate').text(reply.ReplyDate);

                                var replyDiv = $('<div>').addClass('reply-item');
                                replyDiv.append(replyUser);
                                replyDiv.append(replyText);
                                replyDiv.append(replyDate);

                                if(reply.UserId == orderUserId) {
                                    // Add Reply delete button
                                    var deleteReplyButton = $('<button>').addClass('delete-button').html('<i class="fa fa-times"></i>').click(function () {
                                        $.ajax({
                                            type: "POST",
                                            url: "php-api/DeleteReply.php",
                                            data: { ReplyId: reply.ReplyId },
                                            success: function (response) {
                                                if (response.status === "Success") {
                                                    replyDiv.remove();
                                                } else {
                                                    openDialog('Error deleting reply: ' + response.message, 'Error', true, '#cc0202', 1300);
                                                }
                                            },
                                            error: function (response) {
                                                openDialog('Error deleting reply!', 'Error', true, '#cc0202', 1300);
                                            }
                                        });
                                    }).css({'position': 'absolute', 'top': '5px', 'right': '5px', 'width': 'auto', 'font-size': '14px'});
                                    replyDiv.append(deleteReplyButton);
                                }

                                // Append each reply div individually to the fragment
                                fragment.append(replyDiv[0]);

                                // Append the fragment to the remarksDiv element once all the DOM elements are created
                                if (fragment.childNodes.length === remark.Replies.length) {
                                    remarksDiv.append(fragment);
                                }
                            });
                        });
                    }

                    // Append the remark to the remarksArea
                    $('#remarksArea').prepend(remarksDiv);


                });

                // Reply click function

                $(document).on('click', '.reply-link', function() {
                    // Check if a reply text area already exists for this remark
                    if ($(this).siblings('.replyInputArea').length === 0) {
                        // Create a reply text area for this specific remark
                        var replyTextInput = $("<textarea class='replyTextInput' rows='4' cols='50' placeholder='Reply to ...'></textarea>");
                        var addReplyButton = $("<button class='btn addReply' style='width: auto;font-size: 14px;padding: 12px;'>Reply</button>");
                        var replyInputArea = $("<div class='replyInputArea'></div>");

                        replyInputArea.append(replyTextInput);
                        replyInputArea.append(addReplyButton);

                        // Append the reply area to the parent of the clicked "Reply" link
                        $(this).parent().append(replyInputArea);

                        // Attach the .addReply click event handler here
                        $(document).on('click', '.addReply', function(){
                            var replyText = $(this).siblings('.replyTextInput').val();
                            if(replyText.length == 0) {
                                openDialog('Please input message!', 'Error', true, '#cc0202', 1300);
                            } else {
                                var remarkId = $(this).closest('.remarks-item').data('remarkId');
                                var orderReferenceKey = $('#referenceKey').text();
                                var userId = orderUserId;
                                var adminUserId = 1;

                                // Assuming formData is defined and contains necessary data for InsertRemarks.php
                                var formData = new FormData();
                                formData.append('replyText', replyText);
                                formData.append('remarkId', remarkId);
                                formData.append('referenceKey', orderReferenceKey);
                                formData.append('userId', adminUserId);

                                var parentRemarksItem = $(this).closest('.remarks-item');

                                // Hide the reply textarea
                                $(this).siblings('.replyTextInput').parent().remove();

                                $.ajax({
                                    type: "POST",
                                    url: "php-api/InsertReply.php",
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    success: function (response) {
                                        if (response.status === "Success") {
                                            GetUserDetailsById(response.UserId, function(fullName) {
                                                var currentDate = new Date();
                                                var formattedDate =
                                                    currentDate.getFullYear() + "-" +
                                                    ('0' + (currentDate.getMonth() + 1)).slice(-2) + "-" +
                                                    ('0' + currentDate.getDate()).slice(-2) + " " +
                                                    ('0' + currentDate.getHours()).slice(-2) + ":" +
                                                    ('0' + currentDate.getMinutes()).slice(-2) + ":" +
                                                    ('0' + currentDate.getSeconds()).slice(-2);

                                                var replyDiv = $('<div>').addClass('reply-item');
                                                var replyUsername = $('<p>').addClass('remarkDate').text(fullName);
                                                replyDiv.append(replyUsername);

                                                var textSection = $('<pre>').text(replyText);
                                                replyDiv.append(textSection);

                                                var replyDate = $('<p>').addClass('remarkDate').text(formattedDate);
                                                replyDiv.append(replyDate);

                                                // Add Reply delete button
                                                var deleteReplyButton = $('<button>').addClass('delete-button').html('<i class="fa fa-times"></i>').click(function () {
                                                    $.ajax({
                                                        type: "POST",
                                                        url: "php-api/DeleteReply.php",
                                                        data: { ReplyId: response.LastInsertedId },
                                                        success: function (response) {
                                                            if (response.status === "Success") {
                                                                replyDiv.remove();
                                                            } else {
                                                                openDialog('Error deleting reply: ' + response.message, 'Error', true, '#cc0202', 1300);
                                                            }
                                                        },
                                                        error: function (response) {
                                                            openDialog('Error deleting reply!', 'Error', true, '#cc0202', 1300);
                                                        }
                                                    });
                                                }).css({'position': 'absolute', 'top': '5px', 'right': '5px', 'width': 'auto', 'font-size': '14px'});
                                                replyDiv.append(deleteReplyButton);

                                                // Append the reply below the original remark and visually associate it
                                                parentRemarksItem.append(replyDiv);
                                            });
                                        } else {
                                            openDialog('Error inserting reply: ' + response.message, response.message, true, '#cc0202', 1300);
                                            console.error('Error inserting reply: ', response.message);
                                        }
                                    },
                                    error: function (xhr, status, error) {
                                        openDialog('Error inserting reply: ' + error, 'Error', true, '#cc0202', 1300);
                                        console.error('Error inserting reply: ', error);
                                    }
                                });
                            }
                        });
                    }
                });

            } else {
                openDialog('Error fetching remarks: ' + response.message, 'Error', true, '#cc0202', 1300);
                console.error('Error fetching remarks: ', response.message);
            }
        },
        error: function(xhr, status, error) {
            openDialog('Error fetching remarks: ' + error, 'Error', true, '#cc0202', 1300);
            console.error('Error fetching remarks: ', error);
        }
    });
}


function activateStatusTab(status) {
    // Remove 'active' class from all tabs
    $('.sidebar-item-mini').removeClass('active');

    switch (status.toLowerCase()) {
        case 'pending':
            $('#pending-tab').parent().addClass('active');
            break;
        case 'processing':
            $('#processing-tab').parent().addClass('active');
            break;
        case 'shipped':
            $('#shipped-tab').parent().addClass('active');
            break;
        case 'delivered':
            $('#delivered-tab').parent().addClass('active');
            break;
        case 'cancelled':
            $('#cancelled-tab').parent().addClass('active');
            break;
        default:
            $('#all-tab').parent().addClass('active');
            break;
    }
}

function sideBarItemsClick(mini) {
    var sidebarItems;
    if(mini) {
        sidebarItems = document.querySelectorAll('.sidebar-item-mini');
    } else {
        sidebarItems = document.querySelectorAll('.sidebar-item');
    }
    

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Find the first <a> element within the clicked sidebar item
            const link = item.querySelector('a');

            // Simulate a click on the <a> element
            link.click();
        });
    });
}

function convertTo12HourFormat(time24) {
    // Parse the input time
    var timeArray = time24.split(":");
    var hours = parseInt(timeArray[0], 10);
    var minutes = parseInt(timeArray[1], 10);

    // Determine the period (AM or PM)
    var period = (hours >= 12) ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = (hours > 12) ? (hours - 12) : hours;

    // Handle midnight (00:00) and noon (12:00)
    hours = (hours === 0) ? 12 : hours;

    // Format the time in 12-hour format
    var time12 = hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + period;

    return time12;
}


function openDialog(html, title, showTitle, color, autoClose, cancelText) {
    $('#dialogContainer').html(html);
    if(title != "") {
        $('#dialogContainer').prop('title', title);
        $('.ui-dialog-title').text(title);
    }
    $('#dialogContainer').dialog('open');
    $('.ui-widget-header').css({
        'background-image': 'none',
        'background-color': '#f6f4f1',
        'color': color ? color : 'brown',
    });
    $('.ui-button').css('padding', '5px 10px');
    //$('.ui-dialog').css('box-shadow', '0 0 0 7px rgba(0,0,0,0.1)');
    $('.ui-dialog-titlebar-close').html("<span class=\"ui-button-icon ui-icon ui-icon-closethick\"></span>\n<span class=\"ui-button-icon-space\"> </span>");

    if(showTitle == false) {
        $('#dialogContainer').dialog("widget").find(".ui-dialog-title").hide();
        $('.ui-dialog-titlebar').css({
            'border': '0',
            'padding': '10px',
            'margin-bottom': '10px'
        });
        $('.ui-dialog-titlebar-close').css({
            'top': 0,
            'right': 0,
            'margin': 0,
            'z-index': 999
        });
    }

    if(autoClose > 0) {
        setTimeout(function(){
            $('#dialogContainer').dialog('close');
        }, autoClose);
    }

    if(cancelText) {
        $('.ui-dialog-buttonset button').text("CANCEL");
    } else {
        $('.ui-dialog-buttonset button').text("OK");
    }
}

function GetUserDetails(fullNameCallback, firstNameCallback, lastNameCallback, contactNumberCallback, addressCallback) {
    // Make an AJAX request
    $.ajax({
        type: 'GET',
        url: 'php-api/GetUserDetails.php',
        dataType: 'json',
        success: function (data) {
            // Check if the response contains an error
            if ('error' in data) {
                console.error('Error:', data.error);
            } else {
                // Access the retrieved data
                const firstName = data.FirstName;
                const lastName = data.LastName;
                const contactNumber = data.ContactNumber;
                // Check if the address field is not empty
                let address;
                if (data.Address) {
                    // Parse the address JSON string into an object
                    address = JSON.parse(data.Address);
                } else {
                    // Handle empty address
                    address = null;
                }

                // Combine first name and last name
                const fullName = `${firstName} ${lastName}`;

                // Execute the fullNameCallback with the combined string
                if (typeof fullNameCallback === 'function') {
                    fullNameCallback(fullName);
                }

                // Execute the firstNameCallback with the retrieved firstName
                if (typeof firstNameCallback === 'function') {
                    firstNameCallback(firstName);
                }

                // Execute the lastNameCallback with the retrieved lastName
                if (typeof lastNameCallback === 'function') {
                    lastNameCallback(lastName);
                }

                // Execute the contactNumberCallback with the retrieved contactNumber
                if (typeof contactNumberCallback === 'function') {
                    contactNumberCallback(contactNumber);
                }

                // Execute the addressCallback with the retrieved contactNumber
                if (typeof addressCallback === 'function') {
                    addressCallback(address);
                }
            }
        },
        error: function (error) {
            console.error('AJAX Error:', error);
        }
    });
}

function GetUserDetailsById(userId, fullNameCallback, firstNameCallback, lastNameCallback, contactNumberCallback) {
    // Make an AJAX request
    $.ajax({
        type: 'GET',
        url: 'php-api/GetUserDetailsById.php',
        data: { userId: userId },
        dataType: 'json',
        success: function (data) {
            // Check if the response contains an error
            if ('error' in data) {
                console.error('Error:', data.error);
            } else {
                // Access the retrieved data
                const firstName = data.FirstName;
                const lastName = data.LastName;
                const contactNumber = data.ContactNumber;

                // Combine first name and last name
                const fullName = `${firstName} ${lastName}`;

                // Execute the fullNameCallback with the combined string
                if (typeof fullNameCallback === 'function') {
                    fullNameCallback(fullName);
                }

                // Execute the firstNameCallback with the retrieved firstName
                if (typeof firstNameCallback === 'function') {
                    firstNameCallback(firstName);
                }

                // Execute the lastNameCallback with the retrieved lastName
                if (typeof lastNameCallback === 'function') {
                    lastNameCallback(lastName);
                }

                // Execute the contactNumberCallback with the retrieved contactNumber
                if (typeof contactNumberCallback === 'function') {
                    contactNumberCallback(contactNumber || null);
                }
            }
        },
        error: function (error) {
            console.error('AJAX Error:', error);
        }
    });
}

// Inside your JavaScript
function loadNotifications(element) {
    $.ajax({
        type: "GET",
        url: "php-api/GetNotifications.php",
        dataType: "json",
        success: function (response) {
            if (response.notifications.length > 0) {
                var notificationsList = element;
                notificationsList.empty(); // Clear existing notifications

                var unseenCount = 0; // Initialize the count of unseen notifications

                // Loop through each notification and append it to the list
                response.notifications.forEach(function (notification) {
                    var notificationClass = notification.Seen ? 'notification-item seen' : 'notification-item';
                    
                    var title = (notification.Title.length > 0) ? '<span class="notificationTitle">' + notification.Title + '</span>': '';
                    var notificationItem = '<li class="' + notificationClass + '">' +
                                            '<a href="' + (response.userId === 1 ? 'orders.html' : 'profile.html') + '?orderReferenceKey=' + notification.ReferenceKey + '&notifId=' + notification.NotifId + '">' +
                                                '<b>' + title + notification.ReferenceKey + '</b>' +
                                                '<div>' + notification.Message + '</div>' +
                                                '<span id="createdAt">' + notification.CreatedAt + '</span>' +
                                            '</a>' +
                                        '</li>';

                    notificationsList.append(notificationItem);

                    // Check if the current notification is seen
                    if (!notification.Seen) {
                        unseenCount++; // Increment the count of unseen notifications
                    }
                });

                // Update the notification count
                updateNotificationCount(unseenCount);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error loading notifications:", error);
        }
    });
}

// Function to update the notification count
function updateNotificationCount(unseenCount) {
    var notificationCount = $('.notification-count');
    
    if (unseenCount > 0) {
        notificationCount.text(unseenCount).show(); // Display the count if there are unseen notifications
    } else {
        notificationCount.hide(); // Hide the count if there are no unseen notifications
    }
}

// Get images from the container
function getBase64Image(imgElement) {
    const canvas = document.createElement("canvas");
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    const context = canvas.getContext("2d");
    context.drawImage(imgElement, 0, 0);

    const dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function statisticsChart() {
    $.ajax({
        type: 'GET',
        url: 'php-api/Statistics.php',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                // Prepare data for the chart
                const data = {
                    labels: ['Page Views', 'Unique Users', 'Registered Users'],
                    datasets: [{
                        label: 'Statistics',
                        data: [response.pageViews.toLocaleString(), response.uniqueUsers.toLocaleString(), response.registeredUsers.toLocaleString()],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                };

                // Configuration options for the chart
                const config = {
                    type: 'bar',
                    data: data,
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                };

                // Render the chart
                const statisticsChart = new Chart(
                    document.getElementById('statisticsChart'),
                    config
                );

                $('#pageViews').text(response.pageViews);
                $('#uniqueUsers').text(response.uniqueUsers);
                $('#registeredUsers').text(response.registeredUsers);
            } else {
                console.error('Error: ' + response.message);
            }
        },
        error: function(error) {
            console.error('AJAX Error:', error);
        }
    });
}

function statisticsOrderChart(totalOrders, totalAmount) {
    var ctx = document.getElementById('statisticsOrdersChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Orders', 'Total Amount'],
            datasets: [{
                label: 'Statistics',
                data: [totalOrders, totalAmount],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Call the function after the document has fully loaded
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: 'php-api/Counter.php',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                
            } else {
                
            }
        },
        error: function(error) {
            console.error('AJAX Error:', error);
        }
    });

    $(".mobile-menu-icon").click(function() {
        $(".topnav-links").slideToggle();
    });

    checkLoginStatus();

    // Attach click event to logout button
    $("#logoutLink").click(function () {
        // Perform AJAX request to logout.php
        $.ajax({
            type: "GET",
            url: "php-api/logout.php",
            success: function (response) {
                // Check if logout was successful
                if (response === "success") {
                    // Hide logout button and show Register/Login link
                    $('.navHid').hide();
                    $(".userProfile").hide();
                    $("#loginLink").show();
                    window.location.reload();
                } else {
                    console.log("Logout failed");
                }
            },
            error: function (error) {
                console.log("Error:", error);
            }
        });
    });
    
});


if(htmlPage == "statistics.html") {
    /* Initialized statistics.html */

    $(document).ready(function() {

        sideBarItemsClick(true);

        $.ajax({
            type: 'GET',
            url: 'php-api/CalculateOrderTotal.php',
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    var totalAmount = parseFloat(response.message);
                    var totalOrders = response.totalOrders;
                    statisticsOrderChart(totalOrders, totalAmount);

                    $('#totalAmount').text(totalAmount.toLocaleString());
                    $('#totalOrders').text(totalOrders.toLocaleString());
                } else {
                    console.error('Error: ' + response.message);
                    window.location = "index.html";
                }
            },
            error: function(error) {
                console.error('AJAX Error:', error);
            }
        });

        statisticsChart();
    });

    /* End ready of statistics.html */
    /* End code of statistics.html */

} else if(htmlPage == "store.html") {
    /* Initialized store.html */

    var addressData = {};
    var contactNumberData = null;
    var firstTime = true;

    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "php-api/ShirtDataByType.php",
            data: { shirtType: "design" },
            dataType: "json", // Expect JSON response
            success: function(response) {
                if (response && response.length > 0) {
                    var itemsToShow = 5;
                    var html = '';

                    $.each(response, function(index, item) {
                        if (index < itemsToShow) {
                            html += item.message2; // Append each shirt's HTML to the container
                        }
                    });

                    if (response.length > itemsToShow) {
                        html += '<button id="seeMoreButton" class="btn" style="font-size:18px; padding:5px;">See more</button>';
                    }

                    $('#productList').html(html);

                    $(".product").click(function(){
                        $('#colorPicker').css('gap', '0');
                        var productShirt = $(this).data('shirt');
                        $('#shirtType').prop('selectedIndex', 1);

                        // Determine the page number dynamically based on the item count
                        var itemsPerPage = 4;
                        var currentIndex = $(this).index(); // Index of the clicked product
                        var pageNumber = Math.floor(currentIndex / itemsPerPage) + 1;

                        colorPickerShirtType(pageNumber, productShirt); // Load the corresponding page

                        
                    });

                    $("#seeMoreButton").click(function(){
                        var remainingHtml = '';
                        $.each(response, function(index, item) {
                            if (index >= itemsToShow) {
                                remainingHtml += item.message2;
                            }
                        });
                        $('#seeMoreButton').remove();
                        $('#productList').append(remainingHtml);

                        $(".product").click(function(){
                            $('#colorPicker').css('gap', '0');
                            var productShirt = $(this).data('shirt');
                            $('#shirtType').prop('selectedIndex', 1);

                            // Determine the page number dynamically based on the item count
                            var itemsPerPage = 4;
                            var currentIndex = $(this).index(); // Index of the clicked product
                            var pageNumber = Math.floor(currentIndex / itemsPerPage) + 1;

                            colorPickerShirtType(pageNumber, productShirt); // Load the corresponding page

                        });
                    });

                } else {
                    console.log("Empty response or invalid data format");
                }
            },
            error: function(error) {
                console.log("Error:", error);
            }
        });
        customTshirtUpload = false;

        $('#dialogContainer').dialog({
            autoOpen: false,
            modal: true,
            buttons: {  
                OK: function() {$(this).dialog("close");}  
            },
            open: function(event, ui) 
            { 
                $('.ui-widget-overlay').bind('click', function()
                { 
                    $("#dialogContainer").dialog('close'); 
                }); 
            }
        });

        // Event delegation for dynamically loaded .colorRadio elements
        $('body').on('change', '.colorRadio', function () {
            // Update the viewButtons based on the retrieved views
            var frontImage = $(this).data('front');
            var backImage = $(this).data('back');
            var rightImage = $(this).data('right');
            var leftImage = $(this).data('left');

            updateShirtImages(frontImage, backImage, rightImage, leftImage);
        });

        function setInitialImageSize() {
            var initialWidth = 100; // Adjust the initial width as needed
            var initialHeight = 100; // Adjust the initial height as needed

            // Calculate the initial position of the target element
            var tshirtAreaWidth = $('#tshirtArea').width();
            var tshirtAreaHeight = $('#tshirtArea').height();
            var initialLeft = (tshirtAreaWidth - initialWidth) / 2;
            var initialTop = (tshirtAreaHeight - initialHeight) / 2;

            // Set the initial size and position of the target element
            $('#target').width(initialWidth);
            $('#target').height(initialHeight);
        }

        function updateShirtImages(frontImage, backImage, rightImage, leftImage) {
            //view-buttons
            $('#frontPreview').attr('src', 'uploads/shirts/' + frontImage);
            $('#backPreview').attr('src', 'uploads/shirts/' + backImage);
            $('#rightPreview').attr('src', 'uploads/shirts/' + rightImage);
            $('#leftPreview').attr('src', 'uploads/shirts/' + leftImage);

            // Update image containers for views
            $('#frontTshirtContainer .image-preview').attr('src', 'uploads/shirts/' + frontImage);
            $('#backTshirtContainer .image-preview').attr('src', 'uploads/shirts/' + backImage);
            $('#rightTshirtContainer .image-preview').attr('src', 'uploads/shirts/' + rightImage);
            $('#leftTshirtContainer .image-preview').attr('src', 'uploads/shirts/' + leftImage);

            // Update the main tshirtImage
            //$('#tshirtImage').attr('src', 'uploads/shirts/' + frontImage); // For example, use the front image for the main preview

            //setInitialImageSize();
        }

        /*$('#colorPicker').load('php-api/ShirtData.php', function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $('#shirtsPickerArea').html(msg + xhr.status + " " + xhr.statusText);
            }
        });*/

        colorPickerShirtType();

        $('#shirtType').on('change', function(){
            const selectedIndex = $('#shirtType').prop('selectedIndex');
            if (selectedIndex === 1) {
              $('#colorPicker').css('gap', '0');
            } else if (selectedIndex === 0) {
              $('#colorPicker').css('gap', '10px');
            }

            colorPickerShirtType();
        })

        $('.viewRadio').change(function(e){
            showShirtView('#' + this.value + 'TshirtContainer');
        });

        $('#showEditorButtons').change(function(e){
            if(this.checked) {
                $('.ui-resizable-handle').css('display', 'block');
                $('.ui-rotatable-handle').css('display', 'block');
            } else {
                $('.ui-resizable-handle').css('display', 'none');
                $('.ui-rotatable-handle').css('display', 'none');
            }
        });

        function createImageContainer(file, counter) {
            
            var imageContainer = $('<div class="draggableImages" id="imageContainer_' + imageCounter + '">');
            var draggableDiv = $('<div class="draggable" id="draggable_' + imageCounter + '">');
            var targetDiv = $('<div class="target" id="target_' + imageCounter + '">');
            var customImage = $('<img class="customImage" id="customImage_' + imageCounter + '">');
            var buttonContainer = $('<div class="buttonContainer">');
            var checkButton = $('<button class="checkButton">&#10004;</button>');
            var xButton = $('<button class="xButton">&#10006;</button>');
            xButton.click(function () {
                // Remove the draggable container
                var containerId = $(this).closest('.draggableImages').attr('id');
                var container = $('#' + containerId);

                // Find the image element within the container
                var customImage = container.find('.customImage');

                // Get the image source
                var imageSource = customImage.attr('src');

                // Check if there are more instances of the same image in draggable containers
                var remainingInstances = $('.customImage[src="' + imageSource + '"]').length;

                if (remainingInstances === 1) {
                    // If only one instance left, remove the corresponding item in customImagesList
                    $('#customImagesList img[src="' + imageSource + '"]').parent().remove();

                    // Remove the image source from the uploadedImages array
                    uploadedImages = uploadedImages.filter(function (uploadedImage) {
                        return uploadedImage !== imageSource;
                    });
                }

                // Recalculate custom image price
                calculateCustomImagesPrice();

                // Remove the container
                container.remove();

                // Recalculate other charges total
                otherChargesTotal = calculateOtherChargesTotal();

                // Update the total sum
                updateTotalSum();
            });

            buttonContainer.append(checkButton, xButton);
            targetDiv.append(customImage, buttonContainer);
            draggableDiv.append(targetDiv);
            imageContainer.append(draggableDiv);
            $('#' + $('.viewRadio:checked').val() + 'TshirtContainer').append(imageContainer);


            draggableDiv.draggable({
              cursor: 'move',
            });

            targetDiv.resizable({
              aspectRatio: false,
              handles: 'se',
              start: function (event, ui) {
                ui.element.data('originalSize', {
                  width: ui.element.width(),
                  height: ui.element.height(),
                });
              },
              resize: function (event, ui) {
                var originalSize = ui.element.data('originalSize');
                var aspectRatio = originalSize.width / originalSize.height;
                var newWidth = ui.size.width;
                customImage.width(newWidth);
              },
            }).rotatable();

            $('.ui-rotatable-handle').html('<img src="images/rotate.png" alt="Rotate">');
                
            

            var reader = new FileReader();
            reader.onload = function (e) {
                customImage.attr('src', e.target.result).show();
                var initialWidth = 100;
                var initialHeight = (initialWidth / e.target.width) * e.target.height;
                targetDiv.width(initialWidth);
                targetDiv.height(initialHeight);
                targetDiv.css({ position: 'absolute', left: 0, top: -100 });
                customImage.width(initialWidth);
                customImage.height(initialHeight);
            };
            reader.readAsDataURL(file);

            return imageContainer;
        }

        var imageCounter = 0;

        var uploadedImages = [];  // Keep track of uploaded images

        $('#uploadInput').change(function (event) {
            var files = event.target.files;

            if (files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        var dataUrl = e.target.result;

                        // Check if the image with the same data URL already exists
                        if (uploadedImages.indexOf(dataUrl) === -1) {
                            var listItem = $('<div>').addClass('custom-image-item');

                            // Display image preview
                            var imagePreview = $('<img>').attr('src', dataUrl).attr('data-price', defaultCustomImagesPrice).css('max-width', '50px');
                            listItem.append(imagePreview);

                            // Display file name
                            listItem.append($('<div>').text(file.name));
                            listItem.append($('<span>').html('&#8369;' + defaultCustomImagesPrice));

                            $('#customImagesList').append(listItem);
                            uploadedImages.push(dataUrl);  // Add the data URL to the uploadedImages array
                        }
                    };

                    reader.readAsDataURL(file);

                    // This is for the T Shirt
                    createImageContainer(file, imageCounter);

                    imageCounter++;
                }

                // Clear the input value to allow selecting the same file again
                $(this).val('');

                if (!$('#showEditorButtons').is(':checked')) {
                    $('.ui-resizable-handle').css('display', 'none');
                    $('.ui-rotatable-handle').css('display', 'none');
                }
            }
        });

        $('#customImageArea').on('click', '.checkButton', function () {
            var containerId = $(this).closest('.draggableImages').attr('id');
            $('#' + containerId + ' .draggable').draggable('disable');
            $('#' + containerId + ' .target').resizable('disable');
            $('#' + containerId + ' .target').rotatable('disable');
            $('#' + containerId + ' .ui-rotatable-handle').hide();
        });

        function showShirtView(view) {
            $('#frontTshirtContainer').hide();
            $('#backTshirtContainer').hide();
            $('#rightTshirtContainer').hide();
            $('#leftTshirtContainer').hide();
            //Show view based on parameter
            $(view).show();
        }

        var otherChargesTotal = calculateOtherChargesTotal();

        // Function to calculate the other charges total
        function calculateOtherChargesTotal() {
            var total = 0;
            $('.otherCharges').each(function () {
                var chargePrice = parseInt($(this).find('h3').attr('data-price'));
                total += chargePrice;
            });
            return total;
        }

        $('#chooseSizeButton').click(function () {
            $.ajax({
                type: "GET",
                url: "php-api/checkLoginStatus.php",
                dataType: "json",
                success: function (response) {
                    if (response.status === "loggedIn") {
                        // If logged in, show logout button and hide Register/Login link
                        if (response.isAdmin === true) {
                            // Special handling for admin users

                        }

                        if(customTshirtUpload) {
                            var filesFilled = $('.image-input').filter(function () {
                                return $(this).get(0).files.length === 1;
                            }).length === $('.image-input').length;

                            // Display an alert if any file input is not filled
                            if (!filesFilled) {
                                openDialog('Please fill out all image inputs.', 'Status', false);
                                return;
                            }
                        }

                        //Calculate the customImages price
                        calculateCustomImagesPrice();
                        

                        $('#clothTypeChose').text($('#clothType option:selected').val());
                        $('#clothTypeAmount').text($('#clothType option:selected').data('value'));
                        $('#clothTypePrice').attr('data-price', $('#clothType option:selected').data('value'));
                        
                        $('#colorPickerContainer').hide();
                        $('#chooseSizeContainer').css('display', 'flex');

                        // Update custom text images
                        updateCustomTextImages();

                        // Calculate the other charges total then updateTotalSum()
                        otherChargesTotal = calculateOtherChargesTotal();

                        updateTotalSum();
                    } else {
                        // If not logged in, show Register/Login link and hide logout button
                        openDialog("Please login first!", "Status", false);
                        setTimeout(function(){
                            window.location.href = 'login.html';
                        }, 800);
                    }
                },
                error: function (error) {
                    console.log("Error:", error);
                }
            });
        });

        window.calculateCustomImagesPrice = function() {
            if($('.custom-image-item img').length > 0 || $('.customText').length > 0) {
                $('#designPrice').parent().show();
                const calculateCustomImagePrice = $('.custom-image-item img').length * defaultCustomImagesPrice;
                const calculateCustomTextPrice = $('.customText').length * defaultCustomTextPrice;
                const totalCustoms = calculateCustomImagePrice + calculateCustomTextPrice;
                $('#designPrice').attr('data-price', totalCustoms);
                $('#designPriceContainer').text(totalCustoms);
            } else {
                $('#designPrice').parent().hide();
            }
        };

        function updateDetailsTable() {
            var detailsTableBody = $('#detailsTableBody');
            detailsTableBody.empty(); // Clear existing details

            $('.size-row').each(function () {
                var sizeLabel = $(this).find('.size-label').data('value');
                var quantity = parseInt($(this).find('.quantity').text());
                var sizePrice = parseInt($(this).find('.size-label').data('price'));

                if (quantity > 0) {
                    var subtotal = quantity * sizePrice;
                    var totalAmount = subtotal; // You can modify this if needed

                    detailsTableBody.append(
                        '<tr>' +
                        '<td>' + sizeLabel + '</td>' +
                        '<td>' + quantity + '</td>' +
                        '<td>&#8369;' + subtotal + '</td>' +
                        '</tr>'
                    );
                }
            });
        }

        // Function to update the total sum based on size prices and other charges
        function updateTotalSum() {
            var totalSum = 0;

            // Add up the size subtotals
            $('.size-row').each(function () {
                var quantity = parseInt($(this).find('.quantity').text());
                var sizePrice = parseInt($(this).find('.size-label').data('price'));
                totalSum += quantity * sizePrice;
            });

            // Add the other charges total to the total sum
            totalSum += otherChargesTotal;

            // Update the total sum in the HTML
            $('#totalSum').html(totalSum);
        }

        

        var sizeCount = 0;

        $('.quantity-control').on('click', function () {
            var action = $(this).data('action');
            var sizeRow = $(this).closest('.size-row');
            var quantityElement = sizeRow.find('.quantity');
            var sizeLabelElement = sizeRow.find('.size-label').attr('data-price');
            var currentQuantity = parseInt(quantityElement.text());
            var currentSizePrice = parseInt(sizeLabelElement);

            if (action === 'increase') {
                quantityElement.text(currentQuantity + 1);
                $('#totalSum').html(parseInt($('#totalSum').text()) + currentSizePrice);
                sizeCount += 1;

            } else if (action === 'decrease' && currentQuantity > 0) {
                quantityElement.text(currentQuantity - 1);
                $('#totalSum').html(parseInt($('#totalSum').text()) - currentSizePrice);
                sizeCount -= 1;
            }

            $('#sizeCount').html(sizeCount.toString());
            updateDetailsTable();
            updateTotalSum();
        });

        // Initial update of the total sum
        updateTotalSum();


        $('#seeDetails').click(function(){
            $('.detailsArea').slideToggle();
        });

        $('#goBack').click(function(){
            const direction = $(this).data('direction');
            $(this).parent().parent().hide();
            $('#' + direction).show();
        });

        $('#addToCart').click(function () {
            if (parseInt($('#totalSum').text()) > otherChargesTotal) {
                // Update custom text images
                updateCustomTextImages();

                $('#finalArea .fa-spinner').show();
                $('.leftContainer').hide();
                $('.detailsArea').show();
                $(this).parent().hide();
                $('#finalArea').show();

                $('#totalFinal').html($('.totalArea').html());
                GetUserDetails(function (fullName) {
                    $('#totalFinal').prepend("<div id='contactDetailsArea'><h3 id='nameArea'>Name: " + fullName + "</h3></div>");
                }, function (firstName) {

                }, function (lastName) {

                }, function (contactNumber) {
                    console.log(contactNumber);
                    if (contactNumber != null && contactNumber.length > 0) {
                        contactNumberData = contactNumber;
                        $('#contactDetailsArea').append("<h3 id='contactNumberArea'>Contact: " + contactNumber + " <span class='option' onclick='editContactNumber()'>[Edit]</span></h3>");

                    } else {
                        $('#contactDetailsArea').append("<h3 id='contactNumberArea'>Contact Number/Email not set yet. <span class='option' onclick='editContactNumber()'>Click here to set</span></h3>");
                    }
                }, function (address) {
                    if (address != null) {
                        addressData = address;
                        addressStreet = (address.street.length > 0) ? address.street + ", " : "";
                        $('#contactDetailsArea').append("<h3 id='addressArea'>Address: " + addressStreet + address.address + ", " + address.zipcode + " <span class='option' onclick='editAddress()'>[Edit]</span></h3>");
                    } else {
                        $('#contactDetailsArea').append("<h3 id='addressArea'>Address not set yet. <span class='option' onclick='editAddress()'>Click here to set <i>(Optional)</i></span></h3>");
                    }

                });
                $('#showEditorButtons').prop('checked', false);
                $('.ui-resizable-handle').css('display', 'none');
                $('.ui-rotatable-handle').css('display', 'none');

                // Capture and append each view to the tShirtImageFinal container

                if (customTshirtUpload) {
                    var images = $('#viewButtons .view-button2');
                    var clonedImages = images.clone();
                    clonedImages.removeAttr('style');
                    $('#tShirtImageFinal').append(clonedImages);
                    $('#tShirtImageFinal img').css('max-width', '100%');
                    $('.tshirtContainer').hide();
                    $('#finalArea .fa-spinner').hide();
                } else {
                    // Create a queue for capturing and appending views
                    var viewQueue = ['frontTshirtContainer', 'backTshirtContainer', 'rightTshirtContainer', 'leftTshirtContainer'];

                    $('.tshirtContainer').css({'position': 'absolute', 'right': 0, 'background-color': '#89a3a3'});
                    $('.pleaseWait').show();
                    $('#placeOrder button').prop('disabled', true);
                    $('#placeOrder button').css({'cursor': 'default', 'background-color': '#89a3a3'});
                    $('#placeOrder button').html('Please wait');

                    // Function to process next view in the queue recursively
                    function processNextView() {
                        if (viewQueue.length > 0) {
                            var containerId = viewQueue.shift(); // Get the next container ID
                            captureAndAppendView(containerId, processNextView); // Capture and append view, then process next view
                        } else {
                            // All views processed, hide containers and spinner
                            $('.tshirtContainer').attr('style', 'display: none;');
                            $('.pleaseWait').hide();
                            $('.tshirtContainer').hide();
                            $('#finalArea .fa-spinner').hide();
                            $('#placeOrder button').html('Place Order <i class="fa fa-cart-arrow-down"></i>');
                            $('#placeOrder button').css({'cursor': 'pointer', 'background-color': '#3d4141'});
                            $('#placeOrder button').prop('disabled', false);
                        }
                    }

                    // Start processing views
                    processNextView();
                }
            }
        });

        function captureAndAppendView(containerId, callback) {
            // Show the specified view container
            $('#' + containerId).show();

            // Capture the specified view container as an image
            html2canvas(document.getElementById(containerId)).then(canvas => {
                // Convert the canvas to data URL
                var dataURL = canvas.toDataURL("image/png");

                // Create an image element and append it to the tShirtImageFinal container
                var img = document.createElement('img');
                img.src = dataURL;
                $('#tShirtImageFinal').append(img);

                // Hide the view container again
                $('#' + containerId).hide();

                // Execute the callback to process next view
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }

        $('#goBackFinal button').click(function(){
            $('#totalFinal').html("");
            $('#tShirtImageFinal').empty();
            $('.viewRadio[value="front"]').prop('checked', true);
            showShirtView('#frontTshirtContainer');
            $('#finalArea').hide();
            $('.leftContainer').show();
            $('.tshirtContainer').show();
            $('#showEditorButtons').trigger('click');
            $('#chooseSizeContainer').show();              
        });

        $('#placeOrder button').click(function () {
            $('#placeOrder .fa').show();

            // Create FormData object
            const formData = new FormData();

            const tShirtImages = [];

            // Get base64 data for t-shirt images
            $("#tShirtImageFinal img").each(function(index, element) {
                const imageBase64 = getBase64Image(element);
                tShirtImages.push(imageBase64);
            });

            formData.append("tShirtImages", JSON.stringify(tShirtImages));

            /// Get base64 data for custom images
            const customImages = [];
            $("#customImagesList img").each(function (index, element) {
                const imageBase64 = getBase64Image(element);
                const imagePrice = $(element).data('price'); // Get data-price attribute
                customImages.push({ base64: imageBase64, price: imagePrice });
            });

            // Check if there are custom images before appending
            if (customImages.length > 0) {
                formData.append("customImages", JSON.stringify(customImages));
            }

            const totalDetails = $(".totalArea").html(); // HTML content of the totalArea div
            const totalAmount = $("#totalSum").text(); // Total amount
            const clothType = $("#clothType").val(); // Cloth type
            const downPayment = $("#downPayment").val(); // Cloth type
            const customImagesCount = $('.customImage').length; // Custom Images Count

            formData.append("totalDetails", totalDetails);
            formData.append("totalAmount", totalAmount);
            formData.append("clothType", clothType);
            formData.append("downPayment", downPayment);
            formData.append("customImageCount", customImagesCount);
            formData.append("address", JSON.stringify(addressData));
            

            if(contactNumberData != null && contactNumberData.length > 0) {
                formData.append("contactNumber", contactNumberData);
            } else {
                $('.fa-spinner').hide();
                openDialog('Contact Number/Email is required!', 'Error', true, '#cc0202', 1300);
                setTimeout(function(){editContactNumber();}, 1400);
                return;
            }

            // Send Ajax request
            $.ajax({
                type: "POST",
                url: "php-api/InsertOrder.php",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if(response.status == 'success') {
                        openDialog(response.message, 'Success', true, '#28a745', 600);
                        $('#placeOrder button').prop('disabled', true);
                        $('.fa-spinner').hide();
                        $('#goBackFinal button').click(function(){
                            location.href = "store.html";
                        });
                        setTimeout(function(){
                            location.href = "profile.html?order=last";
                        }, 1000);
                    } else {
                        openDialog(response.message, 'Error', true, '#cc0202', 600);
                    }
                },
                error: function (xhr, status, error) {
                    openDialog(error, 'Error', true, '#cc0202', 600);
                    $('.fa-spinner').hide();
                    console.log(error);
                }
            });

        });

        $('#goBackStore button').click(function(){
            location.href = 'store.html';
        });

        $('.image-input').change(function () {
            const previewId = $(this).data('preview');
            const preview = $('#' + previewId)[0];
            const file = this.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    if(previewId == "frontPreview2") {
                        $('#tshirtImage2').attr('src', e.target.result);
                    }
                    preview.src = e.target.result;
                };

                reader.readAsDataURL(file);
            }
        });

        $('.view-button2').click(function () {
            const preview = $(this).attr('src');
            $('#tshirtImage2').attr('src', preview);
        });

        $('#uploadTShirtImageButton').click(function(){
            $('#tshirtArea').slideUp();
            $('#startArea').slideUp();
            $('.extraHeight').slideDown();
            $('#customImagesInput').slideDown();
            $('#customTshirtUploadArea').slideDown();
            $(this).slideUp();
            customTshirtUpload = true;
        });

        $('#cancelTshirtUpload').click(function(){
            $('#uploadTShirtImageButton').slideDown();
            $('#tshirtArea').slideDown();
            $('#startArea').slideDown();
            $('.extraHeight').slideUp();
            $('#customImagesInput').slideUp();
            $('#customTshirtUploadArea').slideUp();
            $('#tshirtArea').slideDown();
            customTshirtUpload = false;
        });

        var uploadedImages = []; // Keep track of uploaded images
        var defaultCustomImagesPrice = 80;
        var defaultCustomTextPrice = 40;

        $('.tshirtContainer input[name="customImages[]"]').on('change', function () {
            var customImagesList = $('#customImagesList');

            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];
                var reader = new FileReader();

                reader.onload = function (e) {
                    var dataUrl = e.target.result;

                    // Check if the image with the same data URL already exists
                    if (uploadedImages.indexOf(dataUrl) === -1) {
                        // If not, append it to customImagesList
                        var listItem = $('<div>').addClass('custom-image-item');

                        // Display image preview
                        var imagePreview = $('<img>').attr('src', dataUrl).attr('data-price', defaultCustomImagesPrice).css('max-width', '50px');
                        listItem.append(imagePreview);

                        // Display file name
                        listItem.append($('<div>').text(file.name));
                        listItem.append($('<span>').html('&#8369;' + defaultCustomImagesPrice));

                        // Add 'x' button to remove the current div
                        var removeButton = $('<button class="removeButton">&#10006;</button>');
                        listItem.append(removeButton);

                        // Click handler for the 'x' button
                        removeButton.click(function () {
                            var container = $(this).closest('.custom-image-item');
                            container.remove();
                            uploadedImages = uploadedImages.filter(img => img !== dataUrl); // Remove data URL from the array
                        });

                        customImagesList.append(listItem);
                        uploadedImages.push(dataUrl); // Add the data URL to the uploadedImages array
                    }
                };

                reader.readAsDataURL(file);
            }
        });

        var textCounter = 0;

        function createTextContainer(text, counter) {
            var textContainer = $('<div class="draggableImages" id="textContainer_' + counter + '">');
            var draggableDiv = $('<div class="draggable" id="draggableText_' + counter + '">');
            var targetDiv = $('<div class="target" id="targetText_' + counter + '" style="position: absolute;">');
            var customText = $('<span class="customText" id="customText_' + counter + '">').text(text);
            var buttonContainer = $('<div class="buttonContainer">');
            var checkButton = $('<button class="checkButton">&#10004;</button>');
            var xButton = $('<button class="xButton">&#10006;</button>');

            xButton.click(function () {
                // Remove the draggable container
                var containerId = $(this).closest('.draggableImages').attr('id');
                var containerSpanId = $('#' + containerId + ' span').attr('id');
                var container = $('#' + containerId);

                // Remove the container
                container.remove();
                $('.customImage[data-text-id=' + containerSpanId + ']').parent().remove();
                setTimeout(function () {
                    // Recalculate custom image price
                    calculateCustomImagesPrice();

                    // Recalculate other charges total
                    otherChargesTotal = calculateOtherChargesTotal();

                    // Update the total sum
                    updateTotalSum();
                }, 10);
               
            });

            buttonContainer.append(checkButton, xButton);
            targetDiv.append(customText, buttonContainer);
            draggableDiv.append(targetDiv);
            textContainer.append(draggableDiv);

            // Make the text draggable
            draggableDiv.draggable({
                cursor: 'move',
                start: function (event, ui) {
                    var rotatorHandle = $(this).find('.custom-rotator-handle');
                    rotatorHandle.css('left', $(this).width() + 'px');
                    rotatorHandle.css('top', $(this).height()-30 / 2 - rotatorHandle.height() / 2 + 'px');
                },
            });

            /*targetDiv.resizable({
                aspectRatio: false,
                handles: 'se',
                start: function (event, ui) {
                    ui.element.data('originalSize', {
                        width: ui.element.width(),
                        height: ui.element.height(),
                        fontSize: parseInt(customText.css('font-size')),
                    });
                },
                resize: function (event, ui) {
                    var originalSize = ui.element.data('originalSize');
                    var newWidth = ui.size.width;

                    // Calculate the scale factor between the new and original widths
                    var scaleFactor = newWidth / originalSize.width;

                    // Apply the scale factor to the original font size
                    var newFontSize = originalSize.fontSize * scaleFactor -10;

                    // Resize the text
                    customText.css('font-size', newFontSize + 'px');
                    $('#fontSizeInput').val(parseInt(newFontSize));

                    // Update the position of the resizable handle
                    var handle = $('.ui-resizable-handle');
                    handle.css('left', ui.size.width - handle.width() + 140 + 'px');
                    handle.css('top', ui.size.height - handle.height() + 40 + 'px');
                },
            })*/
            targetDiv.rotatable({
                handle: $('<div class="custom-rotator-handle ui-rotatable-handle"><i class="fa fa-rotate-right" style="color:white;"></i></div>'),
                angle: 0,
                start: function (event, ui) {
                    var rotatorHandle = $(this).find('.custom-rotator-handle');
                    rotatorHandle.css('left', '50%');
                    rotatorHandle.css('top', '-20px'); // Adjust the top position as needed
                },
                rotate: function (event, ui) {
                    customText.css('transform', 'rotate(' + ui.angle + 'deg)');
                },
            });

            customText.click(function () {
                // Remove border from other customText elements
                $('.customText').removeClass('selectedText');

                // Apply border to the selected customText
                $(this).addClass('selectedText');

                // Update styles based on the selected customText
                $('#fontSizeInput').val(parseInt($(this).css('font-size')));
                $('#fontColorPicker').val(rgbToHex($(this).css('color')));

                // Check Text Decoration checkboxes
                $('#boldCheckbox').prop('checked', parseInt($(this).css('font-weight')) >= 700);
                $('#italicCheckbox').prop('checked', $(this).css('font-style') === 'italic');
                $('#underlineCheckbox').prop('checked', $(this).css('text-decoration').includes('underline'));
                $('#strikeCheckbox').prop('checked', $(this).css('text-decoration').includes('line-through'));

                // Check Font Variant Caps radio buttons
                var fontCapsStyle = $(this).css('font-variant-caps');
                $('input[name="fontCapsGroup"]').filter('[data-style="' + fontCapsStyle + '"]').prop('checked', true);

                // Set the value of the font style dropdown
                var selectedFontStyle = $(this).css('font-family');
                
                // Remove quotes if present
                selectedFontStyle = selectedFontStyle.replace(/['"]/g, '');
                
                $('#fontStyleDropdown').val(selectedFontStyle);

                // Update the label indicating the selection
                updateSelectionLabel();
                updateSliderHandlePosition();
            });

            return textContainer;
        }

        $('#addTextBtn').click(function () {
            // Create a jQuery UI dialog for text input
            $('#dialogModalContainer').html('<input type="text" id="textInput" placeholder="Text...">');
            $('#dialogModalContainer').dialog({
                title: "Enter Text",
                modal: true,
                buttons: {
                    OK: function () {
                        var text = $('#textInput').val();
                        if (text.trim() !== "") {
                            // Create a new text container
                            $('#textEditorArea').slideDown();
                            var textContainer = createTextContainer(text, textCounter);
                            $('#selectedTextLabel').text('Text Selected: ' + text);
                            $('.customText').removeClass('selectedText');
                            $('#fontColorPicker').val('#000000');
                            setTimeout(function(){
                                $('span#customText_' + (textCounter-1)).addClass('selectedText');
                                updateSliderHandlePosition();
                            }, 100);

                            // Add the text container to the T-shirt container
                            $('#' + $('.viewRadio:checked').val() + 'TshirtContainer').append(textContainer);

                            setTimeout(function () {
                                // Recalculate custom image price
                                calculateCustomImagesPrice();

                                // Recalculate other charges total
                                otherChargesTotal = calculateOtherChargesTotal();

                                // Update the total sum
                                updateTotalSum();
                            }, 10);

                            $('#fontSizeInput').val(parseInt(textContainer.css('font-size')));

                            if ($('#showEditorButtons').is(":checked")) {
                                $('.ui-resizable-handle').css('display', 'block');
                                $('.ui-rotatable-handle').css('display', 'block');
                            } else {
                                $('.ui-resizable-handle').css('display', 'none');
                                $('.ui-rotatable-handle').css('display', 'none');
                            }

                            textCounter++;
                        }

                        $(this).dialog("close");
                    },
                    Cancel: function () {
                        $(this).dialog("close");
                    }
                },
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#dialogModalContainer").dialog('close');
                    });
                }
            });
            $('.ui-widget-header').css({
                'background-image': 'none',
                'background-color': '#f6f4f1',
                'color': '#595045',
            });
            $('.ui-button').css('padding', '5px 10px');
            //$('.ui-dialog').css('box-shadow', '0 0 0 7px rgba(0,0,0,0.1)');
            $('.ui-dialog-titlebar-close').html("<span class=\"ui-button-icon ui-icon ui-icon-closethick\"></span>\n<span class=\"ui-button-icon-space\"> </span>");
            $('#dialogModalContainer').dialog('open');

        });

        function captureTextImageWithStyle(selectedTextContainer) {
            if (!selectedTextContainer) {
                console.error("No selected text container found.");
                return;
            }

            // Get the font color from the color picker
            var fontColor = $('#fontColorPicker').val();

            // Calculate the contrasting background color based on the font color
            var bgColor = calculateContrastBackgroundColor(fontColor);

            // Get the current font-variant-caps style of the selectedTextContainer
            var fontVariantCaps = $(selectedTextContainer).css('font-variant-caps');

            // Capture the text container as an image with its current style
            domtoimage.toPng(selectedTextContainer, { 
                bgcolor: 'transparent', 
                scale: 3,  // Adjusted scale for higher resolution
                quality: 1.0  // Set the quality to 1.0 for maximum quality
            })
                .then(function (dataUrl) {
                    // Convert the data URL to an image element
                    var img = new Image();
                    img.src = dataUrl;

                    // Check if an image for this text container already exists
                    var existingImage = $('#customImagesList img[data-text-id="' + selectedTextContainer.id + '"]');

                    if (existingImage.length === 0) {
                        // Create a new image element with the captured image and style
                        var listItem = $('<div>').addClass('custom-image-item');
                        img.classList.add('customImage');
                        img.style.backgroundColor = bgColor;
                        img.dataset.textId = selectedTextContainer.id;
                        img.dataset.price = defaultCustomTextPrice;
                        img.style.width = '100px'; // Set the width of the displayed image

                        listItem.append(img);
                        listItem.append($('<div>').text(selectedTextContainer.id));
                        listItem.append($('<span>').html('&#8369;' + defaultCustomTextPrice));

                        // Append the image to the customImageList
                        $('#customImagesList').append(listItem);
                    } else {
                        // Update the existing image source and style
                        existingImage.attr('src', dataUrl);
                        existingImage.css('background-color', bgColor);
                    }
                })
                .catch(function (error) {
                    console.error('Error capturing text image:', error);
                });
        }

        // Function to calculate contrasting background color based on font color
        function calculateContrastBackgroundColor(fontColor) {
            // Assuming fontColor is in hexadecimal format
            fontColor = fontColor.replace(/^#/, '');

            // Parse the hex value to RGB
            var bigint = parseInt(fontColor, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;

            // Calculate the relative luminance (brightness) of the font color
            var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            // Use white background on dark text and black background on light text
            return luminance > 0.5 ? '#000000' : '#ffffff';
        }

        // Dictionary to keep track of processed elements
        var processedElements = {};

        // Call this function when updating the style of the selected text
        function updateCustomTextImages() {
            // Reset the dictionary before processing
            processedElements = {};

            // Capture and update images for all selected texts
            $('.customText').each(function () {
                var textContainer = $(this);
                var elementId = textContainer.attr('id');

                // Check if this element has been processed
                if (!processedElements[elementId]) {
                    captureTextImageWithStyle(this); // Pass the selected text container to the function
                    processedElements[elementId] = true; // Mark as processed
                }
            });
        }

        function rgbToHex(rgb) {
            // Extract RGB values
            var rgbValues = rgb.match(/\d+/g);

            // Convert each RGB value to hexadecimal
            var hexArray = rgbValues.map(function (value) {
                var hex = parseInt(value, 10).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            });

            // Combine the hexadecimal values
            return '#' + hexArray.join('');
        }


        // Font styles dropdown change event
        $('#fontStyleDropdown, #fontSizeInput, #fontColorPicker').change(function () {
            updateFontStyles();
        });

        // Text Decoration checkboxes change event
        $('.textDecorationCheckbox').change(function () {
            var styles = getSelectedTextDecorationStyles();
            $('.selectedText').css('text-decoration', styles);
        });

        // Bold and Italic checkboxes change event
        $('.textStyleCheckbox').change(function () {
            updateTextStyle($(this).data('style'));
        });

        // Font Variant Caps radio buttons change event
        $('.fontCapsRadio').change(function () {
            var style = $(this).data('style');
            $('.selectedText').css('font-variant-caps', style);
        });

        var isDragging = false;
        var originalFontSize;
        var originalMouseX;

        $('#fontSizeInput').on('mousedown', function(e) {
            isDragging = true;
            originalFontSize = parseInt($(this).val());
            originalMouseX = e.clientX;
        });

        $('#sliderHandle').on('mousedown', function(e) {
            isDragging = true;
            originalFontSize = parseInt($('#fontSizeInput').val());
            originalMouseX = e.clientX;
        });

        $(document).on('mousemove', function(e) {
            if (isDragging) {
                var deltaX = e.clientX - originalMouseX;
                var newFontSize = originalFontSize + deltaX / 5; // Adjust the divisor for sensitivity
                $('#fontSizeInput').val(Math.max(1, Math.round(newFontSize))); // Ensure minimum value is 1
                updateFontStyles();
                updateSliderHandlePosition();
            }
        });

        $(document).on('mouseup', function() {
            isDragging = false;
        });

        $('#fontSizeInput').on('input', function() {
            updateSliderHandlePosition();
        });

        function updateSliderHandlePosition() {
            var slider = $('#horizontalSlider');
            var handle = $('#sliderHandle');
            var fontSizeInput = $('#fontSizeInput');
            var sliderWidth = slider.width();
            var maxFontSize = parseInt(fontSizeInput.attr('max')) || 100;
            var minFontSize = parseInt(fontSizeInput.attr('min')) || 1;
            var fontSizeRange = maxFontSize - minFontSize;
            var fontSize = parseInt(fontSizeInput.val());

            var handlePosition = (fontSize - minFontSize) / fontSizeRange * sliderWidth;
            handle.css('left', handlePosition + 'px');
        }

        // Set initial position and handle position
        updateSliderHandlePosition();
    });

    /* End ready of store.html */


    function updateTextStyle(style) {
        var $selectedText = $('.selectedText');
        var isBold = $('#boldCheckbox').prop('checked');
        var isItalic = $('#italicCheckbox').prop('checked');

        if (style === 'bold') {
            $selectedText.css('font-weight', isBold ? 'bold' : 'normal');
        } else if (style === 'italic') {
            $selectedText.css('font-style', isItalic ? 'italic' : 'normal');
        }
    }

    function updateFontStyles() {
        var selectedFont = $('#fontStyleDropdown').val();
        var selectedFontSize = $('#fontSizeInput').val();
        var selectedColor = $('#fontColorPicker').val();

        $('.selectedText').css({
            'font-family': selectedFont,
            'font-size': selectedFontSize + 'px',
            'color': selectedColor
        });
    }

    function getSelectedTextDecorationStyles() {
        var styles = [];
        $('.textDecorationCheckbox:checked').each(function () {
            styles.push($(this).data('style'));
        });

        return styles.join(' ');
    }

    function updateSelectionLabel() {
        var selectedText = $('.selectedText').text();
        $('#selectedTextLabel').text('Text Selected: ' + (selectedText || 'none'));
    }

    function editAddress() {
        let html = 
                '<br><form id="addressEditFields" class="address-edit-form edit-fields" method="post">' +
                '<label for="addressInput">Address:</label>' +
                '<input type="text" id="addressInput" name="addressInput" value="" required />' +

                '<label for="streetBuildingInput">Street Name, Building/House No. <i>(Optional)</i>:</label>' +
                '<input type="text" id="streetBuildingInput" name="streetBuildingInput" value="" />' +

                '<label for="zipCodeInput">ZIP Code:</label>' +
                '<input type="number" id="zipCodeInput" name="zipCodeInput" value="" required />' +

                '<input type="submit" class="save-btn btn" id="saveAddress" value="submit">' +
                '</form>';

        openDialog(html, 'Edit Address', true, '#28a745', 0, true);

        $('.address-edit-form').submit(function(e){
            e.preventDefault();
            var newAddressData = {
                address: $('#addressInput').val(),
                street: ($('#streetBuildingInput').val().length > 0) ? $('#streetBuildingInput').val() : '',
                zipcode: $('#zipCodeInput').val()
            };
            updateAddress(
                newAddressData,
                function (successMessage) {
                    addressData = newAddressData;
                    addressStreet = (addressData.street.length > 0) ? addressData.street + ", " : ""; 
                    $('#addressArea').html("Address: " + addressStreet + addressData.address + ", " + addressData.zipcode + " <span class='option' onclick='editAddress()'>[Edit]</span>");
                    openDialog(successMessage, 'Success', true, '#28a745', 600);
                },
                function (errorMessage) {
                    openDialog(errorMessage, 'Error', true, '#cc0202', 600);
                }
            );
        });
    }

    function editContactNumber() {
        let html = 
                '<br><form id="contactNumberEditFields" class="contact-number-edit-form edit-fields" method="post">' +
                '<label for="contactNumberInput">Contact Number/Email:</label>' +
                '<input type="text" id="contactNumberInput" name="contactNumberInput" value="" required />' +
                '<input type="submit" class="save-btn btn" id="saveContactNumber" value="submit">' +
                '</form>';

        openDialog(html, 'Edit Contact Number', true, '#28a745', 0, true);

        $('.contact-number-edit-form').submit(function(e){
            e.preventDefault();
            newContactNumberData = $('#contactNumberInput').val();
            updateContactNumber(
                newContactNumberData,
                function (successMessage) {
                    contactNumberData = newContactNumberData;
                    $('#contactNumberArea').html("Contact: " + $('#contactNumberInput').val() + " <span class='option' onclick='editContactNumber()'>[Edit]</span>");
                    openDialog(successMessage, 'Success', true, '#28a745', 600);
                },
                function (errorMessage) {
                    openDialog(errorMessage, 'Error', true, '#cc0202', 600);
                }
            );
        });
    }


    function updateAddress(addressData, successCallback, errorCallback) {
        // Prepare the data to be sent as JSON
        var jsonData = JSON.stringify(addressData);

        // Make an AJAX request
        $.ajax({
            type: 'POST',
            url: 'php-api/UpdateAddress.php',
            data: jsonData,
            contentType: 'application/json', // Set content type to JSON
            dataType: 'json',
            success: function (data) {
                if (data.status === 'success') {
                    // Execute the success callback
                    successCallback(data.message);
                } else {
                    // Execute the error callback
                    errorCallback(data.message);
                }
            },
            error: function (xhr, status, error) {
                // Log detailed information about the error
                console.error("XHR:", xhr);
                console.error("Status:", status);
                console.error("Error:", error);

                // Execute the error callback
                errorCallback('AJAX Error ' + error);
            }
        });
    }

    function updateContactNumber(contactNumberData, successCallback, errorCallback) {
        // Make an AJAX request
        $.ajax({
            type: 'POST',
            url: 'php-api/UpdateContactNumber.php',
            data: { contactNumber: contactNumberData },
            success: function (data) {
                if (data.status === 'success') {
                    // Execute the success callback
                    successCallback(data.message);
                } else {
                    // Execute the error callback
                    errorCallback(data.message);
                }
            },
            error: function (xhr, status, error) {
                // Log detailed information about the error
                console.error("XHR:", xhr);
                console.error("Status:", status);
                console.error("Error:", error);

                // Execute the error callback
                errorCallback('AJAX Error ' + error);
            }
        });
    }

    function colorPickerShirtType(pageNumber = 1, productShirt = 0) {
        $('#tshirtImage').attr('src', '');
        $('#frontPreview').attr('src', 'images/image-solid.svg');
        $('#backPreview').attr('src', 'images/image-solid.svg');
        $('#rightPreview').attr('src', 'images/image-solid.svg');
        $('#leftPreview').attr('src', 'images/image-solid.svg');

        $('#shirtColorName').empty();
        $('#colorPickerLoading').show();
        $('#colorPicker').empty();
        $('#pagination').empty(); // Clear previous pagination

        if(productShirt != 0) {
            setTimeout(function() {
                $('input[type="radio"].colorRadio[value="' + productShirt + '"]').trigger('click');
            }, 600);
        }

        $.ajax({
            type: "GET",
            url: "php-api/ShirtDataByType.php",
            data: { shirtType: $('#shirtType').val() },
            dataType: "json", // Expect JSON response
            success: function(response) {
                $('#colorPickerLoading').hide();

                if (response && response.length > 0) {
                    // Check if shirtType is "design" for pagination
                    if ($('#shirtType').val() === 'design') {
                        var itemsPerPage = 4;
                        var startIndex = (pageNumber - 1) * itemsPerPage;
                        var endIndex = startIndex + itemsPerPage;
                        var paginatedData = response.slice(startIndex, endIndex);
                        var totalPages = Math.ceil(response.length / itemsPerPage);

                        var html = '';
                        $.each(paginatedData, function(index, item) {
                            html += item.message; // Append each shirt's HTML to the container
                        });
                        $('#colorPicker').html(html);

                        // Pagination controls
                        var paginationHtml = '<ul class="pagination">';
                        paginationHtml += '<li class="page-item ' + (pageNumber === 1 ? 'disabled' : '') + '"><a class="page-link" href="#" onclick="prevPage()">Previous</a></li>';
                        for (var i = 1; i <= totalPages; i++) {
                            paginationHtml += '<li class="page-item ' + (i === pageNumber ? 'active' : '') + '"><a class="page-link" href="#" onclick="colorPickerShirtType(' + i + ')">' + i + '</a></li>';
                        }
                        paginationHtml += '<li class="page-item ' + (pageNumber === totalPages ? 'disabled' : '') + '"><a class="page-link" href="#" onclick="nextPage()">Next</a></li>';
                        paginationHtml += '</ul>';
                        $('#pagination').html(paginationHtml);

                        // Trigger click on the first radio input if it's the first load
                        if (firstTime) {
                            setTimeout(function() {
                                $('input[type="radio"].colorRadio:first').trigger('click');
                            }, 600);
                            firstTime = false;
                        }

                        // Attach click event listener to update color name
                        $('.colorRadio').click(function() {
                            var shirtColorName = $(this).data('shirtcolor');
                            $('#shirtColorName').text(shirtColorName);
                        });
                    } else {
                        // If shirtType is not "design", show all items without pagination
                        var html = '';
                        $.each(response, function(index, item) {
                            html += item.message; // Append each shirt's HTML to the container
                        });
                        $('#colorPicker').html(html);

                        // Trigger click on the first radio input if it's the first load
                        if (firstTime) {
                            setTimeout(function() {
                                $('input[type="radio"].colorRadio:first').trigger('click');
                            }, 600);
                            firstTime = false;
                        }

                        // Attach click event listener to update color name
                        $('.colorRadio').click(function() {
                            var shirtColorName = $(this).data('shirtcolor');
                            $('#shirtColorName').text(shirtColorName);
                        });
                    }
                } else {
                    console.log("Empty response or invalid data format");
                }
            },
            error: function(error) {
                console.log("Error:", error);
            }
        });
    }

    function prevPage() {
        var currentPage = parseInt($('.pagination').find('.active').text());
        if (currentPage > 1) {
            colorPickerShirtType(currentPage - 1);
        }
    }

    function nextPage() {
        var currentPage = parseInt($('.pagination').find('.active').text());
        var totalPages = parseInt($('.pagination').find('li').last().prev().find('a').text());
        if (currentPage < totalPages) {
            colorPickerShirtType(currentPage + 1);
        }
    }
    /* End code of store.html */
} else if(htmlPage == "uploads.html") {
    /* Initialized uploads.html */

    $(document).ready(function () {

        sideBarItemsClick(true);

        $('#dialogContainer').dialog({
            autoOpen: false,
            modal: true,
            buttons: {  
                OK: function() {$(this).dialog("close");}  
            },
            open: function(event, ui) 
            { 
                $('.ui-widget-overlay').bind('click', function()
                { 
                    $("#dialogContainer").dialog('close'); 
                }); 
            }
        });

        checkUserIdOnLoad();

        $('.image-input').change(function () {
            const previewId = $(this).data('preview');
            const preview = $('#' + previewId)[0];
            const file = this.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    if(previewId == "frontPreview") {
                        $('#tshirtImage').attr('src', e.target.result);
                    }
                    preview.src = e.target.result;
                };

                reader.readAsDataURL(file);
            }
        });

        $('.view-button').click(function () {
            const preview = $(this).attr('src');
            $('#tshirtImage').attr('src', preview);
        });

        $('#uploadShirtForm').submit(function (event) {
            event.preventDefault(); // Prevent the default form submission

            $('.fa-spinner').show();

            const formData = new FormData(this);

            $.ajax({
                url: 'php-api/UploadShirt.php',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (result) {
                    openDialog(result, 'Success', true, '#28a745', 600);
                    $('input[name=frontImage]').val('');
                    $('input[name=backImage]').val('');
                    $('input[name=rightImage]').val('');
                    $('input[name=leftImage]').val('');
                    $('input[name=shirtColor]').val('');
                    $('#tshirtImage').attr('src', '');
                    $('#frontPreview').attr('src', 'images/image-solid.svg');
                    $('#backPreview').attr('src', 'images/image-solid.svg');
                    $('#rightPreview').attr('src', 'images/image-solid.svg');
                    $('#leftPreview').attr('src', 'images/image-solid.svg');
                    $('.fa-spinner').hide();
                    colorPickerShirtType();
                },
                error: function () {
                    console.log('Error loading page');
                    $('.fa-spinner').hide();
                }
            });

            return false;
        });

        function checkUserIdOnLoad() {
            $.ajax({
                type: "GET",
                url: "php-api/CheckUserId.php",
                dataType: "json",
                success: function (response) {
                    if (response.status === "success" && response.userLoggedIn) {
                        // User is logged in
                        if (response.user_id === 1) {
                            // User has user_id equal to 1, proceed with the form
                            $('#uploadButton').prop('disabled', false);
                        } else {
                            // User does not have user_id equal to 1, disable the form
                            $('#uploadButton').prop('disabled', true);
                            openDialog("You are not authorized to upload T-shirt images.", 'Status', false);
                        }
                    } else {
                        $('#uploadButton').prop('disabled', true);
                        openDialog("You are not authorized to upload T-shirt images.", 'Status', false);
                        location.href = 'index.html';
                    }
                },
                error: function (error) {
                    console.error('Error checking user_id: ' + JSON.stringify(error));
                }
            });
        }

        colorPickerShirtType();

        $('#shirtTypeDelete').on('change', function(){
            const selectedIndex = $('#shirtTypeDelete').prop('selectedIndex');
            if (selectedIndex === 1) {
              $('#colorPicker').css('gap', '0');
            } else if (selectedIndex === 0) {
              $('#colorPicker').css('gap', '10px');
            }

            colorPickerShirtType();
        });

        // Color/design Deletion

        $('#deleteShirtForm').submit(function (event) {
            event.preventDefault(); // Prevent the default form submission

            var isConfirmed = confirm("Are you sure you want to delete the " + $('#shirtTypeDelete').val() + "?");

            if(isConfirmed) {
                $('#deleteShirtLoading').show();

                const formData = new FormData(this);

                $.ajax({
                    url: 'php-api/DeleteShirtById.php',
                    type: 'POST',
                    data: { ShirtId : $('input[class="colorRadio"]:checked').val() },
                    dataType: "json",
                    success: function (response) {
                        $('#deleteShirtLoading').hide();
                        openDialog(response.message, response.status, true, '#28a745', 800);
                        colorPickerShirtType();
                    },
                    error: function () {
                        console.log('Error loading page');
                        $('.fa-spinner').hide();
                    }
                });
            } else {
                // Do nothing
            }

            return false;
        });

    });

    /* End ready of uploads.html */

    function colorPickerShirtType(pageNumber = 1) {
        $('#shirtColorName').empty();
        $('#colorPickerLoading').show();
        $('#colorPicker').empty();
        $('#pagination').empty();
        $.ajax({
            type: "GET",
            url: "php-api/ShirtDataByType.php",
            data: { shirtType : $('#shirtTypeDelete').val() },
            dataType: "json",
            success: function (response) {
                $('#colorPickerLoading').hide();

                if ($('#shirtTypeDelete').val() === 'design') {
                    var itemsPerPage = 4;
                    var startIndex = (pageNumber - 1) * itemsPerPage;
                    var endIndex = startIndex + itemsPerPage;
                    var paginatedData = response.slice(startIndex, endIndex);
                    var totalPages = Math.ceil(response.length / itemsPerPage);

                    var html = '';
                    $.each(paginatedData, function(index, item) {
                        html += item.message; // Append each shirt's HTML to the container
                    });
                    $('#colorPicker').html(html);

                    // Pagination controls
                    var paginationHtml = '<ul class="pagination">';
                    paginationHtml += '<li class="page-item ' + (pageNumber === 1 ? 'disabled' : '') + '"><a class="page-link" href="#" onclick="prevPage()">Previous</a></li>';
                    for (var i = 1; i <= totalPages; i++) {
                        paginationHtml += '<li class="page-item ' + (i === pageNumber ? 'active' : '') + '"><a class="page-link" href="#" onclick="colorPickerShirtType(' + i + ')">' + i + '</a></li>';
                    }
                    paginationHtml += '<li class="page-item ' + (pageNumber === totalPages ? 'disabled' : '') + '"><a class="page-link" href="#" onclick="nextPage()">Next</a></li>';
                    paginationHtml += '</ul>';
                    $('#pagination').html(paginationHtml);

                    // Trigger click on the first radio input if it's the first load
                    if (firstTime) {
                        setTimeout(function() {
                            $('input[type="radio"].colorRadio:first').trigger('click');
                        }, 600);
                        firstTime = false;
                    }

                    // Attach click event listener to update color name
                    $('.colorRadio').click(function() {
                        var shirtColorName = $(this).data('shirtcolor');
                        $('#shirtColorName').text(shirtColorName);
                    });
                } else {
                    // If shirtType is not "design", show all items without pagination
                    var html = '';
                    $.each(response, function(index, item) {
                        html += item.message; // Append each shirt's HTML to the container
                    });
                    $('#colorPicker').html(html);

                    // Attach click event listener to update color name
                    $('.colorRadio').click(function() {
                        var shirtColorName = $(this).data('shirtcolor');
                        $('#shirtColorName').text(shirtColorName);
                    });
                }
            },
            error: function (error) {
                $('#colorPickerLoading').hide();
                console.log("Error:", error);
            }
        });
    }

    function prevPage() {
        var currentPage = parseInt($('.pagination').find('.active').text());
        if (currentPage > 1) {
            colorPickerShirtType(currentPage - 1);
        }
    }

    function nextPage() {
        var currentPage = parseInt($('.pagination').find('.active').text());
        var totalPages = parseInt($('.pagination').find('li').last().prev().find('a').text());
        if (currentPage < totalPages) {
            colorPickerShirtType(currentPage + 1);
        }
    }

    /* End code of uploads.html */

} else if(htmlPage == "orders.html") {
    /* Initialized orders.html */

    var orders = [];
    var originalOrderList = []; // Array to store the original order of orders
    var currentIndex = 0;
    var currentPage = 1;
    var itemsPerPage = 5;


    $(document).ready(function () {

        sideBarItemsClick(true);

        $('#dialogContainer').dialog({
            autoOpen: false,
            modal: true,
            buttons: {  
                OK: function() {$(this).dialog("close");}  
            },
            open: function(event, ui) 
            { 
                $('.ui-widget-overlay').bind('click', function()
                { 
                    $("#dialogContainer").dialog('close'); 
                }); 
            }
        });

        // Fetch and display orders
        if(urlParams.has('status')) {
            activateStatusTab(urlParams.get('status'));
            fetchOrders(urlParams.get('status'));
        } else {
            activateStatusTab('all');
            fetchOrders();
        }
        

        // Function to fetch and display orders
        function fetchOrders(statusParam = "") {
            $.ajax({
                type: "GET",
                url: "php-api/GetOrders.php",
                data: {orderStatus: statusParam},
                dataType: "json",
                success: function (response) {
                    if (response.status === "success") {
                        orders = response.data;

                        if (urlParams.has('orderReferenceKey')) {
                            setTimeout(function(){moveOrder(urlParams.get('orderReferenceKey'));}, 1000);
                        }

                        originalOrderList = response.data.slice(); // Create a copy of the original orders
                        displayOrder(currentIndex);
                        populateOrderReferences(); // Populate order references only once
                        showPage(currentPage);
                    } else if (response.status === 'no_orders') {
                        $("#ordersArea").html("<h1><i class='fa fa-ban'> " + response.message + "</h1>");
                    } else {
                        // Display an error message
                        $("#ordersArea").html("<p>Error: " + response.message + "</p>");
                    }
                },
                error: function (error) {
                    $("#ordersArea").html("<p>Error: Unable to fetch orders</p>");
                }
            });
        }

        var orderReferencesPagesButton = [];
        var orderReferencesPaginated = [];
        var orderReferencesItemsPerPage = 5;
        var orderReferenceCurrentPage = 0;

        // Function to update pagination buttons based on total pages
        function updateOrderReferencesPagination() {
            var totalPages = Math.ceil(orders.length / orderReferencesItemsPerPage);
            var paginationButtons = $("#paginationButtons");
            paginationButtons.empty();

            orderReferencesPagesButton = []; // Clear previous buttons
            orderReferencesPaginated = [];   // Clear previous paginated data

            for (var i = 1; i <= totalPages; i++) {
                var button = $("<button onclick='showOrderReferencesPage(" + i + ")'>" + i + "</button>");
                orderReferencesPagesButton.push(button);
            }

            for (var i = 0; i < orders.length; i++) {
                var pageIndex = Math.floor(i / orderReferencesItemsPerPage);

                if (!orderReferencesPaginated[pageIndex]) {
                    orderReferencesPaginated[pageIndex] = [];
                }

                var referenceKey = orders[i].ReferenceKey;
                orderReferencesPaginated[pageIndex].push(referenceKey);
            }

            orderReferencesPagesButton.forEach(function(button, index) {
                paginationButtons.append(button);
                if (index === orderReferenceCurrentPage) {
                    button.addClass("active");
                }
            });
        }

        // Function to populate initial order references and pagination
        function populateOrderReferences() {
            var orderReferencesList = $("#orderReferencesList");

            // Clear existing order references
            orderReferencesList.empty();

            // Populate order references dynamically
            for (var i = 0; i < orders.length; i++) {
                if (i < orderReferencesItemsPerPage) {
                    var orderReference = orders[i].ReferenceKey;
                    // Extract the numeric part of the order reference
                    var orderNumber = orderReference.replace("ORDER_", "");
                    var listItem = $("<li><a href='#' onclick='moveOrder(\"" + orderReference + "\")'>" + orderNumber + "</a></li>");
                    orderReferencesList.append(listItem);
                }
            }

            updateOrderReferencesPagination();
        }

        // Function to show a specific page of order references
        window.showOrderReferencesPage = function(page) {
            var pageIndex = page - 1;
            var orderReferencesList = $("#orderReferencesList");
            orderReferencesList.empty();

            if (orderReferencesPaginated[pageIndex]) {
                orderReferencesPaginated[pageIndex].forEach(function(reference) {
                    var orderNumber = reference.replace("ORDER_", "");
                    orderReferencesList.append("<li><a href='#' onclick='moveOrder(\"" + reference + "\")'>" + orderNumber + "</a></li>");
                });

                orderReferenceCurrentPage = pageIndex;
            }

            // Update active state of pagination buttons
            $("#paginationButtons button").removeClass("active");
            $("#paginationButtons button").eq(pageIndex).addClass("active");
        };

        // Function to navigate to the previous page
        window.prevPage = function() {
            if (orderReferenceCurrentPage > 0) {
                showOrderReferencesPage(orderReferenceCurrentPage);
            }
        };

        // Function to navigate to the next page
        window.nextPage = function() {
            var totalPages = Math.ceil(orders.length / orderReferencesItemsPerPage);
            if (orderReferenceCurrentPage < totalPages - 1) {
                showOrderReferencesPage(orderReferenceCurrentPage + 2);
            }
        };

        window.showPage = function (page) {
            currentPage = page;
            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;
            var slicedOrders = orders.slice(startIndex, endIndex);
        };

        $(document).on('change', '#addAdjustmentCheckbox', function () {
            var orderId = $(this).closest('.order').find('span#orderId').text();
            var label = $('#adjustmentLabel_' + orderId);

            if (this.checked) {
                label.text('(Added)');
            } else {
                label.text('(Subtracted)');
            }
        });

        window.updateOrder = function (order) {
            $('.fa-spinner').show();

            const formData = new FormData();

            const orderId = $('span#orderId').text(); // Get Order Id
            const status = $('.statusDropdown :selected').val();
            const downPayment = $('#downPayment_' + orderId).val();
            const adjustmentPrice = $('#adjustmentPrice_' + orderId).val();
            const addAdjustmentCheckbox = $('#addAdjustmentCheckbox').prop('checked') ? 'Added' : 'Subtracted';

            formData.append("orderId", order.OrderId);
            formData.append("status", status);
            formData.append("downPayment", downPayment);
            formData.append("adjustmentPrice", adjustmentPrice);
            formData.append("adjustmentType", addAdjustmentCheckbox);
            formData.append("userId", order.UserId);
            formData.append("referenceKey", order.ReferenceKey);

            $.ajax({
                type: "POST",
                url: "php-api/UpdateOrder.php",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.status == 'success') {
                        openDialog(response.message, 'Success', true, '#28a745');
                        $('.fa-spinner').hide();
                        // Fetch orders again to update the data
                        fetchOrders();
                        setTimeout(function () {
                            $('#dialogContainer').dialog('close');
                        }, 500);
                    } else {
                        openDialog(response.message, response.status);
                    }
                },
                error: function (response) {
                    openDialog(response.message, response.status);
                }
            });
        };


        // Function to navigate to the previous order
        window.prevOrder = function () {
            currentIndex = (currentIndex - 1 + originalOrderList.length) % originalOrderList.length;
            displayOrder(currentIndex);
        };

        // Function to navigate to the next order
        window.nextOrder = function () {
            currentIndex = (currentIndex + 1) % originalOrderList.length;
            displayOrder(currentIndex);
        };

        // Function to move to a specific order by reference ID
        window.moveOrder = function (referenceId) {
            var orderIndex = originalOrderList.findIndex(function (order) {
                return order.ReferenceKey === referenceId;
            });

            if (orderIndex !== -1) {
                currentIndex = orderIndex;
                displayOrder(currentIndex);
            }
        };

        $(document).keydown(function (e) {
            if (e.keyCode === 37) {
                // Left arrow key
                prevOrder();
            } else if (e.keyCode === 39) {
                // Right arrow key
                nextOrder();
            }
        });

        // Mark As Seen
        

        if(urlParams.has('order') && urlParams.get('order') === "last") {
            setTimeout(function(){prevOrder();}, 1000);
        }

        if(urlParams.has('notifId')) {
            $.ajax({
                type: "POST",
                url: "php-api/MarkNotificationAsSeen.php",
                data: { notifId: urlParams.get('notifId') },
                dataType: "json",
                success: function (response) {
                    loadNotifications($('#notificationsList'));
                },
                error: function (xhr, status, error) {
                    console.error("Error marking notification as seen:", error);
                }
            });
        }

        // Print order function
        window.printOrder = function () {
            // Hide the buttons before printing
            $('#cancelOrderBtn, #printOrderBtn').hide();
            $('#remarksInputArea').hide();
            $('.delete-button').hide();
            $('#updateOrderBtn').hide();
            $('#customImagesList').css('max-height', 'none');

            var printContent = $('.order-card').html();

            // Create a new window and write the content to it
            var printWindow = window.open('', '_blank');
            printWindow.document.open();
            printWindow.document.write('<html><head><title>Print Order</title>');

            // Include external stylesheets
            $('link[rel="stylesheet"]').each(function () {
                var stylesheetLink = $(this).prop('outerHTML');
                printWindow.document.write(stylesheetLink);
            });

            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();

            // Wait for the content to be rendered before printing
            printWindow.onload = function () {
                // Show the buttons again after printing
                $('#cancelOrderBtn, #printOrderBtn').show();
                $('#remarksInputArea').show();
                $('.delete-button').show();
                $('#updateOrderBtn').show();
                $('#customImagesList').css('max-height', '100px');

                printWindow.print();
                printWindow.onafterprint = function () {
                    printWindow.close();
                };
            };
        };

        // Search functionality
        $("#searchInput").on("input", function () {
            if($(this).val() == "") {
                showOrderReferencesPage(1);
                return;
            }
            var searchText = $(this).val().toLowerCase();
            var filteredOrders = originalOrderList.filter(function (order) {
                return order.ReferenceKey.toLowerCase().includes(searchText);
            });
            displayFilteredOrders(filteredOrders);
        });

        // Function to display filtered orders
        function displayFilteredOrders(filteredOrders) {
            var orderReferencesList = $("#orderReferencesList");

            // Clear existing order references
            orderReferencesList.empty();

            // Populate order references dynamically
            for (var i = 0; i < filteredOrders.length; i++) {
                var orderReference = filteredOrders[i].ReferenceKey;
                // Extract the numeric part of the order reference
                var orderNumber = orderReference.replace("ORDER_", "");
                var listItem = $("<li></span><a href='#' onclick='moveOrder(\"" + orderReference + "\")'>" + orderNumber + "</a></li>");
                orderReferencesList.append(listItem);
            }
        }

        var uploadedRemarksImages = [];

        $(document).on('change', '#remarksInputArea input[name="customRemarksImages[]"]', function(){
            var customRemarksImagesList = $('#customRemarksImagesList');

            for(var i = 0; i < this.files.length; i++) {
                var file = this.files[i];
                var reader = new FileReader();

                reader.onload = function(e) {
                    var dataUrl = e.target.result;

                    if(uploadedRemarksImages.indexOf(dataUrl) === -1) {
                        customRemarksImagesList.show();
                        var listItem = $('<div>').addClass('custom-image-item');

                        var imagePreview = $('<img>').attr('src', dataUrl).css('max-width', '80px');

                        listItem.append(imagePreview);
                        listItem.append($('<div>').text(file.name));

                        var removeButton = $('<button class="removeButton" style="width: auto;font-size: 14px;">&#10006;</button>');
                        listItem.append(removeButton);

                        removeButton.click(function () {
                            var container = $(this).closest('.custom-image-item');
                            container.remove();
                            uploadedRemarksImages = uploadedRemarksImages.filter(img => img !== dataUrl);
                        });

                        customRemarksImagesList.append(listItem);
                        uploadedRemarksImages.push(dataUrl);
                    }
                };
                reader.readAsDataURL(file);
            }
        });

    });

    /* End ready of orders.html */

    // Function to display orders
    function displayOrder(index) {
        var order = orders[index];
        var ordersArea = $("#ordersArea");
        var address = JSON.parse(order.Address);

        var imageContainer = "<div class='image-container'>" +
            "<img src='" + order.FrontImageUrl + "' alt='Front Image' class='image-preview'>" +
            "<div id='viewButtons'>" +
            "<label>" +
            "<input type='radio' class='viewRadio' name='tShirtPreview_" + order.OrderId + "' value='front' checked>" +
            "<img class='view-button' alt='Front Image Preview' src='" + order.FrontImageUrl + "'>" +
            "<p class='view-label'>Front</p>" +
            "</label>" +
            "<label>" +
            "<input type='radio' class='viewRadio' name='tShirtPreview_" + order.OrderId + "' value='back'>" +
            "<img class='view-button' alt='Back Image Preview' src='" + order.BackImageUrl + "'>" +
            "<p class='view-label'>Back</p>" +
            "</label>" +
            "<label>" +
            "<input type='radio' class='viewRadio' name='tShirtPreview_" + order.OrderId + "' value='right'>" +
            "<img class='view-button' alt='Right Image Preview' src='" + order.RightImageUrl + "'>" +
            "<p class='view-label'>Right</p>" +
            "</label>" +
            "<label>" +
            "<input type='radio' class='viewRadio' name='tShirtPreview_" + order.OrderId + "' value='left'>" +
            "<img class='view-button' alt='Left Image Preview' src='" + order.LeftImageUrl + "'>" +
            "<p class='view-label'>Left</p>" +
            "</label>" +
            "</div>" +
            "</div>";

        var customImagesList = "<div id='customImagesList' style='max-height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; margin-top: 5px;''>" +
            "<div class='custom-image-item'><img src='' style='max-width: 50px;'>" +
            "<div>15vIpV.jpg</div>" +
            "</div>" +
            "</div>";

        var statusDropdown = "<div class='otherCharges total-row' style='margin-top: -14px;'>" +
            "<h3>Status:</h3>" +
            "<div class='space2'></div>" +
            "<select class='statusDropdown'>" +
            "<option value='Pending'" + (order.OrderStatus === 'Pending' ? ' selected' : '') + ">Pending</option>" +
            "<option value='Processing'" + (order.OrderStatus === 'Processing' ? ' selected' : '') + ">Processing</option>" +
            "<option value='Shipped'" + (order.OrderStatus === 'Shipped' ? ' selected' : '') + ">Shipped</option>" +
            "<option value='Delivered'" + (order.OrderStatus === 'Delivered' ? ' selected' : '') + ">Delivered</option>" +
            "<option value='Cancelled'" + (order.OrderStatus === 'Cancelled' ? ' selected' : '') + ">Cancelled</option>" +
            "<option value='Deleted'" + (order.OrderStatus === 'Deleted' ? ' selected' : '') + ">Deleted</option>" +
            "</select>" +
            "</div>";


        var downPaymentInput = "<div class='otherCharges total-row'>" +
            "<h3>Down Payment:</h3>" +
            "<div class='space2'></div>" +
            "<input type='number' id='downPayment_" + order.OrderId + "' class='downPaymentInput' value='" + order.DownPayment + "'>" +
            "</div>";

        var addAdjustmentCheckbox = "<input type='checkbox' id='addAdjustmentCheckbox'" + (order.AdjustmentType === 'Added' ? ' checked' : '') + ">";
        var adjustmentPriceInput = "<div class='otherCharges total-row'>" +
            "<h3>Adjustment Price:</h3>" +
            "<div class='space2'></div>" +
            addAdjustmentCheckbox +
            "<div class='adjustment-input-container'>" +
            "<input type='number' id='adjustmentPrice_" + order.OrderId + "' class='adjustmentPriceInput' value='" + order.AdjustmentPrice + "'>" +
            "<span id='adjustmentLabel_" + order.OrderId + "' style='margin-top:10px;'>(" + order.AdjustmentType + ")</span>" +
            "</div>" +
            "</div>";

        var remarksArea = "<div id='remarksInputArea'>" +
                "<br>" +
                "<textarea id='remarksTextInput' name='remarksText' rows='4' cols='50' placeholder='Add your remarks here...'></textarea>" +
                "<p><b>Add images to your remarks <i>(Optional):</i></b></p>" +
                "<input type='file' name='customRemarksImages[]' id='customRemarksImagesInput' accept='image/*' class='image-input-2' multiple='' required='' style='display: inline-block;'>" +
                "<div id='customRemarksImagesList' style='display: none;max-height: 200px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; margin-top: 5px;'></div>" +
                "<button class='btn' id='addRemarks' style='width: auto;font-size: 14px;padding: 12px;'>Add remarks</button>" +
            "</div>";

        var updateButton = "<button onclick='updateOrder(orders[currentIndex])'' class='btn' id='updateOrderBtn'>Update</button>"; // Add an Update button

        var printButton = "<button class='btn' onclick='printOrder()' id='printOrderBtn'><i class='fa fa-print'></i></button>";

        var orderDateDisplay = order.OrderDate.split(" ")[0] + " " + convertTo12HourFormat(order.OrderDate.split(" ")[1]);

        var addressHtml = address !== null
            ? "<p>Address: <span id='addressId'>" + address.street + ", " + address.address + ", " + address.zipcode + "</span></p>"
            : "";

        var contactNumberHtml = "<p>Contact: <span id='contactNumberId'>" + order.ContactNumber + "</span></p>";

        var orderContainer = $("<div class='order'>" +
            "<div style='border: 1px solid gray; padding: 2px 18px; background-color: " + getBackgroundColor(order.OrderStatus) + ";'><h2>" + order.OrderStatus + "</h2></div>" +
            "<p>Order Reference: <span id='referenceKey'>" + order.ReferenceKey + "</span></p>" +
            "<p><span id='orderId'>" + order.OrderId + "</span></p>" +
            "<p>Order Date: " + orderDateDisplay + "</p>" +
            "<p>Total Amount: &#8369;" + order.TotalAmount + "</p>" +
            "<p>Contact Name: <span id='nameId'></span></p>" +
            addressHtml +
            contactNumberHtml +
            imageContainer +
            customImagesList +
            "<div class='total-details'>" + order.TotalDetails + "</div>" +
            statusDropdown +
            "<div class='adjustment-down-payment-container'>" +
            downPaymentInput +
            adjustmentPriceInput +
            "</div><br>" +
            "<div id='adjustedTotalSumArea'></div>" +
            "</div><br><br>" +
            "<div id='remarksArea'></div>" +
            remarksArea +
            updateButton + // Append the Update button
            printButton +
            "<i class='fa fa-spinner fa-spin' style='font-size:24px;display:none;''></i></div>" +
            "<br><br></div>" +
            "</div>");

        GetUserDetailsById(order.UserId, function (fullName) {
            $('#nameId').html(fullName);
        });

        ordersArea.html(orderContainer);

        getCustomImages(order.OrderId);

        var totalSumText = $('#totalSum').text();

        var adjustedTotalSum = (order.AdjustmentType === 'Added') 
          ? parseFloat(totalSumText) + parseFloat(order.AdjustmentPrice)
          : parseFloat(totalSumText) - parseFloat(order.AdjustmentPrice);

        $('#adjustedTotalSumArea').html("<h2>Total:</h2>\n<div class='space2'></div>\n<h2>&#8369;<span id='totalSum'>" + adjustedTotalSum + "</span>");
        $('.total-details .total-row h2:contains("Total:")').remove();
        $('.total-details .total-row h2:has(span#totalSum)').remove();
        $('#adjustedTotalSumArea').addClass('total-row');


        $("#ordersArea").on('change', 'input[type="radio"][class^="viewRadio"]', function () {
            var selectedView = $(this).val();
            var order = $(this).closest('.order');
            order.find(".image-preview").attr("src", order.find('.viewRadio:checked + .view-button').attr('src'));
        });

        var orderUserId = order.UserId;

        // Select all Remarks
        $.ajax({
            type: "GET",
            url: "php-api/GetRemarks.php",
            dataType: "json",
            data: { orderId: order.OrderId }, // Pass the order ID to fetch remarks for that specific order
            success: function(response) {
                if (response.status === "Success") {
                    // Iterate through each remark
                    response.remarks.forEach(function(remark) {
                        // Create a div for the remark
                        var remarksDiv = $('<div>').addClass('remarks-item').css('border', '1px solid #ccc').css('padding', '10px').css('position', 'relative');

                        // Add remark text if available
                        if (remark.RemarkText.length > 0) {
                            var textSection = $('<pre>').text(remark.RemarkText);
                            remarksDiv.append(textSection);
                        }

                        // Add images if available
                        if (remark.Images.length > 0) {
                            remark.Images.forEach(function(imagePath) {
                                var imgElement = $('<img>').attr('src', imagePath);
                                remarksDiv.append(imgElement);
                            });
                        }              

                        // Add delete button
                        var deleteButton = $('<button>').addClass('delete-button').html('<i class="fa fa-times"></i>').click(function () {
                            $.ajax({
                                type: "POST",
                                url: "php-api/DeleteRemark.php",
                                data: { RemarkId: remark.RemarkId },
                                success: function (response) {
                                    if (response.status === "Success") {
                                        remarksDiv.remove();
                                    } else {
                                        openDialog('Error deleting remark: ' + response.message, 'Error', true, '#cc0202', 1300);
                                    }
                                },
                                error: function (response) {
                                    openDialog('Error deleting remark!', 'Error', true, '#cc0202', 1300);
                                }
                            });
                        }).css({'position': 'absolute', 'top': '5px', 'right': '5px', 'width': 'auto', 'font-size': '14px'});
                        remarksDiv.append(deleteButton);

                        // Display the RemarkDate
                        var remarkDate = $('<p>').addClass('remarkDate').text(remark.RemarkDate);
                        remarksDiv.append(remarkDate);

                        var replyLink = $('<span>').addClass('reply-link').text('Reply').css({'margin-left': '10px'});

                        remarksDiv.append(replyLink);

                        remarksDiv.data('remarkId', remark.RemarkId);

                        // Add replies if available
                        if (remark.Replies.length > 0) {
                            var fragment = document.createDocumentFragment();
                            remark.Replies.forEach(function (reply) {
                                GetUserDetailsById(reply.UserId, function(fullName) {
                                    var replyUser = $('<p>').addClass('remarkDate').text(fullName);
                                    var replyText = $('<pre>').text(reply.ReplyText);
                                    var replyDate = $('<p>').addClass('remarkDate').text(reply.ReplyDate);

                                    var replyDiv = $('<div>').addClass('reply-item');
                                    replyDiv.append(replyUser);
                                    replyDiv.append(replyText);
                                    replyDiv.append(replyDate);

                                    // Add Reply delete button

                                    var deleteReplyButton = $('<button>').addClass('delete-button').html('<i class="fa fa-times"></i>').click(function () {
                                        $.ajax({
                                            type: "POST",
                                            url: "php-api/DeleteReply.php",
                                            data: { ReplyId: reply.ReplyId },
                                            success: function (response) {
                                                if (response.status === "Success") {
                                                    replyDiv.remove();
                                                } else {
                                                    openDialog('Error deleting reply: ' + response.message, 'Error', true, '#cc0202', 1300);
                                                }
                                            },
                                            error: function (response) {
                                                openDialog('Error deleting reply!', 'Error', true, '#cc0202', 1300);
                                            }
                                        });
                                    }).css({'position': 'absolute', 'top': '5px', 'right': '5px', 'width': 'auto', 'font-size': '14px'});
                                    replyDiv.append(deleteReplyButton);
                                    

                                    // Append each reply div individually to the fragment
                                    fragment.append(replyDiv[0]);

                                    // Append the fragment to the remarksDiv element once all the DOM elements are created
                                    if (fragment.childNodes.length === remark.Replies.length) {
                                        remarksDiv.append(fragment);
                                    }
                                });
                            });
                        }

                        // Append the remark to the remarksArea
                        $('#remarksArea').prepend(remarksDiv);
                    });

                    // Reply click function

                    $(document).on('click', '.reply-link', function() {
                        // Check if a reply text area already exists for this remark
                        if ($(this).siblings('.replyInputArea').length === 0) {
                            // Create a reply text area for this specific remark
                            var replyTextInput = $("<textarea class='replyTextInput' rows='4' cols='50' placeholder='Reply to ...'></textarea>");
                            var addReplyButton = $("<button class='btn addReply' style='width: auto;font-size: 14px;padding: 12px;'>Reply</button>");
                            var replyInputArea = $("<div class='replyInputArea'></div>");

                            replyInputArea.append(replyTextInput);
                            replyInputArea.append(addReplyButton);

                            // Append the reply area to the parent of the clicked "Reply" link
                            $(this).parent().append(replyInputArea);

                            // .addReply click event handler here
                            $(document).on('click', '.addReply', function(){
                                var replyText = $(this).siblings('.replyTextInput').val();
                                if(replyText.length == 0) {
                                    openDialog('Please input message!', 'Error', true, '#cc0202', 1300);
                                } else {
                                    var remarkId = $(this).closest('.remarks-item').data('remarkId');
                                    var orderReferenceKey = order.ReferenceKey;
                                    var userId = orderUserId;

                                    // Assuming formData is defined and contains necessary data for InsertRemarks.php
                                    var formData = new FormData();
                                    formData.append('replyText', replyText);
                                    formData.append('remarkId', remarkId);
                                    formData.append('referenceKey', orderReferenceKey);
                                    formData.append('userId', userId);

                                    var parentRemarksItem = $(this).closest('.remarks-item');

                                    // Hide the reply textarea
                                    $(this).siblings('.replyTextInput').parent().remove();

                                    $.ajax({
                                        type: "POST",
                                        url: "php-api/InsertReply.php",
                                        data: formData,
                                        contentType: false,
                                        processData: false,
                                        success: function (response) {
                                            if (response.status === "Success") {
                                                GetUserDetailsById(response.UserId, function(fullName) {
                                                    var currentDate = new Date();
                                                    var formattedDate =
                                                        currentDate.getFullYear() + "-" +
                                                        ('0' + (currentDate.getMonth() + 1)).slice(-2) + "-" +
                                                        ('0' + currentDate.getDate()).slice(-2) + " " +
                                                        ('0' + currentDate.getHours()).slice(-2) + ":" +
                                                        ('0' + currentDate.getMinutes()).slice(-2) + ":" +
                                                        ('0' + currentDate.getSeconds()).slice(-2);

                                                    var replyDiv = $('<div>').addClass('reply-item');
                                                    var replyUsername = $('<p>').addClass('remarkDate').text(fullName);
                                                    replyDiv.append(replyUsername);

                                                    var textSection = $('<pre>').text(replyText);
                                                    replyDiv.append(textSection);

                                                    var replyDate = $('<p>').addClass('remarkDate').text(formattedDate);
                                                    replyDiv.append(replyDate);

                                                    // Add Reply delete button
                                                    var deleteReplyButton = $('<button>').addClass('delete-button').html('<i class="fa fa-times"></i>').click(function () {
                                                        $.ajax({
                                                            type: "POST",
                                                            url: "php-api/DeleteReply.php",
                                                            data: { ReplyId: response.LastInsertedId },
                                                            success: function (response) {
                                                                if (response.status === "Success") {
                                                                    replyDiv.remove();
                                                                } else {
                                                                    openDialog('Error deleting reply: ' + response.message, 'Error', true, '#cc0202', 1300);
                                                                }
                                                            },
                                                            error: function (response) {
                                                                openDialog('Error deleting reply!', 'Error', true, '#cc0202', 1300);
                                                            }
                                                        });
                                                    }).css({'position': 'absolute', 'top': '5px', 'right': '5px', 'width': 'auto', 'font-size': '14px'});
                                                    replyDiv.append(deleteReplyButton);

                                                    // Append the reply below the original remark and visually associate it
                                                    parentRemarksItem.append(replyDiv);
                                                });
                                            } else {
                                                openDialog('Error inserting reply: ' + response.message, response.message, true, '#cc0202', 1300);
                                                console.error('Error inserting reply: ', response.message);
                                            }
                                        },
                                        error: function (xhr, status, error) {
                                            openDialog('Error inserting reply: ' + error, 'Error', true, '#cc0202', 1300);
                                            console.error('Error inserting reply: ', error);
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    openDialog('Error fetching remarks: ' + response.message, 'Error', true, '#cc0202', 1300);
                    console.error('Error fetching remarks: ', response.message);
                }
            },
            error: function(xhr, status, error) {
                openDialog('Error fetching remarks: ' + error, 'Error', true, '#cc0202', 1300);
                console.error('Error fetching remarks: ', error);
            }
        });

        $('#addRemarks').click(function(){
            const formData = new FormData();
            const remarksTextInput = $('#remarksTextInput').val();

            formData.append("userId", order.UserId);
            formData.append("orderId", order.OrderId);
            formData.append("referenceKey", order.ReferenceKey);

            if (remarksTextInput.length > 0) {
                formData.append("remarksText", remarksTextInput);
            }

            $("#customRemarksImagesList img").removeAttr('style');
            const customRemarksImages = [];
            $("#customRemarksImagesList img").each(function (index, element) {
                const imageBase64 = getBase64Image(element);
                customRemarksImages.push({ base64: imageBase64 });
            });

            if (customRemarksImages.length > 0) {
                formData.append("customRemarksImages", JSON.stringify(customRemarksImages));
            }

            if (remarksTextInput.length > 0 || customRemarksImages.length > 0) {
                $.ajax({
                    type: "POST",
                    url: "php-api/InsertRemarks.php",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.status === "Success") {
                            var remarkId = response.RemarkId;
                            var remarksDiv = $('<div>').addClass('remarks-item').css('border', '1px solid #ccc').css('padding', '10px').css('position', 'relative');

                            if (remarksTextInput.length > 0) {
                                var textSection = $('<pre>').text(remarksTextInput);
                                remarksDiv.append(textSection);
                            }

                            if (response.ImageFileNames.length > 0) {
                                var imagesLoaded = 0;

                                response.ImageFileNames.forEach(function (fileName) {
                                    var imgElement = $('<img>').attr('src', fileName);

                                    imgElement.on('load', function() {
                                        remarksDiv.append(imgElement);

                                        // Increment the counter
                                        imagesLoaded++;

                                        // Check if all images are loaded
                                        if (imagesLoaded === response.ImageFileNames.length) {
                                            // Append the remarksDiv to the remarksArea only after all images are loaded
                                            $('#remarksArea').prepend(remarksDiv);
                                        }
                                    });
                                });
                            } else {
                                // If there are no images, just append the remarksDiv
                                $('#remarksArea').prepend(remarksDiv);
                            }

                            var deleteButton = $('<button>').addClass('delete-button').html('<i class="fa fa-times"></i>').click(function () {
                                    $.ajax({
                                        type: "POST",
                                        url: "php-api/DeleteRemark.php",
                                        data: { RemarkId: remarkId },
                                        success: function (response) {
                                            if (response.status === "Success") {
                                                remarksDiv.remove();
                                            } else {
                                                openDialog('Error deleting remark: ' + response.message, 'Error', true, '#cc0202', 1300);
                                            }
                                        },
                                        error: function (response) {
                                            openDialog('Error deleting remark!', 'Error', true, '#cc0202', 1300);
                                        }
                                    });
                                }).css({'position': 'absolute', 'top': '5px', 'right': '5px', 'width': 'auto', 'font-size': '14px'});
                                remarksDiv.append(textSection).append(deleteButton);

                                var currentDate = new Date();
                                var formattedDate =
                                  currentDate.getFullYear() + "-" +
                                  ('0' + (currentDate.getMonth() + 1)).slice(-2) + "-" +
                                  ('0' + currentDate.getDate()).slice(-2) + " " +
                                  ('0' + currentDate.getHours()).slice(-2) + ":" +
                                  ('0' + currentDate.getMinutes()).slice(-2) + ":" +
                                  ('0' + currentDate.getSeconds()).slice(-2);

                                // Display the RemarkDate
                                var remarkDate = $('<p>').addClass('remarkDate').text(formattedDate);
                                remarksDiv.append(remarkDate);

                                $('#remarksArea').prepend(remarksDiv);
                                $("#remarksTextInput").val("");
                                $("#customRemarksImagesInput").val("");
                                $("#customRemarksImagesList").empty();
                                $("#customRemarksImagesList").hide();

                        } else {
                            openDialog('Error inserting remark: ' + response.message, response.message, true, '#cc0202', 1300);
                            console.error('Error inserting remark: ', response.message);
                        }
                    },
                    error: function (xhr, status, error) {
                        openDialog('Error inserting remark: ' + error, 'Error', true, '#cc0202', 1300);
                        console.error('Error inserting remark: ', error);
                    }
                });
            } else {
                openDialog('Please input message or pictures!', 'Error', true, '#cc0202', 1300);
            }
        });
    }

    // End of diplayOrder function

    function getBackgroundColor(status) {
        switch (status) {
            case 'Pending':
                return '#ffffff'; // Default background color for Pending
            case 'Processing':
                return '#e6e6e6'; // Example background color for Processing
            case 'Shipped':
                return '#c1ecc1'; // Example background color for Shipped
            case 'Delivered':
                return '#b3ffb3'; // Example background color for Delivered
            case 'Cancelled':
                return '#ffcccc'; // Example background color for Cancelled
            case 'Deleted':
                return '#ffc2c2'; // Light red background color for Deleted
            default:
                return '#ffffff'; // Default background color for other statuses
        }
    }

    function getCustomImages(orderId) {
        $.ajax({
            type: "POST",
            url: "php-api/GetCustomImages.php", // Update the URL to your PHP script
            data: { orderId: orderId },
            dataType: "json",
            success: function (response) {
                var customImagesList = $("#customImagesList");
                customImagesList.empty(); // Clear existing content

                if (response && response.length && Array.isArray(response.data)) {
                    // Custom images exist, populate the customImagesList
                    for (var i = 0; i < response.data.length; i++) {
                        var imageUrl = response.data[i].ImageUrl;
                        var imagePrice = parseInt(response.data[i].ImagePrice);

                        // Ensure 'ImageUrl' property exists before using it
                        if (imageUrl) {
                            var fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

                            // Create a custom image item and append it to the customImagesList
                            var customImageItem = $("<div class='custom-image-item' data-image-url='" + imageUrl + "'>" +
                                "<img src='" + imageUrl + "' data-price='" + imagePrice + "' style='max-width: 50px;'>" +
                                "<a href='" + imageUrl + "' target='_blank'>" + fileName + "</a>" +
                                "<span>&#8369;" + imagePrice + "</span>" +
                                "</div>");
                            customImagesList.append(customImageItem);
                        }
                    }
                }

                // Check if customImagesList is empty and remove the div
                if (customImagesList.is(':empty')) {
                    customImagesList.remove();
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching custom images:", error);
            }
        });
    }

    /* End code of orders.html */

} else if(htmlPage == "profile.html") {
    /* Initialized profile.html */

    function toggleEdit(section) {
        // Toggle the visibility of edit and display fields
        $(`#${section}EditFields`).slideToggle();
        $(`#${section}DisplayFields`).slideToggle();
    }
    
    var orders = [];
    var currentIndex = 0;
    var originalOrderList = []; // Array to store the original order of orders

    $(document).ready(function () {

        sideBarItemsClick(true);

        $('#dialogContainer').dialog({
            autoOpen: false,
            modal: true,
            buttons: {  
                OK: function() {$(this).dialog("close");}  
            },
            open: function(event, ui) 
            { 
                $('.ui-widget-overlay').bind('click', function()
                { 
                    $("#dialogContainer").dialog('close'); 
                }); 
            }
        });

        $('.option').click(function () {
            // Remove 'active' class from all options
            $('.option').removeClass('active');

            // Add 'active' class to the clicked option
            $(this).addClass('active');

            // Hide all content sections
            $('.content > div').hide();

            // Show the selected content section based on data-content attribute
            const contentToShow = $(this).data('content');
            $(`.${contentToShow}-content`).show();
        });


        if(urlParams.has('status')) {
            activateStatusTab(urlParams.get('status'));
            fetchOrders(urlParams.get('status'));
        } else {
            activateStatusTab('all');
            fetchOrders();
        }

        // Function to fetch and display orders
        function fetchOrders(statusParam = "") {
            $.ajax({
                type: "GET",
                url: "php-api/GetOrderByUserId.php",
                data: {orderStatus: statusParam},
                dataType: "json",
                success: function (response) {
                    
                    if (response.status === "success") {
                            // Process and display orders
                            orders = response.data;
                            originalOrderList = response.data.slice(); // Create a copy of the orders

                            displayOrder(currentIndex);

                            if (urlParams.has('orderReferenceKey')) {
                                setTimeout(function(){moveOrder(urlParams.get('orderReferenceKey'));
                                    getRemarksProfile(order, orderUserId);
                                }, 1000);
                            }

                    } else if(response.status == 'no_orders') {
                        $(".nav-buttons").css("height", "auto");
                        $("#ordersArea").html("<h1><i class='fa fa-ban'></i> " + response.message + "</h1>");
                    } else {
                        // Display an error message
                        $("#ordersArea").html("<p>Error: " + response.message + "</p>");
                    }
                

                },
                error: function (error) {
                    $("#ordersArea").html("<p>Error: Unable to fetch orders</p>");
                }
            });
        }

        GetUserDetails(function (fullName) {
            // Do something with the full name

            }, function (firstName) {
                $('#firstNameLabel').text(firstName);
                $('#firstNameInput').val(firstName);
            }, function (lastName) {
                $('#lastNameLabel').text(lastName);
                $('#lastNameInput').val(lastName);
            }, function (contactNumber) {
                $('#contactNumberInput').val(contactNumber);
            }, function (address) {
        });

        // Function to display orders
        function displayOrder(index) {
            var order = orders[index];
            var ordersArea = $("#ordersArea");
            var address = JSON.parse(order.Address);

            var imageContainer = "<div class='image-container'>" +
                "<img src='" + order.FrontImageUrl + "' alt='Front Image' class='image-preview'>" +
                "<div id='viewButtons'>" +
                "<label>" +
                "<input type='radio' class='viewRadio' name='tShirtPreview_" + order.OrderId + "' value='front' checked>" +
                "<img class='view-button' alt='Front Image Preview' src='" + order.FrontImageUrl + "'>" +
                "<p class='view-label'>Front</p>" +
                "</label>" +
                "<label>" +
                "<input type='radio' class='viewRadio' name='tShirtPreview_" + order.OrderId + "' value='back'>" +
                "<img class='view-button' alt='Back Image Preview' src='" + order.BackImageUrl + "'>" +
                "<p class='view-label'>Back</p>" +
                "</label>" +
                "<label>" +
                "<input type='radio' class='viewRadio' name='tShirtPreview_" + order.OrderId + "' value='right'>" +
                "<img class='view-button' alt='Right Image Preview' src='" + order.RightImageUrl + "'>" +
                "<p class='view-label'>Right</p>" +
                "</label>" +
                "<label>" +
                "<input type='radio' class='viewRadio' name='tShirtPreview_" + order.OrderId + "' value='left'>" +
                "<img class='view-button' alt='Left Image Preview' src='" + order.LeftImageUrl + "'>" +
                "<p class='view-label'>Left</p>" +
                "</label>" +
                "</div>" +
                "</div>";

            var customImagesList = "<div id='customImagesList' style='max-height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; margin-top: 5px;''>" +
                "<div class='custom-image-item'><img src='' style='max-width: 50px;'>" +
                "<div>15vIpV.jpg</div>" +
                "</div>" +
                "</div>";

            var statusDropdown = "<div class='otherCharges total-row' style='margin-top: -14px;'>" +
                "<h3>Status:</h3>" +
                "<div class='space2'></div>" +
                "<h3>" + order.OrderStatus + "</h3>" +
                "</div>";

            var downPaymentInput = "<div class='otherCharges total-row'>" +
                "<h3>Down Payment:</h3>" +
                "<div class='space2'></div>" +
                "<h3>" + order.DownPayment + "</h3>" +
                "</div>";

            var adjustmentPriceInput = "<div class='otherCharges total-row'>" +
                "<h3>Adjustment Price:</h3>" +
                "<div class='space2'></div>" +
                "<h3>" + order.AdjustmentPrice + " <span id='adjustmentLabel_" + order.OrderId + "'>(" + order.AdjustmentType + ")</span></h3>" +
                "</div>";

            var cancelButton = (order.OrderStatus !== 'Cancelled') ? "<button class='btn' id='cancelOrderBtn'>Cancel Order</button>" : ""; // Add an Cancel button

            var printButton = "<button class='btn' onclick='printOrder()' id='printOrderBtn'><i class='fa fa-print'></i></button>";

            var orderDateDisplay = order.OrderDate.split(" ")[0] + " " + convertTo12HourFormat(order.OrderDate.split(" ")[1]);

            var addressHtml = address !== null
                ? "<p>Address: <span id='addressId'>" + address.street + ", " + address.address + ", " + address.zipcode + "</span></p>"
                : "";

            var contactNumberHtml = "<p>Contact: <span id='contactNumberId'>" + order.ContactNumber + "</span></p>";

            var orderContainer = $("<div class='order'>" +
                "<div style='border: 1px solid gray; padding: 2px 18px; background-color: " + getBackgroundColor(order.OrderStatus) + ";'><h2>" + order.OrderStatus + "</h2></div>" +
                "<p>Order Reference: <span id='referenceKey'>" + order.ReferenceKey + "</span></p>" +
                "<p>Order Date: " + orderDateDisplay + "</p>" +
                "<p>Total Amount: &#8369;" + order.TotalAmount + "</p>" +
                "<p>Contact Name: <span id='nameId'></span></p>" +
                addressHtml +
                contactNumberHtml +
                imageContainer +
                customImagesList +
                "<div class='total-details'>" + order.TotalDetails + "</div>" +
                statusDropdown +
                "<div class='adjustment-down-payment-container'>" +
                downPaymentInput +
                adjustmentPriceInput +
                "</div>" +
                "<div id='adjustedTotalSumArea'></div>" +
                "</div><br><br>" +
                "<div id='remarksArea'></div>" +
                cancelButton + // Append the Cancel button
                printButton +
                "<i class='fa fa-spinner fa-spin' style='font-size:24px;display:none;''></i></div>" +
                "<br><br></div>" +
                "</div>");

            GetUserDetailsById(order.UserId, function (fullName) {
                $('#nameId').html(fullName);
            });

            ordersArea.html(orderContainer);

            getCustomImages(order.OrderId);

            // Move the Total Text then update it based on the Adjustment Price
            var totalSumText = $('#totalSum').text(); // Use jQuery to get the totalSumText

            var adjustedTotalSum = (order.AdjustmentType === 'Added') 
              ? parseFloat(totalSumText) + parseFloat(order.AdjustmentPrice)
              : parseFloat(totalSumText) - parseFloat(order.AdjustmentPrice);

            $('#adjustedTotalSumArea').html("<h2>Total:</h2>\n<div class='space2'></div>\n<h2>&#8369;<span id='totalSum'>" + adjustedTotalSum + "</span>");
            $('.total-details .total-row h2:contains("Total:")').remove();
            $('.total-details .total-row h2:has(span#totalSum)').remove();
            $('#adjustedTotalSumArea').addClass('total-row');

            $("#ordersArea").on('change', 'input[type="radio"][class^="viewRadio"]', function () {
                var selectedView = $(this).val();
                var order = $(this).closest('.order');
                order.find(".image-preview").attr("src", order.find('.viewRadio:checked + .view-button').attr('src'));
            });

            var orderUserId = order.UserId;

            function getCustomImages(orderId) {
                $.ajax({
                    type: "POST",
                    url: "php-api/GetCustomImages.php", // Update the URL to your PHP script
                    data: { orderId: orderId },
                    dataType: "json",
                    success: function (response) {
                        var customImagesList = $("#customImagesList");
                        customImagesList.empty(); // Clear existing content

                        if (response && response.length && Array.isArray(response.data)) {
                            // Custom images exist, populate the customImagesList
                            for (var i = 0; i < response.data.length; i++) {
                                var imageUrl = response.data[i].ImageUrl;
                                var imagePrice = parseInt(response.data[i].ImagePrice);

                                // Ensure 'ImageUrl' property exists before using it
                                if (imageUrl) {
                                    var fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

                                    // Create a custom image item and append it to the customImagesList
                                    var customImageItem = $("<div class='custom-image-item' data-image-url='" + imageUrl + "'>" +
                                        "<img src='" + imageUrl + "' data-price='" + imagePrice + "' style='max-width: 50px;'>" +
                                        "<a href='" + imageUrl + "' target='_blank'>" + fileName + "</a>" +
                                        "<span>&#8369;" + imagePrice + "</span>" +
                                        "</div>");
                                    customImagesList.append(customImageItem);
                                }
                            }
                        }

                        // Check if customImagesList is empty and remove the div
                        if (customImagesList.is(':empty')) {
                            customImagesList.remove();
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Error fetching custom images:", error);
                    }
                });
            }

            $('#cancelOrderBtn').click(function () {
                // Use a confirmation dialog
                var isConfirmed = confirm("Are you sure you want to cancel the order?");

                if (isConfirmed) {
                    // User clicked OK, proceed with cancellation

                    // Send Ajax request
                    $('.fa-spinner').show();

                    const formData = new FormData();
                    const orderId = order.OrderId;

                    formData.append("orderId", orderId);

                    $.ajax({
                        type: "POST",
                        url: "php-api/CancelOrder.php",
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (response.status == 'success') {
                                openDialog(response.message, 'Success', true, '#28a745');
                                $('.fa-spinner').hide();
                                // Fetch orders again to update the data
                                fetchOrders();
                                setTimeout(function () {
                                    $('#dialogContainer').dialog('close');
                                }, 500);
                            } else {
                                openDialog(response.message, response.status);
                            }
                        },
                        error: function () {
                            openDialog(response.message, response.status);
                        }
                    });
                } else {
                    // User clicked Cancel, do nothing
                }
            });

            
            getRemarksProfile(order, orderUserId);

        }

        // End of displayOrder function

        


        // Function to navigate to the previous order
        window.prevOrder = function () {
            currentIndex = (currentIndex - 1 + originalOrderList.length) % originalOrderList.length;
            displayOrder(currentIndex);
        };

        // Function to navigate to the next order
        window.nextOrder = function () {
            currentIndex = (currentIndex + 1) % originalOrderList.length;
            displayOrder(currentIndex);
        };

        window.moveOrder = function (referenceId) {
            var orderIndex = originalOrderList.findIndex(function (order) {
                return order.ReferenceKey === referenceId;
            });

            if (orderIndex !== -1) {
                currentIndex = orderIndex;
                displayOrder(currentIndex);
            }
        };

        $(document).keydown(function (e) {
            if (e.keyCode === 37) {
                // Left arrow key
                prevOrder();
            } else if (e.keyCode === 39) {
                // Right arrow key
                nextOrder();
            }
        });

        function getBackgroundColor(status) {
            switch (status) {
                case 'Pending':
                    return '#ffffff'; // Default background color for Pending
                case 'Processing':
                    return '#e6e6e6'; // Example background color for Processing
                case 'Shipped':
                    return '#c1ecc1'; // Example background color for Shipped
                case 'Delivered':
                    return '#b3ffb3'; // Example background color for Delivered
                case 'Cancelled':
                    return '#ffcccc'; // Example background color for Cancelled
                case 'Deleted':
                    return '#ffc2c2'; // Light red background color for Deleted
                default:
                    return '#ffffff'; // Default background color for other statuses
            }
        }


        $('.contact-edit-form').submit(function(e) {
            e.preventDefault();
            var firstName = $('#firstNameInput').val();
            var lastName = $('#lastNameInput').val();
            var contactNumber = $('#contactNumberInput').val();

            $.ajax({
                type: 'POST',
                url: 'php-api/UpdateContact.php',
                data: { firstName: firstName, lastName: lastName, contactNumber: contactNumber },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        // Update the display fields with the new data
                        openDialog(response.message, 'Success', true, '#28a745', 600);

                        $('#firstNameLabel').text(firstName);
                        $('#lastNameLabel').text(lastName);
                    } else {
                        // Handle error case
                        console.error(response.message);
                    }
                },
                error: function() {
                    // Handle Ajax error
                    openDialog(response.message, 'Failed', true, '#cc0202', 600);
                }
            });
        });

        $('.address-edit-form').submit(function(e){
            e.preventDefault();
            var newAddressData = {
                address: $('#addressInput').val(),
                street: ($('#streetBuildingInput').val().length > 0) ? $('#streetBuildingInput').val() : '',
                zipcode: $('#zipCodeInput').val()
            };
            updateAddress(
                newAddressData,
                function (successMessage) {
                    openDialog(successMessage, 'Success', true, '#28a745', 600);

                    if (urlParams.has('settings') && urlParams.get('settings') === "address") {
                        window.close();
                    }
                },
                function (errorMessage) {
                    openDialog(errorMessage, 'Error', true, '#cc0202', 600);
                }
            );
        });


        function updateAddress(addressData, successCallback, errorCallback) {
            // Prepare the data to be sent as JSON
            var jsonData = JSON.stringify(addressData);

            // Make an AJAX request
            $.ajax({
                type: 'POST',
                url: 'php-api/UpdateAddress.php',
                data: jsonData,
                contentType: 'application/json', // Set content type to JSON
                dataType: 'json',
                success: function (data) {
                    if (data.status === 'success') {
                        // Execute the success callback
                        successCallback(data.message);
                    } else {
                        // Execute the error callback
                        errorCallback(data.message);
                    }
                },
                error: function (xhr, status, error) {
                    // Log detailed information about the error
                    console.error("XHR:", xhr);
                    console.error("Status:", status);
                    console.error("Error:", error);

                    // Execute the error callback
                    errorCallback('AJAX Error ' + error);
                }
            });
        }


        // Mark As Seen

        if (urlParams.has('settings') && urlParams.get('settings') === "address") {
            $('.option[data-content="settings"]').trigger('click');
            toggleEdit('address');
        }

        if(urlParams.has('order') && urlParams.get('order') === "last") {
            setTimeout(function(){prevOrder();}, 1000);
        }

        if(urlParams.has('notifId')) {
            $.ajax({
                type: "POST",
                url: "php-api/MarkNotificationAsSeen.php",
                data: { notifId: urlParams.get('notifId') },
                dataType: "json",
                success: function (response) {
                    loadNotifications($('#notificationsList'));
                },
                error: function (xhr, status, error) {
                    console.error("Error marking notification as seen:", error);
                }
            });
        }

        // Print order function
        window.printOrder = function () {
            // Hide the buttons before printing
            $('#cancelOrderBtn, #printOrderBtn').hide();
            $('#customImagesList').css('max-height', 'none');

            var printContent = $('.order-card').html();

            // Create a new window and write the content to it
            var printWindow = window.open('', '_blank');
            printWindow.document.open();
            printWindow.document.write('<html><head><title>Print Order</title>');

            // Include external stylesheets
            $('link[rel="stylesheet"]').each(function () {
                var stylesheetLink = $(this).prop('outerHTML');
                printWindow.document.write(stylesheetLink);
            });

            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();

            // Wait for the content to be rendered before printing
            printWindow.onload = function () {
                // Show the buttons again after printing
                $('#cancelOrderBtn, #printOrderBtn').show();
                $('#customImagesList').css('max-height', '100px');

                printWindow.print();
                printWindow.onafterprint = function () {
                    printWindow.close();
                };
            };
        };

    });

    /* End ready of profile.html */
    /* End code of profile.html */

} else if(htmlPage == "login.html") {
    /* Initialized login.html */

    $(document).ready(function () {
        $('#dialogContainer').dialog({
            autoOpen: false,
            modal: true,
            buttons: {  
                OK: function() {$(this).dialog("close");}  
            },
            open: function(event, ui) 
            { 
                $('.ui-widget-overlay').bind('click', function()
                { 
                    $("#dialogContainer").dialog('close'); 
                }); 
            }
        });

        $("#loginBtn").click(function (event) {
            event.preventDefault(); // Prevent the default form submission

            var email = $("#emailInput").val();
            var password = $("#passwordInput").val();

            $.ajax({
                type: 'POST',
                url: 'php-api/UserLogin.php',
                data: { email: email, password: password },
                dataType: 'json',
                success: function(response) {
                    openDialog(response.message, 'Status', false);
                    // Check the status
                    if (response.status === 'success') {
                        setTimeout(function(){
                            window.location.href = 'store.html';
                        }, 800);
                    }
                },
                error: function(error) {
                    // Handle errors
                    console.error('AJAX error: ' + JSON.stringify(error));
                }
            });
        });
    });

    /* End ready of login.html */
    /* End code of login.html */

} else if(htmlPage == "register.html") {
    /* Initialized register.html */

    $(document).ready(function() {
        $('#dialogContainer').dialog({
            autoOpen: false,
            modal: true,
            buttons: {  
                OK: function() {$(this).dialog("close");}  
            },
            open: function(event, ui) 
            { 
                $('.ui-widget-overlay').bind('click', function()
                { 
                    $("#dialogContainer").dialog('close'); 
                }); 
            }
        });

        $(".register-form").submit(function(event) {
            event.preventDefault(); // Prevent the default form submission

            // Perform client-side validation
            if (validateForm()) {
                // If validation passes, submit the form via AJAX
                submitForm();
            }
        });

        function validateForm() {
            var firstName = $("#firstNameInput").val();
            var lastName = $("#lastNameInput").val();
            var email = $("#emailInput").val();
            var password = $("#passwordInput").val();
            var confirmPassword = $("#confirmPasswordInput").val();

            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                alert("All fields are required.");
                return false;
            }

            if (password !== confirmPassword) {
                alert("Password and Confirm Password do not match.");
                return false;
            }

            return true;
        }

        function submitForm() {
            // Prepare the form data for submission
            var formData = $(".register-form").serialize();

            // AJAX submission
            $.ajax({
                type: "POST",
                url: "php-api/Registration.php",
                data: formData,
                dataType: 'json',
                success: function(response) {
                    openDialog(response.message, 'Status', false);
                    // Check the status
                    if (response.status === 'success') {
                        setTimeout(function(){
                            window.location.href = 'login.html';
                        }, 800);
                    }
                },
                error: function(error) {
                    console.error(error);
                    alert("Error during registration. Please try again.");
                }
            });
        }
    });

    /* End ready of register.html */
    /* End code of dashboard.html */

} else if(htmlPage == "dashboard.html") {
    /* Initialized dashboard.html */

    $(document).ready(function () {

        $('#dialogContainer').dialog({
            autoOpen: false,
            modal: true,
            buttons: {  
                OK: function() {$(this).dialog("close");}  
            },
            open: function(event, ui) 
            { 
                $('.ui-widget-overlay').bind('click', function()
                { 
                    $("#dialogContainer").dialog('close'); 
                }); 
            }
        });

        checkUser();

        function checkUser() {
            $.ajax({
                type: "GET",
                url: "php-api/DashboardCheck.php",
                dataType: "json",
                success: function (response) {
                    if (response.isAdmin) {
                        $('.dashboardContent').html(response.message);

                        const sidebarItems = document.querySelectorAll('.sidebar-item');

                        sideBarItemsClick(false);

                        statisticsChart();

                        $.ajax({
                            type: 'GET',
                            url: 'php-api/CalculateOrderTotal.php',
                            dataType: 'json',
                            success: function(response) {
                                if (response.status === 'success') {
                                    var totalAmount = parseFloat(response.message);
                                    var totalOrders = response.totalOrders;
                                    statisticsOrderChart(totalOrders, totalAmount);

                                    $('#totalAmount').text(totalAmount.toLocaleString());
                                    $('#totalOrders').text(totalOrders.toLocaleString());
                                } else {
                                    console.error('Error: ' + response.message);
                                }
                            },
                            error: function(error) {
                                console.error('AJAX Error:', error);
                            }
                        });
                    } else {
                        $('.dashboardContent').html(response.message);
                        window.location = "index.html";
                    }
                },
                error: function (error) {
                    $(".dashboardContent").html("<p>Error: Unable to load!</p>");
                }
            });
        }
    });

    /* End ready of dashboard.html */

    /* End code of dashboard.html */
} else if(htmlPage == "history.html") {
    /* Initialized history.html */

    var orders = [];
    var currentIndex = 0;
    var originalOrderList = []; // Array to store the original order of orders

    $(document).ready(function () {

        sideBarItemsClick(true);

        $('#dialogContainer').dialog({
            autoOpen: false,
            modal: true,
            buttons: {  
                OK: function() { $(this).dialog("close"); }  
            },
            open: function(event, ui) { 
                $('.ui-widget-overlay').bind('click', function() { 
                    $("#dialogContainer").dialog('close'); 
                }); 
            }
        });

        function loadAllNotifications() {
            $.ajax({
                type: "GET",
                url: "php-api/GetAllNotifications.php",
                dataType: "json",
                success: function(response) {
                    if (response.status === 'success') {
                        // Clear existing notifications
                        $('#orderHistory').empty();

                        // Loop through each notification and append it to the orderHistory element
                        response.data.forEach(function(notification) {
                            var notificationItem = '<tr>' +
                                '<td class="userId_' + notification.UserId + '">' + notification.UserId + '</td>' +
                                '<td><a href="orders.html?orderReferenceKey=' + notification.ReferenceKey + '">' + notification.ReferenceKey + '</a></td>' +
                                '<td>' + notification.Message + '</td>' +
                                '<td>' + notification.CreatedAt + '</td>' +
                                '</tr>';

                            $('#orderHistory').append(notificationItem);

                            GetUserDetailsById(notification.UserId, function (fullName) {
                                $('.userId_' + notification.UserId + '').html(fullName);
                            });
                        });

                        // Initialize DataTables after data has been appended
                        $('#orderHistoryTable').DataTable();
                    } else {
                        $('#orderHistory').html("<p>Error: " + response.message + "</p>");
                        $('.dashboardContent').html(response.message);
                        window.location = "index.html";
                    }
                },
                error: function(xhr, status, error) {
                    $('#orderHistory').html("<p>Error: Unable to fetch notifications</p>");
                }
            });
        }

        loadAllNotifications();
    });

    /* End ready of history.html */
    /* End code of history.html */

}