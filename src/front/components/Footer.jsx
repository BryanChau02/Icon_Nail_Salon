import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => (
	<footer className="bg-dark text-light py-5">
		<div className="container pe-5">
			<div className="row">
				{/* Brand */}
				<div className="col-md-4 mb-3">
					<h5>Eagle Nail Spa</h5>
					<p className="small">© 2025 Eagle Nail Spa. All rights reserved.</p>
				</div>

				{/* Social Media */}
				<div className="col-md-4 mb-3">
					<h5>Follow Us</h5>
					<a className="btn text-light mx-2" onClick={() => { window.open("https://instagram.com"); }}>
						<span className="highlight-on-hover">
							<i className="fab fa-instagram fa-lg"></i>
						</span>
					</a>
					<a className="btn text-light mx-2" onClick={() => { window.open("https://facebook.com"); }}>
						<span className="highlight-on-hover">
						<i className="fab fa-facebook fa-lg"></i>
						</span>
					</a>
				</div>

				{/* Hours */}
				<div className="col-md-4 mb-3">
					<h5>Hours of Operation</h5>
					<p className="small">
						<strong>Mon:</strong> 9:00 A.M. - 7:00 P.M.
						<br />
						<strong>Tuesday:</strong> CLOSED
						<br />
						<strong>Wednesday - Saturday:</strong> 9:00 A.M. - 7:00 P.M.
						<br />
						<strong>Sun:</strong> 10:00 A.M. - 5:00 P.M.
						<br />
						Last walk-ins 30 mins before close.
					</p>
				</div>

				{/* Quick Links */}
				<div className="col-md-4">
					<h6>Quick Links</h6>
					<ul className="list-unstyled small">
						<li>
							<Link to="/" className="text-decoration-none text-light">
								<span className="highlight-on-hover">Home</span>
							</Link>
						</li>
						<li>
							<Link to="/OurTeam" className="text-decoration-none text-light">
								<span className="highlight-on-hover">Team</span>
							</Link>
						</li>
						<li>
							<Link to="/Services" className="text-decoration-none text-light">
								<span className="highlight-on-hover">Services</span>
							</Link>
						</li>
						<li>
							<Link to="/booking-app" className="text-decoration-none text-light">
								<span className="highlight-on-hover">Booking</span>
							</Link>
						</li>
					</ul>
				</div>

				{/* Location */}
				<div className="col-md-4">
					<h6>Location</h6>
					<p>
						<a
							href="https://www.google.com/maps/dir/?api=1&destination=Eagle+Nail+Spa,+4684+Coral+Ridge+Dr,+Coral+Springs,+FL+33076"
							target="_blank"
							rel="noopener noreferrer"
							className="text-decoration-none text-light"
						>
							<span className="highlight-on-hover">
							4684 Coral Ridge Dr,
							<br />
							Coral Springs, FL 33076
							</span>
						</a>
					</p>
				</div>

				{/* Contact */}
				<div className="col-md-4">
					<h5>Call Us</h5>
					<p>
						<a
							href="tel:+19543469788"
							className="text-decoration-none text-light"
						>
							<span className="highlight-on-hover">
							<i className="fa-solid fa-phone me-2"></i>
							(954) 346-9788
							</span>
						</a>
					</p>

					<h5>Email</h5>
					<p>
						<a
							href="mailto:eaglenails26@gmail.com"
							className="text-decoration-none text-light"
						>
							<span className="highlight-on-hover">
							<i className="fa-solid fa-envelope me-2"></i>eaglenails26@gmail.com
							</span>
						</a>
					</p>
				</div>
			</div>
		</div>
	</footer>
);