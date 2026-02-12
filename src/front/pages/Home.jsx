// Images (adjust paths if yours differ)
import heroImage1 from "../assets/img/nails1.jpg";
import heroImage2 from "../assets/img/nails2.jpg";
import salonImage from "../assets/img/salon.webp";

export const Home = () => {

	return (
		<div className="text-center">
			{/* HERO */}
			<section className="position-relative">
				{/* Carousel */}
				<div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
					<div className="carousel-inner">
						<div className="carousel-item active">
							<div className="ratio ratio-21x9 hero-ratio">
								<img src={heroImage1} className="w-100 h-100 hero-img" alt="Luxury Nails 1" />
							</div>
						</div>
						<div className="carousel-item">
							<div className="ratio ratio-21x9 hero-ratio">
								<img src={heroImage2} className="w-100 h-100 hero-img" alt="Luxury Nails 2" />
							</div>
						</div>
					</div>
				</div>

				{/* Overlay content */}
				<div className="hero-overlay d-flex flex-column align-items-center justify-content-center text-center">
					<h1 className="display-4 text-white text-shadow mb-2">Luxury Nail Care</h1>
					<p className="lead text-white-50 mb-4">Experience the ultimate in pampering and style</p>
					<div className="container-fluid">
						<a href="#about" className="btn btn-gold btn-lg me-3">About Us</a>
						<a href="#find-us" className="btn btn-gold btn-lg">Location</a>
					</div>
				</div>
			</section>

			{/* SOCIALS / QUICK LINKS */}
			<section id="socials" className="py-5">
				<div className="container">
					<div className="row row-cols-1 row-cols-md-3 g-4">
						<div className="col">
							<a href="/Giftcard.html" className="text-decoration-none">
								<div className="card service-card h-100 shadow-sm hover-lift">
									<div className="card-body text-center">
										<i className="fa-solid fa-gift fa-3x mb-3 text-gold" />
										<h5 className="card-title mb-2">Gift Cards</h5>
										<p className="card-text mb-0">
											Give the gift of luxury—perfect for any occasion.
										</p>
									</div>
								</div>
							</a>
						</div>

						<div className="col">
							<a
								href="https://www.instagram.com/"
								className="text-decoration-none"
								target="_blank"
								rel="noreferrer"
							>
								<div className="card service-card h-100 shadow-sm hover-lift">
									<div className="card-body text-center">
										<i className="fab fa-instagram fa-3x mb-3 text-gold" />
										<h5 className="card-title mb-2">Instagram Gallery</h5>
										<p className="card-text mb-0">
											Follow us for daily nail-art inspiration.
										</p>
									</div>
								</div>
							</a>
						</div>

						<div className="col">
							<a
								href="https://www.facebook.com/"
								className="text-decoration-none"
								target="_blank"
								rel="noreferrer"
							>
								<div className="card service-card h-100 shadow-sm hover-lift">
									<div className="card-body text-center">
										<i className="fab fa-facebook fa-3x mb-3 text-gold" />
										<h5 className="card-title mb-2">Facebook Updates</h5>
										<p className="card-text mb-0">
											Stay up to date on promotions and events.
										</p>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* ABOUT */}
			<section id="about" className="py-5 bg-light text-start">
				<div className="container">
					<div className="row align-items-center g-4">
						<div className="col-lg-6">
							<img
								src={salonImage}
								alt="Salon interior"
								className="img-fluid rounded shadow-sm"
							/>
						</div>

						<div className="col-lg-6">
							<h2 className="section-heading">- About Us</h2>
							<p>
								Welcome to Nails Spa, where beauty meets wellness in a serene, salon-style
								setting. Since our founding, we’ve been dedicated to providing personalized
								nail care experiences that leave you looking and feeling your very best.
								From the moment you step through our doors, our friendly, professional team
								will make you feel right at home with attentive service, expert guidance,
								and a soothing atmosphere designed to melt away the stresses of your day.
							</p>

							<h2 className="section-heading mt-4">- Our Philosophy</h2>
							<p>
								We believe that self-care is essential, and that every manicure and
								pedicure is an opportunity to nourish both body and spirit. That’s why we
								use only premium, vegan-friendly products and follow rigorous sanitation
								protocols—because your health and safety are our top priorities. Our
								technicians take the time to understand your individual style, offering
								custom color consultations, nail art designs, and treatments built around
								your needs.
							</p>

							<h2 className="section-heading mt-4">- Our Expertise</h2>
							<p>
								Our experienced nail artists stay on the cutting edge of industry trends,
								from classic French finishes and gel polishes to sculpted acrylics and the
								latest “dip” powders. Whether you’re looking for an everyday elegant look
								or a bold statement set for a special occasion, we combine technical
								precision with artistic flair to achieve flawless results, every time.
							</p>
						</div>
					</div>
				</div>
			</section>
			{/* FIND US */}
			<section id="find-us" className="py-5">
				<div className="container">
					<div className="row g-4 align-items-stretch">
						{/* Left: details */}
						<div className="col-lg-5">
							<div className="card h-100 shadow-sm text-start">
								<div className="card-body">
									<h2 className="mb-3">Find Us</h2>

									<p className="mb-2">
										<i className="fa-solid fa-location-dot me-2 text-gold"></i>
										<strong>Located in: Windsor Square Commons</strong><br />
										4684 Coral Ridge Dr, Coral Springs, FL 33076
									</p>
									{/* <p className="text-muted small mb-3">
										Hours: <br/>
										Monday: 9:00 AM - 7:00 PM <br/>
										Tuesday: CLOSED <br/>
										Wednesday - Saturday: 9:00 AM - 7:00 PM <br/>
										Sunday: 10:00 AM - 5:00 PM
									</p> */}

									<ul className="list-unstyled mb-4">
										<li className="mb-1">
											<i className="fa-regular fa-clock me-2 text-gold"></i>
											Monday: 9:00 AM - 7:00 PM
											<div className="ms-4">
												<div>Tuesday: CLOSED</div>
												<div>Wednesday - Saturday: 9:00 AM - 7:00 PM</div>
												<div>Sunday: 10:00 AM - 5:00 PM</div>
											</div>
										</li>
										<li>
											<i className="fa-solid fa-phone me-2 text-gold"></i>
											<a href="tel:+19543469788" className="text-decoration-none text-dark">
												(954) 346-9788
											</a>
										</li>
									</ul>

									<a
										className="btn btn-gold"
										href="https://www.google.com/maps/dir/?api=1&destination=Eagle+Nail+Spa,+4684+Coral+Ridge+Dr,+Coral+Springs,+FL+33076"
										target="_blank"
										rel="noreferrer"
									>
										Get Directions
									</a>
								</div>
							</div>
						</div>

						{/* Right: map */}
						<div className="col-lg-7">
							<div className="ratio ratio-16x9 rounded shadow-sm overflow-hidden">
								<iframe
									title="Map to Salon"
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.1660364559507!2d-80.2880125139952!3d26.288716927402426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d91005fb5929d3%3A0x32ade908fb0b9fd5!2sEagle%20Nail%20Spa!5e0!3m2!1sen!2sus!4v1770870733303!5m2!1sen!2sus"
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
									className="border-0"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

		</div>
	);
};

