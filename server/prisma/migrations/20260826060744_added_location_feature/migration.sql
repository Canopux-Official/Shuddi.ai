-- AlterTable
ALTER TABLE "CommunityTask" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "radiusMeters" INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "CommunityTaskRegistration" ADD COLUMN     "checkInLat" DOUBLE PRECISION,
ADD COLUMN     "checkInLng" DOUBLE PRECISION,
ADD COLUMN     "checkInTime" TIMESTAMP(3);
