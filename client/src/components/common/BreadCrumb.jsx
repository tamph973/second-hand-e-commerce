import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';

export default function BreadCrumb(props) {
	const { fields = [] } = props;
	return (
		<div className='py-4 mb-0 mt-[80px]'>
			<div className='container mx-auto'>
				<div className='flex justify-center'>
					<Breadcrumb className='bg-gray-50 px-5 dark:bg-gray-800'>
						<Breadcrumb.Item href='/' icon={HiHome}>
							Trang chủ
						</Breadcrumb.Item>
						{fields.map((field) => (
							<Breadcrumb.Item key={field.href} href={field.href}>
								{field.title}
							</Breadcrumb.Item>
						))}
					</Breadcrumb>
				</div>
			</div>
		</div>
	);
}
