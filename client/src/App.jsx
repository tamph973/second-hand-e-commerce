import AppRoute from '@/routes/AppRoute';
import { CustomToastContainer } from '@/components/common/CustomToast';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import NotificationCenter from '@/components/common/NotificationCenter';

function App() {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 60 * 1000, // 5 minutes
						retry: 1,
					},
				},
			}),
	);

	return (
		<>
			<NotificationCenter />
			{/* Router chính */}
			<QueryClientProvider client={queryClient}>
				<AppRoute />
			</QueryClientProvider>

			{/* Global Toast / Notification */}
			<CustomToastContainer />
			<Toaster
				duration='4000'
				position='top-center'
				reverseOrder={false}
				toastOptions={{
					className: 'z-[9999]',
				}}
			/>
			{/* Global Loader / Spinner (nếu có) */}
			{/* <GlobalLoader /> */}
		</>
	);
}

export default App;
