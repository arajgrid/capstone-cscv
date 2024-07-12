import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AlertDocumentationPage from "./pages/AlertDocumentation/AlertDocumentationPage";
import RootPPE from "./pages/RootPPE/RootPPe";
import RootForklift from "./pages/RootForklift/RootForklift";
import ZoomContextProvider from "./store/ZoomContext";
import Login from "./pages/LoginForm/LoginForm";
import AuthProvider from "./store/AuthContext";
import SelectUseCase from "./pages/SelectPage/SelectUseCase";
import WebSocketContextProvider from "./store/WebSocketContext";
import WebSocketContextForkliftProvider from "./store/WebSocketContextForklift";
import { AlertsProvider } from "./store/AlertsContext";
import { LoadingProvider } from "./store/LoadingContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard-ppe",
    element: <RootPPE />,
  },
  {
    path: "/dashboard-forklift",
    element: <RootForklift />,
  },
  {
    path: "/alert/:alertId",
    element: <AlertDocumentationPage />,
  },
  {
    path: "/select-useCase",
    element: <SelectUseCase />,
  },
]);

function App() {
  return (
    <LoadingProvider>
      <AlertsProvider>
      <WebSocketContextForkliftProvider>
      <WebSocketContextProvider>
      <AuthProvider>
      <ZoomContextProvider>
        <RouterProvider router={router} />
      </ZoomContextProvider>
    </AuthProvider>
    </WebSocketContextProvider>
    </WebSocketContextForkliftProvider>
    </AlertsProvider>
    </LoadingProvider>
    
    
    
    
  );
}

export default App;
