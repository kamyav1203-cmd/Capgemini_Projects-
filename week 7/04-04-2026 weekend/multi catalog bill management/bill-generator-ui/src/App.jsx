import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import BillsListPage from './pages/BillsListPage'
import BillEditPage from './pages/BillEditPage'
import InvoicePrintPage from './pages/InvoicePrintPage'
import CatalogsPage from './pages/CatalogsPage'
import SummaryPage from './pages/SummaryPage'
import CartPage from './pages/CartPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<BillsListPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/catalogs" element={<CatalogsPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/bills/:id" element={<BillEditPage />} />
        </Route>
        <Route path="/bills/:id/print" element={<InvoicePrintPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
