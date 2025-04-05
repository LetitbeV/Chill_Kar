import React from 'react';
import {ArrowRight,} from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        { name: 'Instagram', link: 'https://www.instagram.com' },
        { name: 'Discord', link: 'https://www.discordapp.com' },
        { name: 'LinkedIn', link: 'https://www.linkedin.com' },
        { name: 'Facebook', link: 'https://www.facebook.com' }
    ];
    const myAccountLinks = [
        { name: 'My Profile', link: '/nft-user-profile' },
        { name: 'Favourites', link: '/nft-favourites' },
        { name: 'Cart', link: '/nft-cart' },
        { name: 'Documentation', link: '/documentation' }
    ];
    const EventCollections = [
        'Comedy Shows',
        'Live Music',
        'Theatre',
        'Kids',
        'Adventure & Fun',
        'Concerts',
        'Live Sports'
    ]

    return (
        <footer className="bg-gray-900 text-white pt-10 pb-6">
            {/* Main Footer Section */}
            <div className="container mx-auto px-4">
                {/* Top Section with Feedback */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10 justify-items-center text-center">
                    {/* Newsletter/Feedback Section */}
                    <div className="lg:col-span-1 w-full max-w-xs">
                        <h3 className="text-xl font-bold mb-4">Always Feel Connected</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Your Feedback"
                                className="w-full bg-gray-800 rounded-full py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-400">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Collections Links */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold mb-4">Collections</h3>
                        <ul className="space-y-2 text-left">
                            {EventCollections.map((item, index) => (
                                <li key={`collection-${index}`}>
                                    <a
                                        href={`/nft-collection-${index + 1}`}
                                        className="text-gray-400 hover:text-white text-sm transition duration-300"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* My Account Links */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold mb-4">My Account</h3>
                        <ul className="space-y-2 text-left">
                            {myAccountLinks.map((item, index) => (
                                <li key={`account-${index}`}>
                                    <a
                                        href={item.link}
                                        id={item.id}
                                        className="text-gray-400 hover:text-white text-sm transition duration-300"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Media Links */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold mb-4">Join Us</h3>
                        <ul className="space-y-2 text-left">
                            {socialLinks.map((item, index) => (
                                <li key={`social-${index}`}>
                                    <a
                                        href={item.link}
                                        className="text-gray-400 hover:text-white text-sm transition duration-300"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Footer Section */}
            <div className="border-t border-gray-800 mt-8 pt-3">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0 text-sm text-gray-400">
                            <span>© 2025 ChillKar. All Rights Reserved.</span>
                        </div>

                        <div className="flex space-x-6">
                            <i className="fi fi-brands-instagram text-xl hover:text-red-500 "></i>
                            <i className="fi fi-brands-facebook text-xl hover:text-blue-400"></i>
                            <i className="fi fi-brands-linkedin text-xl hover:text-blue-400"></i>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
