import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [isInvalidSubmit, setIsInvalidSubmit] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name field is empty.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "A valid email is required.";
    if (!form.message.trim()) newErrors.message = "Don't be shy, Share your thoughts!!!";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsInvalidSubmit(true);
      setTimeout(() => setIsInvalidSubmit(false), 600);
      return;
    }

    setLoading(true);
    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        { from_name: form.name.trim(), to_name: "Navin B", time: new Date().toLocaleString(), from_email: form.email.trim(), to_email: "navinking2305@gmail.com", message: form.message.trim() },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setLoading(false);
        alert("Thank you. I will get back to you as soon as possible.");
        setForm({ name: "", email: "", message: "" });
        setErrors({});
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        alert("Ahh, something went wrong. Please try again.");
      });
  };

  const formShakeAnimation = {
    reject: {
      x: [0, -20, 20, -10, 10, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  const inputPulseAnimation = {
    glow: {
      boxShadow: [
        "0 0 0 0 rgba(239, 68, 68, 0.0)",
        "0 0 0 4px rgba(239, 68, 68, 0.4)",
        "0 0 0 0 rgba(239, 68, 68, 0.0)",
      ],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeOut" },
    },
    stopGlow: {
      boxShadow: "0 0 0 0 rgba(239, 68, 68, 0.0)",
    }
  };

  return (
    <div className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        animate={isInvalidSubmit ? "reject" : ""}
        initial={false}
        className='flex-[0.75] bg-black-100 p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form ref={formRef} onSubmit={handleSubmit} className='mt-12 flex flex-col gap-8'>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Name</span>
            <motion.input
              type='text' name='name' value={form.name} onChange={handleChange}
              placeholder="What's your good name?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              variants={inputPulseAnimation}
              animate={errors.name ? "glow" : "stopGlow"}
            />
            {errors.name && <p className='text-red-400 text-xs mt-2'>{errors.name}</p>}
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your email</span>
            <motion.input
              type='email' name='email' value={form.email} onChange={handleChange}
              placeholder="What's your email address?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              variants={inputPulseAnimation}
              animate={errors.email ? "glow" : "stopGlow"}
            />
             {errors.email && <p className='text-red-400 text-xs mt-2'>{errors.email}</p>}
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Message</span>
            <motion.textarea
              rows={7} name='message' value={form.message} onChange={handleChange}
              placeholder='What you want to share?'
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              variants={inputPulseAnimation}
              animate={errors.message ? "glow" : "stopGlow"}
            />
            {errors.message && <p className='text-red-400 text-xs mt-2'>{errors.message}</p>}
          </label>

          <button
            type='submit'
            className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary'
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div variants={slideIn("right", "tween", 0.2, 1)} className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'>
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");