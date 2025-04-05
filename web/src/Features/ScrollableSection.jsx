import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const ScrollableSection = ({
  title,
  items,
  renderItem,
  seeAllLink,
  containerId,
}) => {
  const scroll = (direction) => {
    const container = document.getElementById(containerId);
    const scrollAmt = container.offsetWidth;
    const scrollAmount = direction === "left" ? -scrollAmt : scrollAmt;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-800 relative inline-block">
              {title}
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-400 transform -skew-x-12"></div>
            </h2>
          </div>
          {seeAllLink && (
            <a
              href={seeAllLink}
              className="text-yellow-600 text-sm font-medium hover:text-yellow-700 transition-colors flex items-center gap-1"
            >
              See All
              <ChevronRight size={16} />
            </a>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>

          <div
            id={containerId}
            className="grid grid-flow-col auto-cols-max md:auto-cols-min gap-4 overflow-x-auto pb-2 scrollbar-hide justify-between"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.length === 0 ? (
              <div className="text-gray-500 text-center py-8 w-full">
                No items available
              </div>
            ) : items.length <= 3 ? (
              <div className="flex justify-evenly w-full">
                {items.map((item, index) => (
                  <div key={item.id || index}>{renderItem(item)}</div>
                ))}
              </div>
            ) : (
              items.map((item, index) => (
                <div key={item.id || index} className="flex-shrink-0">
                  {renderItem(item)}
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ScrollableSection;
