
export const universitiesData = [
  { name: "UT Austin", value: "The University of Texas at Austin" },
  { name: "TAMU", value: "Texas A&M University" },
  { name: "Rice", value: "Rice University" },
  { name: "UH", value: "University of Houston" },
  { name: "UTD", value: "The University of Texas at Dallas" },
  { name: "Baylor", value: "Baylor University" },
  { name: "TTU", value: "Texas Tech University" },
  { name: "UNT", value: "University of North Texas" },
  { name: "TCU", value: "Texas Christian University" },
  { name: "Tarleton", value: "Tarleton State University" },
  { name: "UTA", value: "The University of Texas at Arlington" },
  { name: "UTEP", value: "The University of Texas at El Paso" },
  { name: "UTSA", value: "The University of Texas at San Antonio" },
  { name: "PVAMU", value: "Prairie View A&M University" },
  { name: "Trinity", value: "Trinity University" },
  { name: "SMU", value: "Southern Methodist University" },
  { name: "TXST", value: "Texas State University" },
  { name: "SHSU", value: "Sam Houston State University" },
  { name: "SFA", value: "Stephen F. Austin State University" },
  { name: "Lamar", value: "Lamar University" },
];

export const degreeData = [
  { name: "Bachelor’s", value: "Bachelor of Science (B.S.)" },
  { name: "Master’s", value: "Master of Science (M.S.)" },
  { name: "Ph.D.", value: "Doctor of Philosophy (Ph.D.)" },
  { name: "Associate", value: "Associate of Science (A.S.)" }
]



export const majorData = [
  "Computer Science",
  "Software Engineering",
  "Computer Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Aerospace Engineering",
  "Biomedical Engineering",
  "Industrial Engineering",
  "Chemical Engineering",
  "Systems Engineering",
  "Data Science",
  "Cybersecurity",
  "Environmental Engineering",
  "Materials Science and Engineering",
];

export const utaEngineeringCourses = [
  // Computer Science Courses
  { name: "CSE 1310", value: "Introduction to Computers & Programming", languages: ["Python", "Java", "C++"], tools: [] },
  { name: "CSE 1320", value: "Intermediate Programming", languages: ["C", "C++"], tools: [] },
  { name: "CSE 1325", value: "Object-Oriented Programming", languages: ["Java", "C++"], tools: [] },
  { name: "CSE 2312", value: "Computer Organization", languages: ["C", "Assembly"], tools: [] },
  { name: "CSE 2315", value: "Discrete Structures", languages: ["Python", "JavaScript"], tools: ["Mathematica"] },
  { name: "CSE 2441", value: "Digital Logic I", languages: ["Verilog", "VHDL"], tools: ["Logisim"] },
  { name: "CSE 3318", value: "Algorithms & Data Structures", languages: ["C++", "Java", "Python"], tools: [] },
  { name: "CSE 3302", value: "Programming Languages", languages: ["Python", "C++", "Scheme", "Prolog"], tools: [] },
  { name: "CSE 3310", value: "Fundamentals of Software Engineering", languages: ["Java", "C#", "Python"], tools: ["Git", "VS Code", "JIRA"] },
  { name: "CSE 3320", value: "Operating Systems", languages: ["C", "C++"], tools: ["Linux", "Unix", "VMware"] },
  { name: "CSE 3330", value: "Database Systems and File Structures", languages: ["SQL", "Python"], tools: ["MySQL", "PostgreSQL", "SQLite"] },
  { name: "CSE 3340", value: "Introduction to Human-Computer Interaction", languages: ["HTML", "CSS", "JavaScript"], tools: ["Figma", "Adobe XD"] },
  { name: "CSE 4304", value: "Game Design and Development", languages: ["C++", "C#", "Python"], tools: ["Unity", "Unreal Engine", "Blender"] },
  { name: "CSE 4308", value: "Artificial Intelligence", languages: ["Python", "Java"], tools: ["TensorFlow", "NumPy", "scikit-learn"] },
  { name: "CSE 4309", value: "Fundamentals of Machine Learning", languages: ["Python", "R"], tools: ["PyTorch", "TensorFlow", "Jupyter Notebook"] },
  { name: "CSE 4310", value: "Fundamentals of Computer Vision", languages: ["Python", "C++"], tools: ["OpenCV", "PyTorch", "TensorFlow"] },
  { name: "CSE 4344", value: "Computer Networks", languages: ["Python", "C"], tools: ["Wireshark", "Cisco Packet Tracer"] },
  { name: "CSE 4360", value: "Autonomous Robot Design and Programming", languages: ["C++", "Python"], tools: ["ROS", "Gazebo", "Arduino IDE"] },
  { name: "CSE 4380", value: "Information Security", languages: ["Python", "C"], tools: ["Wireshark", "Kali Linux", "Metasploit"] },
  // Engineering Core Courses
  { name: "ENGR 1101", value: "Introduction to Engineering (for transfer students)", languages: ["Python"], tools: ["MATLAB", "Excel"] },
  { name: "ENGR 1204", value: "Engineering First-Year Seminar", languages: [], tools: ["MATLAB", "Excel"] },
  { name: "ENGR 1250", value: "Problem Solving in Engineering", languages: ["Python"], tools: ["MATLAB"] },
  // Electrical Engineering Courses
  { name: "CE 1105", value: "Introduction to Civil Engineering", languages: [], tools: ["AutoCAD", "SolidWorks"] },
  { name: "CE 1353", value: "Intro to Computer Aided Design Tools in CE", languages: [], tools: ["AutoCAD", "SolidWorks"] },
  { name: "CE 2311", value: "Statics", languages: [], tools: ["MATLAB", "Excel"] },
  { name: "CE 2313", value: "Mechanics of Materials", languages: [], tools: ["MATLAB", "Excel"] },
  { name: "CE 2221", value: "Dynamics", languages: [], tools: ["MATLAB", "Simulink"] },
  // Industrial Engineering Courses
  { name: "IE 2308", value: "Engineering Economy", languages: ["Python"], tools: ["Excel", "MATLAB"] },
  // Electrical Engineering Courses
  { name: "EE 1101", value: "Introduction to Electrical Engineering", languages: [], tools: ["MATLAB", "Multisim", "PSpice"] },
  { name: "EE 1106", value: "Electrical Engineering Freshman Practicum", languages: [], tools: ["MATLAB", "PSpice"] },
  { name: "EE 3302", value: "Fundamentals of Power Systems", languages: [], tools: ["MATLAB", "Simulink"] },
  { name: "EE 3310", value: "Advanced Microcontrollers", languages: ["C", "C++", "Assembly"], tools: ["Arduino IDE"] },
  { name: "EE 4314", value: "Control Systems", languages: ["Python"], tools: ["MATLAB", "Simulink"] },
  { name: "EE 4310", value: "Microprocessor Systems", languages: ["C", "C++", "Assembly"], tools: [] },
  { name: "EE 3446", value: "Circuit Analysis II", languages: [], tools: ["MATLAB", "LTSpice", "Multisim"] },
  { name: "EE 3318", value: "Analog & Digital Signal Processing", languages: ["Python", "C++"], tools: ["MATLAB"] },
  // Mechanical & Aerospace Engineering Courses
  { name: "MAE 1107", value: "Introduction to Mechanical Engineering", languages: [], tools: ["SolidWorks", "MATLAB"] },
  { name: "MAE 1140", value: "Problems in Mechanical & Aerospace Engineering", languages: [], tools: ["MATLAB", "Excel"] },
  { name: "MAE 1351", value: "Introduction to Engineering Design", languages: [], tools: ["SolidWorks", "MATLAB", "CAD"] },
  { name: "MAE 3324", value: "Materials & Structures", languages: [], tools: ["MATLAB", "Simulink"] },
  { name: "MAE 3315", value: "Mechanics of Materials II", languages: [], tools: ["MATLAB", "Simulink"] },
  { name: "MAE 3304", value: "Introduction to Fluid Mechanics", languages: ["Python"], tools: ["MATLAB"] },
  { name: "MAE 3318", value: "Mechanical Design I", languages: [], tools: ["SolidWorks", "ANSYS"] },
  { name: "MAE 4350", value: "Engineering Design Project I", languages: ["Python", "C++"], tools: ["MATLAB", "SolidWorks"] },
  { name: "MAE 4310", value: "Senior Design Project II", languages: ["C++"], tools: ["MATLAB", "SolidWorks", "ANSYS"] }
];
