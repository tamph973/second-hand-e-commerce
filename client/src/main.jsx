import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './store/store.js';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
	<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</GoogleOAuthProvider>,
);
