import { useState } from 'react';
import Sidebar from '@/admin/components/Sidebar';
import Topbar from '@/admin/components/Topbar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
	const [isSidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className='flex h-screen bg-gray-100'>
			<Sidebar
				isSidebarOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>
			<div className='flex-1 flex flex-col'>
				<Topbar toggleSidebar={toggleSidebar} />
				<main className='p-4 flex-1 overflow-y-auto'>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
