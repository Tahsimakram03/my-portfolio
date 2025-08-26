import React from 'react';
import { Download, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const HeroSection = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center bg-gray-900">
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
          Hi, I'm Tahsim Akram.
        </h2>
        <p className="text-xl md:text-2xl text-cyan-400 mb-8">
          Passionate Frontend Developer | Crafting dynamic web experiences.
        </p>

        <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mb-8 text-gray-400">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>tahsimakram786786@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5" />
            <span>+91 7905645660</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Mirzapur, Uttar Pradesh</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-10">
          <a
            href="https://linkedin.com/in/tahsim-akram-03/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
          ><Linkedin size={28} /></a>
          <a
            href="https://github.com/Tahsimakram03"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
          ><Github size={28} /></a>
        </div>

        <div className="flex justify-center items-center flex-wrap gap-4">
          <button
            onClick={() => scrollToSection('projects')}
            className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-600 transition-transform duration-300 transform hover:scale-105"
          >
            View My Projects
          </button>

          <a
            href="https://drive.google.com/uc?export=download&id=14jq0jCk7dNcU_mwyZwYzjf6hxy5MNnLK"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-500 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-600 transition-transform duration-300 transform hover:scale-105 inline-flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Resume
          </a>

          <button
            onClick={() => scrollToSection('contact')}
            className="bg-gray-700 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 transition-transform duration-300 transform hover:scale-105"
          >
            Connect with Me
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
