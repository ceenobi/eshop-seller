import { ToastContainer, Zoom } from "react-toastify";
import { AppRoutes } from "@/routes";
import { AuthProvider } from "@/config";

function App() {
  return (
    <>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          transition={Zoom}
          theme="colored"
        />
        <AppRoutes />
      </AuthProvider>
    </>
  );
}

export default App;
