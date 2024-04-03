import { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  
  return (
     // Adjusting the style here
     <nav className='leftsidebar' style={{
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '0 20px 20px 0', // Rounded edges on the right side
      marginLeft: '20px', // Gap on the leftmost side
      marginTop: '20px', // Optional: Adds space at the top
      marginBottom: '20px', // Optional: Adds space at the bottom
    }}>
      <div className="flex flex-col gap-11">
        
        <Link to="/" className="flex gap-3 items-center">
            <img
              src="/assets/images/cookhub.png"
              alt="logo"
              width={170}
              height={36}
            />
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>

          <ul className="flex flex-col gap-6">
            {sidebarLinks.map((link: INavLink) => {
              const isActive = pathname === link.route;

              return (
                <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-[rgb(18,55,42)]"
                }`}>

                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4 "
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white  ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>


                </li>
              )
            })}
          </ul>
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
            <p className="small-medium lg:base-medium">Signout</p>
          </Button>
      </div>
    </nav>
  )
}

export default LeftSidebar