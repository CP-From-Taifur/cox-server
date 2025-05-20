import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/img/logo.png';
import NotificationDropdown from "../../components/Dropdowns/NotificationDropdown";
import UserDropdown from "../../components/Dropdowns/UserDropdown";
import SidebarLi from "./SidebarLi";


export default function Sidebar({ isOpenSidebar }) {
  const navLinks = [
    {
      text: "Dashboard",
      path: "/",
      icon: "fas fa-chart-line", 
    },
    {
      text: "User",
      path: "/settings",
      icon: "fas fa-users-cog", 
      submenu: [
        {
          text: "Admin",
          path: "/admins",
          icon: "fas fa-user-shield", 
        },
        {
          text: "User",
          path: "/user",
          icon: "fas fa-user", 
        },
      ],
    },
    {
      text: "Payment Method",
      path: "/payment-method",
      icon: "fas fa-credit-card",
    },
    {
      text: "Topup Payment Method",
      path: "/topup-payment-method",
      icon: "fas fa-wallet", 
    },
    {
      text: "Order Message",
      path: "/tables",
      icon: "fas fa-inbox", 
      submenu: [
        {
          text: "Messages",
          path: "/topup-order-message",
          icon: "fas fa-envelope-open-text",
        },
        {
          text: "Add new Message",
          path: "/topup-order-message/add-new",
          icon: "fas fa-plus", 
        },
      ]
    },
    {
      text: "Topup",
      path: "/tables",
      icon: "fas fa-coins", 
      submenu: [
        {
          text: "Top Product",
          path: "/topup-product",
          icon: "fas fa-star", 
        },
        {
          text: "Topup Packages",
          path: "/topup-packages",
          icon: "fas fa-box",
        },
        {
          text: "Voucher Stat",
          path: "/topup-package/voucher-statistic",
          icon: "fas fa-ticket-alt",
        },
        {
          text: "Category",
          path: "/category",
          icon: "fas fa-tags",
        }
      ]
    },
    {
      text: "Admin Performance",
      path: "/tables",
      icon: "fas fa-chart-bar",
      submenu: [
        {
          text: "Order Status",
          path: "/admin-order-count",
          icon: "fas fa-shopping-cart",
        },
        {
          text: "Shell Status",
          path: "/admin-shell-count",
          icon: "fas fa-terminal",
        },
        {
          text: "Commission Count",
          path: "/admin-com-count",
          icon: "fas fa-percentage", 
        },
      ]
    },
    {
      text: "Add Wallet",
      path: "/add-wallet",
      icon: "fas fa-wallet", 
    },
    {
      text: "Automated Add Wallet",
      path: "/automated-add-wallet",
      icon: "fas fa-robot", 
    },
    {
      text: "Topup Order",
      path: "/tables",
      icon: "fas fa-shopping-basket",
      submenu: [
        {
          text: "Order",
          path: "/order",
          icon: "fas fa-clipboard-list",
        },
        {
          text: "Admin Order",
          path: "/subadmin-order",
          icon: "fas fa-user-clock",
        },
      ],
    },
    {
      text: "Product Order",
      path: "/product-order",
      icon: "fas fa-box-open",
    },
    {
      text: "Auths",
      path: "/auths",
      icon: "fas fa-lock",
    },
    {
      text: "Banners",
      path: "/tables",
      icon: "fas fa-images",
      submenu: [
        {
          text: "main banner",
          path: "/banner",
          icon: "fas fa-image",
        },
        {
          text: "Product banner",
          path: "/product-banner",
          icon: "fas fa-ad",
        },
      ],
    },
    {
      text: "Notice",
      path: "/notice",
      icon: "fas fa-bell",
    },
    {
      text: "landing Page",
      path: "/landing",
      icon: "fas fa-home",
    },
    {
      text: "Profile",
      path: "/profile",
      icon: "fas fa-id-card", 
    },
    {
      text: "Send Sms",
      path: "/send-sms",
      icon: "fas fa-sms", 
    },
  ];
  const [collapseShow, setCollapseShow] = useState(false);

  useEffect(() => {
    if (collapseShow) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [collapseShow])

  return (
    <>
      <div className="relative">
        <header className="flex items-center justify-between container md:hidden" >
          <div >
            <i className={`fas fa-${collapseShow ? 'times' : 'bars'} p-2 text-xl`} onClick={() => setCollapseShow(prev => !prev)}></i>
          </div>
          <div>
            <img src={logo} alt="Sizishop" className="w-[120px] md:[130px]" />
          </div>
          <div className="flex items-center space-x-2 relative z-[999999999]" >
            <NotificationDropdown />
            <UserDropdown />
          </div>
        </header>
        <nav className={`${isOpenSidebar ? 'md:left-0' : 'md:-left-full'} ${collapseShow ? 'block' : 'hidden'} md:block fixed w-full h-[calc(100vh-75px)] top-[75px] md:top-0 left-1/2 -translate-x-1/2 z-[999] duration-150 md:w-56 md:h-screen md:translate-x-0 md:translate-y-0 overflow-hidden overflow-y-auto bg-white`}>

          <Link
            to="/"
            className="hidden md:block"
          >
            <img src={logo} alt="Sizishop" className="w-[120px] md:[150px] mt-5 mb-3 ml-5" />
          </Link>


          <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            {navLinks.map((e, index) => (
              <SidebarLi key={index} data={e} />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
