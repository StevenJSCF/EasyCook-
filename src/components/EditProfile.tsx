"use client";

import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import axios from "axios";
import { toast } from "react-hot-toast";
import { handleError } from "@/lib/utils";

const EditProfile = () => {
  const router = useRouter();
  const [dislikedFood, setDislikedFood] = useState("");
  const [allergies, setAllergies] = useState("");
  const [cuisinePreference, setCuisinePreference] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const { userId } = useAuth();
  const isAuth = !!userId;

  const {user} = useClerk(); 


  async function onSumit() {
    const values = {
      userId: userId,
      disliked_food: dislikedFood,
      allergies: allergies,
      cuisine_preference: cuisinePreference,
    };

    try {
      const response = await axios.post("/api/create-profile", {
        userProfile: values,
      });
      toast.success("Profile created successfully");
    } catch (error) {
      console.log("error creating the user profile", error);
      handleError(error);
    }
    console.log(values);

    setIsModalOpen(false);
    router.push("/");
  }

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="p-6">
        <h1 className="text-3xl text-center font-bold mb-4">
            Hey {user?.firstName}! 
        </h1>
        <p className="text-center mb-4">
          By changing your profile, our AI can generate personalized and
          accurate recipes just for you.
        </p>
        <p className="text-center font-semibold mb-6">
          Let's make your culinary experience unique and enjoyable!
        </p>
        <form onSubmit={onSumit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Disliked food:</label>
            <input
              className="p-2 border border-gray-300 rounded"
              value={dislikedFood}
              onChange={(e) => setDislikedFood(e.target.value)}
              placeholder="e.g., tuna, olive, ..."
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Allergies:</label>
            <input
              className="p-2 border border-gray-300 rounded"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g., seafood, ..."
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Cuisine Preference:</label>
            <input
              className="p-2 border border-gray-300 rounded"
              value={cuisinePreference}
              onChange={(e) => setCuisinePreference(e.target.value)}
              placeholder="e.g., Chinese, Italian, ..."
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update Profile
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default EditProfile;
