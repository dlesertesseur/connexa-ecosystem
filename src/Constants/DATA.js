const hours = [
  "00:00", "00:30",
  "01:00", "01:30",
  "02:00", "02:30",
  "03:00", "03:30",
  "04:00", "04:30",
  "05:00", "05:30",
  "06:00", "06:30",
  "07:00", "07:30",
  "08:00", "08:30",
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00", "17:30",
  "18:00", "18:30",
  "19:00", "19:30",
  "20:00", "20:30",
  "21:00", "21:30",
  "22:00", "22:30",
  "23:00", "23:30",
];

const shiftDurations = [
  { value: 1, label: "1:00" },
  { value: 2, label: "2:00" },
  { value: 3, label: "3:00" },
  { value: 4, label: "4:00" },
  { value: 5, label: "5:00" },
  { value: 6, label: "6:00" },
  { value: 7, label: "7:00" },
  { value: 8, label: "8:00" },
];

const pauseDurations = [
  { value: 15, label: "00:15" },
  { value: 30, label: "00:30" },
  { value: 45, label: "00:45" },
  { value: 60, label: "01:00" },
];

const radius = [
  { value: 5, label: "5 mts." },
  { value: 15, label: "15 mts." },
  { value: 25, label: "25 mts." },
  { value: 50, label: "50 mts." },
  { value: 100, label: "100 mts." },
  { value: 1000, label: "1000 mts." },
];

const storeType = [
  {value:"Minimercado", label:"Minimercado"},
  {value:"Supermercado", label:"Supermercado"},
  {value:"Hipermercado", label:"Hipermercado"},
]

//const jobType = ["generalReplacement","technicalVerification"];
const jobType = ["Reposición General","Verificación técnica"];

const pauseType = ["Desayuno","Almuerzo","Merienda","Cena"];

export { hours, shiftDurations, pauseDurations, jobType, pauseType, radius, storeType};
