"use client";
import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  Settings,
  ChevronRight,
  ChevronDown,
  UserRoundCog,
  AudioLines,
  LogIn,
} from "lucide-react";
import { UserButton, useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import FirstLogin from "@/components/FirstLogin";
import { getUserById } from "@/lib/actions/user-action";

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
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const className =
    "bg-red-500 w-[250px] h-screen fixed md:static top-0 bottom-0 left-0 z-40 overflow-y-auto";

  const { userId } = useAuth();
  const isAuth = !!userId;
  const { user } = useClerk();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/getProfile");
        console.log("response data", response.data);
        setProfile(response.data);
      } catch (error) {
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isAuth]);

  useEffect(() => {
    if (!loading && profile !== null) {
      toast.success("Welcome back!");
    }
  }, [loading]);

  return (
    <div className={className}>
      <div className="flex flex-col">
        {isAuth ? (
          <div className="flex">
            <p className="font-bold text-3xl my-3 ml-7 text-white">
              Hi {user?.firstName}!
            </p>
            <div className="ml-3 mt-5">
              <UserButton />
            </div>
            {!loading && profile === null ? <FirstLogin /> : null}
          </div>
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
          name="Edit Profile"
          route="/artists"
          icon={<UserRoundCog />}
        />
        <MenuItem
          name="Settings"
          onClick={() => setPlaylistOpen(!isPlaylistOpen)}
          icon={<Settings /> }
          isOpen={isPlaylistOpen}
        >
          <MenuItem name="..." route="/playlists/1" icon={<AudioLines />} />
          <MenuItem name="..." route="/playlists/2" icon={<AudioLines />} />
        </MenuItem>
      </div>
    </div>
  );
};

export default Sidebar;
