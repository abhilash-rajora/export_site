import { Toaster } from '@/components/ui/sonner';
import { Outlet, RouterProvider, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import AdminGuard from './components/AdminGuard';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import AboutPage from './pages/AboutPage';
import EnquiryPage from './pages/EnquiryPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPage from './pages/ProductsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import FloatingButtons from './components/FloatingButtons';
import AdminSeoPage from './pages/admin/AdminSeoPage';
import CreateAdminPage from './pages/admin/CreateAdminPage';
import ScrollToTop from './components/ScrollToTop';
import TermsPage from './pages/TermsPage';
import CookieBanner from './components/CookieBanner';
import WishlistPage from './pages/WishlistPage';




const rootRoute = createRootRoute({
  component: () => (
    <>
      <ScrollToTop />
      <Outlet />
      <Toaster position="top-right" richColors  />
      <CookieBanner /> 
    </>
  ),
});

const publicLayoutRoute = createRoute({ getParentRoute: () => rootRoute, id: 'public-layout', component: () => <PublicLayout /> });
const homeRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/', component: HomePage });
const productsRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/products', component: ProductsPage });
const productDetailRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/products/$id', component: ProductDetailPage });
const enquiryRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/enquiry', component: EnquiryPage });
const aboutRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/about', component: AboutPage });
const wishlistRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/wishlist', component: WishlistPage });
const adminLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/login', component: AdminLoginPage });

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: () => (
    <AdminGuard>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminGuard>
  ),
});

const adminSeoRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/seo',
  component: AdminSeoPage,
});

const adminDashboardRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin', component: AdminDashboardPage });
const adminProductsRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/products', component: AdminProductsPage });
const adminProductNewRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/products/new', component: AdminProductFormPage });
const adminProductEditRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/products/$id/edit', component: AdminProductFormPage });
const adminEnquiriesRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/enquiries', component: AdminEnquiriesPage });
const adminCreateAdminRoute = createRoute({getParentRoute: () => adminLayoutRoute, path: '/admin/create-admin',component: CreateAdminPage,});
const termsRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/terms', component: TermsPage });

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([homeRoute, productsRoute, productDetailRoute, enquiryRoute, aboutRoute, termsRoute,wishlistRoute]),
  adminLoginRoute,
  adminLayoutRoute.addChildren([adminDashboardRoute, adminProductsRoute, adminProductNewRoute, adminProductEditRoute, adminEnquiriesRoute, adminSeoRoute, adminCreateAdminRoute]),
]);



const router = createRouter({ routeTree 
  
});

declare module '@tanstack/react-router' {
  interface Register { router: typeof router; }
}

export default function App() {
  return <RouterProvider router={router} />;
}

