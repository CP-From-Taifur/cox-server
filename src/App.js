import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import AddWallet from "./components/AddWallet/AddWallet";
import AutomatedAddWallet from "./components/AddWallet/AutomatedAddWallet";
import AddAdmins from "./components/Admin/AddAdmin";
import Admins from "./components/Admin/Admins";
import AdminComStatus from "./components/AdminPerformance/Com";
import AdminOrderStatus from "./components/AdminPerformance/Order";
import AdminShellStatus from "./components/AdminPerformance/Shell";
import Auths from "./components/Auths/Auths";
import ManageAuthPermission from "./components/Auths/ManageAuthPermission";
import AddBanner from "./components/Banner/AddBanner";
import Banner from "./components/Banner/Banner";
import EditBanner from "./components/Banner/EditBanner";
import AddCategory from "./components/category/AddCategory";
import Category from "./components/category/Category";
import EditCategory from "./components/category/EditCategory";
import AddNotice from "./components/Notice/AddNotice";
import EditNotice from "./components/Notice/EditNotice";
import Notice from "./components/Notice/Notice";
import ManageOrderPermission from "./components/Orders/ManageOrderPermission";
import Orders from "./components/Orders/Orders";
import SubadminOrders from "./components/Orders/SubadminOrders";
import AddPackage from "./components/Packages/AddPackage";
import EditPackage from "./components/Packages/EditPackage";
import Packages from "./components/Packages/Packages";
import AddUpVouchers from "./components/Packages/Voucher/AddUpVouchers";
import VoucherStatistic from "./components/Packages/Voucher/Statistic";
import Voucher from "./components/Packages/Voucher/Voucher";
import AddPaymentMethod from "./components/PaymentMethod/AddPaymentMethod";
import EditPaymentMethod from "./components/PaymentMethod/EditPaymentMethod";
import PaymentMethod from "./components/PaymentMethod/PaymentMethod";
import AddPhysicalProduct from "./components/PhysicalProduct/AddPhysicalProduct";
import EditPhysicalProduct from "./components/PhysicalProduct/EditPhysicalProduct";
import PhysicalProduct from "./components/PhysicalProduct/PhysicalProduct";
import PhysicalProductOrder from "./components/PhysicalProduct/PhysicalProductOrder";
import AddProductBanner from "./components/ProductBanner/AddProductBanner";
import EditProductBanner from "./components/ProductBanner/EditProductBanner";
import ProductBanner from "./components/ProductBanner/ProductBanner";
import ChangePassword from "./components/Profile/ChangePassword";
import Profile from "./components/Profile/Profile";
import SendSms from "./components/Sms/SendSms";
import Test from "./components/Test";
import AddNewMessage from "./components/TopupOrderMessage/AddNewMessage";
import TopupOrderMessage from "./components/TopupOrderMessage/TopupOrderMessage";
import TopupPaymentMethod from "./components/TopupPaymentMethod/TopupPaymentMethod";
import AddTopupProduct from "./components/TopupProduct/AddTopupProduct";
import EditTopupProduct from "./components/TopupProduct/EditTopupProduct";
import TopupProduct from "./components/TopupProduct/TopupProduct";
import EditUser from "./components/Users/EditUser";
import Users from "./components/Users/Users";
import AdminLayout from "./layouts/AdminLayout";
import BlankLayout from "./layouts/BlankLayout";
import { isAuth } from "./utils/handler.utils";
import Dashboard from "./views/admin/Dashboard";
import Settings from "./views/admin/Settings";
import Tables from "./views/admin/Tables";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import Landing from "./views/Landing";



function App() {
  const auth = isAuth()
  return (
    <>
      <ToastContainer />
      {auth ? (
        <AdminLayout>
          <Switch>
            <Route path="/" exact component={Dashboard} />

            <Route path="/order" exact component={Orders} />
            <Route path="/subadmin-order" exact component={SubadminOrders} />

            <Route path="/user" exact component={Users} />
            <Route path="/user/edit/:id" exact component={EditUser} />

            <Route path="/payment-method" exact component={PaymentMethod} />
            <Route path="/payment-method/add" exact component={AddPaymentMethod} />
            <Route path="/payment-method/edit/:id" exact component={EditPaymentMethod} />

            <Route path="/notice" exact component={Notice} />
            <Route path="/notice/add" exact component={AddNotice} />
            <Route path="/notice/edit/:id" exact component={EditNotice} />

            <Route path="/topup-product" exact component={TopupProduct} />
            <Route path="/topup-product/add" exact component={AddTopupProduct} />
            <Route path="/topup-product/edit/:id" exact component={EditTopupProduct} />

            <Route path="/category" exact component={Category} />
            <Route path="/add-category" exact component={AddCategory} />
            <Route path="/category/edit/:id" exact component={EditCategory} />

            <Route path="/topup-payment-method" exact component={TopupPaymentMethod} />

            <Route path="/physical-product" exact component={PhysicalProduct} />
            <Route path="/physical-product/add" exact component={AddPhysicalProduct} />
            <Route path="/physical-product/edit/:id" exact component={EditPhysicalProduct} />

            <Route path="/banner" exact component={Banner} />
            <Route path="/banner/add" exact component={AddBanner} />
            <Route path="/banner/edit/:id" exact component={EditBanner} />

            <Route path="/product-banner" exact component={ProductBanner} />
            <Route path="/product-banner/add" exact component={AddProductBanner} />
            <Route path="/product-banner/edit/:id" exact component={EditProductBanner} />


            <Route path="/admins" exact component={Admins} />
            <Route path="/admin/add" exact component={AddAdmins} />

            <Route path="/add-wallet" exact component={AddWallet} />
            <Route path="/automated-add-wallet" exact component={AutomatedAddWallet} />
            {/* <Route path="/add-wallet/edit/:id" exact component={EditTransaction} /> */}

            <Route path="/manage-auth-permission/:id" exact component={ManageAuthPermission} />
            <Route path="/manage-order-permission/:id" exact component={ManageOrderPermission} />

            <Route path="/auths" exact component={Auths} />
            <Route path="/settings" exact component={Settings} />
            <Route path="/tables" exact component={Tables} />
            <Route path="/register" exact component={Register} />
            <Route path="/landing" exact component={Landing} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/profile/change-password" exact component={ChangePassword} />

            <Route path="/topup-packages" exact component={Packages} />
            <Route path="/topup-package/edit/:id" exact component={EditPackage} />
            <Route path="/topup-package/add/:id" exact component={AddPackage} />

            <Route path="/add-vouchers/:id" exact component={AddUpVouchers} />
            <Route path="/topup-package/voucher/:id" exact component={Voucher} />
            <Route path="/topup-package/voucher-statistic" exact component={VoucherStatistic} />


            <Route path="/admin-com-count" exact component={AdminComStatus} />
            <Route path="/admin-order-count" exact component={AdminOrderStatus} />
            <Route path="/admin-shell-count" exact component={AdminShellStatus} />

            <Route path="/send-sms" exact component={SendSms} />

            <Route path="/product-order" exact component={PhysicalProductOrder} />

            <Route path="/topup-order-message" exact component={TopupOrderMessage} />
            <Route path="/topup-order-message/add-new" exact component={AddNewMessage} />

            <Route path="/test" exact component={Test} />
            <Redirect from="/" to="/" />
          </Switch>
        </AdminLayout>
      ) : (
        <BlankLayout>
          <Switch>
            <Route path="/login" exact component={Login} />
            <Redirect from="/" to="/login" />
          </Switch>
        </BlankLayout>
      )}
    </>
  );
}

export default App;
