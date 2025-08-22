import Topbar from './topbar/Topbar';
import Mainbar from './mainbar/Mainbar';
import CategoryBar from './categorybar/CategoryBar';

export default function Header() {
	return (
		<div className='header sticky top-0 z-[50] bg-white'>
			<div className='border-b'>
				<Topbar />
			</div>
			<Mainbar />
			<div className='border-t'>
				<CategoryBar />
			</div>
		</div>
	);
}
