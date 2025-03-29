import { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "1",
    course: "BCA",
    department: ["Computer Applications"],
    noOfYears: 3,
  },
  {
    id: "2",
    course: "MCA",
    department: ["Computer Applications"],
    noOfYears: 2,
  },
  {
    id: "3",
    course: "MTech",
    department: ["Computer Science and Engineering"],
    noOfYears: 2,
  },
  {
    id: "4",
    course: "BTech",
    department: [
      "Computer Science and Engineering",
      "Mechanical Engineering",
      "Chemical Engineering",
    ],
    noOfYears: 4,
  },
  { id: "5", course: "BA-LLB", department: ["Law/Legal"], noOfYears: 5 },
];
