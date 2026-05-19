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
}else{
    $userId = null;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link rel="stylesheet" href="../style/nav.css">
	<link rel="stylesheet" href="../style/cards.css">
	<link rel="stylesheet" href="../style/footer.css">
	<link rel="stylesheet" href="../style/root.css">
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&family=Raleway&display=swap"
		rel="stylesheet">
	<script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></script>
	<title>SunSpot</title>
    <script src="../scripts/scroll_to_contact.js"></script>
<link rel="stylesheet" href="../style/back_to_top.css">
	<link rel="stylesheet" href="../style/theme.css">


	<style>
		
		.slider{
			width: 60%;
			height: 500px;
			margin: auto;
			margin-top: 20px;
			margin-bottom: 20px;
			box-shadow: 0px 0px 3px grey;
			position: relative;
			overflow: hidden;
		}


		.slide{
			width: 100%;
			height: 100%;
			position:absolute;
		}

		.nav{
			text-align: center;
			margin-top: 15px;
		}

		.nav button{
			font-size: 25px;
			font-weight: bold;
			text-align: center;
			text-decoration: none;
			background-color: rgb(var(--brown-light));
			border: 1px solid rgb(var(--dark));
			border-radius:25px;
			color: rgb(var(--dark));
			transition: 0.2s;
			width: 125%;
			padding: 5px;
		}

		.nav>button:hover {
			background-color: rgb(var(--dark));
			color: rgb(var(--light));

			border: 1px solid rgb(var(--light));

			transition: 0.2s;
			cursor: pointer;
		}

		.slider_buttons{
			display: flex;
		}

	</style>
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
			<a href="#">Products</a>
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

	<div class="slider_buttons">
		<div class="nav" style="margin: 250px 0 0 300px;">
			<button onclick="goPrev()">
				<
			</button>
		</div>

			<div class="slider">
					<a href="/views/item.php?id=1"><img src="https://cackle.co.nz/hardware/wp-content/uploads/sites/3/2023/06/510288-0.jpg" class="slide" alt="" ></a>
					<a href="/views/item.php?id=2"><img src="https://www.business2community.com/wp-content/uploads/2013/04/HP-Envy-Spectre-XT-Review.jpg" class="slide" alt="" ></a>
					<a href="/views/item.php?id=3"><img src="https://reviewed-com-res.cloudinary.com/image/fetch/s--NMTqMJpN--/b_white,c_limit,cs_srgb,f_auto,fl_progressive.strip_profile,g_center,q_auto,w_792/https://reviewed-production.s3.amazonaws.com/attachment/94d18a105bcf4a2d/Dell-Inspiron-14-7420-About.jpg" class="slide" alt="" ></a>
					<a href="/views/item.php?id=4"><img src="https://laptopmedia.com/wp-content/uploads/2020/12/Aspire5_KSP6.jpg" class="slide" alt="" ></a>
					<a href="/views/item.php?id=5"><img src="https://cdn.mos.cms.futurecdn.net/Q2eW2m6uASnYsWRn5m7mr4.jpg" class="slide" alt="" ></a>
					<a href="/views/item.php?id=6"><img src="https://www.apple.com/v/ipad-pro/am/images/overview/hero/hero_combo__fcqcc3hbzjyy_large.jpg" class="slide" alt="" ></a>
					<a href="/views/item.php?id=7"><img src="https://external-preview.redd.it/hv_h2fMMFVz19ifVH9vHmVL_2-tOqlTt9bPmu7GZyXo.jpg?auto=webp&s=5ec5a6149ced1076ded1941ee8cb18d3e0eae603" class="slide" alt="" ></a>
					<a href="/views/item.php?id=8"><img src="https://www.pcworld.com/wp-content/uploads/2023/04/fitbitlineup-100900381-orig.jpg?quality=50&strip=all&w=1024" class="slide" alt="" ></a>
			</div>

		<div class="nav" style="margin: 250px 300px 0 0;">
			<button onclick="goNext()">
				>
			</button>
		</div>
	</div>
	<main>
        <button id="back-to-top" onclick="scrollToTop()" >^</button>

		<div class="container" id="card-container"></div>

	</main>

	<script>

		const slides = document.querySelectorAll(".slide")
		let counter = 0;
		const totalSlides = slides.length;
		
		slides.forEach(
			(slide, index)=>{
				slide.style.left = `${index * 100}%`;
			}
		);

		const goPrev = () => {
			counter = (counter - 1 + totalSlides) % totalSlides;
			slideImage();
		};

		const goNext = () => {
			counter = (counter + 1) % totalSlides;
			slideImage();
		};

		const slideImage = () => {
			slides.forEach(
				(slide) => {
					slide.style.transform = `translateX(-${counter * 100}%)`
				}
			);
		};

		let fetchedProduct;
		
		fetch('/controller/fetchProducts.php')
			.then(response => response.json())
			.then(data => {
				const container = document.getElementById('card-container');

				data.forEach(device => {

					const card = document.createElement('div');
					card.className = 'product';

					const img_div = document.createElement('div')
					const img = document.createElement('img');
					img_div.className = "card_img";
					img.src = device.image;
					img.alt = 'Device Image';

					const heading = document.createElement('h4');
					heading.textContent = device.name;
					heading.className = "card_name"

					const action_div = document.createElement('div')
					action_div.className = "action_div"

					heart = document.createElement('a')
					heart.innerHTML = ""
					heart_icon = document.createElement('ion-icon')
					heart_icon.name = 'heart-outline'

					const p = document.createElement('div');
					p.style.fontFamily = "Trebuchet MS "
					p.className = "device_price_parent_div"
				
						const p_original = document.createElement('p');
						p_original.textContent = device.price + "$"
						p.appendChild(p_original)

					add_to_cart = document.createElement('a')
					add_to_cart.innerHTML = ""
					add_to_cart_icon = document.createElement('ion-icon')
					add_to_cart_icon.name = 'cart-outline'

					img_div.appendChild(img);
					heart.appendChild(heart_icon);
					add_to_cart.appendChild(add_to_cart_icon)
					action_div.appendChild(heart)
					action_div.appendChild(p);
					action_div.appendChild(add_to_cart)
					card.appendChild(img_div);
					card.appendChild(heading);
					card.appendChild(action_div);
					container.appendChild(card);

					card.addEventListener('click', () => {
						window.location.replace('/views/item.php?id=' + device.id)
					})

				
				});
			})
			.catch(error => console.error('Error fetching data:', error));

			// let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

			// function fillCart(product) {
			// 	const cartContainer = document.getElementById('card-container');

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

			// 	cartItems.push(product);
			// 	localStorage.setItem('cartItems', JSON.stringify(cartItems));

			// 	window.location.href = 'http://localhost:8008/views/cart.php'; 
			// }

	</script>

	
<footer>
	<hr>
	<div id="foot" class="foot">
		<div class="aboutUs">
			<h2 class="au">About Us</h2>
			<div class="leftFooter">
				<a href="#"><p>Who We Are</p></a>
				<a href="#"><p>Gift Cards</p></a>
				<a href="#"><p>Sell on SunSpot</p></a>
				<a href="#"><p>Advertise With Us</p></a>
				<a href="#"><p>Locations</p></a>
				<a href="#"><p>SunSpot Credit Card</p></a>
				<a href="#"><p>Careers</p></a>
				<a href="#"><p>SunSpot Professional</p></a>
			</div>
		</div>

		<div class="costumerService">
			<h2 class="cs">Costumer Service</h2>
			<div class="midFooter">
				<a href="/views/cart.php"><p>My Orders</p></a>
				<a href="#"><p>My Account</p></a>
				<a href="#"><p>Track My Order</p></a>
				<a href="#"><p>Return Policy</p></a>
				<a href="#"><p>Help Center</p></a>
				<a href="#"><p>Product Recalls</p></a>
				<a href="#"><p>SunSpot Accessibility Statement</p></a>
				<a href="#"><p>Quick Help</p></a>
			</div>
		</div>

		<div class="contactUs">
			<h2 class="cu">Contact Us</h2>
			<div class="rightFooter">
				<h3 style="font-weight: bold;">Customer Service</h3>
				<p>Mon - Fri: 8:00 AM - 11:59 PM</p>
				<p>Sat: 8:00 AM - 8:00 PM</p>
				<p>Sun: 9:00 AM - 6:00 PM</p>
				<p>European Time</p>
				<h3 style="font-weight: bold;">Shopping Assistance</h3>
				<p>Mon - Fri: 8:00 AM - 11:55 PM</p>
				<p>Sat: 8:00 AM - 8:00 PM</p>
				<p>Sun: 9:00 AM - 6:00 PM</p>
				<p>European Time</p>
			</div>
		</div>
	</div>
	
	<hr>

	<div class="socialMedia">
		<a href="#"><img src="../assets/icons8-twitterx-50.png" alt="twitter"></a>
		<a href="#"><img src="../assets/icons8-facebook-64.png" alt="facebook"></a>
		<a href="#"><img src="../assets/icons8-pinterest-50.png" alt="pinterest"></a>
		<a href="#"><img src="../assets/instagram.png" alt="instagram"></a>
	</div>
	<br>
	<div class="termsOfUse">
		<a href="#">Terms of Use</a>
		<a href="#">Privacy Policy</a>
		<a href="#">Your Privacy Rights & Choices</a><br>
	</div>
	<br>
	&copy; SunSpot LLC. 2024 Home Appliances Store. All rights reserved.
</footer>

</body>


</html>
