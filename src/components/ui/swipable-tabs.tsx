"use client";

import * as React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";

const SwipeableTabs = ({
  tabs,
  onTabChange,
}: {
  tabs: { label: string; content: React.ReactNode }[];
  onTabChange?: (index: number, label: string) => void;
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [carouselRef, carouselApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
  });
  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    onTabChange?.(index, tabs[index].label);
    carouselApi?.scrollTo(index);
  };
  const handleCarouselSelect = React.useCallback(() => {
    if (carouselApi) {
      const index = carouselApi.selectedScrollSnap();
      setSelectedIndex(index);
      onTabChange?.(index, tabs[index].label);
    }
  }, [carouselApi, tabs, onTabChange]);
  React.useEffect(() => {
    if (carouselApi) {
      carouselApi.on("select", handleCarouselSelect);
    }
    return () => {
      if (carouselApi) {
        carouselApi.off("select", handleCarouselSelect);
      }
    };
  }, [carouselApi, handleCarouselSelect]);

  return (
    <div className="relative">
      <RadixTabs.Root
        value={tabs[selectedIndex]?.label}
        onValueChange={(value) => {
          const index = tabs.findIndex((tab) => tab.label === value);
          if (index !== -1) handleTabChange(index);
        }}
      >
        <div className="relative">
          <RadixTabs.List className="flex relative ">
            {tabs.map((tab, index) => (
              <RadixTabs.Trigger
                key={tab.label}
                value={tab.label}
                className={cn(
                  "flex-1 p-2 text-center relative z-10",
                  selectedIndex === index
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {tab.label}
              </RadixTabs.Trigger>
            ))}
            <div
              className="absolute bottom-0 h-[2px]  bg-primary transition-transform duration-300 ease-in-out "
              style={{
                width: `${100 / tabs.length}%`,
                transform: `translateX(${selectedIndex * 100}%)`,
              }}
            />
          </RadixTabs.List>
        </div>
      </RadixTabs.Root>

      <div ref={carouselRef} className="overflow-hidden">
        <div className="flex">
          {tabs.map((tab, index) => (
            <div
              key={tab.label}
              className="flex-shrink-0 w-full pt-2"
              role="tabpanel"
              aria-hidden={selectedIndex !== index}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwipeableTabs;