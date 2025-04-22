import { Link } from 'react-router-dom';
import {TrophyIcon, Linkedin, Twitter, Trophy} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="flex items-center">
              <Trophy className="h-8 w-8 text-[var(--frc-blue)]" />
              <span className="ml-2 text-xl font-bold text-[var(--frc-blue)]">OutreachNet</span>
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center text-base text-gray-500">
              &copy; {new Date().getFullYear()} OutreachNet. All rights reserved.
            </p>
          </div>
          <div className="mt-8 flex justify-center md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-500 mx-2">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 mx-2">
              <span className="sr-only">GitHub</span>
              <Trophy className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 mx-2">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link to="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</Link>
            <Link to="#" className="text-gray-500 hover:text-gray-700">Terms of Service</Link>
            <Link to="#" className="text-gray-500 hover:text-gray-700">Contact Us</Link>
          </div>
          <p className="mt-8 text-base text-gray-500 md:mt-0 md:order-1">
            Supporting FIRST Robotics Competition teams in their outreach efforts.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;