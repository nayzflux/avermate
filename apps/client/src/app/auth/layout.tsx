"use client";

import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="h-screen w-screen grid md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
        <div className="bg-blue-500 text-white md:flex flex-col justify-center items-center hidden">
          <h1 className="text-4xl font-bold">Welcome to AverageCalc</h1>
          <p className="text-lg">Please sign in to continue</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthLayout;
