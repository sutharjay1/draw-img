import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Edit } from "./app/edit";
import Home from "./app/home";
import ImageMerge from "./app/merge";
import Preview from "./app/preview";
import Loading from "./features/global/loading";

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

const AppContent = () => {
  return (
    <div className="font-poppins flex min-h-screen w-full flex-col text-muted-foreground">
      <main className="font-poppins flex h-screen w-full flex-1 items-center justify-center">
        <Suspense fallback={<Loading />}>
          <AppRouter />
        </Suspense>
      </main>
    </div>
  );
};

const AppRouter = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="/merge" element={<ImageMerge />} />
    <Route path="/edit" element={<Edit />} />
    <Route path="/preview" element={<Preview />} />
  </Routes>
);

export default App;
