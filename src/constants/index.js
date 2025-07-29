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
  portfolio,
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
    title: "Software Developer Intern",
    company_name: "Maestrominds",
    icon: maestrominds,
    iconBg: "#383E56",
    date: "June 2025 - July 2025",
    points: [
      "Contributed to the development of the AI Mirror project backend for real-time emotion and mood analysis.",
      "Built scalable APIs and backend logic using Python and Flask to support dynamic user interaction flows.",
      "Collaborated with cross-functional teams to ensure seamless integration of AI features and optimize performance.",
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
      "Developed an AI-based healthcare solution using NLP and Mistral AI, achieving 91% accuracy.",
      "Gained hands-on experience with RAG techniques, Redis Database and other related technologies.",
      "Designed and deployed scalable backend services using Python, Django, and RAG.",
    ],
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
  name: "AI-Powered Portfolio Website",
  description:
    "This portfolio showcases my skills and projects with an interactive, AI-powered chatbot built using a Retrieval-Augmented Generation (RAG) approach. The frontend is built on a responsive template.",
  tags: [
    {
      name: "RAG",
      color: "pink-text-gradient",
    },
    {
      name: "Flask",
      color: "blue-text-gradient",
    },
    {
      name: "React",
      color: "green-text-gradient",
    },
  ],
  image: portfolio,
  source_code_link: "https://github.com/Navin-2305-dev/chatbot-portfolio",
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

export { services, technologies, experiences, projects };
