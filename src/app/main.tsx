import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router'
import {App} from './index'
import './styles/global.css'
import {Provider} from 'react-redux'
import {AuthInit} from '@/features/auth'
import {store} from './store'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<AuthInit>
					<Routes>
						<Route element={<App />} path='/' />
						<Route element={<App />} path='/chat/:chatId' />
					</Routes>
				</AuthInit>
			</BrowserRouter>
		</Provider>
	</StrictMode>
)
