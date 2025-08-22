import Header from '@/components/header';
import Footer from '../components/footer/FooterComponent';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
	return (
		<>
			<Header />
			<main className='min-h-[80vh] bg-[#f5f5f5]'>
				<Outlet />
			</main>
			<Footer />
		</>
	);
}
