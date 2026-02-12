import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Eagle from "../assets/img/eagle.png";


export const Navbar = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			if (typeof logout === "function") {
				await logout();
			} else {
				localStorage.removeItem("token");
				localStorage.removeItem("access_token");
				localStorage.removeItem("jwt");
				localStorage.removeItem("user_id");
				localStorage.removeItem("id");
				localStorage.removeItem("userId");
			}
		} finally {
			navigate("/", { replace: true });
		}
	};
	const { loggedIn, logout } = useAuth();

	return (
		<nav className="navbar navbar-dark bg-dark">
			<div className="container mb-1">
				<Link to="/" className="text-decoration-none d-flex align-items-center">
					<div style={{ width: 55, height: 55 }}>
						<img
							src={Eagle}
							alt="Logo"
							style={{ width: "100%", height: "100%", objectFit: "contain" }}
						/>
					</div>
					<span className="navbar-brand mb-0 h1 gold-title ms-2">
						Eagle Nail Spa
					</span>
				</Link>
				{/* Invisible div pushes all the buttons over */}
				<div className="ms-auto"></div>
				<Link to="/OurTeam" className="text-decoration-none">
					<span className="diff-text mb-0 highlight-on-hover">Team</span>
				</Link>
				<Link to="/Services" className="text-decoration-none">
					<span className="diff-text mb-0 ms-3 highlight-on-hover">Services</span>
				</Link>
				<Link to="/booking-app" className="text-decoration-none">
					<span className="diff-text mb-0 ms-3 highlight-on-hover">Booking</span>
				</Link>
				<div className="ms-4">
					<div className="dropdown" style={{ position: 'relative' }}>
						<button
							className="btn btn-gold dropdown-toggle"
							type="button"
							id="dropdownMenuButton"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							{loggedIn ? (
								<span className="button-text">Account </span>
							) : (
								<span className="button-text">Login </span>
							)}
						</button>
						<ul className="dropdown-menu dropdown-menu-end bg-dark" aria-labelledby="dropdownMenuButton">
							{loggedIn ? (
								<>
									<li><a className="dropdown-item text-warning nav-drop button-text" href="/account">My Info</a></li>
									<li><button className="dropdown-item text-light nav-drop button-text" onClick={handleLogout}>
										Logout
									</button></li>
								</>
							) : (
								<>
									<li><a className="dropdown-item text-light nav-drop button-text" href="/login">Login</a></li>
									<li><a className="dropdown-item text-light nav-drop button-text" href="/signup">Sign Up</a></li>
								</>
							)}

						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};