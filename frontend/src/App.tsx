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
import AdminForgotPasswordPage from './pages/admin/AdminForgotPasswordPage';
import AdminVerifyResetOtpPage from './pages/admin/AdminVerifyResetOtpPage';
import AdminResetPasswordPage from './pages/admin/AdminResetPasswordPage';
import { Navigate } from '@tanstack/react-router';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminBlogFormPage from './pages/admin/AdminBlogFormPage';

// ─── Admin password reset routes ───────────────────────────────────────────
const adminForgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/forgot-password',
  component: AdminForgotPasswordPage,
});

const adminVerifyResetOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/verify-reset-otp',
  component: AdminVerifyResetOtpPage,
});

const adminResetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/reset-password',
  component: AdminResetPasswordPage,
});

// ─── Root ──────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <>
      <ScrollToTop />
      <Outlet />
      <Toaster position="top-right" richColors />
      <CookieBanner />
    </>
  ),
});

// ─── Public layout ─────────────────────────────────────────────────────────
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-layout',
  component: () => <PublicLayout />,
});

const homeRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/', component: HomePage });
const enquiryRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/enquiry', component: EnquiryPage });
const aboutRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/about', component: AboutPage });
const wishlistRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/wishlist', component: WishlistPage });
const termsRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/terms', component: TermsPage });
const blogRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/blog', component: BlogPage });
const blogDetailRoute = createRoute({ getParentRoute: () => publicLayoutRoute, path: '/blog/$slug', component: BlogDetailPage });

// ─── Products routes (NEW: clean URL + legacy redirect) ────────────────────
const productsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/products',
  component: ProductsPage,
});

// NEW: /products/agriculture, /products/textiles, etc.
const productsByCategoryRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/products/$category',
  component: ProductsPage,           // same component, reads $category param
});

const productDetailRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/products/detail/$id',     // moved to /detail/$id so $category doesn't conflict
  component: ProductDetailPage,
});

// ─── Admin login ────────────────────────────────────────────────────────────
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

// ─── Admin layout ───────────────────────────────────────────────────────────
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

const adminSeoRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/seo', component: AdminSeoPage });
const adminDashboardRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin', component: AdminDashboardPage });
const adminProductsRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/products', component: AdminProductsPage });
const adminProductNewRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/products/new', component: AdminProductFormPage });
const adminProductEditRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/products/$id/edit', component: AdminProductFormPage });
const adminEnquiriesRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/enquiries', component: AdminEnquiriesPage });
const adminCreateAdminRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/create-admin', component: CreateAdminPage });
const adminBlogRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/blog', component: AdminBlogPage });
const adminBlogNewRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/blog/new', component: AdminBlogFormPage });
const adminBlogEditRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/admin/blog/$id/edit', component: AdminBlogFormPage });

// ─── Route tree ─────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    productsRoute,
    productsByCategoryRoute,   // NEW clean URL route
    productDetailRoute,
    enquiryRoute,
    aboutRoute,
    termsRoute,
    wishlistRoute,
    blogRoute,
    blogDetailRoute,
  ]),
  adminLoginRoute,
  adminForgotPasswordRoute,
  adminVerifyResetOtpRoute,
  adminResetPasswordRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminProductNewRoute,
    adminProductEditRoute,
    adminEnquiriesRoute,
    adminSeoRoute,
    adminCreateAdminRoute,
    adminBlogRoute,
    adminBlogNewRoute,
    adminBlogEditRoute,
  ]),
]);

setInterval(() => {
  fetch('https://export-site-backend.onrender.com/ping').catch(() => {});
}, 10 * 60 * 1000);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router; }
}

export default function App() {
  return <RouterProvider router={router} />;
}