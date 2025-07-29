import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Social media and resume data
const profiles = [
  {
    name: "LinkedIn",
    description: "Connect with me professionally on LinkedIn.",
    link: "https://www.linkedin.com/in/navinb23",
    icon: "https://img.icons8.com/color/96/000000/linkedin.png",
  },
  {
    name: "GitHub",
    description: "Explore my projects and code on GitHub.",
    link: "https://github.com/Navin-2305-dev",
    icon: "https://img.icons8.com/color/96/000000/github.png",
  },
  {
    name: "LeetCode",
    description: "Check out my problem-solving skills on LeetCode.",
    link: "https://leetcode.com/u/Navin-2305/",
    icon: "https://img.icons8.com/external-tal-revivo-color-tal-revivo/96/000000/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png",
  },
  {
    name: "Skillrack",
    description: "View my coding practice on Skillrack.",
    link: "http://www.skillrack.com/profile/402949/52665ee32bb06f5ef539d15ff91e1b160ea0b35b",
    icon: "https://cdn.skillrack.com/profilepic/232344/1608128273958skillracklogo.jpg",
  },
  {
    name: "Resume",
    description: "Download or view my resume to learn more about my experience.",
    link:" https://drive.google.com/file/d/18miH86JZSLdrUxA3uWBPCbutwFxhgv5m/view",
    icon: "https://img.icons8.com/color/96/000000/resume.png",
  },
];

const ProfileCard = ({ index, name, description, link, icon }) => {
  const isResume = name === "Resume";
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 1)}
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      animate={{ boxShadow: ["0 0 10px rgba(59, 130, 246, 0.5)", "0 0 20px rgba(59, 130, 246, 0.8)", "0 0 10px rgba(59, 130, 246, 0.5)"], transition: { duration: 3, repeat: Infinity } }}
      className={`relative xs:w-[320px] bg-gray-900/80 p-6 rounded-xl shadow-inner backdrop-blur-md border border-gray-800 hover:border-blue-500/50 transition-all duration-500 overflow-hidden group`}
      style={{ perspective: 1000 }}
    >
      {/* Resume glowing orbit effect */}
      {
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-blue-500/30 opacity-50 group-hover:opacity-100"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      }
      {/* Card content */}
      <div className="flex items-start gap-4 relative z-10">
        <motion.img
          src={icon}
          alt={`${name}-icon`}
          className="w-14 h-14 rounded-full object-cover group-hover:shadow-blue-500/50"
          whileHover={{ y: -5, rotate: 360 }}
          transition={{ duration: 0.4 }}
        />
        <div>
          <p className="text-white font-extrabold text-[18px] tracking-tight group-hover:text-blue-300 transition-colors duration-300">
            {name}
          </p>
          <p className="text-gray-400 text-[13px] mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
      {/* Action button */}
      <div className="mt-5 relative z-10">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center px-6 py-3 rounded-full text-white font-semibold text-[14px] bg-gradient-to-r ${
            isResume ? "from-blue-600 to-purple-600" : "from-blue-500 to-blue-700"
          } hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-blue-500/50 group-hover:shadow-lg relative overflow-hidden`}
        >
          <span className="relative z-20">{isResume ? "View Resume" : `View ${name}`}</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </a>
      </div>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const SocialProfiles = () => {
  return (
    <div className="mt-12 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-blue-950 to-black rounded-[20px] shadow-2xl overflow-hidden animate-gradient-bg">
      <div className={`bg-gradient-to-r from-blue-900/90 to-purple-900/90 rounded-t-2xl ${styles.padding} min-h-[300px] relative overflow-hidden`}>
        {/* Header background particles */}
        <div className="absolute inset-0 bg-[url('https://img.icons8.com/fluency-systems-regular/24/ffffff/sparkle.png')] bg-[length:15px] opacity-10 animate-twinkle" />
        <motion.div variants={textVariant()}>
          <p className={`${styles.sectionSubText} text-blue-400 tracking-wider font-medium mt-2`}>
            Connect with me
          </p>
          <h1 className="text-white text-[48px] font-extrabold tracking-tight bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 animate-pulse">
            My Digital Presence
          </h1>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-8 justify-center relative z-10`}>
        {profiles.map((profile, index) => (
          <ProfileCard key={profile.name} index={index} {...profile} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(SocialProfiles, "");