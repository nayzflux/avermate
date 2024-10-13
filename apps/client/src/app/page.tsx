"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Home: FC = () => {

  const router = useRouter();

  return (
    <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-indigo-700 text-white"
      >
      <header className="w-full p-4 flex justify-between items-center bg-opacity-10">
        <div className="flex items-center space-x-4">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <h1 className="text-xl font-bold">AverageCalc</h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Calculate Averages in Seconds!
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mb-8">
            Get instant, accurate results for your average calculations with ease.
            Just enter your numbers, and we'll do the math for you!
          </p>
          <Button
            className="px-6 py-3 text-lg bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-200 transition"
            onClick={() => {
              // Navigate to the /auth/sign-in page
              router.push("/auth/sign-in");
            }}
          >
            Start Calculating
          </Button>
        </main>
        <footer className="w-full p-4 text-center text-sm bg-opacity-10">
          <p>&copy; 2024 AverageCalc. All rights reserved.</p>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;