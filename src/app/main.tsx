import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ErrorBoundary } from "react-error-boundary"
import { BrowserRouter, Route, Routes } from "react-router"
import { App } from "./index"
import "./styles/global.css"
import { Provider } from "react-redux"
import { AuthInit } from "@/features/auth"
import { makeErrorFallback } from "@/shared/ui"
import { store } from "./store"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary FallbackComponent={makeErrorFallback("page")}>
			<Provider store={store}>
				<BrowserRouter>
					<AuthInit>
						<Routes>
							<Route element={<App />} path="/" />
							<Route element={<App />} path="/chat/:chatId" />
						</Routes>
					</AuthInit>
				</BrowserRouter>
			</Provider>
		</ErrorBoundary>
	</StrictMode>
)
