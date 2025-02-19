"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarHeaderComponentProps {
  user: {
    name: string;
    email: string;
    imageUrl?: string;
  };
}

export default function SidebarHeaderComponent({
  user,
}: SidebarHeaderComponentProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="h-16 w-16">
        {user.imageUrl ? (
          <AvatarImage src={user.imageUrl} alt={user.name} />
        ) : null}
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
