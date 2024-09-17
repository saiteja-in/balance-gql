import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className='p-3'>
			<Link to="/">
				<FaHome className="text-3xl cursor-pointer text-white-500 relative"/> 
			</Link>
		</div>
	);
};
export default Header;