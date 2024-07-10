"use client";

// @/components/Layout/Sidebar.tsx
import React, { useState,useEffect, FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserRoundSearchIcon,
  ChevronRight,
  ChevronDown,
  Disc,
  AudioLines,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useAuth, useClerk } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import User from "@/lib/db/schema";

// Define prop types for MenuItem component
interface MenuItemProps {
  icon: React.ReactNode;
  name: string;
  route?: string; // Made optional for items without routes
  onClick?: () => void; // Added onClick handler for items that need it
  isOpen?: boolean; // Added to track if the item is open
  children?: React.ReactNode; // For nested items
}

// Define MenuItem component
const MenuItem: FC<MenuItemProps> = ({
  icon,
  name,
  route,
  onClick,
  isOpen,
  children,
}) => {
  const pathname = usePathname();
  const colorClass =
    route && pathname === route
      ? "text-white"
      : "text-white/50 hover:text-white";

  return (
    <div className="flex flex-col">
      <div
        onClick={onClick}
        className={`flex justify-between items-center gap-1 text-md pl-6 py-3 border-b-[1px] border-b-white/10 ${colorClass}`}
      >
        <div className="flex gap-1 items-center">
          <div className="text-xl flex items-center w-[30px]">{icon}</div>
          <div>{name}</div>
        </div>
        {children && (
          <div className="text-xl flex items-center w-[30px]">
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </div>
        )}
      </div>
      {isOpen && children && <div className="pl-8">{children}</div>}
    </div>
  );
};

// Define Sidebar component
const Sidebar: FC = () => {
  const [isPlaylistOpen, setPlaylistOpen] = useState(false);

  const className =
    "bg-red-500 w-[250px] h-screen fixed md:static top-0 bottom-0 left-0 z-40 overflow-y-auto";

  const { userId } = useAuth();
  const isAuth = !!userId;
  const { user } = useClerk();

  useEffect(() => {
    const saveUser = async () => {

      if (isAuth ) {
        const newUser = {
          name: user?.firstName,
          userId: userId,
        };
  
        try {
          const res = await fetch("/api/create-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          });
  
          if (!res.ok) {
            throw new Error("Failed to save user");
          }
  
          const data = await res.json();
          console.log("User saved:", data);
        } catch (error) {
          console.error("Error saving user:", error);
        }
      }
    };
  
    saveUser();
  }, [user, userId]);
  
  return (
    <div className={className}>
      <div className="flex flex-col">
        <div className="flex">
          <p className="font-bold text-3xl my-3 ml-7 text-white">
            Hi {user?.firstName}!
          </p>
          <div className="ml-3 mt-5">
            <UserButton />
          </div>
        </div>

        {isAuth ? (
          <p></p>
        ) : (
          <Link href="/sign-in">
            <Button className="my-3 ml-5">
              Login to get started
              <LogIn className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}

        <MenuItem name="Home" route="/" icon={<HomeIcon />} />
        <MenuItem
          name="My Meals"
          onClick={() => setPlaylistOpen(!isPlaylistOpen)}
          icon={<Disc />}
          isOpen={isPlaylistOpen}
        >
          <MenuItem name="..." route="/playlists/1" icon={<AudioLines />} />
          <MenuItem name="..." route="/playlists/2" icon={<AudioLines />} />
        </MenuItem>
        <MenuItem name="TBD" route="/artists" icon={<UserRoundSearchIcon />} />
      </div>
    </div>
  );
};

export default Sidebar;
