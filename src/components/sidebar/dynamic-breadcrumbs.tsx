"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbLink, 
  BreadcrumbItem, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from "@/components/ui/breadcrumb";

const BREADCRUMB_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  edit: "Edit",
  settings: "Settings",
  folders: "Folders",
  decks: "Decks",
  study: "Study",
};

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLastItem = index === pathSegments.length - 1;
    const label = BREADCRUMB_MAP[segment] || segment;
    
    return (
      <React.Fragment key={href}>
        {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
        <BreadcrumbItem className="hidden md:block">
          {isLastItem ? (
            <BreadcrumbPage>{label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={href}>
              {label}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </React.Fragment>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  );
}