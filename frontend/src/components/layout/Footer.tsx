import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* About Section */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-sm">CRC</span>
                        Come for Road Child
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        A university-based social service and volunteer organization dedicated to bringing smiles to underprivileged children and making a positive impact in our society.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/events" className="hover:text-blue-400 transition-colors">Upcoming Events</Link></li>
                        <li><Link to="/campaigns" className="hover:text-blue-400 transition-colors">Donate Now</Link></li>
                        <li><Link to="/about" className="hover:text-blue-400 transition-colors">Our Mission</Link></li>
                        <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li>📍 University Campus, Main Building</li>
                        <li>📧 hello@crc-club.edu</li>
                        <li>📞 +880 1234 567890</li>
                    </ul>
                    <div className="mt-4">
                        <button className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-all">
                            Join as Volunteer
                        </button>
                    </div>
                </div>

            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
                © {new Date().getFullYear()} Come for Road Child (CRC). All rights reserved.
            </div>
        </footer>
    );
}