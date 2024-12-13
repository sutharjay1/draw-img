import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Edit } from "./app/edit";
import Home from "./app/home";
import Preview from "./app/preview";
import Loading from "./features/global/loading";

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

const AppContent = () => {
  return (
    <main className="font-poppins flex min-h-screen w-full flex-1 flex-col items-center justify-center text-muted-foreground">
      <Suspense fallback={<Loading />}>
        <AppRouter />
      </Suspense>
    </main>
  );
};

const AppRouter = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="/edit" element={<Edit />} />
    <Route path="/preview" element={<Preview />} />
  </Routes>
);

export default App;
