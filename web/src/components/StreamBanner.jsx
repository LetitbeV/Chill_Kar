import React from 'react';

const StreamBanner = () => {
  return (
    <section className="py-6 bg-gradient-to-r from-purple-800 via-blue-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <div className="flex items-center flex-col md:flex-row p-6 md:p-8">
            <div className="flex gap-1.5 items-center w-full mb-4 md:mb-0">
              {/* Left Section: ChillKar */}
              <div className="flex items-center space-x-4">
                <div className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
                  <span className='text-3xl'>Chill</span>
                  <span className="text-yellow-400 text-3xl">Kar</span>
                </div>
              </div>

              {/* Right Section: STREAM with stretch and bold */}
              <div className="text-white font-extrabold text-3xl md:text-5xl uppercase tracking-widest">
                STREAM
              </div>
            </div>

            {/* Tagline Section: Endless Entertainment */}
            <div className="text-yellow-400 font-medium text-center text-lg md:text-2xl max-w-lg">
              Endless Entertainment Anytime. Anywhere!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StreamBanner;
