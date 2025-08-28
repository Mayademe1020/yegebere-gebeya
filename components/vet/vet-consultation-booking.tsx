"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Stethoscope, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Calendar as CalendarIcon,
  MessageSquare,
  Video,
  Home,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Veterinarian {
  id: string;
  name: string;
  profileImage?: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  location: {
    region: string;
    zone: string;
    woreda: string;
  };
  availability: {
    days: string[];
    hours: string;
  };
  services: {
    consultation: { price: number; duration: number };
    homeVisit: { price: number; available: boolean };
    videoCall: { price: number; available: boolean };
  };
  languages: string[];
  isVerified: boolean;
  responseTime: string;
}

interface VetConsultationBookingProps {
  veterinarian: Veterinarian;
  onBookingComplete: (booking: any) => void;
}

type ConsultationType = "consultation" | "homeVisit" | "videoCall";

export function VetConsultationBooking({ 
  veterinarian, 
  onBookingComplete 
}: VetConsultationBookingProps) {
  const [selectedType, setSelectedType] = useState<ConsultationType>("consultation");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultationTypes = [
    {
      id: "consultation" as ConsultationType,
      name: "Clinic Visit",
      icon: Stethoscope,
      description: "Visit the veterinarian's clinic",
      price: veterinarian.services.consultation.price,
      duration: veterinarian.services.consultation.duration,
      available: true
    },
    {
      id: "homeVisit" as ConsultationType,
      name: "Home Visit",
      icon: Home,
      description: "Veterinarian visits your location",
      price: veterinarian.services.homeVisit.price,
      duration: 60,
      available: veterinarian.services.homeVisit.available
    },
    {
      id: "videoCall" as ConsultationType,
      name: "Video Call",
      icon: Video,
      description: "Online consultation via video call",
      price: veterinarian.services.videoCall.price,
      duration: 30,
      available: veterinarian.services.videoCall.available
    }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const urgencyLevels = [
    { value: "low", label: "Low Priority", color: "text-green-600" },
    { value: "normal", label: "Normal", color: "text-blue-600" },
    { value: "high", label: "High Priority", color: "text-orange-600" },
    { value: "emergency", label: "Emergency", color: "text-red-600" }
  ];

  const selectedService = consultationTypes.find(type => type.id === selectedType);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !description.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsBooking(true);
    setError(null);

    try {
      const response = await fetch("/api/vet/book-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          veterinarianId: veterinarian.id,
          type: selectedType,
          date: selectedDate.toISOString(),
          time: selectedTime,
          description,
          urgency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book consultation");
      }

      onBookingComplete(data.booking);
      setShowBookingDialog(false);
      resetForm();

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsBooking(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    setDescription("");
    setUrgency("normal");
    setError(null);
  };

  const isDateAvailable = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return veterinarian.availability.days.includes(dayName);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={veterinarian.profileImage} />
            <AvatarFallback>
              {veterinarian.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{veterinarian.name}</CardTitle>
              {veterinarian.isVerified && (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{veterinarian.rating}</span>
                <span>({veterinarian.reviewCount} reviews)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{veterinarian.location.woreda}, {veterinarian.location.zone}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {veterinarian.specialization.map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Service Options */}
        <div className="grid gap-3">
          {consultationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-colors",
                  !type.available && "opacity-50 cursor-not-allowed",
                  selectedType === type.id && "ring-2 ring-green-500"
                )}
                onClick={() => type.available && setSelectedType(type.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{type.price} ETB</p>
                      <p className="text-xs text-gray-600">{type.duration} min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Availability Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Available: {veterinarian.availability.days.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <span>Response time: {veterinarian.responseTime}</span>
          </div>
        </div>

        {/* Book Consultation Button */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogTrigger asChild>
            <Button className="w-full" size="lg">
              Book Consultation - {selectedService?.price} ETB
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book {selectedService?.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Date Selection */}
              <div>
                <label className="text-sm font-medium">Select Date</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => 
                    date < new Date() || !isDateAvailable(date)
                  }
                  className="rounded-md border"
                />
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="text-sm font-medium">Select Time</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Urgency Level */}
              <div>
                <label className="text-sm font-medium">Urgency Level</label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <span className={level.color}>{level.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium">Describe the Issue</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe your animal's condition or the reason for consultation..."
                  rows={4}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Booking Summary */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{selectedService?.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>
                      {selectedDate && selectedTime 
                        ? `${selectedDate.toLocaleDateString()} at ${selectedTime}`
                        : "Not selected"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total:</span>
                    <span>{selectedService?.price} ETB</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleBooking}
                  disabled={isBooking || !selectedDate || !selectedTime || !description.trim()}
                  className="flex-1"
                >
                  {isBooking ? "Booking..." : "Confirm Booking"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBookingDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
