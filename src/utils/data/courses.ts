export type Course = {
  course: string;
  department: string[];
  noOfYears: number;
};

export const courses: Course[] = [
  { course: "BCA", department: ["Computer Applications"], noOfYears: 3 },
  { course: "MCA", department: ["Computer Applications"], noOfYears: 2 },
  {
    course: "MTech",
    department: ["Computer Science and Engineering"],
    noOfYears: 2,
  },
  {
    course: "BTech",
    department: [
      "Computer Science and Engineering",
      "Mechanical Engineering",
      "Chemical Engineering",
    ],
    noOfYears: 4,
  },
  { course: "BA-LLB", department: ["Law/Legal"], noOfYears: 5 },
];
