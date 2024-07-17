"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";

const FirstLogin = () => {
  const router = useRouter();
  const [dislikedFood, setDislikedFood] = useState("");
  const [allergies, setAllergies] = useState("");
  const [cuisinePreference, setCuisinePreference] = useState("");
  const { userId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/create-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        disliked_food: dislikedFood,
        allergies: allergies,
        cuisine_preference: cuisinePreference,
      }),
    });

    setIsModalOpen(false);
    router.push("/");
  };

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="p-6">
        <h1 className="text-3xl text-center font-bold mb-4">
          Complete Your Profile
        </h1>
        <p className="text-center mb-4">
          By completing your profile, our AI can generate personalized and
          accurate recipes just for you.
        </p>
        <p className="text-center font-semibold mb-6">
          Let's make your culinary experience unique and enjoyable!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Complete Profile
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default FirstLogin;
