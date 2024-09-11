import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className=''>
			<h1 className='md:text-3xl text-3xl lg:text-3xl relative z-50 text-white pt-5 pl-5'>
				{/* Updated to link only the icon */}
				<Link to='/'><FaHome/></Link>
			</h1>
			
		</div>
	);
};
export default Header;