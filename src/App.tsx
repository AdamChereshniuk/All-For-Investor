import { PortfolioByTokenPage } from "./pages/PortfolioByTokenPage/PortfolioByTokenPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { BondsScreenerPage } from "./pages/BondsScreenerPage/BondsScreenerPage";
import { DepositsCalcPage } from "./pages/DepositsCalcPage/DepositsCalcPage";
import { BondsCalcPage } from "./pages/BondsCalcPage/BondsCalcPage";
import { InvestmentsCalcPage } from "./pages/InvestmentsCalcPage/InvestmentsCalcPage";
import { SharesScreenerPage } from "./pages/SharesScreenerPage/SharesScreenerPage";
import { ReadyPortfoliosPage } from "./pages/ReadyPortfoliosPage/ReadyPortfoliosPage";
import { ReadyPortfolioPage } from "./pages/ReadyPortfolioPage/ReadyPortfolioPage";
import { MainPage } from "./pages/MainPage/MainPage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/All-For-Investor" element={<MainPage />} />
          <Route path="/portfolio-by-token-page" element={<PortfolioByTokenPage />} />
          <Route path="/bonds-screener" element={<BondsScreenerPage />} />
          <Route path="/deposits-calc" element={<DepositsCalcPage />} />
          <Route path="/bonds-calc" element={<BondsCalcPage />} />
          <Route path="/investments-calc" element={<InvestmentsCalcPage />} />
          <Route path="/shares-screener" element={<SharesScreenerPage />} />
          <Route path="/ready-portfolios" element={<ReadyPortfoliosPage />} />
          <Route path="/ready-portfolio/:id" element={<ReadyPortfolioPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;