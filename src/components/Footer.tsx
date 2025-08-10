import { Link } from 'react-router-dom';
import { Trophy, Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Home', href: '/' },
      { name: 'Categories', href: '/?category=community_events' },
      { name: 'Create Thread', href: '/create' },
    ],
    community: [
      { name: 'Community Events', href: '/?category=community_events' },
      { name: 'STEM Outreach', href: '/?category=stem_outreach' },
      { name: 'Fundraising', href: '/?category=fundraising' },
      { name: 'Mentorship', href: '/?category=mentorship' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };

  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Trophy className="h-8 w-8 text-primary-600" />
                  <div className="absolute -inset-1 bg-primary-100 rounded-full opacity-50 -z-10"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-neutral-900">OutreachNet</span>
                  <span className="text-xs text-neutral-500 -mt-1">FRC Community</span>
                </div>
              </Link>
              <p className="text-neutral-600 mb-6 max-w-md">
                Connecting FIRST Robotics Competition teams worldwide to share outreach experiences, 
                collaborate on initiatives, and build stronger communities together.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="p-2 rounded-lg bg-neutral-100 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-neutral-100 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                  aria-label="View our GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-neutral-100 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                  aria-label="Contact us via email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Links */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Community
              </h3>
              <ul className="space-y-3">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <span>&copy; {currentYear} OutreachNet.</span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-secondary-600 fill-current" />
              <span>for the FRC community.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="#"
                className="text-neutral-600 hover:text-primary-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="#"
                className="text-neutral-600 hover:text-primary-600 transition-colors"
              >
                Terms
              </Link>
              <Link
                to="#"
                className="text-neutral-600 hover:text-primary-600 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;