"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  MessageSquare,
  Calendar,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  price: number;
  status: "active" | "sold" | "expired" | "suspended" | "pending";
  isVideoVerified: boolean;
  isVetInspected: boolean;
  createdAt: Date;
  expiresAt: Date;
  views: number;
  inquiries: number;
}

interface ListingStatusManagerProps {
  listing: Listing;
  onStatusUpdate: (listingId: string, newStatus: string, notes?: string) => void;
  isOwner: boolean;
  isAdmin?: boolean;
}

const STATUS_CONFIG = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Listing is live and visible to buyers"
  },
  sold: {
    label: "Sold",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
    description: "Animal has been sold"
  },
  expired: {
    label: "Expired",
    color: "bg-gray-100 text-gray-800",
    icon: Clock,
    description: "Listing has expired and is no longer visible"
  },
  suspended: {
    label: "Suspended",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    description: "Listing has been suspended by admin"
  },
  pending: {
    label: "Pending Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertTriangle,
    description: "Listing is under review"
  }
};

export function ListingStatusManager({ 
  listing, 
  onStatusUpdate, 
  isOwner, 
  isAdmin = false 
}: ListingStatusManagerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(listing.status);
  const [notes, setNotes] = useState("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const currentStatus = STATUS_CONFIG[listing.status];
  const StatusIcon = currentStatus.icon;

  const handleStatusUpdate = async () => {
    if (selectedStatus === listing.status) {
      setShowStatusDialog(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onStatusUpdate(listing.id, selectedStatus, notes);
      setShowStatusDialog(false);
      setNotes("");
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(listing.expiresAt);
    const diffInHours = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours <= 0) return "Expired";
    if (diffInHours <= 24) return `${diffInHours}h remaining`;
    if (diffInHours <= 168) return `${Math.ceil(diffInHours / 24)}d remaining`;
    return `${Math.ceil(diffInHours / 168)}w remaining`;
  };

  const canChangeStatus = isOwner || isAdmin;
  const availableStatuses = isAdmin 
    ? Object.keys(STATUS_CONFIG)
    : isOwner 
    ? ["active", "sold"]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Listing Status</span>
          {canChangeStatus && (
            <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Listing Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">New Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStatuses.map((status) => {
                          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                          return (
                            <SelectItem key={status} value={status}>
                              <div className="flex items-center gap-2">
                                <config.icon className="h-4 w-4" />
                                {config.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {isAdmin && (
                    <div>
                      <label className="text-sm font-medium">Notes (Optional)</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this status change..."
                        rows={3}
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      {isUpdating ? "Updating..." : "Update Status"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowStatusDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center gap-3">
          <StatusIcon className="h-5 w-5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge className={currentStatus.color}>
                {currentStatus.label}
              </Badge>
              {listing.status === "active" && (
                <span className="text-sm text-gray-600">
                  {getTimeRemaining()}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {currentStatus.description}
            </p>
          </div>
        </div>

        {/* Verification Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {listing.isVideoVerified ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm">
              Video {listing.isVideoVerified ? "Verified" : "Not Verified"}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {listing.isVetInspected ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm">
              Vet {listing.isVetInspected ? "Inspected" : "Not Inspected"}
            </span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="font-semibold">{listing.views}</span>
            </div>
            <p className="text-xs text-gray-600">Views</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span className="font-semibold">{listing.inquiries}</span>
            </div>
            <p className="text-xs text-gray-600">Inquiries</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-semibold">
                {Math.ceil((new Date().getTime() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
              </span>
            </div>
            <p className="text-xs text-gray-600">Days Live</p>
          </div>
        </div>

        {/* Status-specific Actions */}
        {listing.status === "expired" && isOwner && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your listing has expired. You can renew it to make it active again.
              <Button variant="link" className="p-0 h-auto ml-2">
                Renew Listing
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {listing.status === "suspended" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              This listing has been suspended. Please contact support for more information.
            </AlertDescription>
          </Alert>
        )}

        {listing.status === "pending" && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your listing is under review. It will be published once approved.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
