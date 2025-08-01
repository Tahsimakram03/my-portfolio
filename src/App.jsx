import React, { useState, useEffect } from 'react';
import { Linkedin, Github, Mail, Phone, MapPin, ExternalLink, Code, Download } from 'lucide-react';

// Main App Component
export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  const handleScroll = () => {
    const sections = ['home', 'about', 'projects', 'achievements', 'contact'];
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
        setActiveSection(section);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'projects', name: 'Projects' },
    { id: 'achievements', name: 'Achievements' },
    { id: 'contact', name: 'Contact' },
  ];

  return (
    <div className="bg-gray-900 text-gray-200 font-sans leading-normal tracking-tight">
      <Header navLinks={navLinks} activeSection={activeSection} />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <AchievementsSection />
        <ContactSection />
      </main>
      <Footer navLinks={navLinks} />
    </div>
  );
}

// Header Component
const Header = ({ navLinks, activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400">Tahsim Akram</h1>
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`text-lg font-medium transition-colors duration-300 ${
                activeSection === link.id
                  ? 'text-cyan-400'
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>
        <button className="md:hidden z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-sm">
          <nav className="flex flex-col items-center space-y-4 py-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-lg font-medium transition-colors duration-300 ${
                  activeSection === link.id
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-cyan-400'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};


// Hero Section Component
const HeroSection = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
  return (
    <section id="home" className="min-h-screen flex items-center bg-gray-900">
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4">Hi, I'm Tahsim Akram.</h2>
        <p className="text-xl md:text-2xl text-cyan-400 mb-8">Passionate Frontend Developer | Crafting dynamic web experiences.</p>
        <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mb-8 text-gray-400">
            <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5"/>
                <span>tahsimakram786786@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5"/>
                <span>+91 7905645660</span>
            </div>
            <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5"/>
                <span>Mirzapur, Uttar Pradesh</span>
            </div>
        </div>
        <div className="flex justify-center space-x-4 mb-10">
            <a href="https://linkedin.com/in/tahsim-akram-03/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"><Linkedin size={28} /></a>
            <a href="https://github.com/Tahsimakram03" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"><Github size={28} /></a>
        </div>
        <div className="flex justify-center items-center flex-wrap gap-4">
          <button onClick={() => scrollToSection('projects')} className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-600 transition-transform duration-300 transform hover:scale-105">View My Projects</button>
          
          {/* To enable this button, place your resume PDF (e.g., "resume.pdf") in the 'public' folder of your project. */}
          {/* Then, make sure the href below matches the filename. */}
          <a href="/Tahsim_Akram.pdf" download className="bg-teal-500 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-600 transition-transform duration-300 transform hover:scale-105 inline-flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Download Resume
          </a>

          <button onClick={() => scrollToSection('contact')} className="bg-gray-700 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 transition-transform duration-300 transform hover:scale-105">Connect with Me</button>
        </div>
      </div>
    </section>
  );
};

// About Section Component
const AboutSection = () => {
  const skills = {
    "Languages": ["Java", "C", "HTML", "JavaScript", "Python"],
    "Web Technologies": ["React", "CSS", "Git"],
    "Tools & Databases": ["VSCode", "SQL","Mongo"],
    "Coursework": ["DBMS", "OS", "Computer Networks", "OOP"]
  };

  return (
    <section id="about" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-cyan-400">About Me</h2>
        <div className="max-w-4xl mx-auto text-center text-lg text-gray-300">
          <p className="mb-4">
            I'm Tahsim Akram, a B.Tech student in Information Technology from Haldia Institute of Technology, graduating in June 2026.
          </p>
          <p className="mb-6">
            I am a dedicated problem-solver with a strong foundation in computer science fundamentals and a passion for building intuitive web applications. Eager to learn and apply new technologies, especially in the React ecosystem, to create impactful user interfaces.
          </p>
          <p className="text-md text-gray-400">(CGPA: 7.4)</p>
        </div>
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8 text-cyan-400">My Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(skills).map(([category, items]) => (
                    <div key={category} className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-shadow duration-300">
                        <h4 className="text-xl font-semibold text-cyan-400 mb-4">{category}</h4>
                        <ul className="space-y-2">
                            {items.map(item => <li key={item} className="text-gray-300">{item}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

// Projects Section Component
const ProjectsSection = () => {
  const projects = [
    {
      title: "Searching And Sorting Visualiser",
      description: "An interactive web application visualizing sorting and searching algorithms through dynamic animations and real-time data representation.",
      technologies: ["HTML", "CSS", "JavaScript"],
      features: ["Responsive user interface", "Dynamic animations and real-time data representation", "Allows users to select different algorithms"],
      liveLink: null,
      repoLink: "https://github.com/Tahsimakram03/Sorting-visualizer"
    },
    {
      title: "Currency-Converter",
      description: "A simple and efficient web application providing real-time currency exchange rates.",
      technologies: ["HTML", "CSS", "JavaScript"],
      features: ["Utilizes an external API to fetch live exchange rates, ensuring accurate and up-to-date conversions."],
      liveLink: null,
      repoLink: "https://github.com/Tahsimakram03/Currency-Converter"
    },
    {
      title: "Rock-Paper-Scissor",
      description: "A simple and interactive game showcasing fundamental frontend development skills.",
      technologies: ["HTML", "CSS", "JavaScript"],
      features: ["DOM manipulation", "Event handling", "Responsive design"],
      liveLink: null,
      repoLink: "https://github.com/Tahsimakram03/Rock-Paper-Scissor"
    },
    {
      title: "Car Rental System",
      description: "A feature-rich system developed using Java OOP principles, showcasing backend logic and data management.",
      technologies: ["Java", "OOPs"],
      features: ["Car inventory management", "Customer registration", "Rental operations with dynamic pricing"],
      liveLink: null,
      repoLink: "https://github.com/Tahsimakram03/Car-Rental-System"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-cyan-400">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Project Card Component
const ProjectCard = ({ title, description, technologies, features, liveLink, repoLink }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col hover:shadow-cyan-500/20 hover:border-cyan-500 border border-transparent transition-all duration-300 transform hover:-translate-y-1">
    <h3 className="text-2xl font-bold mb-2 text-cyan-400">{title}</h3>
    <p className="text-gray-400 mb-4 flex-grow">{description}</p>
    <div className="mb-4">
        <h4 className="font-semibold text-gray-200 mb-2">Key Features:</h4>
        <ul className="list-disc list-inside text-gray-400 space-y-1">
            {features.map((feature, i) => <li key={i}>{feature}</li>)}
        </ul>
    </div>
    <div className="mb-4">
      <p className="font-semibold text-gray-200 mb-2">Technologies:</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span key={index} className="bg-gray-700 text-cyan-300 text-sm font-medium px-3 py-1 rounded-full">{tech}</span>
        ))}
      </div>
    </div>
    <div className="mt-auto pt-4 flex justify-end space-x-4 border-t border-gray-700">
      {liveLink && (
        <a href={liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors duration-300">
          <ExternalLink className="w-5 h-5 mr-2" /> Live Demo
        </a>
      )}
      <a href={repoLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors duration-300">
        <Github className="w-5 h-5 mr-2" /> Source Code
      </a>
    </div>
  </div>
);

// Achievements Section Component
const AchievementsSection = () => (
    <section id="achievements" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-cyan-400">Competitive Programming</h2>
            <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-6">
                    <Code className="w-10 h-10 text-cyan-400 mr-4"/>
                    <h3 className="text-2xl font-bold text-white">Problem Solving Journey</h3>
                </div>
                <ul className="list-disc list-inside space-y-3 text-gray-300 text-lg">
                    <li>Completed over <span className="font-bold text-cyan-400">250 problems</span> on LeetCode and GeeksforGeeks.</li>
                    <li>Demonstrated consistent problem-solving ability across multiple data structures and algorithms.</li>
                    <li>Gained proficiency in code optimization, focusing on reducing time and space complexity.</li>
                    <li>Actively prepared for technical interviews at top companies by focusing on relevant problems.</li>
                </ul>
                <p className="text-sm text-gray-500 mt-6 text-right">Sep 2024 - April 2025</p>
            </div>
        </div>
    </section>
);

// Contact Section Component
const ContactSection = () => (
  <section id="contact" className="py-20 bg-gray-900">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">Get In Touch</h2>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
        I'm actively seeking opportunities to apply and expand my skills. My inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex items-center text-lg">
          <Mail className="w-6 h-6 mr-3 text-cyan-400" />
          <a href="mailto:tahsimakram786786@gmail.com" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
            tahsimakram786786@gmail.com
          </a>
        </div>
        <div className="flex items-center text-lg">
          <Linkedin className="w-6 h-6 mr-3 text-cyan-400" />
          <a href="https://linkedin.com/in/tahsim-akram-03/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
            linkedin.com/in/tahsim-akram-03
          </a>
        </div>
        <div className="flex items-center text-lg">
          <Github className="w-6 h-6 mr-3 text-cyan-400" />
          <a href="https://github.com/Tahsimakram03" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
            github.com/Tahsimakram03
          </a>
        </div>
      </div>
    </div>
  </section>
);

// Footer Component
const Footer = ({ navLinks }) => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return(
        <footer className="bg-gray-800 border-t border-gray-700">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-gray-400">&copy; 2025 Tahsim Akram. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6 mb-4 md:mb-0">
                        {navLinks.map(link => (
                            <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">{link.name}</button>
                        ))}
                    </div>
                    <div className="flex space-x-4">
                        <a href="https://linkedin.com/in/tahsim-akram-03/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"><Linkedin size={24} /></a>
                        <a href="https://github.com/Tahsimakram03" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"><Github size={24} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
