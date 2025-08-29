-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "name" TEXT,
    "profileImage" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'am',
    "region" TEXT,
    "zone" TEXT,
    "woreda" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."animals" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT NOT NULL,
    "breed" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "weight" DOUBLE PRECISION,
    "color" TEXT,
    "healthStatus" TEXT NOT NULL DEFAULT 'healthy',
    "description" TEXT,
    "images" TEXT[],
    "videos" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."health_logs" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "logType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cost" DOUBLE PRECISION,
    "vetName" TEXT,
    "notes" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "animalId" TEXT,
    "images" TEXT[],
    "videos" TEXT[],
    "isVideoVerified" BOOLEAN NOT NULL DEFAULT false,
    "isVetInspected" BOOLEAN NOT NULL DEFAULT false,
    "verificationNotes" TEXT,
    "region" TEXT NOT NULL,
    "zone" TEXT,
    "woreda" TEXT,
    "specificLocation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vet_consultations" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "urgency" TEXT NOT NULL DEFAULT 'normal',
    "userId" TEXT NOT NULL,
    "answer" TEXT,
    "answeredBy" TEXT,
    "answeredAt" TIMESTAMP(3),
    "images" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vet_consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."otp_verifications" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'login',
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ethiopian_breeds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAmharic" TEXT,
    "nameOromo" TEXT,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "characteristics" TEXT,
    "isCommon" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ethiopian_breeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ethiopian_locations" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "zone" TEXT,
    "woreda" TEXT,
    "level" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "ethiopian_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_tips" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAmharic" TEXT,
    "titleOromo" TEXT,
    "content" TEXT NOT NULL,
    "contentAmharic" TEXT,
    "contentOromo" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."milk_records" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "morningMilk" DOUBLE PRECISION,
    "eveningMilk" DOUBLE PRECISION,
    "totalMilk" DOUBLE PRECISION NOT NULL,
    "pricePerLiter" DOUBLE PRECISION,
    "totalValue" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "milk_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "public"."users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "animals_animalId_key" ON "public"."animals"("animalId");

-- AddForeignKey
ALTER TABLE "public"."animals" ADD CONSTRAINT "animals_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."health_logs" ADD CONSTRAINT "health_logs_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listings" ADD CONSTRAINT "listings_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."animals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listings" ADD CONSTRAINT "listings_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vet_consultations" ADD CONSTRAINT "vet_consultations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."milk_records" ADD CONSTRAINT "milk_records_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
