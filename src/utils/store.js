const STUDENTS_KEY = "edu_manage_students";
const USERS_KEY = "edu_manage_users";
const ADMIN_KEY = "edu_manage_admin";

const defaultStudents = [
]

const seededStudentNames = [
  "Adhamov Doston",
  "Abduqodirova Farzona",
  "Abduqayumova Fotima",
  "Abdumalikova Marhabo",
  "Suhbatjonov Nekruz",
  "Qosimov Nekruz",
  "Saidaxmedova Odina",
  "Muhiddinjonova Shodyona",
  "Zohidova Sitora",
  "Mirzajonov Shavkat",
  "Saidjonov Sumbuljon",
  "Isroilov Muhammadaziz",
  "Sharofov Shohzamon",
  "Abdullayev Temur",
  "Mirzaabdullayev Muhammadsiddiq",
  "Sharbatov Karomatillo",
  "Raxmanjonov Asadbek",
  "Hasanboev Shohjahon",
  "Azimjonov Muhammadrizo",
  "Tolipov Xamroz",
  "Mullahasanov Samir",
];

function createSeedStudent(fullName, index) {
  const [surname, ...nameParts] = fullName.split(" ");
  return {
    id: 1000 + index,
    name: nameParts.join(" "),
    surname,
    phone: "",
    grades: { matematika: 0, fizika: 0, ingliz: 0, tarix: 0, kimyo: 0 },
    attendance: { present: 0, total: 0 },
  };
}

const seededStudents = seededStudentNames.map(createSeedStudent);

function getStudentKey(student) {
  return `${String(student.name || "").trim().toLowerCase()}::${String(student.surname || "").trim().toLowerCase()}`;
}

function mergeSeedStudents(students) {
  const existingKeys = new Set(students.map(getStudentKey));
  const missing = seededStudents.filter((student) => !existingKeys.has(getStudentKey(student)));
  return missing.length ? [...students, ...missing] : students;
}

export function getStudents() {
  const data = localStorage.getItem(STUDENTS_KEY);
  if (!data) {
    const initialStudents = mergeSeedStudents(defaultStudents);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(initialStudents));
    return initialStudents;
  }
  const storedStudents = JSON.parse(data);
  const mergedStudents = mergeSeedStudents(storedStudents);
  if (mergedStudents.length !== storedStudents.length) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(mergedStudents));
  }
  return mergedStudents;
}

export function saveStudents(students) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function addStudent(student) {
  const students = getStudents();
  const newStudent = {
    ...student,
    id: Date.now(),
    grades: { matematika: 0, fizika: 0, ingliz: 0, tarix: 0, kimyo: 0 },
    attendance: { present: 0, total: 0 },
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
}

export function updateStudent(id, data) {
  const students = getStudents();
  const idx = students.findIndex((s) => s.id === id);
  if (idx !== -1) {
    students[idx] = { ...students[idx], ...data };
    saveStudents(students);
  }
  return students[idx];
}

export function deleteStudent(id) {
  const students = getStudents().filter((s) => s.id !== id);
  saveStudents(students);
}

export function getAttendancePct(student) {
  if (!student.attendance.total) return 0;
  return Math.round((student.attendance.present / student.attendance.total) * 100);
}

export function getAvgGrade(student) {
  const vals = Object.values(student.grades);
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function getStatus(student) {
  const pct = getAttendancePct(student);
  const avg = getAvgGrade(student);
  if (pct >= 80 && avg >= 80) return "A'lo";
  if (pct >= 70 && avg >= 65) return "Yaxshi";
  if (pct >= 60 && avg >= 50) return "Qoniqarli";
  return "Qoniqarsiz";
}

// Users
export function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function registerUser(user) {
  const users = getUsers();
  users.push({ ...user, id: Date.now() });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function userExists(email) {
  return getUsers().some((u) => u.email === email);
}

// Admin auth
export function checkAdmin(username, password) {
  return username === "superAdmin@gmail.com" && password === "superAdmin123";
}

export function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

export function loginAdmin() {
  sessionStorage.setItem(ADMIN_KEY, "true");
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_KEY);
}

export const SUBJECTS = ["matematika", "fizika", "ingliz", "tarix", "kimyo"];
export const SUBJECT_LABELS = {
  matematika: "Matematika", fizika: "Fizika",
  ingliz: "Ingliz tili", tarix: "Tarix", kimyo: "Kimyo",
};
