<?php
session_start();

function isUserLoggedIn() {
    return isset($_SESSION['id']);
}

if (isUserLoggedIn()) {
    $userId = $_SESSION['id'];
    include_once '../repository/userRepository.php';
    include_once '../models/user.php';

    $userRepository = new UserRepository();
    $user_Admin = $userRepository->getUserById($userId);
    
    $active = $_SESSION['active'];
    $role = $_SESSION['role'];
    echo '<script>';
    echo 'let isLoggedIn = true;';
    echo '</script>';
}else{
    $userId = null;
    echo '<script>';
    echo 'let isLoggedIn = false;';
    echo '</script>';
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="../style/item_card.css">
	<link rel="stylesheet" href="../style/nav.css">
	<link rel="stylesheet" href="../style/footer.css">
	<link rel="stylesheet" href="../style/root.css">
	<script src="https://unpkg.com/ionicons@4.5.0/dist/ionicons.js"></script>
    <script src="../scripts/scroll_to_contact.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<link rel="stylesheet" href="../style/back_to_top.css">

	<title>SunSpot</title>
</head>

<body>
	<header>
		<h3 class="logo">SunSpot
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50"
				height="50" viewBox="0 0 100 100" xml:space="preserve">

				<defs>
				</defs>
				<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
					transform="translate(1.4065934065934016 1.4065934065934016) scale(1 1)">
					<path
						d="M 45 68 c -12.682 0 -23 -10.317 -23 -23 c 0 -12.682 10.318 -23 23 -23 c 12.683 0 23 10.318 23 23 C 68 57.683 57.683 68 45 68 z"
						style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(var(--light)); fill-rule: nonzero; opacity: 1;"
						transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path
						d="M 38.652 17.61 c -0.292 0 -0.573 -0.127 -0.765 -0.356 c -0.239 -0.284 -0.301 -0.677 -0.161 -1.021 l 6.348 -15.61 C 44.227 0.247 44.593 0 45 0 s 0.773 0.247 0.926 0.623 l 6.349 15.61 c 0.14 0.344 0.077 0.737 -0.162 1.021 c -0.238 0.284 -0.616 0.414 -0.978 0.333 c -4.045 -0.881 -8.228 -0.881 -12.271 0 C 38.794 17.603 38.723 17.61 38.652 17.61 z"
						style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(var(--light)); fill-rule: nonzero; opacity: 1;"
						transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path
						d="M 45 90 c -0.407 0 -0.773 -0.246 -0.926 -0.623 l -6.348 -15.61 c -0.14 -0.344 -0.078 -0.737 0.161 -1.021 c 0.239 -0.284 0.615 -0.412 0.978 -0.333 c 4.043 0.882 8.226 0.882 12.271 0 c 0.363 -0.08 0.74 0.05 0.978 0.333 c 0.239 0.283 0.302 0.677 0.162 1.021 l -6.349 15.61 C 45.773 89.754 45.407 90 45 90 z"
						style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(var(--light)); fill-rule: nonzero; opacity: 1;"
						transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path
						d="M 16.61 52.349 c -0.127 0 -0.255 -0.024 -0.377 -0.073 l -15.61 -6.349 C 0.247 45.773 0 45.407 0 45 s 0.247 -0.773 0.624 -0.926 l 15.61 -6.348 c 0.343 -0.14 0.737 -0.078 1.021 0.161 c 0.284 0.239 0.412 0.616 0.333 0.978 c -0.441 2.021 -0.665 4.086 -0.665 6.135 c 0 2.049 0.224 4.113 0.665 6.136 c 0.079 0.362 -0.049 0.739 -0.333 0.978 C 17.071 52.269 16.842 52.349 16.61 52.349 z"
						style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(var(--light)); fill-rule: nonzero; opacity: 1;"
						transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path
						d="M 73.39 52.349 c -0.231 0 -0.461 -0.08 -0.644 -0.235 c -0.284 -0.238 -0.412 -0.615 -0.333 -0.978 c 0.44 -2.022 0.664 -4.087 0.664 -6.136 c 0 -2.049 -0.224 -4.114 -0.664 -6.135 c -0.079 -0.362 0.049 -0.739 0.333 -0.978 c 0.283 -0.239 0.676 -0.301 1.021 -0.161 l 15.61 6.348 C 89.754 44.227 90 44.593 90 45 s -0.246 0.773 -0.623 0.926 l -15.61 6.349 C 73.645 52.324 73.517 52.349 73.39 52.349 z"
						style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(var(--light)); fill-rule: nonzero; opacity: 1;"
						transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path
						d="M 20.437 30.415 c -0.028 0 -0.057 -0.001 -0.085 -0.004 c -0.37 -0.032 -0.692 -0.266 -0.836 -0.607 l -6.549 -15.527 c -0.158 -0.375 -0.073 -0.808 0.214 -1.096 c 0.288 -0.288 0.722 -0.371 1.096 -0.214 l 15.527 6.549 c 0.342 0.144 0.576 0.466 0.607 0.835 c 0.032 0.37 -0.144 0.727 -0.456 0.927 c -1.743 1.119 -3.36 2.42 -4.809 3.868 c -1.448 1.449 -2.75 3.066 -3.868 4.809 C 21.093 30.243 20.775 30.415 20.437 30.415 z"
						style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(var(--light)); fill-rule: nonzero; opacity: 1;"
						transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path
						d="M 76.112 77.112 c -0.131 0 -0.263 -0.025 -0.389 -0.078 l -15.526 -6.549 c -0.342 -0.145 -0.576 -0.467 -0.607 -0.836 c -0.032 -0.37 0.144 -0.727 0.456 -0.928 c 1.745 -1.121 3.363 -2.423 4.808 -3.868 l 0 0 c 1.445 -1.444 2.747 -3.063 3.868 -4.808 c 0.201 -0.312 0.553 -0.489 0.928 -0.456 c 0.369 0.031 0.691 0.266 0.836 0.607 l 6.549 15.526 c 0.157 0.375 0.073 0.809 -0.215 1.096 C 76.628 77.011 76.372 77.112 76.112 77.112 z"
						style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(var(--light)); fill-rule: nonzero; opacity: 1;"
						transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path
						d="M 69.563 30.414 c -0.339 0 -0.656 -0.171 -0.842 -0.459 c -1.121 -1.746 -2.423 -3.363 -3.868 -4.809 l 0 0 c -1.447 -1.447 -3.065 -2.749 -4.808 -3.868 c -0.313 -0.2 -0.488 -0.557 -0.456 -0.927 c 0.031 -0.37 0.266 -0.691 0.607 -0.835 l 15.526 -6.549 c 0.373 -0.158 0.808 -0.074 1.096 0.214 c 0.288 0.288 0.372 0.721 0.215 1.096 l -6.549 15.527 c -0.145 0.342 -0.467 0.576 -0.836 0.607 C 69.62 30.413 69.592 30.414 69.563 30.414 z"
						style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(var(--light)); fill-rule: nonzero; opacity: 1;"
						transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
					<path
						d="M 13.887 77.112 c -0.26 0 -0.516 -0.102 -0.707 -0.293 c -0.288 -0.288 -0.373 -0.721 -0.214 -1.096 l 6.549 -15.526 c 0.144 -0.342 0.466 -0.576 0.835 -0.607 c 0.37 -0.043 0.727 0.144 0.927 0.456 c 1.119 1.742 2.421 3.36 3.868 4.808 l 0 0 c 1.446 1.446 3.063 2.747 4.809 3.868 c 0.312 0.201 0.488 0.558 0.456 0.928 c -0.032 0.369 -0.266 0.691 -0.607 0.836 l -15.527 6.549 C 14.15 77.087 14.019 77.112 13.887 77.112 z"
						style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(var(--light)); fill-rule: nonzero; opacity: 1;"
						transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
				</g>
			</svg>
		</h3>
		<nav>
			<a href="/views/index.php">Home</a>
			<a href="/views/products.php">Products</a>
            <a href="/views/aboutus.php">About Us</a>
			<a onclick="scrollToSection('foot')">Contact</a>
			<a href="/views/cart.php">Cart</a>
		</nav>
		<nav class="login">
			<a href="/views/signup.php" id="signupLink">
				<svg width="30" height="30" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M335 343.43H65V300.06C65 254.02 102.33 216.69 148.37 216.69H251.63C297.67 216.69 335 254.02 335 300.06V343.43Z"
						stroke="#f5f1ee" stroke-width="15" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
					<path
						d="M200 186.57C235.899 186.57 265 157.468 265 121.57C265 85.6713 235.899 56.5698 200 56.5698C164.101 56.5698 135 85.6713 135 121.57C135 157.468 164.101 186.57 200 186.57Z"
						stroke="#f5f1ee" stroke-width="15" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
				</svg>

			</a>
		</nav>

		<script>
            let active = <?php echo json_encode($active); ?>;
            var role = <?php echo json_encode($role); ?>;
            var userId = <?php echo json_encode($userId); ?>;

            document.getElementById('signupLink').addEventListener('click', function(event) {
                if (active === 1) {   
                    event.preventDefault();
                    if(role === 'admin'){
                        window.location.href = "/views/accountAdmin.php?id=" + userId;
                    }else{
                        window.location.href = "/views/account.php?id=" + userId;
                    }
                } 
            });
        </script>

	</header>
	<button id="back-to-top" onclick="scrollToTop()">^</button>

	<div id="item-card-container">

	</div>

	<script>

		let fetchedProduct;

		const querySearch = window.location.search;
		const id = new URLSearchParams(querySearch).get('id')
		fetch('../controller/fetchItem.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				product_id: id,
			}),
		})
			.then(response => response.json())
			.then(device => {
				console.log(device)
						fetchedProduct = device;

						const container = document.getElementById('item-card-container');

						const card = document.createElement('div');
						card.className = 'item-card';
						const card_main_container = document.createElement("div");
						card_main_container.classList="card_main_container";
						const imgContainer = document.createElement('div');
						imgContainer.className = 'img-container';

						const img = document.createElement('img');
						img.src = device.image;
						img.alt = 'Device Image';
						img.className = 'card-img';
						imgContainer.appendChild(img);

						const card_body = document.createElement('div');
						card_body.className = 'card-body';

						const heading = document.createElement('h1');
						heading.textContent = device.name
						heading.className = 'card-name';	
						const description = document.createElement('p');
						description.textContent = device.description
						description.className = 'card-description';
						const details = {
							"name": device.name,
							"processor": device.processor,
							"ram size": device.ram_size,
							"storage": device.storage,
							"display": { "width": device.display.width, "height": device.display.height },
							"os": device.os,
							"battery": device.battery,
							"weight": device.weight,
							"dimensions": { "length": device.dimensions.length, "width": device.dimensions.width, "depth": device.dimensions.depth },
							"camera": { "front": device.camera.front, "rear": device.camera.rear },
							"additional features": JSON.parse(device.additional_features),
					
						};


						const table = document.createElement('table');
						table.className = "item_table"
						table.border = '1';



						for (const key in details) {
							const value = details[key];

							console.log(
								value !== null && value !== "" && (typeof value === 'object' && !Object.values(value).every(val => val === null))
							)


							if (
								value !== null && value !== "" && !(typeof value === 'object' && Object.values(value).every(val => val === null))
							) {
								const dataRow = table.insertRow();

								const header_cell = dataRow.insertCell(0);
								header_cell.textContent = key;
								const data_cell = dataRow.insertCell(1);


								if (typeof value === 'object') {

									const ul = document.createElement('ul');
									if (Array.isArray(value)) {
										value.forEach(item => {
											const li = document.createElement('li');
											li.textContent = item;
											ul.appendChild(li);
										});
									} else {
										for (const subKey in value) {
											const subValue = value[subKey];

											if (subValue !== null) {
												const li = document.createElement('li');
												li.textContent = `${subKey}: ${subValue}`;
												ul.appendChild(li);
											}
										}
									}
									data_cell.appendChild(ul);
								} else {
									data_cell.textContent = value;
								}
							}

						}

						card_body.appendChild(table)
						const price_container = document.createElement('div')
						const price = document.createElement('h1');
						price.textContent = '$' + device.price;
						price.className = 'card-price';
						price_container.className='price-container'


						add_to_cart = document.createElement('button')
						add_to_cart.className = "item_add_to_cart"
						add_to_cart.innerHTML = "Add to Cart&nbsp;&nbsp;"
						add_to_cart_icon = document.createElement('ion-icon')
						add_to_cart_icon.name = 'cart'
						add_to_cart.appendChild(add_to_cart_icon)
						add_to_cart_icon.className = "item_ion_icon"
						
						price_container.appendChild(heading)
						price_container.appendChild(description)
						price_container.appendChild(price)
						price_container.appendChild(add_to_cart)
						card_main_container.appendChild(imgContainer);
						card_main_container.appendChild(price_container);
						card.appendChild(card_main_container)
						card.appendChild(card_body);

						add_to_cart.onclick = function () {
							fillCart(fetchedProduct);
						};

						container.appendChild(card);
		
				return null;
			});

		// let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

		// function fillCart(product) {
		// 	const cartContainer = document.getElementById('item-card-container');

		// 	const cartItem = document.createElement('div');
		// 	cartItem.classList.add('cart-item');

		// 	cartItem.innerHTML = `
		// 		<img src="${product.image}" alt="${product.name}">
		// 		<div class="cart-item-details">
		// 			<h3>${product.name}</h3>
		// 			<p>Price: $${product.price.toFixed(2)}</p>
		// 		</div>
		// 		<button onclick="removeItem(this, ${product.id})">Remove</button>
		// 	`;

		// 	// 

		// 	window.location.href = 'http://localhost:8008/views/cart.php'; 
		// }

		// let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

		async function fillCart(product) {
			// Check if user is logged in
			if (!isLoggedIn) {
				Swal.fire({
					title: 'Login Required',
					text: 'You need to be logged in to add items to cart.',
					icon: 'warning',
					confirmButtonText: 'Go to Login',
					confirmButtonColor: 'rgb(var(--dark))',
				}).then((result) => {
					const baseUrl = window.location.origin;
					window.location.href = baseUrl + '/views/signup.php';
				});
				return;
			}
			
			try {
				const response = await fetch('/controller/addToCartController.php', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						productId: product.id,
						productPrice: product.price,
						productName: product.name,
						productImage: product.image
					}),
				});

				if (response.ok) {
					// Item added successfully - show success message
					Swal.fire({
						title: 'Added to Cart!',
						text: 'Item has been added to your cart.',
						icon: 'success',
						timer: 1500,
						showConfirmButton: false,
					});
					console.log('Item added to cart successfully');
				} else {
					const errorData = await response.json().catch(() => ({}));
					console.error('Failed to update the database:', response.statusText, errorData);
					Swal.fire({
						title: 'Error',
						text: errorData.message || 'Failed to add item to cart. Please try again.',
						icon: 'error',
						confirmButtonColor: 'rgb(var(--dark))',
					});
				}
			} catch (error) {
				console.error('Error updating the database:', error);
				Swal.fire({
					title: 'Error',
					text: 'An error occurred. Please try again.',
					icon: 'error',
					confirmButtonColor: 'rgb(var(--dark))',
				});
			}
		}

	</script>
</body>

</html>
