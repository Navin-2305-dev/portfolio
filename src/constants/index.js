import {
  django,
  mobile,
  zootoca,
  backend,
  creator,
  web,
  sql,
  flutter,
  rag,
  python,
  thurro,
  maestrominds,
  cpp,
  html,
  css,
  github1,
  ai,
  mediwise,
  mongodb,
  flask,
  redis,
  git,
  docker,
  icd,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Python Developer",
    icon: web,
  },
  {
    title: "Backend Developer",
    icon: mobile,
  },
  {
    title: "App Developer (Flutter)",
    icon: backend,
  },
  {
    title: "Innovative Problem Solver",
    icon: creator,
  },
];

const technologies = [
  {
    name: "Python",
    icon: python,
  },
  {
    name: "Django",
    icon: django,
  },
  {
    name: "Flask",
    icon: flask,
  },
  {
    name: "Flutter",
    icon: flutter,
  },
  {
    name: "C++",
    icon: cpp,
  },
  {
    name: "HTML",
    icon: html,
  },
  {
    name: "CSS",
    icon: css,
  },
  {
    name: "SQL",
    icon: sql,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Redis",
    icon: redis,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "GitHub",
    icon: github1,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Web Developer",
    company_name: "Zootoca Technologies",
    icon: zootoca,
    iconBg: "#383E56",
    date: "June 2024 - July 2024",
    points: [
      "Improved backend system efficiency by 35% through optimization.",
      "Enhanced API responsiveness for better frontend integration.",
      "Collaborated on feature deployment using Postman and gained hands-on experience with Figma.",
      "Gained experience in real-world web architecture and deployment.",
    ]
  },
  {
    title: "Application Developer Intern",
    company_name: "Maestrominds",
    icon: maestrominds,
    iconBg: "#383E56",
    date: "Mar 2025 - Apr 2025",
    points: [
      "Developed a mobile application for TNAPEx using Flutter and Django.",
      "Integrated Firebase for real-time database and user authentication.",
      "Improved application usability and performance by 40%.",
      "Delivered a scalable MVP with clean UI/UX and smooth data sync.",
    ],
  },
  {
    title: "Backend Developer Intern",
    company_name: "114 AI INNOVATION LLP",
    icon: ai,
    iconBg: "#ffffff",
    date: "Feb 2025 - July 2025",
    points: [
      "Automated manual diagnosis mapping workflows in healthcare systems.",
      "Developed an ICD code mapping system using NLP and Mistral AI, achieving 91% accuracy.",
      "Gained hands-on experience with RAG techniques, Redis Database and other related technologies.",
      "Designed and deployed scalable backend services using Python, Django, and RAG.",
    ],
  },
  {
    title: "Python Developer Intern",
    company_name: "Thurro",
    icon: thurro,
    iconBg: "#ffffff",
    date: "June 2025 - Present",
    points: [
      "Developing and maintaining Software systems using Python and related frameworks.",
      "Integrating third-party APIs and optimizing server-side performance.",
      "Collaborating with product and engineering teams to build scalable features.",
      "Using Git for version control and following agile development practices.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://logowik.com/content/uploads/images/github9775.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://th.bing.com/th/id/R.14f8d0d8ea255a03471032d79087fdf0?rik=Jcph23UZL08iCA&riu=http%3a%2f%2f1000logos.net%2fwp-content%2fuploads%2f2017%2f03%2fColor-of-the-LinkedIn-Logo.jpg&ehk=hT5Ibkg%2fFPa%2f7TPm%2fs2TP8Fxdd7ySQQBuZmn88xh5j0%3d&risl=&pid=ImgRaw&r=0",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://static.vecteezy.com/system/resources/previews/022/484/516/original/google-mail-gmail-icon-logo-symbol-free-png.png",
  },
];

const projects = [
  {
    name: "Mediwise",
    description:
      "An intelligent Mobile Application that analyzes medical reports and visible symptoms to predict possible diseases and suggest medications. It includes features like Patient Health records, Doctor Connectivity, AI-based Chatbot, Image-based Detection and secure ID-based access for Doctors.",
    tags: [
      {
        name: "Flutter",
        color: "blue-text-gradient",
      },
      {
        name: "Firebase",
        color: "green-text-gradient",
      },
      {
        name: "Gemini AI",
        color: "pink-text-gradient",
      },
      {
        name: "RAG",
        color: "orange-text-gradient",
      },
    ],
    image: mediwise,
    source_code_link: "https://github.com/Navin-2305-dev/MediWise",
  },
  {
    name: "ICD Code Mapper",
    description:
      "This project automates the assignment of ICD (International Classification of Diseases) codes to patient medical data. This System intelligently maps patient data to most relevant ICD codes. Mistral AI was integrated to enhance contextual understanding, achieving 91% accuracy in ICD prediction.",
    tags: [
      {
        name: "Django",
        color: "blue-text-gradient",
      },
      {
        name: "Mistral AI",
        color: "green-text-gradient",
      },
      {
        name: "RAG",
        color: "pink-text-gradient",
      },
      {
        name: "Redis",
        color: "orange-text-gradient",
      },
    ],
    image: icd,
    source_code_link: "https://github.com/Navin-2305-dev/ICD-Code-Matching",
  },
  {
    name: "AskMyDoc",
    description:
      "It is an document-aware conversational AI system built using RAG. It allows users to upload one or more documents and then interact with it, similar to how ChatGPT works, but with knowledge of uploaded documents. By combining semantic search with LLM, the system provides accurate responses.",
    tags: [
      {
        name: "RAG",
        color: "blue-text-gradient",
      },
      {
        name: "Weaviate",
        color: "green-text-gradient",
      },
      {
        name: "Flask",
        color: "pink-text-gradient",
      },
      {
        name: "Web UI",
        color: "orange-text-gradient",
      },
    ],
    image: rag,
    source_code_link: "https://github.com/Navin-2305-dev/RAG-PDF-Chat",
  },
];

export { services, technologies, experiences, testimonials, projects };
