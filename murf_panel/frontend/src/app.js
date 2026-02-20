import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import HomePage from "@/Pages/HomePage";
import ChartPage from "@/Pages/ChartPage";
import LoginPage from "@/Pages/LoginPage";
import DefaultLayout from "@/components/DefaultLayout";
import ExportPage from "@/Pages/ExportPage";
import Custom404 from "@/Pages/errors/Custom404";
import EmployeePage from "@/Pages/EmployeePage";
import DepartmentPage from "@/Pages/DepartmentPage";
import SettingsPage from "@/Pages/SettingsPage";
import AccountMappingPage from "@/Pages/AccountMappingPage";
import FormattingPage from "./Pages/FormattingPage";
import SourceMappingPage from "./Pages/SourceMappingPage";

const App = () => {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="chart" element={<ChartPage />} />
          <Route path="export" element={<ExportPage />} />
          <Route path="employees" element={<EmployeePage />} />
          <Route path="departments" element={<DepartmentPage />} />
          <Route path="account-mapping" element={<AccountMappingPage />} />
          <Route path="export/formatting-page" element={<FormattingPage />} />
          <Route path="source-mapping" element={<SourceMappingPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/403" element={<Custom404 />} />
        <Route path="/404" element={<Custom404 />} />
        <Route path="/500" element={<Custom404 />} />

      </Routes>
    </Router>
  );
};

export default App;
