"use client";

import { ChevronDownIcon, EyeIcon, UserIcon } from "lucide-react";
import React, { useRef, useState } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Transaction, getStatusColor } from "@/lib/data/dashboard";
import Carousel, { Slider, SliderContainer, SliderDotButton } from "@/components/ui/carousel";
import { EmblaOptionsType } from "embla-carousel";

interface TransactionCardProps {
  transaction: Transaction;
  imageUrl?: string;
}

export default function TransactionCard({ transaction, imageUrl }: TransactionCardProps) {
  const [infoVisible, setInfoVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP();
  
  // Carousel options
  const OPTIONS: EmblaOptionsType = { loop: true };
  
  // Determine if we should use carousel (multiple images available)
  const useCarousel = transaction.images && transaction.images.length > 1;
  const displayImages = transaction.images && transaction.images.length > 0 ? transaction.images : [imageUrl].filter(Boolean);

  const toggleTransactionInfo = contextSafe(() => {
    const content = contentRef.current;
    if (!content) return;

    const showContent = () => {
      gsap.set(content, {
        display: "block",
        height: "auto",
      });
      const height = content.offsetHeight;
      gsap.fromTo(
        content,
        {
          height: 0,
          opacity: 0,
          filter: "blur(4px)",
        },
        {
          height,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "expo.out",
        },
      );
    };

    const hideContent = () => {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        filter: "blur(4px)",
        duration: 0.6,
        ease: "circ.in",
        onComplete: () => {
          gsap.set(content, { display: "none" });
        },
      });
    };

    if (infoVisible) {
      hideContent();
    } else {
      showContent();
    }
    setInfoVisible(!infoVisible);
  });

  // Helper function to get badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="group w-80 cursor-pointer">
      <div className="relative">
        {displayImages.length > 0 ? (
          useCarousel ? (
            <div
              className="h-88 w-full rounded-md overflow-hidden"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Carousel options={OPTIONS} className="h-full">
                <SliderContainer className="h-full">
                  {displayImages.map((image, index) => (
                    <Slider key={index} className="w-full h-full">
                      <img
                        src={image}
                        alt={`${transaction.itemTitle} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </Slider>
                  ))}
                </SliderContainer>
                {displayImages.length > 1 && (
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
                    <SliderDotButton className="gap-1" />
                  </div>
                )}
              </Carousel>
            </div>
          ) : (
            <img
              src={displayImages[0]}
              alt={transaction.itemTitle}
              className="h-88 w-full rounded-md object-cover"
            />
          )
        ) : (
          <div className={`h-88 w-full rounded-md ${transaction.bgColor} flex items-center justify-center`}>
            <span className="text-6xl">{transaction.emoji}</span>
          </div>
        )}
        
        <div
          className={cn(
            "bg-background/50 absolute inset-x-2 bottom-2 rounded-md backdrop-blur-xs transition-all",
            {
              "bg-background/80": infoVisible,
            },
          )}>
          <div
            className={cn(
              "hover:bg-background/70 flex items-start justify-between transition-all duration-500",
              {
                "rounded-t-md px-3 py-1.5": infoVisible,
                "rounded-md px-2.5 py-1": !infoVisible,
              },
            )}
            role="button"
            aria-expanded={infoVisible}
            tabIndex={0}
            onClick={toggleTransactionInfo}>
            <div>
              <p
                className={cn(
                  "mt-1 line-clamp-1 leading-none font-medium transition-all duration-500 max-sm:text-sm",
                  {
                    "text-lg/none": infoVisible,
                  },
                )}>
                {transaction.itemTitle}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusBadgeVariant(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
            <div className="bg-background mt-1 rounded-full p-0.5">
              <ChevronDownIcon
                className={cn("text-muted-foreground size-4 transition-all duration-500", {
                  "rotate-180": infoVisible,
                })}
              />
            </div>
          </div>
          
          <div ref={contentRef} className="hidden overflow-hidden">
            <div className="p-3 pt-0">
              {/* Transaction Details */}
              <div className="flex items-center justify-between">
                <p className="text-foreground/60 font-medium">Transaction</p>
                <p className="text-foreground/80 text-xs">#{transaction.id}</p>
              </div>
              
              {/* Transaction Type */}
              <div className="mt-2">
                <p className="text-foreground/60 text-sm font-medium">Type</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="outline" className="text-sm capitalize">
                    {transaction.type === 'ongoing' ? 'Active Swap' : 'Completed Swap'}
                  </Badge>
                  <div className="text-foreground/60 text-xs">
                    • {transaction.type === 'ongoing' ? 'In progress' : 'Finished'}
                  </div>
                </div>
              </div>
              
              {/* Progress & Timeline */}
              <div className="mt-2">
                <p className="text-foreground/60 text-sm font-medium">Progress</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-sm">
                    {transaction.status === 'In Progress' ? 'Step 2 of 3' : 'Completed'}
                  </Badge>
                  <div className="text-foreground/60 text-xs">
                    • {transaction.status === 'In Progress' ? 'Awaiting confirmation' : 'All done'}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="text-muted-foreground text-sm max-sm:text-xs">
                  {transaction.status === 'In Progress' ? 'Active transaction' : 
                   transaction.status === 'Completed' ? 'Successfully completed' : 
                   'Transaction pending'}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs">
                    <EyeIcon className="size-3" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 