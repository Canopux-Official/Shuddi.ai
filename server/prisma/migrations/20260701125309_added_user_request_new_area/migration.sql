-- CreateEnum
CREATE TYPE "AreaRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "AreaRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "status" "AreaRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AreaRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAreaRequest" (
    "userId" TEXT NOT NULL,
    "areaRequestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAreaRequest_pkey" PRIMARY KEY ("userId","areaRequestId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AreaRequest_name_state_country_status_key" ON "AreaRequest"("name", "state", "country", "status");

-- AddForeignKey
ALTER TABLE "UserAreaRequest" ADD CONSTRAINT "UserAreaRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAreaRequest" ADD CONSTRAINT "UserAreaRequest_areaRequestId_fkey" FOREIGN KEY ("areaRequestId") REFERENCES "AreaRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
