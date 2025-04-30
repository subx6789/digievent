"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/StudentPages/Footer/Footer";
import Navbar from "@/components/StudentPages/Navbar/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { studentData } from "@/utils/data/studentData";
import { Student } from "@/types/student";
import {
  Edit,
  Save,
  X,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  BookOpen,
  GraduationCap,
  CalendarClock,
  Hash,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getOrdinalSuffix } from "@/utils/functions/getOrdinalSuffix";
import { z } from "zod";

// Define validation schemas
const phoneSchema = z
  .string()
  .refine(
    (val) => /^(\+91\s)?(?:\(\d{2,3}\)\s\d{4}\s\d{4}|[6-9]\d{9})$/.test(val),
    {
      message:
        "Please enter a valid 10-digit mobile number or a valid landline number with area code.",
    }
  );

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(12, { message: "Password must not exceed 12 characters" });

const StudentProfile = () => {
  const { toast } = useToast();
  const [student, setStudent] = useState<Student>(studentData);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [editData, setEditData] = useState({
    phone: studentData?.phone || "",
    avatarUrl: studentData.avatarUrl || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Add validation errors state
  const [errors, setErrors] = useState({
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      setEditData({
        phone: student.phone || "",
        avatarUrl: student.avatarUrl || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const prefix = "+91 ";

    // If the user is trying to delete characters and the value is just the prefix or less
    if (value.length <= prefix.length) {
      setEditData({
        ...editData,
        phone: prefix,
      });
      return;
    }

    // If the value doesn't start with the prefix, ensure it does
    if (!value.startsWith(prefix)) {
      // Extract any digits the user might have entered
      const digits = value.replace(/\D/g, "");
      value = prefix + digits;
    } else {
      // Only keep the prefix and any digits after it
      const inputAfterPrefix = value.substring(prefix.length);
      const digitsAfterPrefix = inputAfterPrefix.replace(/\D/g, "");
      value = prefix + digitsAfterPrefix;
    }

    // Limit to a reasonable phone number length (10 digits after prefix)
    const maxLength = prefix.length + 10;
    if (value.length > maxLength) {
      value = value.substring(0, maxLength);
    }

    setEditData({
      ...editData,
      phone: value,
    });

    // Validate with Zod and set error if any
    try {
      phoneSchema.parse(value);
      setErrors((prev) => ({ ...prev, phone: "" }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, phone: error.errors[0].message }));
      }
    }
  };

  // Add password validation on change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });

    // Validate password
    if (name === "newPassword") {
      try {
        passwordSchema.parse(value);
        setErrors((prev) => ({ ...prev, newPassword: "" }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            newPassword: error.errors[0].message,
          }));
        }
      }

      // Also check if passwords match when changing new password
      if (editData.confirmPassword && value !== editData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords don't match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }

    // Check if passwords match when changing confirm password
    if (name === "confirmPassword") {
      if (value !== editData.newPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords don't match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditData({
            ...editData,
            avatarUrl: event.target.result as string,
          });

          // Show success toast with animation
          toast({
            title: "Image uploaded",
            description: "Your profile picture has been updated",
            action: (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            ),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setEditData({
      ...editData,
      avatarUrl: "",
    });

    toast({
      title: "Image removed",
      description: "Your profile picture has been removed",
      variant: "destructive",
    });
  };

  const handleSaveChanges = () => {
    setIsLoading(true);

    // Validate phone number with Zod
    try {
      phoneSchema.parse(editData.phone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid phone number",
          description: error.errors[0].message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    // Validate password if changing
    if (editData.newPassword) {
      try {
        passwordSchema.parse(editData.newPassword);
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast({
            title: "Invalid password",
            description: error.errors[0].message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      if (editData.newPassword !== editData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "New password and confirm password must match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (editData.currentPassword === "") {
        toast({
          title: "Current password required",
          description: "Please enter your current password",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    // Simulate API call
    setTimeout(() => {
      // Update student data
      setStudent({
        ...student,
        phone: editData.phone,
        avatarUrl: editData.avatarUrl,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        action: (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </motion.div>
        ),
      });

      setIsLoading(false);
      setIsEditing(false);

      // Reset password fields
      setEditData({
        ...editData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      <div className="pt-32 min-h-screen pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-2">
              My Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              View and manage your personal information
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            {/* Edit/Cancel Button */}
            <Button
              onClick={handleEditToggle}
              variant={isEditing ? "destructive" : "default"}
              className={cn(
                `flex items-center text-white gap-2 h-11 hover:scale-105 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150`,
                isEditing
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
              disabled={isLoading}
            >
              {isEditing ? (
                <>
                  <X size={18} /> Cancel Editing
                </>
              ) : (
                <>
                  <Edit size={18} /> Edit Profile
                </>
              )}
            </Button>

            {/* Save Button - Only visible in edit mode */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 px-8 h-11 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-150"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Save size={18} />
                    )}
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <motion.div
                    className="relative w-40 h-40 mb-4"
                    animate={!isEditing ? pulseAnimation : {}}
                  >
                    {isEditing ? (
                      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-400 shadow-xl">
                        {editData.avatarUrl ? (
                          <Image
                            src={editData.avatarUrl}
                            alt={student.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                            <User
                              size={64}
                              className="text-blue-500 dark:text-blue-400"
                            />
                          </div>
                        )}

                        <motion.div
                          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="flex gap-3">
                            <motion.label
                              htmlFor="avatar-upload"
                              className="cursor-pointer"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg">
                                <Upload size={20} className="text-blue-500" />
                              </div>
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                              />
                            </motion.label>
                            {editData.avatarUrl && (
                              <motion.button
                                onClick={handleRemoveAvatar}
                                className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Trash2 size={20} className="text-red-500" />
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div
                        className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-400 shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        {student.avatarUrl ? (
                          <Image
                            src={student.avatarUrl}
                            alt={student.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                            <User
                              size={64}
                              className="text-blue-500 dark:text-blue-400"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mt-2"
                  >
                    {student.name}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-500 dark:text-gray-400 mt-1"
                  >
                    {student.email}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 px-5 py-3 rounded-full shadow-md"
                  >
                    <GraduationCap
                      size={18}
                      className="text-blue-500 dark:text-blue-400"
                    />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      {student.course} •{" "}
                      {`${student.year}${getOrdinalSuffix(student.year)} year`}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Profile Details Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            {/* Tab Navigation - Moved above the content cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 w-full"
            >
              <div className="flex justify-between gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <motion.button
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ y: 1, scale: 0.97 }}
                  onClick={() => handleSectionChange("personal")}
                  className={`px-5 flex-1 flex items-center justify-center py-2 rounded-lg h-11 transition-all duration-200 font-medium ${
                    activeSection === "personal"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Personal</span>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ y: 1, scale: 0.97 }}
                  onClick={() => handleSectionChange("academic")}
                  className={`px-5 flex-1 flex items-center justify-center py-2 rounded-lg h-11 transition-all duration-200 font-medium ${
                    activeSection === "academic"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span>Academic</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {activeSection === "personal" && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 mb-6 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Personal Information
                    </h3>

                    <div className="space-y-5">
                      {/* Name */}
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                        whileHover={{ x: 3 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <User size={18} />
                          <span>Full Name</span>
                        </div>
                        <div className="md:col-span-2">
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700">
                            {student.name}
                          </div>
                        </div>
                      </motion.div>

                      {/* Email */}
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                        whileHover={{ x: 3 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Mail size={18} />
                          <span>Email</span>
                        </div>
                        <div className="md:col-span-2">
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700">
                            {student.email}
                          </div>
                        </div>
                      </motion.div>

                      {/* Phone */}
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                        whileHover={{ x: 3 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Phone size={18} />
                          <span>Phone</span>
                        </div>
                        <div className="md:col-span-2">
                          {isEditing ? (
                            <motion.div
                              initial={{ scale: 0.95 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                              className="space-y-1"
                            >
                              <Input
                                name="phone"
                                value={editData.phone}
                                onChange={handlePhoneChange}
                                className={`bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800 text-black dark:text-white h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.phone
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : ""
                                }`}
                              />
                              {errors.phone && (
                                <p className="text-sm text-red-500">
                                  {errors.phone}
                                </p>
                              )}
                            </motion.div>
                          ) : (
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700">
                              {student.phone}
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Roll Number */}
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                        whileHover={{ x: 3 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Hash size={18} />
                          <span>Roll Number</span>
                        </div>
                        <div className="md:col-span-2">
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700">
                            {student.rollno}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "academic" && (
                <motion.div
                  key="academic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 mb-6 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      Academic Information
                    </h3>

                    <div className="space-y-5">
                      {/* Course */}
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                        whileHover={{ x: 3 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <GraduationCap size={18} />
                          <span>Course</span>
                        </div>
                        <div className="md:col-span-2">
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700">
                            {student.course}
                          </div>
                        </div>
                      </motion.div>

                      {/* Year */}
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                        whileHover={{ x: 3 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <CalendarClock size={18} />
                          <span>Year</span>
                        </div>
                        <div className="md:col-span-2">
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700">
                            {student.year}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Change Section - Only visible in edit mode */}
            <AnimatePresence mode="wait">
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{
                    duration: 0.25,
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 15, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Eye className="h-5 w-5 text-blue-500" />
                      </motion.div>
                      Change Password
                    </h3>

                    <div className="space-y-5">
                      {/* Current Password */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="currentPassword"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={editData.currentPassword}
                            onChange={handleInputChange}
                            className="pr-10 bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800 text-black dark:text-white h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* New Password */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="newPassword"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            value={editData.newPassword}
                            onChange={handlePasswordChange}
                            className={`pr-10 bg-white text-black dark:text-white dark:bg-gray-900 border-blue-200 dark:border-blue-800 h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.newPassword
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : ""
                            }`}
                          />
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </motion.button>
                          {errors.newPassword && (
                            <p className="text-sm text-red-500">
                              {errors.newPassword}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={editData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`pr-10 bg-white text-black dark:text-white dark:bg-gray-900 border-blue-200 dark:border-blue-800 h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.confirmPassword
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : ""
                            }`}
                          />
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </motion.button>
                          {errors.confirmPassword && (
                            <p className="text-sm text-red-500">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default StudentProfile;
